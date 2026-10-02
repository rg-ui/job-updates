'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Daily motivational quotes - changes automatically every day based on date
const QUOTES = [
  { text: "Sapne woh nahi jo neend mein aate hain, sapne woh hain jo neend nahi aane dete.", author: "A.P.J. Abdul Kalam" },
  { text: "Mushkilein aapko yeh decide karne ka mauka deti hain ki aap kitne strong hain.", author: "Jobniti" },
  { text: "Ek sarkari naukri sirf ek job nahi, yeh ek naya kal hai.", author: "Jobniti" },
  { text: "Mehnat karo, manzil apne aap tumhare paas aayegi.", author: "Swami Vivekananda" },
  { text: "Safalta wahan milti hai jahan log sochte hain ki yeh mushkil hai.", author: "Jobniti" },
  { text: "Haar mat mano! Aaj ki mehnat kal ki safalta ki buniyad hai.", author: "Jobniti" },
  { text: "Jo aaj padhai karta hai, kal woh rank laata hai.", author: "Jobniti" },
  { text: "Haar ki fikra chhodo, jeet ki taiyari karo!", author: "Jobniti" },
  { text: "Sirf wahi jeetta hai jo haar ke baad bhi uth jaata hai.", author: "Jobniti" },
  { text: "Aaj ki padhai kal ka result banati hai. Shuru kar abhi!", author: "Jobniti" },
  { text: "Udaan bhari thi, isliye aasman bhi chhua. Tu bhi kab udega?", author: "Jobniti" },
  { text: "Khud pe vishwas rakh, duniya bhi rakhne lagegi.", author: "Jobniti" },
  { text: "Pehle khud ko prove karo, baaki sab apne aap hoga.", author: "Jobniti" },
  { text: "Waqt waste mat kar, competition bahut hai. Uth, chal, jeet!", author: "Jobniti" },
  { text: "Roz ek kadam aur, kal manzil paas hogi.", author: "Jobniti" },
  { text: "Himmat karo, mehnat karo, government job pakki hai!", author: "Jobniti" },
  { text: "Tyaag aaj ka, safalta kal ki!", author: "Jobniti" },
  { text: "Padho, likho, jeeto — Jobniti ke saath aage badho!", author: "Jobniti" },
  { text: "Jo thak ke baith jaata hai, woh nahi jeetta. Jo uth ke chalta hai, woh pahunchta hai.", author: "Jobniti" },
  { text: "Sapna dekha hai toh poora karo, baaki sab chhoda ja sakta hai.", author: "Jobniti" },
  { text: "Jab tak haara nahi, tab tak jeeta hoon main.", author: "Jobniti" },
  { text: "Sarkari exam crack karna ek mission hai — abhi se shuru!", author: "Jobniti" },
  { text: "Consistency is the key. Roz thoda thoda padhte raho.", author: "Jobniti" },
  { text: "Aaj ka sangharsh, kal ki kahani banega.", author: "Jobniti" },
  { text: "Jo sapna aapne dekha hai, desh ne bhi wahi sapna aapke liye dekha hai.", author: "A.P.J. Abdul Kalam" },
  { text: "Agar koshish na karo toh haar pakki hai, koshish karo toh jeet mumkin hai.", author: "Jobniti" },
  { text: "Dil mein jazba ho toh result bhi aata hai, sirf waiting se nahi.", author: "Jobniti" },
  { text: "Govt job ki taiyari mein koi shortcut nahi — shortcut sirf mehnat hai.", author: "Jobniti" },
  { text: "Zindagi mein wahi jeetta hai jo haar ke baad bhi khada rehta hai.", author: "Jobniti" },
  { text: "Neend ko kal ke liye rakh, aaj padhai kar. Result aaega toh neend khud aaegi.", author: "Jobniti" },
];

function getDailyQuote() {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const dayOfYear = Math.floor((now.getTime() - startOfYear.getTime()) / (1000 * 60 * 60 * 24));
  return QUOTES[dayOfYear % QUOTES.length];
}

