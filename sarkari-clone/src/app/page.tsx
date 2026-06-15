import React from 'react';
import AdsSidebar from '@/components/AdsSidebar';
import * as cheerio from 'cheerio';

// Force dynamic rendering so there is absolute zero delay on live updates
export const dynamic = 'force-dynamic';

async function fetchSarkariData() {
  try {
    const res = await fetch('https://sarkariresult.com.cm/', { cache: 'no-store' });
    const html = await res.text();
    const $ = cheerio.load(html);

    const blocks: { title: string, links: { text: string, href: string }[] }[] = [];
    const topNotices: { text: string, href: string }[] = [];

    $('.gb-grid-column').each((i, el) => {
      // Find all links in the column
      const rawLinks = $(el).find('a').map((_, a) => {
        let href = $(a).attr('href') || '#';
        if (href.includes('sarkariresult.com.cm')) {
          href = href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//g, '/');
        } else if (href.includes('whatsapp.com')) {
          href = 'https://chat.whatsapp.com/BD8RX29KRA18PVvPoxJSBM?s=cl&p=a&mlu=2&ilr=0';
        } else if (href.includes('t.me') || href.includes('telegram.me')) {
          href = 'https://t.me/job1updat8';
        }
        
        let text = $(a).text().trim();
        text = text.replace(/Sarkari\s*Result/gi, 'Job Updates').replace(/SarkariResult/gi, 'JobUpdates');

        return {
          text: text,
          href: href
        };
      }).get().filter(l => l.text.length > 3);

      if (rawLinks.length === 0) return;

      // Figure out the Title for the Box
      // Sometimes it's wrapped in an <h2>, <h3> or <strong>
      let title = $(el).find('h2, h3, h4, strong').first().text().trim();
      
      // Fallback: If no heading tag is found, try taking the first line of text
      if (!title) {
        title = $(el).text().trim().split('\n')[0].trim();
      }

      title = title.replace(/Sarkari\s*Result/gi, 'Job Updates').replace(/SarkariResult/gi, 'JobUpdates');

      // Filter out the link if it is just the title heading itself
      let links = rawLinks.filter(l => l.text !== title);

      // If a block has many links, it's a category box (Result, Admit Card, Syllabus, etc)
      if (links.length >= 2) {
        // Prevent empty titles
        if (!title || title.length > 50) title = 'Updates';
        blocks.push({ title, links });
      } else if (links.length > 0) {
        // If it's just 1 link, it's usually a top marquee/notice block
        topNotices.push(...links);
      }
    });

    return { blocks, topNotices };
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
}

export default async function Home() {
  const data = await fetchSarkariData();

  if (!data) {
    return <div className="grid-container" style={{ textAlign: 'center', padding: '50px' }}>Failed to load data. Please try again later.</div>;
  }

  return (
    <div className="grid-container">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Main Content Area */}
        <div style={{ flex: '1 1 70%', minWidth: '300px' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {data.blocks.map((block, index) => (
              <div className="category-box" key={index}>
                <h2 className="category-title" style={{textTransform: 'capitalize'}}>{block.title}</h2>
                <ul className="category-list">
                  {block.links.map((item, i) => (
                    <li key={i}><a href={item.href}>{item.text}</a></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Important Links / Notice Section */}
          {data.topNotices.length > 0 && (
            <div style={{ marginTop: '30px' }} className="category-box">
              <h2 className="category-title" style={{ backgroundColor: '#2f4468' }}>Top Notices & Important Links</h2>
              <ul className="category-list" style={{ columns: 2 }}>
                {data.topNotices.map((item, index) => (
                  <li key={`notice-${index}`}><a href={item.href} style={{ color: '#0000c0' }}>{item.text}</a></li>
                ))}
              </ul>
            </div>
          )}

        </div>

        {/* Sidebar Area */}
        <div style={{ flex: '1 1 25%', minWidth: '250px' }}>
          <AdsSidebar />
          <AdsSidebar />
        </div>

      </div>
    </div>
  );
}
