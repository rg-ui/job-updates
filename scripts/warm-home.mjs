import { createClient } from '@supabase/supabase-js';
import * as cheerio from 'cheerio';

const supabase = createClient(
  'https://jrezvtfyhumedhyrqfys.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpyZXp2dGZ5aHVtZWRoeXJxZnlzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjgwMjE1MSwiZXhwIjoyMDk4Mzc4MTUxfQ.O6KvJbN7sXx68mkj7krGB6hE_wRm7Z4O9gBhU6HBKKE'
);

async function main() {
  const res = await fetch('https://sarkariresult.com.cm/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
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
