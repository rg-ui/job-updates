'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('App Router Error:', error);
  }, [error]);

  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      maxWidth: '600px',
      margin: '0 auto',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>⚠️</div>
      <h2 style={{
        fontSize: '28px',
        fontWeight: '800',
        color: '#0A2540',
        marginBottom: '12px',
      }}>Something Went Wrong</h2>
      <p style={{
        fontSize: '15px',
        color: '#6b7280',
        marginBottom: '28px',
        lineHeight: '1.6',
      }}>
        We couldn&apos;t load this page right now. It might be temporarily unavailable or updating.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          onClick={() => reset()}
          style={{
            padding: '12px 26px',
            background: 'linear-gradient(135deg, #059669, #10b981)',
            color: 'white',
            border: 'none',
            borderRadius: '30px',
            fontWeight: '700',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
          }}
        >
          Try Again
        </button>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '12px 26px',
          background: 'linear-gradient(135deg, #1f2937, #111827)',
          color: 'white',
          borderRadius: '30px',
          fontWeight: '700',
          fontSize: '15px',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
        }}>
          Go to Homepage
        </Link>
      </div>
    </div>
  );
}
