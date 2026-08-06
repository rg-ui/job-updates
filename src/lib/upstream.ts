try {
  // Safe dynamic require to avoid bundling errors in edge/serverless runtimes
  const dns = require('node:dns');
  if (dns && typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch {
  // Ignore if unsupported in environment
}

interface FetchUpstreamOptions {
  revalidate?: number | false;
  retries?: number;
  timeoutMs?: number;
}

export async function fetchUpstream(
  urlPath: string,
  options: FetchUpstreamOptions = {}
): Promise<string | null> {
  const { revalidate = 60, retries = 2, timeoutMs = 8000 } = options;

  const headers = {
    'User-Agent':
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept':
      'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
  };

  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');
  const urlsToTry = cleanPath
    ? [
        `https://sarkariresult.com.cm/${cleanPath}/`,
        `https://sarkariresult.com.cm/${cleanPath}`,
      ]
    : ['https://sarkariresult.com.cm/'];

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false } } = {
    headers,
  };
  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate };
  }

  for (const url of urlsToTry) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), timeoutMs);

        const res = await fetch(url, {
          ...fetchOptions,
          signal: controller.signal,
        });

        clearTimeout(timeout);

        if (res.ok) {
          return await res.text();
        }

        if (res.status === 404 && attempt === 0) {
          break;
        }
      } catch (err) {
        console.warn(`Upstream fetch attempt ${attempt + 1} failed for ${url}:`, err);
        if (attempt < retries) {
          await new Promise((resolve) => setTimeout(resolve, 300 * (attempt + 1)));
        }
      }
    }
  }

  return null;
}
