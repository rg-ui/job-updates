const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('/Users/raviranjankumargupta/job-updates/sarkariresult.html', 'utf8');
const $ = cheerio.load(html);

console.log("Analyzing sections...");
// Find the boxes. Usually they have specific background colors or classes
// The original site is built with GenerateBlocks. Let's look for columns.
const blocks = $('.gb-grid-column');
console.log('Number of gb-grid-column:', blocks.length);
blocks.each((i, el) => {
    const text = $(el).text().trim().substring(0, 50).replace(/\n/g, ' ');
    console.log(`Block ${i}: ${text}`);
});
