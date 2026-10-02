import React from 'react';

export default function AdsFooter() {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.05) 100%)',
        border: '1.5px dashed rgba(52, 211, 153, 0.5)',
        borderRadius: '16px',
        padding: '16px 20px',
        margin: '16px auto',
        maxWidth: '900px',
        color: '#FFFFFF',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '14px',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}
    >
      <div style={{ textAlign: 'left', minWidth: '260px', flex: 1 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '11px', fontWeight: '700', color: '#6EE7B7', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '3px' }}>
          <span>🎓</span> Direct Admission &amp; Degree Helpline
        </div>
        <h4 style={{ margin: '0', fontSize: '16px', fontWeight: '800', color: '#FFFFFF', lineHeight: '1.3' }}>
          किसी भी कॉलेज में एडमिशन या डिग्री (B.Tech, MBA, B.Ed, आदि) के लिए संपर्क करें
        </h4>
        <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#CBD5E1' }}>
          100% Genuine Guidance • All UGC / AICTE Approved Universities
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <a
          href="tel:+919135293069"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
            color: '#FFFFFF',
            padding: '9px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 3px 10px rgba(2, 132, 199, 0.3)',
          }}
        >
          📞 Call: 9135293069
        </a>
        <a
          href="https://wa.me/919135293069?text=Hello%20Jobniti,%20mujhe%20college%20admission%20aur%20degree%20ke%20bare%20mein%20jaankari%20chahiye"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
            color: '#FFFFFF',
            padding: '9px 16px',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '700',
            textDecoration: 'none',
            whiteSpace: 'nowrap',
            boxShadow: '0 3px 10px rgba(37, 211, 102, 0.3)',
          }}
        >
          💬 WhatsApp
        </a>
      </div>
    </div>
  );
}
