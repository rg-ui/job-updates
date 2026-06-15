const https = require('https');
const cheerio = require('cheerio');

https.get('https://sarkariresult.com.cm/upsc-engineering-services-2026/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const $ = cheerio.load(data);
    const content = $('.entry-content, .inside-article').html();
    console.log("Content found:", !!content);
    if (content) {
      console.log("Length:", content.length);
      console.log("First 200 chars:", content.substring(0, 200));
    }
  });
});
