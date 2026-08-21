#!/usr/bin/env node

/**
 * Local cache warmer — run from your machine where upstream is reachable.
 * Usage: node scripts/warm-cache.mjs
 */

import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';

const UPSTREAM_HOST = 'sarkariresult.com.cm';
const UPSTREAM_BASE = `https://${UPSTREAM_HOST}`;

const BROWSER_HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.9',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://jrezvtfyhumedhyrqfys.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZXp2dGZ5aHVtZWRoeXJxZnlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjgwMjE1MSwiZXhwIjoyMDk4Mzc4MTUxfQ.O6KvJbN7sXx68mkj7krGB6hE_wRm7Z4O9gBhU6HBKKE'
);

let DOMPurify = null;

async function getDOMPurify() {
  if (!DOMPurify) {
    const mod = await import('isomorphic-dompurify');
    DOMPurify = mod.default;
  }
  return DOMPurify;
}

async function fetchPage(path) {
  const url = path ? `${UPSTREAM_BASE}/${path}/` : `${UPSTREAM_BASE}/`;
  try {
    const res = await fetch(url, { headers: BROWSER_HEADERS, signal: AbortSignal.timeout(15000), redirect: 'follow' });
    if (!res.ok) return null;
    return await res.text();
  } catch (e) {
    console.warn(`  Failed: ${url} — ${e.message}`);
    return null;
  }
}

