const https = require('https');
const cheerio = require('cheerio');

https.get('https://sarkariresult.com.cm/upsc-engineering-services-2026/', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    const $ = cheerio.load(data);
    
    // Log the ID or class of the main content div
    const page = $('#page').length;
    const content = $('#content').length;
    const primary = $('#primary').length;
    console.log("page:", page, "content:", content, "primary:", primary);
    
    // Find where the massive text is
    console.log("Body children:", $('body').children().map((i, el) => el.name + (el.attribs.id ? '#'+el.attribs.id : '')).get().join(', '));
    console.log("Main element classes:", $('main').attr('class') || 'none');
    console.log("Article element classes:", $('article').attr('class') || 'none');
    
  });
});
