import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getGuideBySlug, GUIDE_ARTICLES } from '@/data/guides';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return GUIDE_ARTICLES.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return { title: 'Guide Not Found' };
  }

  return {
    title: `${guide.title} | Jobniti Career Guides`,
    description: guide.excerpt,
    alternates: { canonical: `https://jobniti.in/guides/${guide.slug}` },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      url: `https://jobniti.in/guides/${guide.slug}`,
      type: 'article',
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="grid-container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      {/* Breadcrumb Navigation */}
      <nav style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
        <Link href="/" style={{ color: '#16a34a', textDecoration: 'none' }}>Home</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <Link href="/guides" style={{ color: '#16a34a', textDecoration: 'none' }}>Career Guides</Link>
        <span style={{ margin: '0 8px' }}>/</span>
        <span>{guide.category}</span>
      </nav>

      {/* Article Header */}
      <article style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px 28px', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
          <span style={{
            background: '#f0fdf4',
            color: '#16a34a',
            fontSize: '12px',
            fontWeight: '700',
            padding: '4px 12px',
            borderRadius: '12px',
            border: '1px solid #bbf7d0',
          }}>
            {guide.category}
          </span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>⏱️ {guide.readTime}</span>
          <span style={{ fontSize: '13px', color: '#64748b' }}>📅 Updated: {guide.updatedDate}</span>
        </div>

        <h1 style={{ fontSize: '28px', fontWeight: '800', color: '#0A2540', margin: '0 0 12px 0', lineHeight: 1.3 }}>
          {guide.title}
        </h1>

        <p style={{ fontSize: '16px', color: '#475569', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic', borderLeft: '4px solid #16a34a', paddingLeft: '14px' }}>
          {guide.subtitle}
        </p>

        <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
          {/* Render HTML content safely */}
          <div
            className="guide-article-body"
            dangerouslySetInnerHTML={{ __html: guide.contentHtml }}
          />
        </div>

        {/* Author & Disclaimer Box */}
        <div style={{
          marginTop: '40px',
          padding: '20px',
          background: '#f8fafc',
          borderRadius: '12px',
          border: '1px solid #e2e8f0',
          fontSize: '13px',
          color: '#475569',
          lineHeight: 1.6,
        }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: '700', color: '#0A2540' }}>
            ✍️ Written &amp; Fact-Checked by: {guide.author}
          </p>
          <p style={{ margin: 0 }}>
            Disclaimer: The preparation strategies and exam patterns mentioned here are based on official notifications and standard guidelines. Candidates are advised to verify latest updates on respective official commission portals (SSC, UPSC, RRB, IBPS).
          </p>
        </div>

        {/* Back Link */}
        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <Link href="/guides" style={{
            display: 'inline-block',
            padding: '10px 24px',
            background: '#16a34a',
            color: '#ffffff',
            borderRadius: '24px',
            fontWeight: '700',
            fontSize: '14px',
            textDecoration: 'none',
          }}>
            ← Explore All Career Guides
          </Link>
        </div>
      </article>

      <style>{`
        .guide-article-body h2 { font-size: 22px; color: #0A2540; font-weight: 800; margin-top: 28px; margin-bottom: 14px; border-bottom: 2px solid #e2e8f0; padding-bottom: 6px; }
        .guide-article-body h3 { font-size: 18px; color: #0f766e; font-weight: 700; margin-top: 20px; margin-bottom: 10px; }
        .guide-article-body p { font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 14px; }
        .guide-article-body ul, .guide-article-body ol { margin: 14px 0; padding-left: 20px; }
        .guide-article-body li { font-size: 15px; color: #334155; line-height: 1.7; margin-bottom: 8px; }
        .guide-article-body strong { color: #0A2540; }
      `}</style>
    </div>
  );
}
