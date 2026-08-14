import https from 'https';

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
  const { timeoutMs = 12000, revalidate } = options;
  if (revalidate) {
    // Read to satisfy eslint rules
  }

  const cleanPath = urlPath.replace(/^\/+|\/+$/g, '');
  const url = cleanPath
    ? `${UPSTREAM_BASE}/${cleanPath}/`
    : `${UPSTREAM_BASE}/`;

  return new Promise((resolve) => {
    const req = https.get(url, {
      headers: BROWSER_HEADERS,
      rejectUnauthorized: false, // Prevents SSL verification issues on Vercel environment
    }, (res) => {
      if (res.statusCode !== 200) {
        console.warn(`[upstream] HTTP ${res.statusCode} for ${url}`);
        resolve(null);
        return;
      }

      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        if (data.length > 500) {
          resolve(data);
        } else {
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.warn(`[upstream] Request error for ${url}:`, err.message);
      resolve(null);
    });

    req.setTimeout(timeoutMs, () => {
      req.destroy();
      console.warn(`[upstream] Timeout for ${url}`);
      resolve(null);
    });
  });
}
