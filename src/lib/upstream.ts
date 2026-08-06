// Force IPv4-first DNS resolution to avoid Cloudflare IPv6 timeouts
try {
  const dns = require('node:dns');
  if (dns && typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch {
  // Ignore if unsupported in environment (edge runtimes etc.)
}

interface FetchUpstreamOptions {
  revalidate?: number | false;
  retries?: number;
  /** Per-attempt timeout in ms. Default 12000 (safe for Vercel's 25s limit) */
  timeoutMs?: number;
}

const UPSTREAM_BASE = 'https://sarkariresult.com.cm';

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
};

/**
 * Attempt a single fetch with timeout. Returns null on failure (does NOT throw).
 */
async function tryFetch(
  url: string,
  fetchOptions: RequestInit & { next?: { revalidate?: number | false } },
  timeoutMs: number
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...fetchOptions, signal: controller.signal });
    clearTimeout(timer);
    if (res.ok) return await res.text();
    // On 404 don't retry — return empty string to signal "not found"
    if (res.status === 404) return '';
    console.warn(`[upstream] ${url} responded ${res.status}`);
    return null;
  } catch (err: unknown) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[upstream] ${url} failed: ${msg}`);
    return null;
  }
}

/**
 * Fetch HTML from the upstream source with browser-like headers, retry logic,
 * and support for both trailing-slash and non-trailing-slash URLs.
 *
 * Returns:
 *   - string (HTML content) on success
 *   - '' (empty string) if the page definitively 404s
 *   - null if all attempts failed (network/timeout)
 */
export async function fetchUpstream(
  urlPath: string,
  options: FetchUpstreamOptions = {}
): Promise<string | null> {
  const { revalidate = 60, retries = 1, timeoutMs = 12000 } = options;

  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');

  // Try without trailing slash first — more reliably resolves on Cloudflare
  // then with trailing slash, then root
  const urlsToTry: string[] = cleanPath
    ? [
        `${UPSTREAM_BASE}/${cleanPath}`,
        `${UPSTREAM_BASE}/${cleanPath}/`,
      ]
    : [`${UPSTREAM_BASE}/`];

  const fetchOptions: RequestInit & { next?: { revalidate?: number | false } } = {
    headers: BROWSER_HEADERS,
  };
  if (revalidate !== undefined) {
    fetchOptions.next = { revalidate };
  }

  for (const url of urlsToTry) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      if (attempt > 0) {
        await new Promise((r) => setTimeout(r, 500 * attempt));
      }
      const result = await tryFetch(url, fetchOptions, timeoutMs);
      if (result === '') {
        // Definitive 404 — no point retrying other URLs either
        return null;
      }
      if (result !== null) {
        return result;
      }
    }
  }

  return null;
}
