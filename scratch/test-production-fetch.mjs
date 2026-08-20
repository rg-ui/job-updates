

const path = 'rpsc-rajasthan-police-si-telecom-2025';
const UPSTREAM_BASE = 'https://sarkariresult.com.cm';
const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

async function testUrl(targetUrl) {
  console.log(`\n--- Testing direct fetch for: ${targetUrl} ---`);
  try {
    const res = await fetch(targetUrl, { headers: BROWSER_HEADERS, timeout: 8000 });
    console.log(`Direct fetch status: ${res.status}`);
    const text = await res.text();
    console.log(`Direct fetch length: ${text.length}`);
    if (text.length > 500) {
      console.log(`Direct fetch preview: ${text.substring(0, 200)}`);
    }
  } catch (err) {
    console.log(`Direct fetch error: ${err.message}`);
  }

  // Test proxies
  const proxies = [
    { name: 'corsproxy.io', url: `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}` },
    { name: 'allorigins raw', url: `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}` },
    { name: 'allorigins get json', url: `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}` },
    { name: 'codetabs', url: `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}` },
  ];

  for (const proxy of proxies) {
    console.log(`\nTesting proxy: ${proxy.name}`);
    try {
      const headers = { 'User-Agent': BROWSER_HEADERS['User-Agent'] };
      if (proxy.name === 'corsproxy.io') {
        headers['Origin'] = 'http://localhost:3000';
      }
      const res = await fetch(proxy.url, { headers, timeout: 8000 });
      console.log(`Proxy status: ${res.status}`);
      if (proxy.name.includes('json')) {
        const json = await res.json();
        const content = json.contents || '';
        console.log(`Proxy data length: ${content.length}`);
        if (content.length > 0) {
          console.log(`Proxy preview: ${content.substring(0, 200)}`);
        }
      } else {
        const text = await res.text();
        console.log(`Proxy data length: ${text.length}`);
        if (text.length > 0) {
          console.log(`Proxy preview: ${text.substring(0, 200)}`);
        }
      }
    } catch (err) {
      console.log(`Proxy error: ${err.message}`);
    }
  }
}

async function main() {
  await testUrl(`${UPSTREAM_BASE}/${path}/`);
  await testUrl(`${UPSTREAM_BASE}/${path}`);
}

main();
