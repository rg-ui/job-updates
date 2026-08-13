import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import webpush from 'web-push';

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

const VAPID_PUBLIC_KEY = process.env.VAPID_PUBLIC_KEY || '';
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY || '';
const VAPID_EMAIL = process.env.VAPID_EMAIL || 'mailto:support@jobniti.in';

if (VAPID_PUBLIC_KEY && VAPID_PRIVATE_KEY) {
  webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);
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

function toISTDateString(tsMs: number): string {
  const IST_OFFSET_MS = 5.5 * 60 * 60 * 1000;
  return new Date(tsMs + IST_OFFSET_MS).toISOString().slice(0, 10);
}

// Safe URL construction — only allow relative paths
function safeUpstreamUrl(href: string): string | null {
  if (!href.startsWith('/') || href.startsWith('//')) return null;
  if (href.includes('..')) return null;
  if (href.length > 300) return null;
  return `https://sarkariresult.com.cm${href}`;
}

async function getPostDateIST(href: string): Promise<string | null> {
  try {
    const fullUrl = safeUpstreamUrl(href);
    if (!fullUrl) return null;

    const res = await fetch(fullUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;

    const reader = res.body?.getReader();
    if (!reader) return null;

    let accumulated = '';
    const decoder = new TextDecoder();
    while (accumulated.length < 6000) {
      const { done, value } = await reader.read();
      if (done) break;
      accumulated += decoder.decode(value, { stream: true });
      if (accumulated.includes('</head>')) { reader.cancel(); break; }
    }

    const match = accumulated.match(/article:published_time[^>]*content="([^"]+)"/);
    if (!match) return null;
    return toISTDateString(new Date(match[1]).getTime());
  } catch {
    return null;
  }
}

async function pLimit<T>(tasks: (() => Promise<T>)[], concurrency: number): Promise<T[]> {
  const results: T[] = new Array(tasks.length);
  let index = 0;
  async function worker() {
    while (index < tasks.length) { const i = index++; results[i] = await tasks[i](); }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, tasks.length) }, worker));
  return results;
}

const CONTENT_SELECTORS = [
  'main.site-main', 'main#main', 'main',
  '.site-content .entry-content', 'article .entry-content',
  '.entry-content', '#content', '.site-content',
];

function processPageHtml(html: string, slug: string) {
  const $ = cheerio.load(html);

  let title = $('title').text() || 'Jobniti';
  title = title
    .replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
    .replace(/Sarkari Result/gi, 'Jobniti');

  let description = $('meta[name="description"]').attr('content') || '';
  description = description
    .replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
    .replace(/Sarkari Result/gi, 'Jobniti');

  // Find best content container
  let entryContent = $(CONTENT_SELECTORS[0]);
  for (const sel of CONTENT_SELECTORS) {
    const el = $(sel);
    if (el.length > 0 && el.text().trim().length > 100) {
      entryContent = el;
      break;
    }
  }

  let mainContentHtml = '';

  if (entryContent.length > 0) {
    entryContent.find('ins.adsbygoogle').remove();
    entryContent.find('.code-block').remove();
    entryContent.find('script').remove();
    entryContent.find('style').remove();
    entryContent.find('iframe').remove();

    entryContent.find('a').each((_, a) => {
      let href = $(a).attr('href');
      if (!href) return;

      if (href.startsWith('/wp-content/') || href.startsWith('/wp-includes/')) {
        href = 'https://sarkariresult.com.cm' + href;
        $(a).attr('href', href);
      }

      if (href.includes('whatsapp.com')) {
        $(a).attr('href', 'https://chat.whatsapp.com/BD8RX29KRA18PVvPoxJSBM?s=cl&p=a&mlu=2&ilr=0');
      } else if (href.includes('t.me') || href.includes('telegram.me')) {
        $(a).attr('href', 'https://t.me/job1updat8');
      } else if (href.includes('sarkariresult.com.cm')) {
        if (href.includes('/wp-content/') || href.includes('/wp-includes/') || /\.pdf\??/i.test(href)) {
          // keep as-is
        } else {
          $(a).attr('href', href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//gi, '/'));
        }
      }
    });

    mainContentHtml = (entryContent.html() || '')
      .replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
      .replace(/Sarkari Result/gi, 'Jobniti')
      .replace(/SarkariResult/gi, 'Jobniti')
      .replace(/Since 2009/gi, 'Since 2026')
      .replace(/About Author\s*:\s*Sanjay Singh/gi, 'About Owner : Manii Gupta')
      .replace(/\[email\s*protected\]/gi, '<a href="/contact/email" style="color:#0000c0;font-weight:bold;">[email protected]</a>');
  }

  return { title, description, mainContentHtml, slug };
}

async function warmNewPost(supabase: SupabaseClient, href: string) {
  try {
    const slug = href.replace(/^\/+|\/+$/g, '');
    const pageUrl = `https://sarkariresult.com.cm/${slug}/`;
    const res = await fetch(pageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(15000),
    });
    if (!res.ok) return;

    const html = await res.text();
    const pageData = processPageHtml(html, slug);

    if (pageData.mainContentHtml.length > 100) {
      await supabase
        .from('app_state')
        .upsert({ key: `slug:${slug}`, value: pageData }, { onConflict: 'key' });
      console.log(`[cron-warm] Successfully pre-cached slug: ${slug}`);
    }
  } catch (err) {
    console.warn(`[cron-warm] Failed to pre-cache ${href}:`, err);
  }
}

