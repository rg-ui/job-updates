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
          if (href.includes('whatsapp.com')) {
            $(a).attr('href', 'https://chat.whatsapp.com/BD8RX29KRA18PVvPoxJSBM?s=cl&p=a&mlu=2&ilr=0');
          } else if (href.includes('t.me') || href.includes('telegram.me')) {
            $(a).attr('href', 'https://t.me/job1updat8');
          } else if (href.includes('sarkariresult.com.cm')) {
            $(a).attr('href', href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//g, '/'));
          }
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
                                       // Replace Cloudflare obfuscated emails with the actual email
                                       .replace(/<a[^>]*cdn-cgi\/l\/email-protection[^>]*>\[email protected\]<\/a>/gi, 'mani913529@gmail.com')
                                       .replace(/<span[^>]*__cf_email__[^>]*>\[email protected\]<\/span>/gi, 'mani913529@gmail.com')
                                       .replace(/\[email protected\]/gi, 'mani913529@gmail.com')
                                       // Add phone number for queries
                                       .replace(/(Email:\s*mani913529@gmail\.com)/gi, '$1 <br/><br/><strong>For any query:</strong> 9135293069');
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
        .parsed-content { max-width: 100%; overflow-x: auto; }
        .parsed-content img { max-width: 100%; height: auto; }
        .parsed-content table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #000; text-align: center; }
        .parsed-content th, .parsed-content td { border: 1px solid #000; padding: 10px; }
        .parsed-content th { background-color: #f5f5f5; font-weight: bold; }
        .parsed-content tr:nth-child(even) { background-color: #f9f9f9; }
        .parsed-content a { color: #0000c0; text-decoration: none; font-weight: bold; }
        .parsed-content a:hover { color: #e10101; text-decoration: underline; }
        .parsed-content h1, .parsed-content h2, .parsed-content h3 { color: #cd0808; text-align: center; margin-top: 15px; margin-bottom: 15px; }
        .parsed-content p { text-align: center; margin-bottom: 10px; }
        .parsed-content ul { list-style: inside; text-align: left; margin: 10px 0; }
        .parsed-content li { margin-bottom: 5px; }
      `}} />
    </div>
  );
}
