const UPSTREAM_HOST = 'sarkariresult.com.cm';
const UPSTREAM_BASE = `https://${UPSTREAM_HOST}`;

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9,hi;q=0.8',
  'Accept-Encoding': 'gzip, deflate, br',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
};

export async function fetchUpstream(
  urlPath: string,
  options: { timeoutMs?: number; revalidate?: number | false } = {}
): Promise<string | null> {
  const { timeoutMs = 15000, revalidate = 60 } = options;

  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');
  const targetUrl = cleanPath
    ? `${UPSTREAM_BASE}/${cleanPath}/`
    : `${UPSTREAM_BASE}/`;

  // 1. Direct fetch
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const fetchOptions: RequestInit = {
      headers: BROWSER_HEADERS,
      signal: controller.signal,
      redirect: 'follow',
    };

    if (revalidate !== false) {
      (fetchOptions as RequestInit & { next?: { revalidate: number } }).next = { revalidate };
    }

    const res = await fetch(targetUrl, fetchOptions);
    clearTimeout(timer);

    if (res.ok) {
      const html = await res.text();
      if (html && html.length > 500) {
        console.log(`[upstream] Direct fetch OK for ${targetUrl}`);
        return html;
      }
    }
    console.warn(`[upstream] Direct fetch returned status ${res.status} for ${targetUrl}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[upstream] Direct fetch error for ${targetUrl}:`, msg);
  }

  // 2. Fallback proxies — tried in order, first success wins
  const proxyGetters: Array<(url: string) => Promise<string>> = [
    // 1. corsproxy.io
    async (url: string) => {
      const res = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) throw new Error(`corsproxy.io status ${res.status}`);
      const text = await res.text();
      if (text && text.length > 500) return text;
      throw new Error('corsproxy.io: empty response');
    },

    // 2. api.allorigins.win (raw)
    async (url: string) => {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) throw new Error(`allorigins raw status ${res.status}`);
      const text = await res.text();
      if (text && text.length > 500) return text;
      throw new Error('allorigins raw: empty response');
    },

    // 3. api.allorigins.win (JSON wrapper)
    async (url: string) => {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) throw new Error(`allorigins JSON status ${res.status}`);
      const json = await res.json() as { contents?: string };
      if (json?.contents && json.contents.length > 500) return json.contents;
      throw new Error('allorigins JSON: empty/missing contents');
    },

    // 4. api.codetabs.com
    async (url: string) => {
      const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) throw new Error(`codetabs status ${res.status}`);
      const text = await res.text();
      if (text && text.length > 500) return text;
      throw new Error('codetabs: empty response');
    },

    // 5. thingproxy.freeboard.io
    async (url: string) => {
      const res = await fetch(`https://thingproxy.freeboard.io/fetch/${url}`, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: AbortSignal.timeout(12000),
      });
      if (!res.ok) throw new Error(`thingproxy status ${res.status}`);
      const text = await res.text();
      if (text && text.length > 500) return text;
      throw new Error('thingproxy: empty response');
    },
  ];

  for (const getProxyContent of proxyGetters) {
    try {
      const html = await getProxyContent(targetUrl);
      if (html) {
        console.log(`[upstream] Proxy fetch succeeded for ${targetUrl}`);
        return html;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[upstream] Proxy fallback failed:`, msg);
    }
  }

  console.error(`[upstream] All fetch methods exhausted for ${targetUrl}`);
  return null;
}
