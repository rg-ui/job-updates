import React from 'react';

export default function AdsSidebar({ variant = 'admission' }: { variant?: 'admission' | 'degree' }) {
  const isDegreeVariant = variant === 'degree';

  return (
    <div
      style={{
        width: '100%',
        background: '#FFFFFF',
        borderRadius: '18px',
        border: '1.5px solid #E2E8F0',
        overflow: 'hidden',
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
        marginBottom: '18px',
        textAlign: 'center',
        position: 'relative',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
    >
      {/* Top Banner Header */}
      <div
        style={{
          background: isDegreeVariant
            ? 'linear-gradient(135deg, #0284C7 0%, #0F172A 100%)'
            : 'linear-gradient(135deg, #0A2540 0%, #047857 100%)',
          padding: '16px 14px',
          color: '#FFFFFF',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            background: 'rgba(255, 255, 255, 0.18)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            padding: '3px 10px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.4px',
            marginBottom: '6px',
          }}
        >
          <span>🎓</span> {isDegreeVariant ? 'Direct Degree Guidance' : 'Direct College Admission 2026'}
        </div>
        <h3
          style={{
            fontSize: '17px',
            fontWeight: '900',
            lineHeight: '1.35',
            margin: '0',
            color: '#FFFFFF',
          }}
        >
          {isDegreeVariant
            ? 'कोई भी डिग्री (Regular/Distance) करने के लिए संपर्क करें'
            : 'किसी भी कॉलेज में एडमिशन लेने के लिए संपर्क करें'}
        </h3>
        <p style={{ margin: '4px 0 0', fontSize: '11.5px', color: '#A7F3D0', fontWeight: '600' }}>
          UGC / AICTE Approved All India Universities
        </p>
      </div>

      {/* Body with Courses */}
      <div style={{ padding: '14px 14px 16px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '5px',
            justifyContent: 'center',
            marginBottom: '14px',
          }}
        >
          <span style={tagStyle}>B.Tech / M.Tech</span>
          <span style={tagStyle}>MBA / BBA</span>
          <span style={tagStyle}>B.Ed / D.El.Ed</span>
          <span style={tagStyle}>BA / B.Sc / B.Com</span>
          <span style={tagStyle}>BCA / MCA</span>
          <span style={tagStyle}>Pharmacy</span>
          <span style={tagStyle}>Diploma</span>
          <span style={tagStyle}>LLB / Law</span>
        </div>

        {/* Highlighted Helpline Box */}
        <div
          style={{
            background: '#F0FDF4',
            border: '1.5px dashed #10B981',
            borderRadius: '12px',
            padding: '10px 8px',
            marginBottom: '12px',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: '700', color: '#047857' }}>
            📞 हेल्पलाइन नंबर
          </div>
          <a
            href="tel:+919135293069"
            style={{
              fontSize: '22px',
              fontWeight: '900',
              color: '#0A2540',
              letterSpacing: '1px',
              textDecoration: 'none',
              display: 'block',
              margin: '2px 0',
            }}
          >
            9135293069
          </a>
          <div style={{ fontSize: '10.5px', color: '#059669', fontWeight: '600' }}>
            1-Click कॉल या व्हाट्सएप पर सहायता
          </div>
        </div>

        {/* Direct Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <a
            href="tel:+919135293069"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
              color: '#FFFFFF',
              padding: '9px 12px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(2, 132, 199, 0.25)',
            }}
          >
            📞 अभी कॉल करें
          </a>
          <a
            href="https://wa.me/919135293069?text=Hello%20Jobniti,%20mujhe%20college%20admission%20aur%20degree%20ke%20bare%20mein%20jaankari%20chahiye"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
              color: '#FFFFFF',
              padding: '9px 12px',
              borderRadius: '10px',
              fontSize: '13.5px',
              fontWeight: '700',
              textDecoration: 'none',
              boxShadow: '0 3px 10px rgba(37, 211, 102, 0.25)',
            }}
          >
            💬 WhatsApp पर बात करें
          </a>
        </div>
      </div>
    </div>
  );
}

const tagStyle: React.CSSProperties = {
  background: '#F8FAFC',
  color: '#1E293B',
  border: '1px solid #E2E8F0',
  padding: '3px 7px',
  borderRadius: '6px',
  fontSize: '11px',
  fontWeight: '600',
  whiteSpace: 'nowrap',
};
