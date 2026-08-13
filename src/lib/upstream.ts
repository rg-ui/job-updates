const UPSTREAM_HOST = 'sarkariresult.com.cm';
const UPSTREAM_BASE = `https://${UPSTREAM_HOST}`;

export async function fetchViaProxy(urlPath: string): Promise<string | null> {
  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');
  const targetUrl = cleanPath ? `${UPSTREAM_BASE}/${cleanPath}/` : `${UPSTREAM_BASE}/`;
  const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 6000);

  try {
    const res = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      },
      signal: controller.signal,
    });
    clearTimeout(timer);
    if (res.ok) {
      const text = await res.text();
      if (text.length > 200) {
        return text;
      }
    }
    console.warn(`[proxy-fetch] Proxy responded ${res.status} for ${cleanPath}`);
    return null;
  } catch (err: unknown) {
    clearTimeout(timer);
    const msg = err instanceof Error ? err.message : String(err);
    console.warn(`[proxy-fetch] Proxy failed for ${cleanPath}: ${msg}`);
    return null;
  }
}

export async function fetchUpstream(
  urlPath: string,
  options?: { revalidate?: number | false; timeoutMs?: number }
): Promise<string | null> {
  if (options && options.timeoutMs) {
    console.log(`[upstream] fetch requested with timeout: ${options.timeoutMs}`);
  }
  // Always route through proxy directly for 100% reliability and speed
  return fetchViaProxy(urlPath);
}
