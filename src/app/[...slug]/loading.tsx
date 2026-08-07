export default function Loading() {
  return (
    <div className="grid-container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>

        {/* Main Content Skeleton */}
        <div style={{ flex: '1 1 70%', minWidth: '300px' }}>

          {/* Title skeleton */}
          <div style={{
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            marginBottom: '20px',
            width: '75%',
          }} />

          {/* Content block skeleton */}
          <div className="category-box" style={{ padding: '24px', background: '#fff', borderRadius: '16px' }}>
            {/* Header bar */}
            <div style={{
              height: '44px',
              borderRadius: '10px',
              background: 'linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%)',
              backgroundSize: '200% 100%',
              animation: 'shimmer 1.5s infinite',
              marginBottom: '20px',
            }} />

            {/* Table-like rows */}
            {[100, 85, 90, 70, 95, 80, 65, 88].map((w, i) => (
              <div key={i} style={{
                height: '18px',
                borderRadius: '6px',
                width: `${w}%`,
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%',
                animation: `shimmer 1.5s infinite ${i * 0.1}s`,
                marginBottom: '14px',
              }} />
            ))}

            {/* Divider */}
            <div style={{ height: '1px', background: '#e5e7eb', margin: '20px 0' }} />

            {/* More rows */}
            {[75, 88, 60, 92, 78].map((w, i) => (
              <div key={i} style={{
                height: '18px',
                borderRadius: '6px',
                width: `${w}%`,
                background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                backgroundSize: '200% 100%',
                animation: `shimmer 1.5s infinite ${i * 0.1}s`,
                marginBottom: '14px',
              }} />
            ))}

            {/* CTA buttons skeleton */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '24px', flexWrap: 'wrap' }}>
              {[140, 120, 150].map((w, i) => (
                <div key={i} style={{
                  height: '40px',
                  width: `${w}px`,
                  borderRadius: '30px',
                  background: 'linear-gradient(90deg, #d1fae5 25%, #a7f3d0 50%, #d1fae5 75%)',
                  backgroundSize: '200% 100%',
                  animation: `shimmer 1.5s infinite ${i * 0.15}s`,
                }} />
              ))}
            </div>
          </div>

          {/* Secondary info cards skeleton */}
          {[1, 2].map((_, i) => (
            <div key={i} className="category-box" style={{
              marginTop: '24px',
              padding: '24px',
              background: '#fff',
              borderRadius: '16px'
            }}>
              <div style={{
                height: '44px',
                borderRadius: '10px',
                background: 'linear-gradient(90deg, #e2e8f0 25%, #cbd5e1 50%, #e2e8f0 75%)',
                backgroundSize: '200% 100%',
                animation: 'shimmer 1.5s infinite',
                marginBottom: '20px',
              }} />
              {[90, 80, 70, 85].map((w, j) => (
                <div key={j} style={{
                  height: '16px',
                  borderRadius: '6px',
                  width: `${w}%`,
                  background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
                  backgroundSize: '200% 100%',
                  animation: `shimmer 1.5s infinite ${j * 0.1}s`,
                  marginBottom: '12px',
                }} />
              ))}
            </div>
          ))}
        </div>

        {/* Sidebar skeleton */}
        <div style={{ flex: '1 1 25%', minWidth: '250px' }}>
          <div style={{
            height: '280px',
            borderRadius: '16px',
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            marginBottom: '16px',
          }} />
          <div style={{
            height: '200px',
            borderRadius: '16px',
            background: 'linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite 0.2s',
          }} />
        </div>
      </div>

      {/* Loading indicator text */}
      <div style={{
        textAlign: 'center',
        marginTop: '30px',
        padding: '16px',
        background: 'rgba(5,150,105,0.06)',
        borderRadius: '12px',
        border: '1px solid rgba(5,150,105,0.15)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '10px',
      }}>
        <span style={{ fontSize: '20px', animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
        <span style={{ fontSize: '14px', fontWeight: '600', color: '#059669' }}>
          Loading official notification details...
        </span>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}} />
    </div>
  );
}
