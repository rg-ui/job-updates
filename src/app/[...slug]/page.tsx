import React from 'react';
import AdsSidebar from '@/components/AdsSidebar';
import * as cheerio from 'cheerio';
import DOMPurify from 'isomorphic-dompurify';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60;

const SITE_URL = 'https://jobniti.in';
const ALLOWED_HOST = 'sarkariresult.com.cm';

// Path traversal protection: only allow alphanumeric, hyphens, slashes
function sanitizePath(slugParts: string[]): string | null {
  const joined = slugParts.join('/');
  // Block path traversal
  if (joined.includes('..') || joined.includes('%2e%2e') || joined.includes('%252e')) return null;
  // Block protocol injection
  if (/^https?:\/\//i.test(joined)) return null;
  // Only allow safe characters
  if (!/^[a-zA-Z0-9\/\-_]+$/.test(joined)) return null;
  // Max length guard
  if (joined.length > 200) return null;
  return joined;
}

const innerPagesCache = new Map<string, { data: { title: string, description: string, mainContentHtml: string, slug: string } | null, timestamp: number }>();
const CACHE_TTL = 300 * 1000;

async function fetchInnerPage(slug: string[]) {
  const path = sanitizePath(slug);
  if (!path) return null;

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

    let title = $('title').text() || 'Jobniti';
    title = title.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
                 .replace(/Sarkari Result/gi, 'Jobniti');

    let description = $('meta[name="description"]').attr('content') || '';
    description = description.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
                             .replace(/Sarkari Result/gi, 'Jobniti');

    let mainContentHtml = '';
    const entryContent = $('main.site-main');
    
    if (entryContent.length > 0) {
      entryContent.find('ins.adsbygoogle').remove();
      entryContent.find('.code-block').remove();
      entryContent.find('script').remove();
      entryContent.find('style').remove();
      entryContent.find('iframe').remove();
      
      entryContent.find('a').each((_, a) => {
        let href = $(a).attr('href');
        const text = $(a).text().toLowerCase();

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
            if (href.includes('/wp-content/') || href.includes('/wp-includes/') || /\.pdf\??/i.test(href)) {
              $(a).attr('href', href.replace(/sarkariresult\.com\.cm/gi, 'SARKARI_ASSETS_DOMAIN'));
            } else {
              $(a).attr('href', href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//gi, '/'));
            }
          }
        }
      });

      entryContent.find('img').each((_, img) => {
        const src = $(img).attr('src');
        if (src) {
           $(img).attr('src', src.replace(/sarkariresult\.com\.cm/gi, 'SARKARI_ASSETS_DOMAIN'));
        }
        const srcset = $(img).attr('srcset');
        if (srcset) {
           $(img).attr('srcset', srcset.replace(/sarkariresult\.com\.cm/gi, 'SARKARI_ASSETS_DOMAIN'));
        }
      });

      mainContentHtml = entryContent.html() || '';
      mainContentHtml = mainContentHtml.replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
                                       .replace(/Sarkari Result/gi, 'Jobniti')
                                       .replace(/SarkariResult/gi, 'Jobniti')
                                       .replace(/Since 2009/gi, 'Since 2026')
                                       .replace(/About Author\s*:\s*Sanjay Singh/gi, 'About Owner : Manii Gupta')
                                       .replace(/Sanjay Singh has been writing content for the education sector &amp; competitive exams for quite some time now\. He has been in this field of content writing for almost 6 years\. He has obtained a master's degree in English Literature\. Currently contributing as a content writer on jobniti\.in\. He is basically a resident of Uttar Pradesh\./gi, 'He has cracked several govt exams but somehow not able to make merit results. He has wide experience in this field.')
                                       .replace(/Sanjay Singh has been writing content[^<]*/gi, 'He has cracked several govt exams but somehow not able to make merit results. He has wide experience in this field.')
                                       .replace(/<a[^>]*cdn-cgi\/l\/email-protection[^>]*>.*?<\/a>/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
                                       .replace(/<span[^>]*__cf_email__[^>]*>.*?<\/span>/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
                                       .replace(/\[email\s*protected\]/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
                                       .replace(/\[email&nbsp;protected\]/gi, '<a href="/contact/email" style="color: #0000c0; text-decoration: underline; font-weight: bold;">[email protected]</a>')
                                       .replace(/(Email:\s*<a href="\/contact\/email"[^>]*>\[email protected\]<\/a>)/gi, '$1 <br/><br/><strong>For any query:</strong> 9135293069')
                                       .replace(/SARKARI_ASSETS_DOMAIN/g, 'sarkariresult.com.cm');

      // Sanitize HTML to prevent XSS — strip all event handlers, scripts, dangerous tags
      mainContentHtml = DOMPurify.sanitize(mainContentHtml, {
        ALLOWED_TAGS: ['a', 'strong', 'em', 'b', 'i', 'u', 'p', 'br', 'hr', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
          'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'img', 'div', 'span',
          'blockquote', 'pre', 'code', 'sub', 'sup', 'small', 'section', 'article'],
        ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'width', 'height', 'style', 'class', 'colspan', 'rowspan', 'target', 'rel'],
        ALLOW_DATA_ATTR: false,
      });
    }

    const result = { title, description, mainContentHtml, slug: path };
    innerPagesCache.set(path, { data: result, timestamp: Date.now() });
    return result;
  } catch (error) {
    console.error("Error fetching inner page:", error);
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
    const pageUrl = `${SITE_URL}/${slug.join('/')}`;
    return {
      title: data.title,
      description: data.description,
      alternates: {
        canonical: pageUrl,
      },
    };
  } catch {
    return { title: 'Jobniti' };
  }
}

function buildJobPostingJsonLd(title: string, description: string, slug: string[]) {
  const pageUrl = `${SITE_URL}/${slug.join('/')}`;
  const hiringOrg = title.match(/(?:for|at|in)\s+(.+?)(?:\s+(?:recruitment|vacancy|20\d{2}|notification))/i)?.[1] || 'Government of India';
  return {
    '@context': 'https://schema.org',
    '@type': 'JobPosting',
    title: title,
    description: description,
    url: pageUrl,
    datePosted: new Date().toISOString().split('T')[0],
    hiringOrganization: {
      '@type': 'Organization',
      name: hiringOrg,
    },
    employmentType: 'FULL_TIME',
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'IN',
      },
    },
    applicantLocationRequirements: {
      '@type': 'Country',
      name: 'India',
    },
    validThrough: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    publisher: {
      '@type': 'Organization',
      name: 'Jobniti',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/jobniti-logo.png`,
      },
    },
    isPartOf: {
      '@type': 'WebSite',
      name: 'Jobniti',
      url: SITE_URL,
    },
  };
}

function getOriginalSections(title: string) {
  const lowerTitle = title.toLowerCase();
  const isResult = /result|merit|score|cut.?off/i.test(lowerTitle);
  const isAdmitCard = /admit card|hall ticket/i.test(lowerTitle);
  const isExam = /exam|paper|test|cbt/i.test(lowerTitle);
  const isJob = /recruitment|vacancy|job|post|apply|notification/i.test(lowerTitle);

  let preparationTips: { heading: string; items: string[] } = {
    heading: 'How to Prepare for Government Exams',
    items: [
      'Start with understanding the complete syllabus and exam pattern from the official notification.',
      'Create a daily study schedule allocating at least 4-6 hours for focused preparation.',
      'Solve previous year question papers to understand the difficulty level and important topics.',
      'Take regular mock tests to improve time management and accuracy.',
      'Focus on current affairs — read daily newspapers and monthly current affairs magazines.',
      'Revise formulas, shortcuts, and key concepts regularly to retain them for the exam.',
    ],
  };

  let careerAdvice: { heading: string; items: string[] } = {
    heading: 'Career Growth Tips for Government Job Aspirants',
    items: [
      'Government jobs offer structured career progression through departmental exams and seniority.',
      'After joining, pursue additional certifications and training programs for faster promotions.',
      'Build a strong professional network within your department and across government services.',
      'Stay updated on inter-departmental transfers and deputation opportunities.',
      'Consider appearing for departmental promotional exams to move from Group C to Group B.',
      'Maintain a clean service record — it impacts your annual performance assessments.',
    ],
  };

  if (isResult) {
    preparationTips = {
      heading: 'What to Do After Checking Your Result',
      items: [
        'Download and save your scorecard immediately — it may not be available indefinitely.',
        'If shortlisted, start preparing for the next stage (PET, interview, or document verification).',
        'Gather all original documents, certificates, and photocopies well in advance.',
        'Check the official website regularly for updates on next stage dates and venues.',
        'If not shortlisted, analyze your performance and identify areas for improvement.',
        'Maintain a positive mindset — many successful candidates crack exams in subsequent attempts.',
      ],
    };
    careerAdvice = {
      heading: 'Tips for Merit List Candidates',
      items: [
        'Verify all your documents against the eligibility criteria mentioned in the official notification.',
        'Keep multiple certified copies of your educational certificates ready.',
        'Prepare a chronological file of all academic records from 10th standard onwards.',
        'If waitlisted, keep your documents ready — waitlist movement is common in government recruitment.',
        'Join preparation groups for interview and physical test stages if applicable.',
      ],
    };
  } else if (isAdmitCard) {
    preparationTips = {
      heading: 'Exam Day Preparation Checklist',
      items: [
        'Download and print your admit card at least 3 days before the exam.',
        'Verify all details on the admit card — name, photo, exam center, date, and time.',
        'Visit the exam center a day before to familiarize yourself with the route.',
        'Carry a valid government-issued photo ID along with the admit card.',
        'Pack essential items: pens, pencils, eraser, sharpener, and a transparent water bottle.',
        'Get adequate sleep the night before — avoid last-minute cramming.',
        'Reach the exam center at least 45-60 minutes before the reporting time.',
      ],
    };
    careerAdvice = {
      heading: 'During the Exam',
      items: [
        'Read all instructions on the admit card and question paper carefully.',
        'Start with sections you are most confident about to build momentum.',
        'Allocate time per question and move on if stuck — don\'t waste time on one question.',
        'For negative marking exams, avoid random guessing — attempt only when reasonably sure.',
        'Review your answers if time permits before submitting.',
      ],
    };
  } else if (isJob || isExam) {
    preparationTips = {
      heading: 'Application and Preparation Strategy',
      items: [
        'Read the official notification thoroughly — note all eligibility criteria and important dates.',
        'Apply well before the last date to avoid technical issues on the deadline day.',
        'Keep your registration number and login credentials safely for future reference.',
        'Start preparation based on the exam pattern mentioned in the notification.',
        'Subscribe to official channels (WhatsApp, Telegram) for instant updates on this recruitment.',
      ],
    };
    careerAdvice = {
      heading: 'Maximize Your Selection Chances',
      items: [
        'Understand the weightage of each section in the exam and prepare accordingly.',
        'If the selection includes an interview, practice common HR and domain-specific questions.',
        'For physical tests, start your fitness routine at least 2-3 months in advance.',
        'Connect with selected candidates from previous years for insider tips.',
        'Keep all required documents verified and ready before the selection process begins.',
      ],
    };
  }

  const faqItems = [
    { q: 'How often is the information on this page updated?', a: 'Our team monitors official sources regularly and updates the information as soon as new notifications or changes are published. The page revalidates every 60 seconds to ensure freshness.' },
    { q: 'Is Jobniti affiliated with the recruiting organization?', a: 'No. Jobniti is an independent information aggregator. We are not affiliated with any government body or recruiting organization. All information is sourced from official public domain sources.' },
    { q: 'Can I apply directly through Jobniti?', a: 'No. Jobniti provides information and direct links to the official application portals. You must complete your application on the official website of the recruiting organization.' },
    { q: 'What should I do if I find incorrect information?', a: 'Please report any discrepancies immediately via our Contact page or email us at support@jobniti.in. We take accuracy seriously and will investigate and correct any errors promptly.' },
    { q: 'How can I stay updated about this recruitment?', a: 'Join our WhatsApp group or Telegram channel for instant notifications. You can also bookmark this page and check back regularly for updates.' },
  ];

  return { preparationTips, careerAdvice, faqItems };
}

export default async function InnerPage(props: { params: Promise<{ slug: string[] }> }) {
  const params = await props.params;
  const slug = params?.slug || [];
  const data = await fetchInnerPage(slug);

  if (!data) {
    notFound();
  }

  const { preparationTips, careerAdvice, faqItems } = getOriginalSections(data.title);
  const jobPostingJsonLd = buildJobPostingJsonLd(data.title, data.description, slug);

  return (
    <div className="grid-container">
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
        
        {/* Main Content Area */}
        <div style={{ flex: '1 1 70%', minWidth: '300px' }}>
          
          {/* Official Notification Content */}
          <div className="category-box">
            <div 
              style={{ padding: '20px', backgroundColor: '#fff' }}
              className="parsed-content"
              dangerouslySetInnerHTML={{ __html: data.mainContentHtml || '<p>Content not available.</p>' }} 
            />
          </div>

          {/* Original Content: Career Growth Advice */}
          <div className="job增值-section" style={{ marginTop: '24px' }}>
            <div className="category-box">
              <h2 className="category-title" style={{ background: 'linear-gradient(135deg, #0A2540, #004D40)' }}>
                {careerAdvice.heading}
              </h2>
              <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                <ul style={{ paddingLeft: '20px', listStyle: 'disc' }}>
                  {careerAdvice.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: '10px', fontSize: '14.5px', lineHeight: '1.6', color: '#374151', paddingLeft: '4px' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Original Content: Preparation Tips */}
          <div className="job增值-section" style={{ marginTop: '24px' }}>
            <div className="category-box">
              <h2 className="category-title" style={{ background: 'linear-gradient(135deg, #059669, #10b981)' }}>
                {preparationTips.heading}
              </h2>
              <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                <ul style={{ paddingLeft: '20px', listStyle: 'disc' }}>
                  {preparationTips.items.map((item, i) => (
                    <li key={i} style={{ marginBottom: '10px', fontSize: '14.5px', lineHeight: '1.6', color: '#374151', paddingLeft: '4px' }}>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Interactive FAQ Section */}
          <div className="job增值-section" style={{ marginTop: '24px' }}>
            <div className="category-box">
              <h2 className="category-title" style={{ background: 'linear-gradient(135deg, #1e3a8a, #2563eb)' }}>
                Frequently Asked Questions
              </h2>
              <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                {faqItems.map((faq, i) => (
                  <details key={i} style={{ marginBottom: '12px', border: '1px solid #e5e7eb', borderRadius: '10px', overflow: 'hidden' }}>
                    <summary style={{ padding: '14px 16px', cursor: 'pointer', fontWeight: '600', fontSize: '15px', color: '#0A2540', backgroundColor: '#f9fafb', lineHeight: '1.5' }}>
                      {faq.q}
                    </summary>
                    <div style={{ padding: '14px 16px', fontSize: '14px', color: '#4b5563', lineHeight: '1.7', borderTop: '1px solid #e5e7eb' }}>
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          </div>

          {/* Related Information Callout */}
          <div className="job增值-section" style={{ marginTop: '24px' }}>
            <div className="category-box">
              <h2 className="category-title" style={{ background: 'linear-gradient(135deg, #b45309, #d97706)' }}>
                Important Resources
              </h2>
              <div style={{ padding: '20px', backgroundColor: '#fff' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                  <Link href="/latest-jobs" style={{ display: 'block', padding: '14px', background: '#f0fdf4', borderRadius: '10px', textDecoration: 'none', border: '1px solid #bbf7d0', transition: 'all 0.2s' }}>
                    <strong style={{ color: '#166534', fontSize: '14px' }}>Latest Govt Jobs</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>View all recent job openings</p>
                  </Link>
                  <Link href="/result" style={{ display: 'block', padding: '14px', background: '#eff6ff', borderRadius: '10px', textDecoration: 'none', border: '1px solid #bfdbfe', transition: 'all 0.2s' }}>
                    <strong style={{ color: '#1e40af', fontSize: '14px' }}>Exam Results</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>Check latest exam results</p>
                  </Link>
                  <Link href="/admit-card" style={{ display: 'block', padding: '14px', background: '#fef3c7', borderRadius: '10px', textDecoration: 'none', border: '1px solid #fde68a', transition: 'all 0.2s' }}>
                    <strong style={{ color: '#92400e', fontSize: '14px' }}>Admit Cards</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>Download exam hall tickets</p>
                  </Link>
                  <Link href="/syllabus" style={{ display: 'block', padding: '14px', background: '#fce7f3', borderRadius: '10px', textDecoration: 'none', border: '1px solid #fbcfe8', transition: 'all 0.2s' }}>
                    <strong style={{ color: '#9d174d', fontSize: '14px' }}>Syllabus &amp; Pattern</strong>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#6b7280' }}>Exam syllabus and paper pattern</p>
                  </Link>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Sidebar Area */}
        <div style={{ flex: '1 1 25%', minWidth: '250px' }}>
          <AdsSidebar />
          <AdsSidebar />
        </div>

      </div>

      {/* JobPosting JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jobPostingJsonLd) }}
      />

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
        details summary::-webkit-details-marker { display: none; }
        details summary::marker { content: ''; }
        details[open] summary { background: #f0fdf4; border-bottom: 1px solid #e5e7eb; }
        details div { animation: fadeIn 0.2s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
      `}} />
    </div>
  );
}
