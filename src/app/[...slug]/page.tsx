import React from 'react';
import AdsSidebar from '@/components/AdsSidebar';
import * as cheerio from 'cheerio';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';

export const revalidate = 60; // Revalidate every 60 seconds

const innerPagesCache = new Map<string, { data: { title: string, description: string, mainContentHtml: string } | null, timestamp: number }>();
const CACHE_TTL = 300 * 1000; // 5 minutes cache

async function fetchInnerPage(slug: string[]) {
  const path = slug.join('/');
  const now = Date.now();
  const cached = innerPagesCache.get(path);

  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return cached.data;
  }

  try {
    const res = await fetch(`https://sarkariresult.com.cm/${path}/`, {
      next: { revalidate: 60 }
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        innerPagesCache.set(path, { data: null, timestamp: Date.now() });
        return null;
      }
      throw new Error(`Failed to fetch page: ${res.status}`);
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    // Extract title and description for SEO
    let title = $('title').text() || 'Jobniti';
    title = title.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
                 .replace(/Sarkari Result/gi, 'Jobniti');

    let description = $('meta[name="description"]').attr('content') || '';
    description = description.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
                             .replace(/Sarkari Result/gi, 'Jobniti');

    // Extract main content
    // Original site typically uses <main id="main"> or <div id="content"> or specific blocks
    // We will extract everything inside the main post body
    let mainContentHtml = '';
    const entryContent = $('main.site-main');
    
    if (entryContent.length > 0) {
      // Clean up ads inside the content
      entryContent.find('ins.adsbygoogle').remove();
      entryContent.find('.code-block').remove();
      entryContent.find('script').remove();
      entryContent.find('style').remove();
      entryContent.find('iframe').remove();
      
      // Rewrite internal links to localhost and social links to user's groups
      entryContent.find('a').each((_, a) => {
        let href = $(a).attr('href');
        const text = $(a).text().toLowerCase();

        // Remove mobile app download links
        if (text.includes('app now') || text.includes('mobile app') || text.includes('android app') || text.includes('app download')) {
          const parent = $(a).parent();
          if (parent.is('p') && parent.text().trim() === $(a).text().trim()) {
            parent.remove();
          } else {
            $(a).remove();
          }
          return;
        }

        if (href) {
          // If the link is relative and points to wordpress assets/uploads, point it to the source domain
          if (href.startsWith('/wp-content/') || href.startsWith('/wp-includes/') || (href.startsWith('/') && /\.pdf\??/i.test(href))) {
            href = 'https://sarkariresult.com.cm' + href;
            $(a).attr('href', href);
          }

          if (href.includes('whatsapp.com')) {
            $(a).attr('href', 'https://chat.whatsapp.com/BD8RX29KRA18PVvPoxJSBM?s=cl&p=a&mlu=2&ilr=0');
          } else if (href.includes('t.me') || href.includes('telegram.me')) {
            $(a).attr('href', 'https://t.me/job1updat8');
          } else if (href.includes('email-protection')) {
            $(a).attr('href', '/contact/email');
            $(a).text('[email protected]');
          } else if (href.includes('sarkariresult.com.cm')) {
            // Keep absolute URLs for static assets and PDFs
            if (href.includes('/wp-content/') || href.includes('/wp-includes/') || /\.pdf\??/i.test(href)) {
              // Protect asset URLs from the global text replace by using a temporary placeholder
              $(a).attr('href', href.replace(/sarkariresult\.com\.cm/gi, 'SARKARI_ASSETS_DOMAIN'));
            } else {
              $(a).attr('href', href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//gi, '/'));
            }
          }
        }
      });

      // Protect image src attributes from global text replace
      entryContent.find('img').each((_, img) => {
        let src = $(img).attr('src');
        if (src) {
           $(img).attr('src', src.replace(/sarkariresult\.com\.cm/gi, 'SARKARI_ASSETS_DOMAIN'));
        }
        let srcset = $(img).attr('srcset');
        if (srcset) {
           $(img).attr('srcset', srcset.replace(/sarkariresult\.com\.cm/gi, 'SARKARI_ASSETS_DOMAIN'));
        }
      });

      // Rewrite text 
      mainContentHtml = entryContent.html() || '';
      mainContentHtml = mainContentHtml.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
                                       .replace(/Sarkari Result/gi, 'Jobniti')
                                       .replace(/SarkariResult/gi, 'Jobniti')
                                       .replace(/Since 2009/gi, 'Since 2026')
                                       // Replace Author to Owner Manii Gupta
                                       .replace(/About Author\s*:\s*Sanjay Singh/gi, 'About Owner : Manii Gupta')
                                       .replace(/Sanjay Singh has been writing content for the education sector &amp; competitive exams for quite some time now\. He has been in this field of content writing for almost 6 years\. He has obtained a master's degree in English Literature\. Currently contributing as a content writer on jobniti\.in\. He is basically a resident of Uttar Pradesh\./gi, 'He has cracked several govt exams but somehow not able to make merit results. He has wide experience in this field.')
                                       .replace(/Sanjay Singh has been writing content[^<]*/gi, 'He has cracked several govt exams but somehow not able to make merit results. He has wide experience in this field.')
                                       // Replace Cloudflare obfuscated emails with contact directory link
                                       .replace(/<a[^>]*cdn-cgi\/l\/email-protection[^>]*>.*?<\/a>/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
                                       .replace(/<span[^>]*__cf_email__[^>]*>.*?<\/span>/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
                                       .replace(/\[email\s*protected\]/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
                                       .replace(/\[email&nbsp;protected\]/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
                                       // Add phone number for queries
                                       .replace(/(Email:\s*<a href="\/contact\/email"[^>]*>\[email protected\]<\/a>)/gi, '$1 <br/><br/><strong>For any query:</strong> 9135293069')
                                       // Restore protected asset domains
                                       .replace(/SARKARI_ASSETS_DOMAIN/g, 'sarkariresult.com.cm');
    }

    const result = { title, description, mainContentHtml };
    innerPagesCache.set(path, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Error fetching inner page:", error);
    
    // Return stale cache if available
    if (cached) {
      console.warn("Using stale cache for inner page due to network failure");
      return cached.data;
    }
    throw error;
  }
}

export async function generateMetadata(props: { params: Promise<{ slug: string[] }> }): Promise<Metadata> {
  try {
    const params = await props.params;
    const slug = params?.slug || [];
    const data = await fetchInnerPage(slug);
    if (!data) return { title: 'Not Found' };
    return {
      title: data.title,
      description: data.description
    };
  } catch (err) {
    return { title: 'Jobniti' };
  }
}

export default async function InnerPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const slug = params?.slug || [];
  const data = await fetchInnerPage(slug);

  if (!data) {
    notFound();
  }

  return (
    <div className="grid-container">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Main Content Area */}
        <div style={{ flex: '1 1 70%', minWidth: '300px' }} className="category-box">
           <div 
             style={{ padding: '20px', backgroundColor: '#fff' }}
             className="parsed-content"
             dangerouslySetInnerHTML={{ __html: data.mainContentHtml || '<p>Content not available.</p>' }} 
           />
        </div>

        {/* Sidebar Area */}
        <div style={{ flex: '1 1 25%', minWidth: '250px' }}>
          <AdsSidebar />
          <AdsSidebar />
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .parsed-content { 
          max-width: 100%; 
          overflow-x: auto; 
          font-size: 15px; 
          line-height: 1.6;
          color: #333;
        }
        .parsed-content img { max-width: 100%; height: auto; border-radius: 8px; }
        .parsed-content table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 20px 0; 
          border: 1px solid #e2e8f0; 
          text-align: center;
          background: #fff;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
        }
        .parsed-content th, .parsed-content td { 
          border: 1px solid #e8edf2; 
          padding: 12px 14px; 
          vertical-align: middle;
        }
        .parsed-content th { 
          background: linear-gradient(135deg, #0A2540 0%, #004D40 100%); 
          color: #ffffff; 
          font-weight: 700; 
          text-transform: uppercase;
          font-size: 13px;
          letter-spacing: 0.5px;
        }
        .parsed-content tr:nth-child(even) { background-color: #f8fafc; }
        .parsed-content tr:hover { background-color: #f1f5f9; }
        .parsed-content a { color: #059669; text-decoration: none; font-weight: bold; transition: color 0.2s ease; }
        .parsed-content a:hover { color: #047857; text-decoration: underline; }
        .parsed-content h1, .parsed-content h2, .parsed-content h3 { 
          color: #0A2540; 
          text-align: center; 
          margin-top: 25px; 
          margin-bottom: 15px; 
          font-weight: 800;
        }
        .parsed-content h1 { font-size: 24px; border-bottom: 2px solid rgba(16, 185, 129, 0.15); padding-bottom: 8px; }
        .parsed-content h2 { font-size: 20px; }
        .parsed-content h3 { font-size: 18px; }
        .parsed-content p { text-align: center; margin-bottom: 12px; }
        .parsed-content ul { list-style: inside; text-align: left; margin: 15px 0; padding-left: 10px; }
        .parsed-content li { margin-bottom: 8px; }
      `}} />
    </div>
  );
}
