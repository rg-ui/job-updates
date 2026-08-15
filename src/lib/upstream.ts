const UPSTREAM_HOST = 'sarkariresult.com.cm';
const UPSTREAM_BASE = `https://${UPSTREAM_HOST}`;

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

export async function fetchUpstream(
  urlPath: string,
  options: { timeoutMs?: number; revalidate?: number | false } = {}
): Promise<string | null> {
  const { timeoutMs = 10000, revalidate = 60 } = options;

  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');
  const targetUrl = cleanPath
    ? `${UPSTREAM_BASE}/${cleanPath}/`
    : `${UPSTREAM_BASE}/`;

  // 1. Direct fetch with fetch() (handles gzip/brotli decoding & redirects automatically)
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const fetchOptions: RequestInit = {
      headers: BROWSER_HEADERS,
      signal: controller.signal,
      redirect: 'follow',
    };

    if (revalidate !== false) {
      fetchOptions.next = { revalidate };
    }

    const res = await fetch(targetUrl, fetchOptions);
    clearTimeout(timer);

    if (res.ok) {
      const html = await res.text();
      if (html && html.length > 500) {
        return html;
      }
    }
    console.warn(`[upstream] Direct fetch returned status ${res.status} for ${targetUrl}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[upstream] Direct fetch error for ${targetUrl}:`, msg);
  }


  // 2. Fallback Proxy Fetch (if direct request blocked or failed)
  const proxyGetters = [
    (url: string) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    (url: string) => `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`,
  ];

  for (const getProxyUrl of proxyGetters) {
    try {
      const proxyUrl = getProxyUrl(targetUrl);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(proxyUrl, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: controller.signal,
      });
      clearTimeout(timer);

      if (res.ok) {
        const html = await res.text();
        if (html && html.length > 500) {
          console.log(`[upstream] Proxy fetch succeeded for ${targetUrl}`);
          return html;
        }
      }
    } catch {
      // Ignore proxy error and try next fallback
    }
  }

  return null;
}

