'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';

interface Props {
  slug: string[];
  initialHtml?: string | null;
}

// ─── HTML processing (client-side, mirrors server-side logic) ────────────────
function processHtmlClient(rawHtml: string, path: string): string {
  // Use DOMParser to process the HTML
  const parser = new DOMParser();
  const doc = parser.parseFromString(rawHtml, 'text/html');

  // Find main content
  const selectors = [
    'main.site-main', 'main#main', 'main',
    '.site-content .entry-content', 'article .entry-content',
    '.entry-content', '#content', '.site-content',
  ];
  let content: Element | null = null;
  for (const sel of selectors) {
    const el = doc.querySelector(sel);
    if (el && (el.textContent?.trim().length ?? 0) > 100) {
      content = el;
      break;
    }
  }

  if (!content) return '<p>Content not available.</p>';

  // Remove ads/scripts
  content.querySelectorAll('ins.adsbygoogle, .code-block, script, style, iframe').forEach(el => el.remove());

  // Fix links
  content.querySelectorAll('a').forEach(a => {
    const text = a.textContent?.toLowerCase() ?? '';
    if (text.includes('app now') || text.includes('mobile app') || text.includes('android app')) {
      a.remove();
      return;
    }
    let href = a.getAttribute('href') || '';
    if (href.startsWith('/wp-content/') || href.startsWith('/wp-includes/')) {
      href = 'https://sarkariresult.com.cm' + href;
      a.setAttribute('href', href);
    }
    if (href.includes('whatsapp.com')) {
      a.setAttribute('href', 'https://chat.whatsapp.com/BD8RX29KRA18PVvPoxJSBM?s=cl&p=a&mlu=2&ilr=0');
    } else if (href.includes('t.me') || href.includes('telegram.me')) {
      a.setAttribute('href', 'https://t.me/job1updat8');
    } else if (href.includes('sarkariresult.com.cm')) {
      if (href.includes('/wp-content/') || href.includes('/wp-includes/') || /\.pdf/i.test(href)) {
        // keep as-is
      } else {
        a.setAttribute('href', href.replace(/https?:\/\/(www\.)?sarkariresult\.com\.cm\//gi, '/'));
      }
    }
  });

  // Fix images
  content.querySelectorAll('img').forEach(img => {
    const src = img.getAttribute('src') || '';
    if (src.includes('sarkariresult.com.cm')) {
      img.setAttribute('src', src); // keep original
    }
  });

  let html = content.innerHTML;
  // Text replacements
  html = html
    .replace(/SarkariResult\.com\.cm/gi, 'jobniti.in')
    .replace(/Sarkari Result/gi, 'Jobniti')
    .replace(/SarkariResult/gi, 'Jobniti')
    .replace(/Since 2009/gi, 'Since 2026');

  return html;
}

// ─── Loading spinner ─────────────────────────────────────────────────────────
function LoadingState({ attempt, onRetry }: { attempt: number; onRetry: () => void }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
        background: '#fff', borderRadius: '24px', padding: '48px 40px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', maxWidth: '480px', width: '100%',
      }}>
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          border: '4px solid #e5e7eb', borderTopColor: '#059669',
          animation: 'cSpin 1s linear infinite', marginBottom: '24px',
        }} />
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#0A2540', marginBottom: '10px' }}>
          Loading Content{attempt > 1 ? ` (Attempt ${attempt})` : '...'}
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7', marginBottom: '28px' }}>
          Fetching from official sources. Please wait a moment.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={onRetry}
            style={{
              display: 'inline-block', padding: '11px 26px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white', borderRadius: '30px', fontWeight: '700',
              fontSize: '14px', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
            }}
          >
            🔄 Retry Now
          </button>
          <Link href="/" style={{
            display: 'inline-block', padding: '11px 26px',
            background: '#f9fafb', color: '#374151', borderRadius: '30px',
            fontWeight: '600', fontSize: '14px', textDecoration: 'none',
            border: '1px solid #e5e7eb',
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>
      <style>{`
        @keyframes cSpin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

// ─── Error state ─────────────────────────────────────────────────────────────
function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ padding: '60px 20px', textAlign: 'center' }}>
      <div style={{
        display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
        background: '#fff', borderRadius: '24px', padding: '48px 40px',
        boxShadow: '0 8px 40px rgba(0,0,0,0.08)', maxWidth: '480px', width: '100%',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
        <h1 style={{ fontSize: '20px', fontWeight: '800', color: '#0A2540', marginBottom: '10px' }}>
          Content Temporarily Unavailable
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.7', marginBottom: '28px' }}>
          The official source is taking too long to respond. Please try again in a few seconds.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            onClick={onRetry}
            style={{
              padding: '11px 26px',
              background: 'linear-gradient(135deg, #059669, #10b981)',
              color: 'white', borderRadius: '30px', fontWeight: '700',
              fontSize: '14px', border: 'none', cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(16,185,129,0.3)',
            }}
          >
            🔄 Try Again
          </button>
          <Link href="/" style={{
            display: 'inline-block', padding: '11px 26px',
            background: '#f9fafb', color: '#374151', borderRadius: '30px',
            fontWeight: '600', fontSize: '14px', textDecoration: 'none',
            border: '1px solid #e5e7eb',
          }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function SlugPageContent({ slug, initialHtml }: Props) {
  const path = slug.join('/');
  const [html, setHtml] = useState<string | null>(initialHtml || null);
  const [status, setStatus] = useState<'loading' | 'done' | 'error'>(
    initialHtml ? 'done' : 'loading'
  );
  const [attempt, setAttempt] = useState(1);
  const isFetching = useRef(false);

  const fetchContent = useCallback(async (currentAttempt: number) => {
    if (isFetching.current) return;
    isFetching.current = true;
    setStatus('loading');

    try {
      const res = await fetch(`/api/fetch-content?path=${encodeURIComponent(path)}`, {
        signal: AbortSignal.timeout(30000),
      });

      if (!res.ok) throw new Error(`API error: ${res.status}`);

      const data = await res.json() as { html?: string; error?: string; source?: string };

      if (!data.html || data.html.length < 100) {
        throw new Error('Empty content received');
      }

      // Process the HTML client-side
      const processed = processHtmlClient(data.html, path);
      setHtml(processed);
      setStatus('done');
    } catch (err) {
      console.error('[SlugPageContent] fetch failed:', err);
      if (currentAttempt < 3) {
        // Auto-retry after 3 seconds (max 3 attempts)
        setTimeout(() => {
          isFetching.current = false;
          setAttempt(a => a + 1);
        }, 3000);
      } else {
        setStatus('error');
      }
    } finally {
      if (status !== 'loading' || attempt >= 3) {
        isFetching.current = false;
      }
    }
  }, [path, status, attempt]);

  useEffect(() => {
    if (!html) {
      isFetching.current = false;
      fetchContent(attempt);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt]);

  const handleRetry = () => {
    setStatus('loading');
    setHtml(null);
    isFetching.current = false;
    setAttempt(a => a + 1);
  };

  if (status === 'loading') {
    return <LoadingState attempt={attempt} onRetry={handleRetry} />;
  }

  if (status === 'error' || !html) {
    return <ErrorState onRetry={handleRetry} />;
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '10px 0' }}>
      {/* Jobniti Top Verification & Editorial Badge */}
      <div style={{
        background: 'linear-gradient(135deg, #f0fdf4 0%, #e6f4ea 100%)',
        border: '1px solid #bbf7d0',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>✅</span>
          <div>
            <h4 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#065f46' }}>
              Jobniti Verified Information Desk
            </h4>
            <p style={{ margin: 0, fontSize: '12px', color: '#047857' }}>
              Fact-checked against official recruitment notifications. Verify dates &amp; eligibility before applying.
            </p>
          </div>
        </div>
        <Link
          href="/guides/online-application-error-prevention-guide"
          style={{
            background: '#16a34a',
            color: '#ffffff',
            fontSize: '12px',
            fontWeight: 700,
            padding: '6px 14px',
            borderRadius: '20px',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          📋 Application Checklist &rarr;
        </Link>
      </div>

      {/* Main Detail Content */}
      <div
        className="parsed-content"
        style={{ padding: '20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0' }}
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Jobniti Bottom Candidate Advice & Original Guides Section */}
      <div style={{
        marginTop: '28px',
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '14px',
        padding: '24px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.02)',
      }}>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0A2540', marginTop: 0, marginBottom: '12px' }}>
          💡 Jobniti Candidate Guidance &amp; Tips
        </h3>
        <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px', color: '#475569', lineHeight: '1.7' }}>
          <li><strong>Official Website Cross-Check:</strong> Always verify eligibility criteria, key dates, and official notification PDFs directly on the recruiting authority&apos;s website.</li>
          <li><strong>Document Specifications:</strong> Ensure your passport photo (light background) and signature (dark ink) meet specified file sizes before uploading.</li>
          <li><strong>Category Certificate:</strong> Verify that your EWS/OBC-NCL/SC/ST/PwBD certificates are valid for the current financial year.</li>
        </ul>

        <div style={{
          marginTop: '16px',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
        }}>
          <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 600 }}>
            Want detailed preparation strategies for SSC, Railways, or UPSC?
          </span>
          <Link
            href="/guides"
            style={{
              color: '#16a34a',
              fontSize: '13px',
              fontWeight: 700,
              textDecoration: 'none',
            }}
          >
            Explore Jobniti Career Guides &rarr;
          </Link>
        </div>
      </div>

      <style>{`
        .parsed-content { max-width: 100%; overflow-x: auto; font-size: 15px; line-height: 1.6; color: #333; }
        .parsed-content img { max-width: 100%; height: auto; border-radius: 8px; }
        .parsed-content table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e2e8f0; text-align: center; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.02); }
        .parsed-content th, .parsed-content td { border: 1px solid #e8edf2; padding: 12px 14px; vertical-align: middle; }
        .parsed-content th { background: linear-gradient(135deg, #0A2540 0%, #004D40 100%); color: #ffffff; font-weight: 700; text-transform: uppercase; font-size: 13px; letter-spacing: 0.5px; }
        .parsed-content tr:nth-child(even) { background-color: #f8fafc; }
        .parsed-content tr:hover { background-color: #f1f5f9; }
        .parsed-content a { color: #059669; text-decoration: none; font-weight: bold; }
        .parsed-content a:hover { color: #047857; text-decoration: underline; }
        .parsed-content h1, .parsed-content h2, .parsed-content h3 { color: #0A2540; text-align: center; margin-top: 25px; margin-bottom: 15px; font-weight: 800; }
        .parsed-content h1 { font-size: 24px; border-bottom: 2px solid rgba(16,185,129,0.15); padding-bottom: 8px; }
        .parsed-content h2 { font-size: 20px; }
        .parsed-content h3 { font-size: 18px; }
        .parsed-content p { text-align: center; margin-bottom: 12px; }
        .parsed-content ul { list-style: inside; text-align: left; margin: 15px 0; padding-left: 10px; }
        .parsed-content li { margin-bottom: 8px; }
      `}</style>
    </div>
  );
}
