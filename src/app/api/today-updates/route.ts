import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://jobniti.in');
    const protocol = parsed.protocol.toLowerCase();
    if (protocol === 'javascript:' || protocol === 'data:' || protocol === 'vbscript:') return '#';
    return url;
  } catch {
    return '#';
  }
}

// IST date string for a given timestamp: "2026-07-01"
function toISTDateString(tsMs: number): string {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  return new Date(tsMs + IST_OFFSET_MS).toISOString().slice(0, 10);
}

// Fetch only the <head> of a page to extract article:published_time meta tag
// We send a regular GET but only read enough bytes to find the meta tag (fast)
async function getPostDateIST(href: string): Promise<string | null> {
  try {
    const baseUrl = 'https://sarkariresult.com.cm';
    const fullUrl = href.startsWith('http') ? href : `${baseUrl}${href}`;

    // Only internal sarkariresult pages have a post date
    if (!fullUrl.includes('sarkariresult.com.cm') && !href.startsWith('/')) {
      return null;
    }

    const res = await fetch(fullUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!res.ok) return null;

    // Read in chunks and stop early once we find the meta tag
    const reader = res.body?.getReader();
    if (!reader) return null;

    let accumulated = '';
    const decoder = new TextDecoder();
    const MAX_BYTES = 6000; // <head> is usually within first 6KB

    while (accumulated.length < MAX_BYTES) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });

      // Once we have </head> we can stop reading
      if (accumulated.includes('</head>')) {
        reader.cancel();
        break;
      }
    }

    // Extract article:published_time
    const match = accumulated.match(/article:published_time[^>]*content="([^"]+)"/);
    if (!match) return null;

    const publishedTime = match[1]; // e.g. "2026-07-01T04:47:56+00:00"
    const tsMs = new Date(publishedTime).getTime();
    return toISTDateString(tsMs); // e.g. "2026-07-01"
  } catch {
    return null;
  }
}

// Run promises with max concurrency
async function pLimit<T>(
  tasks: (() => Promise<T>)[],
  concurrency: number
): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, tasks.length) }, worker);
  await Promise.all(workers);
  return results;
}

export async function GET() {
  try {
    // Today's date in IST
    const todayIST = toISTDateString(Date.now());

    // 1. Fetch fresh listing from source
    const res = await fetch('https://sarkariresult.com.cm/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      cache: 'no-store',
    });

    const html = await res.text();
    const $ = cheerio.load(html);

    // 2. Parse all unique links from main listing
    interface RawLink {
      text: string;
      href: string;
      blockTitle: string;
    }

    const allLinks: RawLink[] = [];
    const seenHrefs = new Set<string>();

    $('.gb-grid-column').each((_, el) => {
      let title = $(el).find('.gb-headline-text').first().text().trim();
      if (!title) title = $(el).find('h2, h3, h4, strong').first().text().trim();
      if (!title || title.length > 60) title = 'Updates';
      title = title
        .replace(/sarkariresult\.com\.cm/gi, 'jobniti.in')
        .replace(/Sarkari Result/gi, 'Jobniti');

      $(el).find('a').each((_, a) => {
        let href = sanitizeUrl($(a).attr('href') || '#');

        // Rewrite external social links
        if (href.includes('whatsapp.com')) href = 'https://chat.whatsapp.com/BD8RX29KRA18PVvPoxJSBM?s=cl&p=a&mlu=2&ilr=0';
        else if (href.includes('t.me') || href.includes('telegram.me')) href = 'https://t.me/job1updat8';
        else if (href.includes('sarkariresult.com.cm')) {
          href = href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//g, '/');
        }

        let text = $(a).text().trim()
          .replace(/sarkariresult\.com\.cm/gi, 'jobniti.in')
          .replace(/Sarkari Result/gi, 'Jobniti');

        // Only keep meaningful internal links, skip duplicates
        if (text.length > 3 && href.startsWith('/') && !seenHrefs.has(href)) {
          seenHrefs.add(href);
          allLinks.push({ text, href, blockTitle: title });
        }
      });
    });

    // 3. Check if Supabase has a cached date-map for today
    const supabase = getSupabase();
    const cacheKey = `post_dates_${todayIST}`;
    let cachedDateMap: Record<string, string | null> = {};

    if (supabase) {
      try {
        const { data: row } = await supabase
          .from('app_state')
          .select('value')
          .eq('key', cacheKey)
          .single();
        if (row?.value) {
          cachedDateMap = row.value as Record<string, string | null>;
        }
      } catch {
        // No cache yet — ok
      }
    }

    // 4. Find which hrefs we need to fetch (not in cache)
    const toFetch = allLinks.filter(l => !(l.href in cachedDateMap));

    // 5. Parallel fetch post dates (concurrency = 20)
    if (toFetch.length > 0) {
      const tasks = toFetch.map(link => () => getPostDateIST(link.href));
      const dates = await pLimit(tasks, 20);

      toFetch.forEach((link, i) => {
        cachedDateMap[link.href] = dates[i];
      });

      // Save updated cache to Supabase (only for today's cache key)
      if (supabase) {
        try {
          await supabase
            .from('app_state')
            .upsert({ key: cacheKey, value: cachedDateMap }, { onConflict: 'key' });
        } catch {
          // Non-critical
        }
      }
    }

    // 6. Filter: only links whose post date == today (IST)
    const todayLinks = allLinks.filter(l => cachedDateMap[l.href] === todayIST);

    // 7. Group by block title
    const groupedBlocks: Record<string, { text: string; href: string }[]> = {};
    for (const link of todayLinks) {
      if (!groupedBlocks[link.blockTitle]) {
        groupedBlocks[link.blockTitle] = [];
      }
      groupedBlocks[link.blockTitle].push({ text: link.text, href: link.href });
    }

    const blocks = Object.entries(groupedBlocks).map(([title, links]) => ({ title, links }));

    return NextResponse.json({
      success: true,
      todayIST,
      totalLinks: allLinks.length,
      totalFetched: toFetch.length,
      totalTodayLinks: todayLinks.length,
      blocks,
      supabaseConnected: !!supabase,
    });
  } catch (error) {
    console.error('today-updates API error:', error);
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