export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getSupabase();
  if (!supabase) {
    return NextResponse.json({ error: 'Database not configured' }, { status: 503 });
  }

  const todayIST = toISTDateString(Date.now());

  try {
    // 1. Scrape listing
    const res = await fetch('https://sarkariresult.com.cm/', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
      cache: 'no-store',
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    // 2. Parse links
    const allLinks: { text: string; href: string }[] = [];
    const seenHrefs = new Set<string>();

    $('.gb-grid-column').each((_, el) => {
      $(el).find('a').each((_, a) => {
        let href = sanitizeUrl($(a).attr('href') || '#');
        if (href.includes('sarkariresult.com.cm')) {
          href = href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//g, '/');
        }
        const text = $(a).text().trim().replace(/sarkariresult\.com\.cm/gi, 'jobniti.in').replace(/Sarkari Result/gi, 'Jobniti');
        if (text.length > 3 && href.startsWith('/') && !seenHrefs.has(href)) {
          seenHrefs.add(href);
          allLinks.push({ text, href });
        }
      });
    });

    // 3. Check date cache
    const cacheKey = `post_dates_${todayIST}`;
    let cachedDateMap: Record<string, string | null> = {};
    try {
      const { data: row } = await supabase.from('app_state').select('value').eq('key', cacheKey).single();
      if (row?.value) cachedDateMap = row.value as Record<string, string | null>;
    } catch {}

    // 4. Fetch dates for uncached links
    const toFetch = allLinks.filter(l => !(l.href in cachedDateMap));
    if (toFetch.length > 0) {
      const tasks = toFetch.map(link => () => getPostDateIST(link.href));
      const dates = await pLimit(tasks, 20);
      toFetch.forEach((link, i) => { cachedDateMap[link.href] = dates[i]; });
      await supabase.from('app_state').upsert({ key: cacheKey, value: cachedDateMap }, { onConflict: 'key' });
    }

    // 5. Filter today's links
    const todayLinks = allLinks.filter(l => cachedDateMap[l.href] === todayIST);

    // 6. Check what's already been notified
    const notifiedKey = `notified_links_${todayIST}`;
    let alreadyNotified: string[] = [];
    try {
      const { data: notifiedRow } = await supabase.from('app_state').select('value').eq('key', notifiedKey).single();
      if (notifiedRow?.value) alreadyNotified = notifiedRow.value as string[];
    } catch {}

    const newHrefs = todayLinks.map(l => l.href).filter(href => !alreadyNotified.includes(href));

    if (newHrefs.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new posts to notify',
        todayIST,
        totalLinks: allLinks.length,
        todayLinks: todayLinks.length,
        newPosts: 0,
        alreadyNotified: alreadyNotified.length,
      });
    }

    // Warm cache for new posts in parallel before sending notifications
    await Promise.allSettled(newHrefs.map(href => warmNewPost(supabase, href)));

    // 7. Fetch subscriptions
    const { data: subscriptions } = await supabase.from('push_subscriptions').select('endpoint, p256dh, auth');
    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ success: true, message: 'No subscribers', newPosts: newHrefs.length });
    }

    // 8. Build notification payload
    const newPosts = todayLinks.filter(l => newHrefs.includes(l.href));
    const postCount = newPosts.length;
    const title = postCount === 1 ? 'New Job Update' : `${postCount} New Updates Today`;
    const body = postCount === 1
      ? newPosts[0].text
      : `Latest: ${newPosts[0].text} and ${postCount - 1} more. Check now!`;
    const url = postCount === 1 ? newPosts[0].href : '/';

    const payload = JSON.stringify({
      title, body, url,
      tag: 'jobniti-new-update',
      icon: '/jobniti-favicon.png',
      badge: '/jobniti-favicon-48.png',
    });

    // 9. Send to all subscribers
    let sent = 0, errors = 0;
    const failedEndpoints: string[] = [];

    await Promise.allSettled(
      subscriptions.map(async (sub) => {
        try {
          await webpush.sendNotification(
            { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
            payload
          );
          sent++;
        } catch (err: unknown) {
          errors++;
          if (err && typeof err === 'object' && 'statusCode' in err) {
            const sc = (err as { statusCode?: number }).statusCode;
            if (sc === 404 || sc === 410) failedEndpoints.push(sub.endpoint);
          }
        }
      })
    );

    // 10. Clean expired subscriptions
    if (failedEndpoints.length > 0) {
      await supabase.from('push_subscriptions').delete().in('endpoint', failedEndpoints);
    }

    // 11. Update notified list
    const updatedNotified = [...alreadyNotified, ...newHrefs].slice(-200);
    await supabase.from('app_state').upsert({ key: notifiedKey, value: updatedNotified }, { onConflict: 'key' });

    return NextResponse.json({
      success: true,
      todayIST,
      newPosts: newHrefs.length,
      notificationsSent: sent,
      notificationsFailed: errors,
      totalSubscribers: subscriptions.length,
      cleanedExpired: failedEndpoints.length,
    });

  } catch (error) {
    console.error('Cron notify error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
