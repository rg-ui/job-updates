import React, { cache } from 'react';
import AdsSidebar from '@/components/AdsSidebar';
import SeoContent from '@/components/SeoContent';
import dynamic from 'next/dynamic';
import * as cheerio from 'cheerio';
import { Metadata } from 'next';
import { supabase } from '@/lib/supabase';
import { fetchUpstream } from '@/lib/upstream';

const StateJobFilter = dynamic(() => import('@/components/StateJobFilter'));

// Revalidate page every 60 seconds to prevent hammering the target site and getting IP banned
export const maxDuration = 30;
export const revalidate = 60;

function sanitizeUrl(url: string): string {
  try {
    const parsed = new URL(url, 'https://jobniti.in');
    const protocol = parsed.protocol.toLowerCase();
    if (protocol === 'javascript:' || protocol === 'data:' || protocol === 'vbscript:') {
      return '#';
    }
    return url;
  } catch {
    return '#';
  }
}

const fetchSarkariData = cache(async () => {
  try {
    const html = await fetchUpstream('');
    if (!html) {
      if (supabase) {
        try {
          const { data: cachedHome } = await supabase
            .from('app_state')
            .select('value')
            .eq('key', 'homepage_cache')
            .single();
          if (cachedHome?.value) {
            return cachedHome.value as { blocks: { title: string; links: { text: string; href: string; isViewMore?: boolean; timestamp?: number }[] }[]; topNotices: { text: string; href: string }[] };
          }
        } catch (e) {
          console.warn('Could not read homepage cache from Supabase', e);
        }
      }
      return null;
    }

    const $ = cheerio.load(html);

    const blocks: { title: string, links: { text: string, href: string, isViewMore?: boolean, timestamp?: number }[] }[] = [];
    const topNotices: { text: string, href: string }[] = [];

    $('.gb-grid-column').each((i, el) => {
      // Find all links in the column
      const rawLinks = $(el).find('a').map((_, a) => {
        let href = sanitizeUrl($(a).attr('href') || '#');
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

        // Detect "View More" button from wp-block-button parent
        const isViewMore = $(a).closest('.wp-block-button').length > 0 || text.toLowerCase() === 'view more';

        return {
          text: text,
          href: href,
          isViewMore,
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
          href: 'https://www.instagram.com/jobniti.in?igsh=Mm5oY3J3NHp6N3Zz',
          isViewMore: false,
        });
        links.push({
          text: 'Jobniti @Facebook',
          href: 'https://www.facebook.com/share/1DmWcGpRku/',
          isViewMore: false,
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

    // Track link appearance via Supabase for persistent storage
    let knownLinks: Record<string, number> = {};
    if (supabase) {
      try {
        const { data: row } = await supabase
          .from('app_state')
          .select('value')
          .eq('key', 'known_links')
          .single();
        if (row?.value) {
          knownLinks = row.value as Record<string, number>;
        }
      } catch (e) {
        console.warn('Could not read links from Supabase', e);
      }
    }

    const nowTime = Date.now();
    const isFirstRun = Object.keys(knownLinks).length === 0;
    let stateChanged = false;

    // Apply timestamps to links
    blocks.forEach(block => {
      block.links.forEach(link => {
        const linkKey = `${link.text}|${link.href}`;
        if (!knownLinks[linkKey]) {
          knownLinks[linkKey] = isFirstRun ? nowTime - 2 * 24 * 60 * 60 * 1000 : nowTime;
          stateChanged = true;
        }
        link.timestamp = knownLinks[linkKey];
      });
    });

    // Save updated state to Supabase
    if (stateChanged && supabase) {
      try {
        await supabase
          .from('app_state')
          .upsert({ key: 'known_links', value: knownLinks }, { onConflict: 'key' });
      } catch (e) {
        console.warn('Could not write links to Supabase', e);
      }
    }

    // Fixed section order as requested by user
    const getOrderWeight = (title: string) => {
      const lowerTitle = title.toLowerCase();
      if (lowerTitle.includes('result')) return 1;
      if (lowerTitle.includes('latest job')) return 2;
      if (lowerTitle.includes('admit card')) return 3;
      if (lowerTitle.includes('answer key')) return 4;
      if (lowerTitle.includes('syllabus')) return 5;
      if (lowerTitle.includes('admission')) return 6;
      if (lowerTitle.includes('certificate')) return 7;
      if (lowerTitle.includes('important')) return 8;
      return 99;
    };

    // Keep original index for stable sorting of un-weighted items
    const sortedBlocks = blocks
      .map((block, index) => ({ ...block, originalIndex: index }))
      .sort((a, b) => {
        const weightA = getOrderWeight(a.title);
        const weightB = getOrderWeight(b.title);
        if (weightA !== weightB) {
          return weightA - weightB;
        }
        return a.originalIndex - b.originalIndex;
      });

    const result = { blocks: sortedBlocks, topNotices };

    // Persist homepage cache to Supabase
    if (supabase && sortedBlocks.length > 0) {
      try {
        await supabase
          .from('app_state')
          .upsert({ key: 'homepage_cache', value: result }, { onConflict: 'key' });
      } catch (e) {
        console.warn('Could not write homepage cache to Supabase', e);
      }
    }

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
    return null;
  }
});

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
