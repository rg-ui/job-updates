// Force IPv4-first DNS resolution to avoid Cloudflare IPv6 timeouts
try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const dns = require('node:dns') as typeof import('node:dns');
  if (dns && typeof dns.setDefaultResultOrder === 'function') {
    dns.setDefaultResultOrder('ipv4first');
  }
} catch {
  // Ignore if unsupported (edge runtimes, etc.)
}

interface FetchUpstreamOptions {
  revalidate?: number | false;
  /** Per-attempt timeout in ms. Default 15000 (safe for Vercel's 30s limit) */
  timeoutMs?: number;
}

const UPSTREAM_HOST = 'sarkariresult.com.cm';
const UPSTREAM_BASE = `https://${UPSTREAM_HOST}`;

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  Pragma: 'no-cache',
  Connection: 'keep-alive',
};

/**
 * Attempt a single fetch with timeout. Returns null on failure (does NOT throw).
 * Returns '' on definitive 404.
 */
async function tryFetch(
  url: string,
  extra: { next?: { revalidate?: number | false } },
  timeoutMs: number
): Promise<string | null> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: BROWSER_HEADERS,
      signal: controller.signal,
      ...extra,
    });
    clearTimeout(timer);
    if (res.ok) return await res.text();
    if (res.status === 404) return ''; // definitive not-found
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
 * Fetch HTML from the upstream source with browser-like headers and retry logic.
 *
 * Tries URLs in this order per attempt:
 *  1. No trailing slash  (faster, avoids IPv6 redirect)
 *  2. With trailing slash
 *
 * Returns:
 *  - HTML string on success
 *  - null if all attempts failed (caller shows fallback UI)
 */
export async function fetchUpstream(
  urlPath: string,
  options: FetchUpstreamOptions = {}
): Promise<string | null> {
  const { revalidate = 60, timeoutMs = 15000 } = options;

  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');
  const urlsToTry: string[] = cleanPath
    ? [
        // No trailing slash first — resolves faster on Cloudflare IPv4
        `${UPSTREAM_BASE}/${cleanPath}`,
        `${UPSTREAM_BASE}/${cleanPath}/`,
      ]
    : [`${UPSTREAM_BASE}/`];

  const nextOption = revalidate !== undefined ? { next: { revalidate } } : {};

  // Two outer rounds: first quick pass, then slower retry if all fail
  for (let round = 0; round < 2; round++) {
    for (const url of urlsToTry) {
      const result = await tryFetch(url, nextOption, timeoutMs);
      if (result === '') return null; // definitive 404
      if (result !== null) return result;
    }
    if (round === 0) {
      // Brief pause before retry round
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  return null;
}
