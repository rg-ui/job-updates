import React from 'react';
import AdsSidebar from '@/components/AdsSidebar';
import SeoContent from '@/components/SeoContent';
import StateJobFilter from '@/components/StateJobFilter';
import * as cheerio from 'cheerio';

// Revalidate page every 60 seconds to prevent hammering the target site and getting IP banned
export const revalidate = 60;

async function fetchSarkariData() {
  try {
    // Use a standard User-Agent so we don't look like a malicious bot
    const res = await fetch('https://sarkariresult.com.cm/', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
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
        // SEO: Keep 'Sarkari Result' keyword intact, only replace the target domain string
        text = text.replace(/sarkariresult\.com\.cm/gi, 'jobniti.in');

        return {
          text: text,
          href: href
        };
      }).get().filter(l => l.text.length > 3);

      if (rawLinks.length === 0) return;

      // Figure out the Title for the Box
      // Source site uses <p class="gb-headline gb-headline-text"> for section titles
      let title = $(el).find('.gb-headline-text').first().text().trim();

      // Fallback: try h2, h3, h4, strong
      if (!title) {
        title = $(el).find('h2, h3, h4, strong').first().text().trim();
      }

      // Last resort fallback
      if (!title) {
        title = $(el).text().trim().split('\n')[0].trim();
      }

      // SEO: Keep 'Sarkari Result' intact
      title = title.replace(/sarkariresult\.com\.cm/gi, 'jobniti.in');

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
    // Enhanced security logging for scraping failures
    const logEntry = {
      timestamp: new Date().toISOString(),
      level: 'ERROR',
      type: 'SCRAPING_FAILURE',
      targetUrl: 'https://sarkariresult.com.cm/',
      message: error instanceof Error ? error.message : String(error)
    };
    console.error(JSON.stringify(logEntry));
    return null;
  }
}

export default async function Home() {
  const data = await fetchSarkariData();

  if (!data) {
    return <div className="grid-container" style={{ textAlign: 'center', padding: '50px' }}>Failed to load data. Please try again later.</div>;
  }

  return (
    <div className="grid-container" style={{ paddingTop: '10px', paddingBottom: '20px' }}>
      <div className="main-layout">

        {/* Main Content */}
        <div className="main-content">
          <StateJobFilter initialBlocks={data.blocks} />

          {/* Important Links / Notice Section */}
          {data.topNotices.length > 0 && (
            <div style={{ marginTop: '20px' }} className="category-box">
              <h2 className="category-title" style={{ backgroundColor: '#2f4468' }}>Top Notices &amp; Important Links</h2>
              <ul className="category-list" style={{ columns: 2 }}>
                {data.topNotices.map((item, index) => (
                  <li key={`notice-${index}`}><a href={item.href} style={{ color: '#0000c0' }}>{item.text}</a></li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar — desktop only (hidden on mobile via CSS) */}
        <div className="sidebar-area">
          <AdsSidebar />
          <AdsSidebar />
        </div>

      </div>

      {/* SEO Content */}
      <SeoContent />
    </div>
  );
}
