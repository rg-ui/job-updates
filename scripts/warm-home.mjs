import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';

const supabase = createClient(
  'https://jrezvtfyhumedhyrqfys.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZXp2dGZ5aHVtZWRoeXJxZnlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjgwMjE1MSwiZXhwIjoyMDk4Mzc4MTUxfQ.O6KvJbN7sXx68mkj7krGB6hE_wRm7Z4O9gBhU6HBKKE'
);

const BROWSER_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
  'Cache-Control': 'no-cache',
};

async function fetchWithFallbacks(targetUrl) {
  // 1. Direct fetch with timeout
  try {
    const res = await fetch(targetUrl, {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      const html = await res.text();
      if (html && html.length > 500) {
        return html;
      }
    }
    console.warn(`[warm-home] Direct fetch returned status ${res.status} for ${targetUrl}`);
  } catch (err) {
    console.warn(`[warm-home] Direct fetch error for ${targetUrl}:`, err.message || err);
  }

  // 2. Proxy Fallbacks
  const proxyGetters = [
    // 1. corsproxy.io
    async (url) => {
      const res = await fetch(`https://corsproxy.io/?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500) return text;
      }
      throw new Error('corsproxy.io failed');
    },
    // 2. api.allorigins.win (raw)
    async (url) => {
      const res = await fetch(`https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500) return text;
      }
      throw new Error('allorigins raw failed');
    },
    // 3. api.allorigins.win (JSON wrapper)
    async (url) => {
      const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const json = await res.json();
        if (json && json.contents && json.contents.length > 500) return json.contents;
      }
      throw new Error('allorigins JSON failed');
    },
    // 4. api.codetabs.com
    async (url) => {
      const res = await fetch(`https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(url)}`, {
        headers: { 'User-Agent': BROWSER_HEADERS['User-Agent'] },
        signal: AbortSignal.timeout(8000),
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500) return text;
      }
      throw new Error('codetabs failed');
    },
  ];

  for (const getProxyContent of proxyGetters) {
    try {
      const html = await getProxyContent(targetUrl);
      if (html) {
        console.log(`[warm-home] Proxy fetch succeeded for ${targetUrl}`);
        return html;
      }
    } catch (err) {
      console.warn(`[warm-home] Proxy fallback failed:`, err.message || err);
    }
  }

  throw new Error('All fetch attempts failed');
}

async function main() {
  const html = await fetchWithFallbacks('https://sarkariresult.com.cm/');
  const $ = cheerio.load(html);
  const blocks = [];
  const topNotices = [];
  $('.gb-grid-column').each((_, el) => {
    let title = $(el).find('.gb-headline-text').first().text().trim() || $(el).find('h2, h3, h4, strong').first().text().trim();
    if (!title) return;
    title = title.replace(/sarkariresult\.com\.cm/gi, 'jobniti.in').replace(/Sarkari Result/gi, 'Jobniti');
    const links = [];
    $(el).find('a').each((_, a) => {
      let href = $(a).attr('href') || '#';
      if (href.includes('sarkariresult.com.cm')) href = href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//g, '/');
      let text = $(a).text().trim().replace(/sarkariresult\.com\.cm/gi, 'jobniti.in').replace(/Sarkari Result/gi, 'Jobniti');
      if (text.length > 3 && href.startsWith('/')) {
        links.push({ text, href });
      }
    });
    if (links.length >= 2) blocks.push({ title, links });
    else if (links.length > 0) topNotices.push(...links);
  });

  const { error } = await supabase.from('app_state').upsert({ key: 'homepage_cache', value: { blocks, topNotices } }, { onConflict: 'key' });
  console.log('Homepage cache stored in Supabase:', !error ? 'SUCCESS' : error);
}

main();
