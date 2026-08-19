import https from 'https';
import * as cheerio from 'cheerio';

https.get('https://sarkariresult.com.cm/bpssc-bihar-forest-range-officer-2026/', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
  }
}, (res) => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    const $ = cheerio.load(d);
    const mainEl = $('main.site-main');
    console.log('main.site-main count:', mainEl.length);
    console.log('main.site-main text length:', mainEl.text().trim().length);
    console.log('main.site-main html length:', (mainEl.html() || '').length);
  });
});
