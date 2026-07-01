import React from 'react';
import Image from 'next/image';

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

  return (
    <header style={{ position: 'relative', overflow: 'hidden' }}>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradientBG {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
        @keyframes pulse-dot {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes quoteGlow {
          0% { box-shadow: 0 0 8px rgba(46, 204, 113, 0.15); }
          50% { box-shadow: 0 0 20px rgba(46, 204, 113, 0.4); }
          100% { box-shadow: 0 0 8px rgba(46, 204, 113, 0.15); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animated-header-bg {
          background: linear-gradient(-45deg,
            rgba(135, 206, 235, 0.75),
            rgba(34, 193, 195, 0.75),
            rgba(46, 204, 113, 0.75),
            rgba(135, 206, 235, 0.75));
          background-size: 400% 400%;
          animation: gradientBG 15s ease infinite;
        }
        .glass-blob {
          position: absolute;
          filter: blur(55px);
          z-index: 0;
          border-radius: 50%;
          opacity: 0.7;
          animation: float 8s ease-in-out infinite;
          pointer-events: none;
        }
        .daily-quote-bar {
          animation: quoteGlow 4s ease-in-out infinite, fadeInUp 0.8s ease forwards;
        }
        .quote-text {
          font-style: italic;
          font-size: 15px;
          font-weight: 600;
          color: #0A2540;
          line-height: 1.5;
        }
        .quote-author {
          font-size: 12px;
          color: #2E7D32;
          font-weight: 700;
          margin-top: 4px;
        }
        /* Mobile responsive header styles */
        @media (max-width: 480px) {
          .header-logo-img {
            width: 72px !important;
            height: 72px !important;
            padding: 8px !important;
          }
          .header-title {
            font-size: 28px !important;
            letter-spacing: 1px !important;
          }
          .header-subtitle {
            font-size: 14px !important;
          }
          .header-badges {
            display: none !important;
          }
          .quote-text {
            font-size: 12px !important;
          }
          .quote-author {
            font-size: 10px !important;
          }
          .daily-quote-bar {
            padding: 10px 12px !important;
            gap: 8px !important;
          }
          .quote-icon {
            font-size: 20px !important;
          }
          .aaj-ka-vichar-badge {
            display: none !important;
          }
          .no-ads-badge {
            font-size: 7px !important;
            padding: 4px 7px !important;
            right: -40px !important;
            top: -14px !important;
          }
          .top-microbar-right {
            display: none !important;
          }
        }
        @media (max-width: 768px) {
          .animated-header-bg {
            padding: 20px 12px 16px !important;
          }
          .header-main-row {
            gap: 20px !important;
          }
          .header-title {
            font-size: 32px !important;
          }
          .header-badges {
            display: none !important;
          }
        }
      `}} />

      {/* Background blobs */}
      <div className="glass-blob" style={{ background: '#00E5FF', width: '250px', height: '250px', top: '-80px', left: '-40px' }}></div>
      <div className="glass-blob" style={{ background: '#00E676', width: '200px', height: '200px', bottom: '-80px', right: '-40px', animationDelay: '2s' }}></div>

      {/* Top micro-bar */}
      <div style={{ background: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', position: 'relative', zIndex: 1, borderBottom: '1px solid rgba(255,255,255,0.4)' }}>
        <div className="grid-container" style={{ padding: '5px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', fontWeight: '600', color: '#333', gap: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', flexShrink: 0 }}>
            <span style={{ display: 'inline-block', width: '7px', height: '7px', background: '#FF3D00', borderRadius: '50%', animation: 'pulse-dot 2s infinite' }}></span>
            Live Updates 24/7
          </div>
          <div className="top-microbar-right" style={{ textAlign: 'right', fontSize: '11px' }}>India&apos;s Trusted Govt Job Portal</div>
        </div>
      </div>

      {/* Main Header */}
      <div
        className="animated-header-bg"
        style={{ padding: '28px 12px 22px', position: 'relative', zIndex: 1, backdropFilter: 'blur(15px)', WebkitBackdropFilter: 'blur(15px)' }}
      >
        <div
          className="grid-container header-main-row"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '30px' }}
        >
          {/* Logo + Name */}
          <a href="/" style={{ display: 'flex', alignItems: 'center', gap: '18px', textDecoration: 'none' }}>
            <div style={{ position: 'relative', animation: 'float 5s ease-in-out infinite', flexShrink: 0 }}>
              <Image
                src="/jobniti-logo.png"
                alt="Jobniti Logo"
                className="header-logo-img"
                width={100}
                height={100}
                priority
                style={{
                  objectFit: 'cover',
                  background: 'rgba(255,255,255,0.95)',
                  padding: '10px',
                  borderRadius: '50%',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.12)',
                  border: '3px solid rgba(255,255,255,0.9)',
                  display: 'block',
                }}
              />
              <div
                className="no-ads-badge"
                style={{
                  position: 'absolute',
                  top: '-16px',
                  right: '-48px',
                  background: 'linear-gradient(135deg, #004D40, #0A2540)',
                  color: '#fff',
                  padding: '4px 9px',
                  borderRadius: '20px',
                  fontSize: '8px',
                  fontWeight: '800',
                  boxShadow: '0 3px 8px rgba(0,77,64,0.5)',
                  letterSpacing: '0.4px',
                  whiteSpace: 'nowrap',
                  textAlign: 'center',
                  lineHeight: '1.4',
                }}
              >
                NO ADS<br/>ONLY UPDATES
              </div>
            </div>

            <div>
              <h1
                className="header-title"
                style={{
                  fontSize: '46px',
                  fontWeight: '900',
                  background: 'linear-gradient(135deg, #0A2540 0%, #004D40 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  textTransform: 'uppercase',
                  letterSpacing: '2px',
                  margin: '0',
                  filter: 'drop-shadow(1px 3px 4px rgba(0,0,0,0.1))',
                  lineHeight: 1.1,
                }}
              >
                Jobniti
              </h1>
              <p
                className="header-subtitle"
                style={{ fontSize: '17px', color: '#004D40', margin: '5px 0 0', fontWeight: '700', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}
              >
                jobniti.in
                <span style={{ fontSize: '11px', background: 'rgba(255,255,255,0.7)', color: '#2E7D32', padding: '2px 9px', borderRadius: '12px', border: '1px solid rgba(165,214,167,0.5)', fontWeight: '800' }}>
                  ✓ Official
                </span>
              </p>
            </div>
          </a>

          {/* Badges — hidden on mobile via CSS */}
          <div className="header-badges" style={{ display: 'flex', flexDirection: 'column', gap: '12px', alignItems: 'center' }}>
            <div style={{ background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)', padding: '10px 22px', borderRadius: '28px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', border: '1px solid rgba(255,255,255,0.8)', display: 'flex', gap: '18px' }}>
              <span style={{ fontWeight: '700', color: '#0A2540', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>🚀</span> Latest Results
              </span>
              <span style={{ color: '#ccc' }}>|</span>
              <span style={{ fontWeight: '700', color: '#0A2540', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span>🎯</span> Admit Cards
              </span>
            </div>
            <div style={{ background: 'linear-gradient(135deg, #004D40 0%, #0A2540 100%)', color: 'white', padding: '9px 26px', borderRadius: '22px', fontSize: '13px', fontWeight: '600', boxShadow: '0 4px 14px rgba(0,0,0,0.18)', letterSpacing: '0.4px' }}>
              Search 500+ Sarkari Jobs
            </div>
          </div>
        </div>

        {/* Daily Quote */}
        <div className="grid-container" style={{ marginTop: '18px' }}>
          <div
            className="daily-quote-bar"
            style={{
              background: 'rgba(255,255,255,0.78)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              borderRadius: '18px',
              padding: '12px 20px',
              border: '1px solid rgba(46,204,113,0.35)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              maxWidth: '780px',
              margin: '0 auto',
            }}
          >
            <span className="quote-icon" style={{ fontSize: '24px', lineHeight: 1, flexShrink: 0 }}>💡</span>
            <div style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
              <div className="quote-text">&ldquo;{quote.text}&rdquo;</div>
              <div className="quote-author">— {quote.author}</div>
            </div>
            <div
              className="aaj-ka-vichar-badge"
              style={{
                flexShrink: 0,
                background: 'linear-gradient(135deg, #2E7D32, #004D40)',
                color: 'white',
                padding: '4px 10px',
                borderRadius: '18px',
                fontSize: '10px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                boxShadow: '0 2px 6px rgba(46,204,113,0.4)',
              }}
            >
              ✨ Aaj ka Vichar
            </div>
          </div>
        </div>
      </div>

      {/* Gradient bottom border */}
      <div style={{ height: '3px', background: 'linear-gradient(90deg, #00E5FF, #00E676, #00E5FF)', backgroundSize: '200%', animation: 'gradientBG 4s ease infinite' }}></div>
    </header>
  );
}
