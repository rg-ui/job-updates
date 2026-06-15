const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('/Users/raviranjankumargupta/job-updates/sarkariresult.html', 'utf8');
const $ = cheerio.load(html);

$('.gb-grid-column').each((i, el) => {
    const firstText = $(el).find('h3, p, div').first().text().trim();
    const cleanText = $(el).text().trim().toLowerCase();
    
    if (cleanText.startsWith('results')) console.log('Found results at', i);
    if (cleanText.startsWith('admit cards')) console.log('Found admit cards at', i);
    if (cleanText.startsWith('latest jobs')) console.log('Found latest jobs at', i);
});
