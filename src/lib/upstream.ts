const UPSTREAM_HOST = 'sarkariresult.com.cm';
const UPSTREAM_BASE = `https://${UPSTREAM_HOST}`;

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

export async function fetchUpstream(
  urlPath: string,
  options: { timeoutMs?: number; revalidate?: number | false } = {}
): Promise<string | null> {
  const { timeoutMs = 12000, revalidate = 60 } = options;

  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');
  const url = cleanPath
    ? `${UPSTREAM_BASE}/${cleanPath}/`
    : `${UPSTREAM_BASE}/`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fetchOptions: RequestInit = {
      headers: BROWSER_HEADERS,
      signal: controller.signal,
      redirect: 'follow',
    };

    if (revalidate !== false) {
      fetchOptions.next = { revalidate };
    }

    const res = await fetch(url, fetchOptions);
    clearTimeout(timer);

    if (res.ok) {
      const html = await res.text();
      if (html.length > 500) {
        return html;
      }
    }
    console.warn(`[upstream] ${url} responded ${res.status}`);
    return null;
  } catch (err: unknown) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[upstream] ${url} failed: ${msg}`);
    return null;
  }
}
