'use client';

import React, { useState, useEffect } from 'react';

export default function AdmissionPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup shortly after page load every time the website is opened
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admission-popup-title"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 999999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(7, 21, 39, 0.72)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '16px',
        animation: 'fadeInOverlay 0.25s ease-out forwards',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popUpModal {
          from { opacity: 0; transform: scale(0.92) translateY(12px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes pulsePhone {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.03); }
        }
        .admission-action-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 13px 18px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.2s ease;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
        }
        .admission-action-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.18);
          text-decoration: none;
        }
        .btn-call {
          background: linear-gradient(135deg, #0284C7 0%, #0369A1 100%);
          color: #FFFFFF !important;
          border: 1px solid #38BDF8;
        }
        .btn-call:hover {
          background: linear-gradient(135deg, #0369A1 0%, #075985 100%);
        }
        .btn-whatsapp {
          background: linear-gradient(135deg, #25D366 0%, #128C7E 100%);
          color: #FFFFFF !important;
          border: 1px solid #86EFAC;
        }
        .btn-whatsapp:hover {
          background: linear-gradient(135deg, #128C7E 0%, #075E54 100%);
        }
        .course-tag {
          background: #F1F5F9;
          color: #0F172A;
          border: 1px solid #E2E8F0;
          padding: 4px 9px;
          border-radius: 8px;
          font-size: 11.5px;
          font-weight: 600;
          white-space: nowrap;
        }
      `}} />

      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '480px',
          background: '#FFFFFF',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 25px 65px rgba(0, 0, 0, 0.35), 0 0 35px rgba(16, 185, 129, 0.2)',
          animation: 'popUpModal 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        }}
      >
        {/* Top Header Banner */}
        <div
          style={{
            background: 'linear-gradient(135deg, #0A2540 0%, #004D40 50%, #065F46 100%)',
            padding: '24px 20px 20px',
            color: '#FFFFFF',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Close X Button */}
          <button
            onClick={handleClose}
            aria-label="Close popup"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '32px',
              height: '32px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)')}
          >
            ✕
          </button>

          {/* Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.15)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '11.5px',
              fontWeight: '700',
              letterSpacing: '0.4px',
              marginBottom: '10px',
            }}
          >
            <span>🎓</span> Direct Admission Helpline 2026
          </div>

          <h2
            id="admission-popup-title"
            style={{
              fontSize: '22px',
              fontWeight: '900',
              lineHeight: '1.3',
              margin: '0',
              color: '#FFFFFF',
              letterSpacing: '0.2px',
            }}
          >
            किसी भी कॉलेज में एडमिशन या डिग्री के लिए संपर्क करें!
          </h2>
          <p
            style={{
              fontSize: '13px',
              color: '#A7F3D0',
              margin: '6px 0 0',
              fontWeight: '600',
            }}
          >
            UGC / AICTE Approved All India Colleges &amp; Universities
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '20px 22px 18px' }}>
          
          {/* Courses Badges */}
          <div style={{ marginBottom: '16px' }}>
            <div
              style={{
                fontSize: '11px',
                fontWeight: '700',
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '8px',
                textAlign: 'center',
              }}
            >
              उपलब्ध कोर्सेज व डिग्रियां (Regular / Distance)
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
                justifyContent: 'center',
              }}
            >
              <span className="course-tag">B.Tech / M.Tech</span>
              <span className="course-tag">MBA / BBA</span>
              <span className="course-tag">B.Ed / D.El.Ed</span>
              <span className="course-tag">BCA / MCA</span>
              <span className="course-tag">BA / B.Sc / B.Com</span>
              <span className="course-tag">D.Pharma / B.Pharma</span>
              <span className="course-tag">Diploma / Polytechnic</span>
              <span className="course-tag">LLB / Law</span>
            </div>
          </div>

          {/* Primary Phone Box */}
          <div
            style={{
              background: 'linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%)',
              border: '2px dashed #10B981',
              borderRadius: '16px',
              padding: '14px 16px',
              textAlign: 'center',
              marginBottom: '16px',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.08)',
              animation: 'pulsePhone 3s ease-in-out infinite',
            }}
          >
            <div style={{ fontSize: '12px', fontWeight: '700', color: '#047857' }}>
              📞 एडमिशन हेल्पलाइन नंबर
            </div>
            <a
              href="tel:+919135293069"
              style={{
                display: 'inline-block',
                fontSize: '28px',
                fontWeight: '900',
                color: '#0A2540',
                letterSpacing: '1px',
                textDecoration: 'none',
                margin: '3px 0 2px',
              }}
            >
              9135293069
            </a>
            <div style={{ fontSize: '11.5px', color: '#059669', fontWeight: '600' }}>
              (1-Click कॉल या व्हाट्सएप पर तुरंत सलाह लें)
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <a
              href="tel:+919135293069"
              className="admission-action-btn btn-call"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M6.62 10.79a15.053 15.053 0 006.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/>
              </svg>
              अभी कॉल करें (Call: 9135293069)
            </a>

            <a
              href="https://wa.me/919135293069?text=Hello%20Jobniti,%20mujhe%20college%20admission%20aur%20degree%20ke%20bare%20mein%20jaankari%20chahiye"
              target="_blank"
              rel="noopener noreferrer"
              className="admission-action-btn btn-whatsapp"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0012.04 2m.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 01-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24m4.52 11.63c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.37-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.34-.76-1.84-.2-.49-.4-.42-.56-.43h-.47c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.71 4.31 3.8 2.53 1.09 2.53.73 2.99.69.46-.04 1.47-.6 1.68-1.18.21-.58.21-1.08.15-1.18-.06-.11-.23-.17-.48-.3z"/>
              </svg>
              WhatsApp पर बात करें
            </a>
          </div>

          {/* Dismiss button */}
          <div style={{ textAlign: 'center', marginTop: '12px' }}>
            <button
              onClick={handleClose}
              style={{
                background: 'none',
                border: 'none',
                color: '#64748B',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                textDecoration: 'underline',
                padding: '4px 8px',
              }}
            >
              वेबसाइट पर जाएं (Continue to Jobniti)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
