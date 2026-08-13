import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';

export const maxDuration = 60;

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
  if (!url || !key) return null;
  return createClient(url, key);
}

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

// Selectors in priority order
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

export async function POST(request: Request) {
  try {
    const { secret, force } = await request.json();
    if (secret !== process.env.PUSH_ADMIN_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getSupabase();
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
    }

    // 1. Fetch homepage to get all slugs
    const homeRes = await fetch('https://sarkariresult.com.cm/', {
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(20000),
    });
    const homeHtml = await homeRes.text();

    // Extract all internal job/result links
    const slugPattern = /href="https?:\/\/sarkariresult\.com\.cm\/([a-zA-Z0-9\/\-_]+)\/?"/g;
    const slugSet = new Set<string>();
    let match;
    while ((match = slugPattern.exec(homeHtml)) !== null) {
      const slug = match[1].replace(/\/$/, '');
      if (
        slug && slug !== '' &&
        !slug.includes('wp-content') && !slug.includes('wp-includes') &&
        !slug.includes('feed') && !slug.includes('xmlrpc') &&
        slug.length > 3
      ) {
        slugSet.add(slug);
      }
    }

    const SKIP_SLUGS = new Set([
      'result', 'admit-card', 'latest-jobs', 'answer-key', 'syllabus',
      'admission', 'contact', 'privacy-policy', 'disclaimer', 'terms', 'about',
    ]);

    const slugs = Array.from(slugSet).filter(s => !SKIP_SLUGS.has(s));
    let warmed = 0;
    let skipped = 0;
    let failed = 0;

    // 2. For each slug, check Supabase and fetch+process if missing (or force)
    for (const slug of slugs.slice(0, 20)) {
      if (!force) {
        const { data: existing } = await supabase
          .from('app_state')
          .select('value')
          .eq('key', `slug:${slug}`)
          .single();

        // Skip if already cached WITH real content
        const cachedVal = existing?.value as { mainContentHtml?: string } | null;
        if (cachedVal && (cachedVal.mainContentHtml?.length ?? 0) > 200) {
          skipped++;
          continue;
        }
      }

      try {
        const pageUrl = `https://sarkariresult.com.cm/${slug}/`;
        const pageRes = await fetch(pageUrl, {
          headers: BROWSER_HEADERS,
          signal: AbortSignal.timeout(15000),
        });

        if (!pageRes.ok) { failed++; continue; }

        const html = await pageRes.text();
        const pageData = processPageHtml(html, slug);

        if (pageData.mainContentHtml.length > 100) {
          await supabase
            .from('app_state')
            .upsert({ key: `slug:${slug}`, value: pageData }, { onConflict: 'key' });
          warmed++;
        } else {
          failed++;
        }
      } catch {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      totalSlugs: slugs.length,
      processed: Math.min(slugs.length, 20),
      warmed,
      skipped,
      failed,
    });
  } catch (error) {
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    usage: 'POST with { "secret": "your-push-admin-secret" } to warm the Supabase page cache with FULL content. Add "force": true to re-warm even cached pages.',
  });
}
