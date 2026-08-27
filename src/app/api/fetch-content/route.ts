// Edge runtime = runs on Cloudflare's network, different IPs than Vercel serverless
// This bypasses IP blocks that sarkariresult.com.cm may have on Vercel datacenter IPs
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

const UPSTREAM_BASE = 'https://sarkariresult.com.cm';

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function sanitizePath(path: string): string | null {
  if (!path) return null;
  const clean = path.replace(/^\/+|\/+$/g, '');
  if (clean.includes('..') || /^https?:\/\//i.test(clean)) return null;
  if (!/^[a-zA-Z0-9/\-_]+$/.test(clean)) return null;
  if (clean.length > 200) return null;
  return clean;
}

async function tryFetch(url: string, timeoutMs: number): Promise<string | null> {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': UA,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
      signal: AbortSignal.timeout(timeoutMs),
      redirect: 'follow',
    });
    if (!res.ok) return null;
    const text = await res.text();
    return text && text.length > 500 ? text : null;
  } catch {
    return null;
  }
}

async function tryProxyFetch(targetUrl: string): Promise<string | null> {
  const proxies = [
    // allorigins raw
    `https://api.allorigins.win/raw?url=${encodeURIComponent(targetUrl)}`,
    // corsproxy.io
    `https://corsproxy.io/?url=${encodeURIComponent(targetUrl)}`,
    // allorigins JSON
    null, // handled separately below
    // codetabs
    `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(targetUrl)}`,
  ];

  // Try allorigins raw
  for (const proxyUrl of [proxies[0], proxies[1], proxies[3]]) {
    if (!proxyUrl) continue;
    try {
      const res = await fetch(proxyUrl, {
        headers: { 'User-Agent': UA },
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok) {
        const text = await res.text();
        if (text && text.length > 500) return text;
      }
    } catch { /* try next */ }
  }

  // Try allorigins JSON wrapper
  try {
    const res = await fetch(
      `https://api.allorigins.win/get?url=${encodeURIComponent(targetUrl)}`,
      { headers: { 'User-Agent': UA }, signal: AbortSignal.timeout(12000) }
    );
    if (res.ok) {
      const json = await res.json() as { contents?: string };
      if (json?.contents && json.contents.length > 500) return json.contents;
    }
  } catch { /* ignore */ }

  return null;
}

// Supabase helpers (pure fetch-based, no SDK needed in edge runtime)
function getSupabaseConfig() {
  const url = (globalThis as Record<string, unknown>)['process']
    ? (process.env.NEXT_PUBLIC_SUPABASE_URL || '')
    : '';
  const key = (globalThis as Record<string, unknown>)['process']
    ? (process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '')
    : '';
  return { url, key };
}

async function fetchFromSupabaseEdge(path: string): Promise<string | null> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return null;
  try {
    const res = await fetch(
      `${url}/rest/v1/app_state?key=eq.slug:${encodeURIComponent(path)}&select=value&limit=1`,
      {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
          'Content-Type': 'application/json',
        },
        signal: AbortSignal.timeout(5000),
      }
    );
    if (!res.ok) return null;
    const rows = await res.json() as Array<{ value: { mainContentHtml?: string } }>;
    const html = rows?.[0]?.value?.mainContentHtml;
    return html && html.length > 200 ? html : null;
  } catch {
    return null;
  }
}

async function saveToSupabaseEdge(path: string, html: string): Promise<void> {
  const { url, key } = getSupabaseConfig();
  if (!url || !key) return;
  try {
    await fetch(`${url}/rest/v1/app_state`, {
      method: 'POST',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
        'Prefer': 'resolution=merge-duplicates',
      },
      body: JSON.stringify({ key: `slug:${path}`, value: { mainContentHtml: html } }),
      signal: AbortSignal.timeout(5000),
    });
  } catch { /* non-critical */ }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const rawPath = searchParams.get('path') || '';
  const path = sanitizePath(rawPath);

  if (!path) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const targetUrl = `${UPSTREAM_BASE}/${path}/`;

  // 1. Try Supabase cache first
  const cached = await fetchFromSupabaseEdge(path);
  if (cached) {
    return NextResponse.json(
      { html: cached, source: 'cache' },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }

  // 2. Try direct fetch (Edge = Cloudflare IPs, not Vercel IPs)
  let rawHtml = await tryFetch(targetUrl, 15000);

  // 3. Try proxies if direct fetch fails
  if (!rawHtml) {
    rawHtml = await tryProxyFetch(targetUrl);
  }

  if (!rawHtml) {
    return NextResponse.json(
      { error: 'Content unavailable', source: 'none' },
      {
        status: 503,
        headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' },
      }
    );
  }

  // Save raw HTML to Supabase for next time (fire and forget)
  // (We save raw HTML here; the client processes it)
  // Actually save a marker so we know this path exists
  saveToSupabaseEdge(path, rawHtml).catch(() => {});

  return NextResponse.json(
    { html: rawHtml, source: 'upstream' },
    {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
        'Access-Control-Allow-Origin': '*',
      },
    }
  );
}
