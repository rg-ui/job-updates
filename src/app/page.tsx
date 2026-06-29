import React from 'react';
import AdsSidebar from '@/components/AdsSidebar';
import SeoContent from '@/components/SeoContent';
import StateJobFilter from '@/components/StateJobFilter';
import * as cheerio from 'cheerio';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { Metadata } from 'next';

// Revalidate page every 60 seconds to prevent hammering the target site and getting IP banned
export const revalidate = 60;

let cachedData: { blocks: any[], topNotices: any[] } | null = null;
let cacheTime = 0;
const CACHE_TTL = 300 * 1000; // 5 minutes cache

async function fetchSarkariData() {
  const now = Date.now();
  if (cachedData && (now - cacheTime < CACHE_TTL)) {
    return cachedData;
  }

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
        text = text.replace(/Sarkari Result/gi, 'Jobniti');

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
      title = title.replace(/Sarkari Result/gi, 'Jobniti');

      // Filter out the link if it is just the title heading itself
      let links = rawLinks.filter(l => l.text !== title);

      // Connect With Us: Only keep WhatsApp and Telegram links
      if (title.toLowerCase().includes('connect') || title.toLowerCase().includes('follow')) {
        links = links.filter(l =>
          l.text.toLowerCase().includes('whatsapp') ||
          l.text.toLowerCase().includes('telegram')
        );
        // Add Social Media Links
        links.push({
          text: 'Jobniti @Instagram',
          href: 'https://www.instagram.com/jobniti.in?igsh=Mm5oY3J3NHp6N3Zz'
        });
        links.push({
          text: 'Jobniti @Facebook',
          href: 'https://www.facebook.com/share/1DmWcGpRku/'
        });
      }

      // If a block has many links, it's a category box (Result, Admit Card, Syllabus, etc)
      if (links.length >= 2 || (title.toLowerCase().includes('connect') && links.length > 0)) {
        // Prevent empty titles
        if (!title || title.length > 50) title = 'Updates';
        blocks.push({ title, links });
      } else if (links.length > 0) {
        // If it's just 1 link, it's usually a top marquee/notice block
        topNotices.push(...links);
      }
    });

    // Diffing logic for dynamic section sorting
    const stateFilePath = path.join(os.tmpdir(), 'jobniti_state.json');
    let previousState: Record<string, { firstLinkHref: string, lastUpdated: number }> = {};
    
    try {
      if (fs.existsSync(stateFilePath)) {
        previousState = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
      }
    } catch (e) {
      console.warn('Could not read state file', e);
    }

    const blocksWithTimestamp = blocks.map(block => {
      const firstLinkHref = block.links[0]?.href || '';
      let lastUpdated = previousState[block.title]?.lastUpdated || 0;
      
      // If this section has a new top link, update its timestamp
      if (previousState[block.title]?.firstLinkHref !== firstLinkHref) {
        lastUpdated = Date.now();
      }
      
      previousState[block.title] = { firstLinkHref, lastUpdated };
      return { ...block, lastUpdated };
    });

    // Save the new state
    try {
      fs.writeFileSync(stateFilePath, JSON.stringify(previousState));
    } catch (e) {
      console.warn('Could not write state file', e);
    }

    // Sort blocks by lastUpdated descending (newly updated sections on top)
    const sortedBlocks = blocksWithTimestamp.sort((a, b) => b.lastUpdated - a.lastUpdated);

    const result = { blocks: sortedBlocks, topNotices };
    cachedData = result;
    cacheTime = Date.now();
    return result;
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
    
    // Return stale cache if available when backend fails
    if (cachedData) {
      console.warn("Using stale cache due to scraping failure");
      return cachedData;
    }
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const data = await fetchSarkariData();
  let dynamicTitle = 'Jobniti | Sarkari Result 2026 | Latest Govt Jobs';
  let dynamicDesc = 'Jobniti.in - India\'s trusted platform for Sarkari Result 2026, Latest Govt Jobs.';

  if (data && data.topNotices && data.topNotices.length > 0) {
    const topKeywords = data.topNotices.slice(0, 2).map(n => n.text).join(' | ');
    dynamicTitle = `${topKeywords} | Jobniti - Sarkari Result`;
    dynamicDesc = `Latest Update: ${topKeywords}. Jobniti.in is your trusted source for Sarkari Result, Govt Jobs, Admit Card and Answer keys.`;
  }

  return {
    title: dynamicTitle,
    description: dynamicDesc,
  };
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
      <SeoContent topNotices={data.topNotices} />
    </div>
  );
}
