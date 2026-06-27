import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import JobUpdatesHeader from '@/components/JobUpdatesHeader';
import JobUpdatesNav from '@/components/JobUpdatesNav';
import AdsFooter from '@/components/AdsFooter';
import * as cheerio from 'cheerio';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch('https://sarkariresult.com.cm/', {
      next: { revalidate: 60 }, // Cache for 60 seconds
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    let title = $('title').text() || 'Sarkari Result | Latest Govt Jobs';
    title = title.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in'); // Only replace target domain

    let description = $('meta[name="description"]').attr('content') || 'Check latest Sarkari Result, Admit Card, Syllabus, and Govt Jobs.';
    description = description.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in');

    return {
      title,
      description,
    };
  } catch (err) {
    return {
      title: 'Jobniti - Official Job Portal',
      description: 'Get the latest Job Updates, Admit Cards, and Results.',
    };
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-US">
      <body>
        <Analytics />
        <JobUpdatesHeader />
        <JobUpdatesNav />
        <main style={{ minHeight: '80vh', padding: '20px 0' }}>
          {children}
        </main>
        <footer className="bg-darkblue text-white" style={{ padding: '20px', textAlign: 'center' }}>
          <div className="grid-container">
            <AdsFooter />
            <p style={{ margin: 0, fontSize: '15px' }}>
              © 2026 jobniti.in - All rights reserved.
            </p>
            <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.9 }}>
              In Collaboration with Gupta Corp. &amp; Managed By Manii Gupta
            </p>
            <p style={{ margin: '10px 0 0', fontSize: '11px', opacity: 0.7, maxWidth: '800px', marginInline: 'auto' }}>
              Disclaimer: jobniti.in is an independent platform that aggregates job listings and educational information from various public sources for informational purposes only. We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with any government organization or other websites.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
