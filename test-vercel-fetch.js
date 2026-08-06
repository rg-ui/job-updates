// Test the fixed fetchUpstream
const path = 'hbse-class-12th-2026';
const UPSTREAM_BASE = 'https://sarkariresult.com.cm';
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
  'Pragma': 'no-cache',
};

async function tryFetch(url, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const start = Date.now();
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS, signal: controller.signal });
    clearTimeout(timer);
    const elapsed = Date.now() - start;
    if (res.ok) {
      const text = await res.text();
      return { status: res.status, len: text.length, elapsed };
    }
    return { status: res.status, elapsed };
  } catch (err) {
    clearTimeout(timer);
    return { error: err.message, elapsed: Date.now() - start };
  }
}

async function main() {
  // Try WITHOUT trailing slash first (new order)
  const urls = [
    `${UPSTREAM_BASE}/${path}`,
    `${UPSTREAM_BASE}/${path}/`,
  ];
  
  for (const url of urls) {
    console.log(`Testing: ${url}`);
    const result = await tryFetch(url, 12000);
    console.log('  Result:', JSON.stringify(result));
    if (result.len > 0) {
      console.log('  SUCCESS! Breaking.');
      break;
    }
  }
}

main();
