import Link from 'next/link';

export default function NotFound() {
  return (
    <div style={{
      textAlign: 'center',
      padding: '60px 20px',
      maxWidth: '600px',
      margin: '0 auto',
    }}>
      <div style={{ fontSize: '64px', marginBottom: '16px' }}>🔍</div>
      <h1 style={{
        fontSize: '32px',
        fontWeight: '800',
        color: '#0A2540',
        marginBottom: '12px',
      }}>Page Not Found</h1>
      <p style={{
        fontSize: '16px',
        color: '#6b7280',
        marginBottom: '30px',
        lineHeight: '1.6',
      }}>
        The page you&apos;re looking for doesn&apos;t exist or may have been moved. Check the URL or go back to the homepage.
      </p>
      <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link href="/" style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #059669, #10b981)',
          color: 'white',
          borderRadius: '30px',
          fontWeight: '700',
          fontSize: '15px',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(16,185,129,0.4)',
        }}>Go to Homepage</Link>
        <Link href="/latest-jobs" style={{
          display: 'inline-block',
          padding: '12px 28px',
          background: 'linear-gradient(135deg, #1f2937, #111827)',
          color: 'white',
          borderRadius: '30px',
          fontWeight: '700',
          fontSize: '15px',
          textDecoration: 'none',
          boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
        }}>Browse Jobs</Link>
      </div>
    </div>
  );
}
