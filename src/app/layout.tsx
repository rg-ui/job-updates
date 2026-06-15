import type { Metadata } from 'next';
import './globals.css';
import JobUpdatesHeader from '@/components/JobUpdatesHeader';
import JobUpdatesNav from '@/components/JobUpdatesNav';
import AdsFooter from '@/components/AdsFooter';
import * as cheerio from 'cheerio';

export async function generateMetadata(): Promise<Metadata> {
  try {
    const res = await fetch('https://sarkariresult.com.cm/', {
      next: { revalidate: 60 } // Cache for 60 seconds
    });
    const html = await res.text();
    const $ = cheerio.load(html);

    let title = $('title').text() || 'Job Updates';
    title = title.replace(/SarkariResult\.com\.cm/gi, 'JobUpdates.com')
                 .replace(/Sarkari Result/gi, 'Job Updates');

    let description = $('meta[name="description"]').attr('content') || '';
    description = description.replace(/SarkariResult\.com\.cm/gi, 'JobUpdates.com')
                             .replace(/Sarkari Result/gi, 'Job Updates');

    return {
      title,
      description,
    };
  } catch (err) {
    return {
      title: 'Job Updates - Official Job Portal',
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
        <JobUpdatesHeader />
        <JobUpdatesNav />
        <main style={{ minHeight: '80vh', padding: '20px 0' }}>
          {children}
        </main>
        <footer className="bg-darkblue text-white" style={{ padding: '20px', textAlign: 'center' }}>
          <div className="grid-container">
            <AdsFooter />
            <p style={{ margin: 0, fontSize: '15px' }}>
              © 2026 JobUpdates.com - All rights reserved.
            </p>
            <p style={{ margin: '5px 0 0', fontSize: '13px', opacity: 0.9 }}>
              In Collabaration with Gupta Corp. &amp; Managed By Manii Gupta
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