export default function JobUpdatesHeader() {
  const quote = getDailyQuote();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    const term = searchQuery.toLowerCase().trim();
    const links = document.querySelectorAll('a');
    let found = false;

    for (const link of Array.from(links)) {
      if (link.textContent && link.textContent.toLowerCase().includes(term)) {
        link.scrollIntoView({ behavior: 'smooth', block: 'center' });
        link.style.outline = '3px solid #10B981';
        link.style.borderRadius = '4px';
        setTimeout(() => {
          link.style.outline = '';
        }, 3000);
        found = true;
        break;
      }
    }

    if (!found) {
      const content = document.querySelector('main') || document.querySelector('.grid-container');
      if (content) {
        content.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <header style={{ position: 'relative', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes pulseDotLive {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.35); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes floatLogoSmooth {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-4px); }
        }
        .mint-gradient-header {
          background: linear-gradient(135deg, #2dd4bf 0%, #06b6d4 50%, #10b981 100%);
          position: relative;
        }
        .mint-glass-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 14px;
          border-radius: 9999px;
          font-size: 13px;
          font-weight: 700;
          color: #0A2540;
          text-decoration: none;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.9);
          box-shadow: 0 2px 8px rgba(10, 37, 64, 0.08);
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          white-space: nowrap;
        }
        .mint-glass-pill:hover {
          background: #FFFFFF;
          color: #004D40;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(10, 37, 64, 0.15);
          text-decoration: none;
        }
        .search-pill-container {
          display: flex;
          align-items: center;
          background: rgba(10, 37, 64, 0.92);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 9999px;
          padding: 3px 4px 3px 12px;
          box-shadow: 0 2px 10px rgba(0, 77, 64, 0.2);
          transition: all 0.2s ease;
          width: 250px;
        }
        .search-pill-container:focus-within {
          background: #0A2540;
          box-shadow: 0 4px 16px rgba(0, 77, 64, 0.35);
          width: 270px;
        }
        .search-pill-input {
          border: none;
          background: transparent;
          outline: none;
          font-size: 12.5px;
          color: #FFFFFF;
          width: 100%;
          font-family: inherit;
        }
        .search-pill-input::placeholder {
          color: #94A3B8;
        }
        .search-pill-btn {
          border: none;
          background: #10B981;
          color: #FFFFFF;
          padding: 5px 12px;
          border-radius: 9999px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .search-pill-btn:hover {
          background: #059669;
        }
        .quote-glass-card {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.95);
          box-shadow: 0 4px 15px rgba(0, 77, 64, 0.07);
          padding: 9px 18px;
          transition: all 0.2s ease;
        }
        @media (max-width: 768px) {
          .header-main-pad {
            padding: 16px 12px 14px !important;
          }
          .header-brand-title {
            font-size: 32px !important;
          }
          .header-circle-logo {
            width: 76px !important;
            height: 76px !important;
            padding: 6px !important;
          }
          .header-right-stack {
            align-items: center !important;
            width: 100% !important;
            margin-top: 6px;
          }
          .header-pills-row {
            justify-content: center !important;
          }
          .search-pill-container {
            width: 100% !important;
            max-width: 300px !important;
          }
          .top-bar-right-text {
            display: none !important;
          }
        }
      `}} />

      {/* Top Micro Bar */}
      <div style={{ background: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', borderBottom: '1px solid rgba(255, 255, 255, 0.45)', position: 'relative', zIndex: 2 }}>
        <div className="grid-container" style={{ padding: '5px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#1E293B', fontWeight: '600' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', background: '#FF3D00', borderRadius: '50%', animation: 'pulseDotLive 2s infinite' }}></span>
            <span style={{ color: '#0A2540', fontWeight: '700' }}>Live Updates 24/7</span>
            <span style={{ color: 'rgba(0,0,0,0.2)' }}>|</span>
            <span style={{ color: '#334155' }}>India&apos;s Trusted Govt Job Portal</span>
          </div>
          <div className="top-bar-right-text" style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11.5px' }}>
            <span style={{ color: '#004D40', fontWeight: '700' }}>⚡ No Ads • Fastest Updates</span>
          </div>
        </div>
      </div>

      {/* Main Header Row */}
      <div className="mint-gradient-header header-main-pad" style={{ padding: '20px 14px 16px', position: 'relative', zIndex: 1 }}>
        <div className="grid-container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            
            {/* Logo + Branding */}
            <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
              {/* Clean White Circular Logo Frame */}
              <div
                className="header-circle-logo"
                style={{
                  width: '88px',
                  height: '88px',
                  borderRadius: '50%',
                  background: '#FFFFFF',
                  padding: '7px',
                  boxShadow: '0 6px 20px rgba(0, 77, 64, 0.15)',
                  border: '3px solid rgba(255, 255, 255, 0.95)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  flexShrink: 0,
                  animation: 'floatLogoSmooth 5s ease-in-out infinite',
                }}
              >
                <Image
                  src="/jobniti-logo.png"
                  alt="Jobniti Logo"
                  width={74}
                  height={74}
                  priority
                  style={{
                    objectFit: 'contain',
                    borderRadius: '50%',
                    display: 'block',
                    width: '100%',
                    height: '100%',
                  }}
                />
              </div>

              <div>
                <h1
                  className="header-brand-title"
                  style={{
                    fontSize: '38px',
                    fontWeight: '900',
                    letterSpacing: '1.2px',
                    textTransform: 'uppercase',
                    color: '#0A2540',
                    lineHeight: 1.1,
                    margin: 0,
                  }}
                >
                  Jobniti
                </h1>

                <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexWrap: 'wrap', marginTop: '4px' }}>
                  <span style={{ fontSize: '14.5px', color: '#004D40', fontWeight: '800', letterSpacing: '0.3px' }}>
                    jobniti.in
                  </span>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '3px',
                      fontSize: '11px',
                      background: 'rgba(255, 255, 255, 0.92)',
                      color: '#047857',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255, 255, 255, 0.95)',
                      fontWeight: '800',
                    }}
                  >
                    ✓ Official
                  </span>
                  <span
                    style={{
                      fontSize: '10.5px',
                      background: 'rgba(10, 37, 64, 0.85)',
                      color: '#FFFFFF',
                      padding: '2px 8px',
                      borderRadius: '12px',
                      fontWeight: '800',
                      letterSpacing: '0.3px',
                    }}
                  >
                    🛡️ No Ads
                  </span>
                </div>
              </div>
            </Link>

            {/* Quick Action Navigation & Search (Right Side) */}
            <div className="header-right-stack" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '9px' }}>
              {/* Row 1: Action Pills */}
              <div className="header-pills-row" style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                <Link href="/result" className="mint-glass-pill">
                  <span>🚀</span> Latest Results
                </Link>
                <Link href="/admit-card" className="mint-glass-pill">
                  <span>🎯</span> Admit Cards
                </Link>
                <Link href="/latest-jobs" className="mint-glass-pill">
                  <span>⚡</span> Latest Jobs
                </Link>
              </div>

              {/* Row 2: Clean Search Bar */}
              <form onSubmit={handleSearch} className="search-pill-container">
                <span style={{ fontSize: '12px', marginRight: '6px' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search Sarkari Jobs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-pill-input"
                  aria-label="Search Sarkari Jobs"
                />
                <button type="submit" className="search-pill-btn">
                  Search
                </button>
              </form>
            </div>
          </div>

          {/* Daily Motivational Quote (Aaj ka Vichar) */}
          <div style={{ marginTop: '14px' }}>
            <div
              className="quote-glass-card"
              style={{
                maxWidth: '780px',
                margin: '0 auto',
                textAlign: 'center',
              }}
            >
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', justifyContent: 'center' }}>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>💡</span>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    fontStyle: 'italic',
                    color: '#0A2540',
                    lineHeight: '1.4',
                  }}
                >
                  &ldquo;{quote.text}&rdquo;
                </span>
                <span
                  style={{
                    fontSize: '11.5px',
                    fontWeight: '800',
                    color: '#004D40',
                    whiteSpace: 'nowrap',
                  }}
                >
                  — {quote.author}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Clean bottom line */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #0A2540, #004D40, #10B981, #004D40, #0A2540)' }}></div>
    </header>
  );
}