function processHtml(html, path) {
  const $ = cheerio.load(html);

  let title = $('title').text() || 'Jobniti';
  title = title.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
               .replace(/Sarkari Result/gi, 'Jobniti');

  let description = $('meta[name="description"]').attr('content') || '';
  description = description.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
                            .replace(/Sarkari Result/gi, 'Jobniti');

  let mainContentHtml = '';
  const entryContent = $('main.site-main');

  if (entryContent.length > 0) {
    entryContent.find('ins.adsbygoogle').remove();
    entryContent.find('.code-block').remove();
    entryContent.find('script').remove();
    entryContent.find('style').remove();
    entryContent.find('iframe').remove();

    entryContent.find('a').each((_, a) => {
      let href = $(a).attr('href');
      const text = $(a).text().toLowerCase();

      if (text.includes('app now') || text.includes('mobile app') || text.includes('android app') || text.includes('app download')) {
        const parent = $(a).parent();
        if (parent.is('p') && parent.text().trim() === $(a).text().trim()) {
          parent.remove();
        } else {
          $(a).remove();
        }
        return;
      }

      if (href) {
        if (href.startsWith('/wp-content/') || href.startsWith('/wp-includes/') || (href.startsWith('/') && /\.pdf\??/i.test(href))) {
          href = 'https://sarkariresult.com.cm' + href;
          $(a).attr('href', href);
        }

        if (href.includes('whatsapp.com')) {
          $(a).attr('href', 'https://chat.whatsapp.com/BD8RX29KRA18PVvPoxJSBM?s=cl&p=a&mlu=2&ilr=0');
        } else if (href.includes('t.me') || href.includes('telegram.me')) {
          $(a).attr('href', 'https://t.me/job1updat8');
        } else if (href.includes('email-protection')) {
          $(a).attr('href', '/contact/email');
          $(a).text('[email protected]');
        } else if (href.includes('sarkariresult.com.cm')) {
          if (href.includes('/wp-content/') || href.includes('/wp-includes/') || /\.pdf\??/i.test(href)) {
            $(a).attr('href', href.replace(/sarkariresult\.com\.cm/gi, 'SARKARI_ASSETS_DOMAIN'));
          } else {
            $(a).attr('href', href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//gi, '/'));
          }
        }
      }
    });

    entryContent.find('img').each((_, img) => {
      const src = $(img).attr('src');
      if (src) $(img).attr('src', src.replace(/sarkariresult\.com\.cm/gi, 'sarkariresult.com.cm'));
      const srcset = $(img).attr('srcset');
      if (srcset) $(img).attr('srcset', srcset.replace(/sarkariresult\.com\.cm/gi, 'sarkariresult.com.cm'));
    });

    mainContentHtml = entryContent.html() || '';
    mainContentHtml = mainContentHtml
      .replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
      .replace(/Sarkari Result/gi, 'Jobniti')
      .replace(/SarkariResult/gi, 'Jobniti')
      .replace(/Since 2009/gi, 'Since 2026')
      .replace(/About Author\s*:\s*Sanjay Singh/gi, 'About Owner : Manii Gupta')
      .replace(/Sanjay Singh has been writing content for the education sector[^<]*/gi, 'He has cracked several govt exams but somehow not able to make merit results. He has wide experience in this field.')
      .replace(/Sanjay Singh has been writing content[^<]*/gi, 'He has cracked several govt exams but somehow not able to make merit results. He has wide experience in this field.')
      .replace(/<a[^>]*cdn-cgi\/l\/email-protection[^>]*>.*?<\/a>/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
      .replace(/<span[^>]*__cf_email__[^>]*>.*?<\/span>/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
      .replace(/\[email\s*protected\]/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
      .replace(/\[email&nbsp;protected\]/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
      .replace(/(Email:\s*<a href="\/contact\/email"[^>]*>\[email protected\]<\/a>)/gi, '$1 <br/><br/><strong>For any query:</strong> 9135293069');
  }

  return { title, description, mainContentHtml, slug: path };
}

async function main() {
  const purify = await getDOMPurify();

  console.log('=== Jobniti Cache Warmer ===\n');

  // 1. Fetch homepage
  console.log('Fetching homepage...');
  const homeHtml = await fetchPage('');
  if (!homeHtml) {
    console.warn('⚠️  Failed to fetch homepage — skipping cache warm (network may be restricted)');
    return;
  }
  console.log('Homepage fetched successfully.\n');

  // 2. Extract slugs
  const slugSet = new Set();
  const slugPattern = /href="https?:\/\/sarkariresult\.com\.cm\/([a-zA-Z0-9\/\-_]+)\/?"/g;
  const relPattern = /href="\/([a-zA-Z0-9\/\-_]+)\/?"/g;

  let match;
  while ((match = slugPattern.exec(homeHtml)) !== null) {
    const slug = match[1].replace(/\/$/, '');
    if (slug && !slug.includes('wp-content') && !slug.includes('wp-includes') && !slug.includes('feed') && !slug.includes('comment')) {
      slugSet.add(slug);
    }
  }
  while ((match = relPattern.exec(homeHtml)) !== null) {
    const slug = match[1].replace(/\/$/, '');
    if (slug && !slug.includes('wp-content') && !slug.includes('wp-includes') && !slug.includes('feed') && !slug.includes('comment') && !['privacy-policy', 'terms', 'disclaimer', 'contact'].includes(slug)) {
      slugSet.add(slug);
    }
  }

  const slugs = Array.from(slugSet);
  console.log(`Found ${slugs.length} slugs on homepage.\n`);

  // 3. Check existing cache
  const { data: existingKeys } = await supabase
    .from('app_state')
    .select('key');

  const existingSlugs = new Set((existingKeys || []).map(k => k.key.replace('slug:', '')));
  const missing = slugs.filter(s => !existingSlugs.has(s));
  console.log(`Already cached: ${slugs.length - missing.length}`);
  console.log(`Missing: ${missing.length}\n`);

  if (missing.length === 0) {
    console.log('All slugs are cached!');
    return;
  }

  // 4. Fetch and cache missing slugs
  let warmed = 0;
  let failed = 0;

  for (let i = 0; i < missing.length; i++) {
    const slug = missing[i];
    process.stdout.write(`[${i + 1}/${missing.length}] ${slug}... `);

    const html = await fetchPage(slug);
    if (!html) {
      console.log('SKIP (fetch failed)');
      failed++;
      continue;
    }

    try {
      const result = processHtml(html, slug);
      const sanitized = purify.sanitize(result.mainContentHtml, {
        ALLOWED_TAGS: ['a', 'strong', 'em', 'b', 'i', 'u', 'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'div', 'span',
          'blockquote', 'pre', 'code', 'sub', 'sup', 'small', 'section', 'article'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'width', 'height', 'style', 'class', 'colspan', 'rowspan', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
      });
      result.mainContentHtml = sanitized;

      const { error } = await supabase
        .from('app_state')
        .upsert({ key: `slug:${slug}`, value: result }, { onConflict: 'key' });

      if (error) {
        console.log(`DB ERROR: ${error.message}`);
        failed++;
      } else {
        console.log('OK');
        warmed++;
      }
    } catch (e) {
      console.log(`PROCESS ERROR: ${e.message}`);
      failed++;
    }
  }

  console.log(`\nDone! Warmed: ${warmed}, Failed: ${failed}`);
}

main().catch(console.error);
