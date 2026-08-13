'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

export default function IndependenceDayPopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Show popup once per session around 15th August
    const hasSeen = sessionStorage.getItem('jobniti_15aug_popup_2026');
    if (!hasSeen) {
      // Small delay for smooth entrance after page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    sessionStorage.setItem('jobniti_15aug_popup_2026', 'true');
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(5, 15, 30, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        padding: '16px',
        animation: 'fadeIn 0.3s ease-out forwards',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '460px',
          background: '#ffffff',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3), 0 0 40px rgba(255, 153, 51, 0.25)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          textAlign: 'center',
          animation: 'popIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        }}
      >
        {/* Tricolor Animated Top Bar */}
        <div
          style={{
            height: '8px',
            width: '100%',
            background: 'linear-gradient(90deg, #FF9933 0%, #FF9933 33.3%, #ffffff 33.3%, #ffffff 66.6%, #138808 66.6%, #138808 100%)',
          }}
        />

        {/* Close Button */}
        <button
          onClick={handleClose}
          aria-label="Close"
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            background: '#f3f4f6',
            border: 'none',
            fontSize: '18px',
            fontWeight: 'bold',
            color: '#4b5563',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s ease',
            zIndex: 10,
          }}
        >
          ✕
        </button>

        <div style={{ padding: '32px 24px 28px 24px' }}>
          {/* Independence Badge */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 16px',
              borderRadius: '30px',
              background: 'linear-gradient(135deg, rgba(255, 153, 51, 0.12), rgba(19, 136, 8, 0.12))',
              border: '1px solid rgba(255, 153, 51, 0.3)',
              marginBottom: '18px',
            }}
          >
            <span style={{ fontSize: '18px' }}>🇮🇳</span>
            <span
              style={{
                fontSize: '13px',
                fontWeight: '800',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                background: 'linear-gradient(90deg, #d97706, #059669)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              15th August • Swatantrata Diwas
            </span>
          </div>

          {/* Heading */}
          <h2
            style={{
              fontSize: '22px',
              fontWeight: '800',
              color: '#0A2540',
              lineHeight: '1.4',
              marginBottom: '14px',
            }}
          >
            Jobniti Parivar Ki Taraf Se Aap Sabhi Ko Swatantrata Diwas Ki Hardik Shubhkamnayein! 🇮🇳
          </h2>

          {/* Message text */}
          <p
            style={{
              fontSize: '14.5px',
              color: '#4b5563',
              lineHeight: '1.65',
              marginBottom: '24px',
            }}
          >
            Aapki Sarkari Naukri ki taiyari me Jobniti Parivar hamesha aapke saath hai. Aao milkar Desh ki pragati me apna yogdan dein!
          </p>

          {/* Founder Profile Card */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: '12px 16px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
              border: '1px solid #e5e7eb',
              marginBottom: '24px',
              textAlign: 'left',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <Image
                src="/team/manii.png"
                alt="Manii Gupta"
                width={56}
                height={56}
                style={{
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid #FF9933',
                  boxShadow: '0 0 10px rgba(255, 153, 51, 0.3)',
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  fontSize: '14px',
                }}
              >
                🇮🇳
              </span>
            </div>
            <div>
              <div style={{ fontSize: '15px', fontWeight: '800', color: '#0A2540' }}>
                Manii Gupta
              </div>
              <div style={{ fontSize: '12.5px', color: '#059669', fontWeight: '600' }}>
                Founder &amp; Director, Jobniti
              </div>
            </div>
          </div>

          {/* Action CTA Button */}
          <button
            onClick={handleClose}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '30px',
              border: 'none',
              background: 'linear-gradient(135deg, #FF9933 0%, #138808 100%)',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '800',
              cursor: 'pointer',
              boxShadow: '0 6px 20px rgba(19, 136, 8, 0.35)',
              transition: 'all 0.25s ease',
              letterSpacing: '0.5px',
            }}
          >
            🇮🇳 Jai Hind! Dhanyawad
          </button>
        </div>

        {/* Tricolor Bottom Accent */}
        <div
          style={{
            height: '4px',
            width: '100%',
            background: 'linear-gradient(90deg, #FF9933, #ffffff, #138808)',
          }}
        />

        <style dangerouslySetInnerHTML={{ __html: `
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes popIn {
            from { opacity: 0; transform: scale(0.85) translateY(20px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}} />
      </div>
    </div>
  );
}
