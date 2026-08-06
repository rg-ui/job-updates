import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

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

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();
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
    });
    const homeHtml = await homeRes.text();

    // Extract all internal links
    const slugPattern = /href="https?:\/\/sarkariresult\.com\.cm\/([a-zA-Z0-9\/\-_]+)\/?"/g;
    const slugSet = new Set<string>();
    let match;
    while ((match = slugPattern.exec(homeHtml)) !== null) {
      const slug = match[1].replace(/\/$/, '');
      if (slug && slug !== '' && !slug.includes('wp-content') && !slug.includes('wp-includes') && !slug.includes('feed')) {
        slugSet.add(slug);
      }
    }

    // Also extract relative paths
    const relPattern = /href="\/([a-zA-Z0-9\/\-_]+)\/?"/g;
    while ((match = relPattern.exec(homeHtml)) !== null) {
      const slug = match[1].replace(/\/$/, '');
      if (slug && slug !== '' && !slug.includes('wp-content') && !slug.includes('wp-includes') && !slug.includes('feed') && !slug.includes('privacy') && !slug.includes('terms') && !slug.includes('disclaimer') && !slug.includes('contact') && !slug.includes('comment')) {
        slugSet.add(slug);
      }
    }

    const slugs = Array.from(slugSet);
    let warmed = 0;
    let skipped = 0;
    let failed = 0;

    // 2. For each slug, check Supabase and fetch if missing
    for (const slug of slugs.slice(0, 30)) { // Limit to 30 per call
      const { data: existing } = await supabase
        .from('app_state')
        .select('key')
        .eq('key', `slug:${slug}`)
        .single();

      if (existing) {
        skipped++;
        continue;
      }

      try {
        const pageUrl = `https://sarkariresult.com.cm/${slug}/`;
        const pageRes = await fetch(pageUrl, {
          headers: BROWSER_HEADERS,
          signal: AbortSignal.timeout(10000),
        });

        if (!pageRes.ok) {
          failed++;
          continue;
        }

        const html = await pageRes.text();

        // Quick extract title and main content
        const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
        const title = titleMatch?.[1]?.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in').replace(/Sarkari Result/gi, 'Jobniti') || 'Jobniti';
        const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
        const description = descMatch?.[1]?.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in').replace(/Sarkari Result/gi, 'Jobniti') || '';

        // Store minimal data for now (full processing on first visit)
        const pageData = { title, description, mainContentHtml: '', slug, cachedAt: Date.now() };

        await supabase
          .from('app_state')
          .upsert({ key: `slug:${slug}`, value: pageData }, { onConflict: 'key' });

        warmed++;
      } catch {
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      totalSlugs: slugs.length,
      processed: Math.min(slugs.length, 30),
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
    usage: 'POST with { "secret": "your-push-admin-secret" } to warm the cache',
  });
}
