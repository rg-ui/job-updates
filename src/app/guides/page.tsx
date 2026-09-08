import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { GUIDE_ARTICLES } from '@/data/guides';

export const metadata: Metadata = {
  title: 'Career Preparation Guides & Exam Strategies | Jobniti',
  description: 'Original career guides, SSC, Railway, UPSC exam preparation strategies, syllabus analysis, and online application tips for job seekers in India.',
  alternates: { canonical: 'https://jobniti.in/guides' },
  openGraph: {
    title: 'Career Preparation Guides & Exam Strategies | Jobniti',
    description: 'Expert career advice, exam strategies, and step-by-step guides for SSC, Banking, Railways, and UPSC examinations.',
    url: 'https://jobniti.in/guides',
  },
};

export default function GuidesIndexPage() {
  return (
    <div className="grid-container" style={{ paddingTop: '24px', paddingBottom: '60px' }}>
      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #0A2540 0%, #004D40 100%)',
        color: '#ffffff',
        padding: '36px 28px',
        borderRadius: '16px',
        marginBottom: '32px',
        boxShadow: '0 10px 30px rgba(10, 37, 64, 0.15)',
      }}>
        <span style={{
          background: 'rgba(34, 197, 94, 0.2)',
          color: '#4ade80',
          fontSize: '12px',
          fontWeight: '700',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          padding: '4px 12px',
          borderRadius: '20px',
          display: 'inline-block',
          marginBottom: '12px',
        }}>
          💡 Jobniti Knowledge Hub
        </span>
        <h1 style={{ fontSize: '28px', fontWeight: '800', margin: '0 0 10px 0', lineHeight: 1.3 }}>
          Career Guides & Exam Strategies
        </h1>
        <p style={{ fontSize: '15px', opacity: 0.9, maxWidth: '750px', margin: 0, lineHeight: 1.6 }}>
          Original, expert-verified articles to help you excel in SSC, Railways, Banking, UPSC, and State PSC examinations. Master syllabus patterns and avoid common application errors.
        </p>
      </div>

      {/* Articles Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
        {GUIDE_ARTICLES.map((article) => (
          <div key={article.slug} style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '14px',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{
                  background: '#f0fdf4',
                  color: '#16a34a',
                  fontSize: '12px',
                  fontWeight: '700',
                  padding: '3px 10px',
                  borderRadius: '12px',
                  border: '1px solid #bbf7d0',
                }}>
                  {article.category}
                </span>
                <span style={{ fontSize: '12px', color: '#64748b' }}>
                  ⏱️ {article.readTime}
                </span>
              </div>
              <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#0A2540', marginBottom: '8px', lineHeight: 1.4 }}>
                <Link href={`/guides/${article.slug}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                  {article.title}
                </Link>
              </h2>
              <p style={{ fontSize: '14px', color: '#475569', lineHeight: 1.6, marginBottom: '16px' }}>
                {article.excerpt}
              </p>
            </div>
            
            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                📅 {article.updatedDate}
              </span>
              <Link href={`/guides/${article.slug}`} style={{
                color: '#16a34a',
                fontSize: '14px',
                fontWeight: '700',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}>
                Read Full Guide →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
