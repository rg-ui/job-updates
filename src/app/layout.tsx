import type { Metadata } from 'next';
import './globals.css';
import { Analytics } from '@vercel/analytics/next';
import JobUpdatesHeader from '@/components/JobUpdatesHeader';
import JobUpdatesNav from '@/components/JobUpdatesNav';
import AdsFooter from '@/components/AdsFooter';
import * as cheerio from 'cheerio';

const SITE_URL = 'https://jobniti.in';
const SITE_NAME = 'Jobniti';

export async function generateMetadata(): Promise<Metadata> {
  let fetchedTitle = '';
  let fetchedDescription = '';

  try {
    const res = await fetch('https://sarkariresult.com.cm/', {
      next: { revalidate: 3600 },
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    fetchedTitle = $('title').text().replace(/SarkariResult\.com\.cm/gi, 'jobniti.in');
    fetchedDescription = ($('meta[name="description"]').attr('content') || '').replace(/SarkariResult\.com\.cm/gi, 'jobniti.in');
  } catch {
    // use defaults below
  }

  const title = fetchedTitle || 'Jobniti | Sarkari Result, Latest Govt Jobs 2026, Admit Card, Result';
  const description = fetchedDescription ||
    'Jobniti.in - India\'s trusted platform for Sarkari Result 2026, Latest Govt Jobs, Admit Card, Answer Key, Syllabus, Sarkari Naukri updates. No Ads. Only Updates.';

  return {
    // === CORE SEO ===
    title: {
      default: 'Jobniti | Sarkari Result 2026 | Latest Govt Jobs | jobniti.in',
      template: `%s | Jobniti - jobniti.in`,
    },
    description,
    keywords: [
      'jobniti', 'jobniti.in', 'sarkari result', 'sarkari result 2026',
      'latest govt jobs', 'sarkari naukri', 'admit card', 'answer key',
      'syllabus', 'government jobs india', 'sarkari result official',
      'latest sarkari jobs', 'result 2026', 'admit card 2026',
      'SSC jobs', 'UPSC', 'Railway jobs', 'RRB NTPC', 'bank jobs',
      'police bharti', 'teacher vacancy', 'sarkari result jobniti',
      'jobniti sarkari result', 'govt job portal india',
    ],

    // === CANONICAL ===
    alternates: {
      canonical: SITE_URL,
    },

    // === FAVICON & ICONS ===
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
        { url: '/jobniti-logo.png', sizes: '192x192', type: 'image/png' },
      ],
      apple: [
        { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
      ],
      shortcut: '/favicon.ico',
    },

    // === OPEN GRAPH (Facebook, WhatsApp, LinkedIn) ===
    openGraph: {
      type: 'website',
      locale: 'en_IN',
      url: SITE_URL,
      siteName: SITE_NAME,
      title: 'Jobniti | Sarkari Result 2026 | Latest Govt Jobs | jobniti.in',
      description,
      images: [
        {
          url: `${SITE_URL}/og-image.png`,
          width: 1200,
          height: 630,
          alt: 'Jobniti - Latest Sarkari Result & Govt Jobs 2026',
        },
      ],
    },

    // === TWITTER / X CARD ===
    twitter: {
      card: 'summary_large_image',
      title: 'Jobniti | Sarkari Result 2026 | Latest Govt Jobs',
      description,
      images: [`${SITE_URL}/og-image.png`],
    },

    // === ROBOTS ===
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },

    // === VERIFICATION ===
    verification: {
      google: 'M22837Z5f_reRc_Y6-TbEzn3XhEKyg6WlWDB-2B0FW0', // keep existing
    },

    // === APP META ===
    applicationName: 'Jobniti',
    category: 'Government Jobs & Sarkari Result',
    creator: 'Jobniti Team',
    publisher: 'Jobniti - jobniti.in',

    // === MANIFEST ===
    manifest: '/manifest.json',
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN">
      <head>
        {/* Structured Data: Organization + WebSite for Google */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'WebSite',
                  '@id': `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: 'Jobniti',
                  alternateName: ['jobniti.in', 'Jobniti Sarkari Result'],
                  description: 'India\'s trusted platform for Sarkari Result 2026, Latest Govt Jobs, Admit Card, Syllabus updates.',
                  inLanguage: 'en-IN',
                  potentialAction: {
                    '@type': 'SearchAction',
                    target: {
                      '@type': 'EntryPoint',
                      urlTemplate: `${SITE_URL}/?s={search_term_string}`,
                    },
                    'query-input': 'required name=search_term_string',
                  },
                },
                {
                  '@type': 'Organization',
                  '@id': `${SITE_URL}/#organization`,
                  name: 'Jobniti',
                  url: SITE_URL,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${SITE_URL}/jobniti-logo.png`,
                    width: 512,
                    height: 512,
                  },
                  sameAs: [
                    'https://t.me/job1updat8',
                    'https://chat.whatsapp.com/BD8RX29KRA18PVvPoxJSBM',
                  ],
                  contactPoint: {
                    '@type': 'ContactPoint',
                    contactType: 'customer support',
                    availableLanguage: ['Hindi', 'English'],
                  },
                },
                {
                  '@type': 'NewsMediaOrganization',
                  '@id': `${SITE_URL}/#newsmedia`,
                  name: 'Jobniti',
                  url: SITE_URL,
                  publishingPrinciples: SITE_URL,
                  logo: {
                    '@type': 'ImageObject',
                    url: `${SITE_URL}/jobniti-logo.png`,
                  },
                },
              ],
            }),
          }}
        />
      </head>
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
