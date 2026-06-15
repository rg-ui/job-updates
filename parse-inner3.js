const https = require('https');
const cheerio = require('cheerio');

https.get('https://sarkariresult.com.cm/upsc-engineering-services-2026/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const $ = cheerio.load(data);
    
    const mainHtml = $('main.site-main').html();
    console.log("Main HTML length:", mainHtml ? mainHtml.length : 0);
    
    // Check if there are gb-headline or table inside
    console.log("Tables inside main:", $('main.site-main table').length);
    console.log("gb-headline inside main:", $('main.site-main .gb-headline').length);
  });
});
