'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: '🏠 Home', href: '/' },
  { label: '💼 Latest Job', href: '/latest-jobs' },
  { label: '📋 Admit Card', href: '/admit-card' },
  { label: '🏆 Result', href: '/result' },
  { label: '🎓 Admission', href: '/admission' },
  { label: '📚 Syllabus', href: '/syllabus' },
  { label: '🗝️ Answer Key', href: '/answer-key' },
  { label: '📞 Contact Us', href: '/contact' },
];

export default function JobUpdatesNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-darkblue" style={{ borderBottom: '3px solid #22c55e', position: 'relative', zIndex: 100 }}>
      <style dangerouslySetInnerHTML={{__html: `
        .nav-link-item {
          display: block;
          color: white;
          padding: 11px 14px;
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
          white-space: nowrap;
          transition: background 0.2s;
        }
        .nav-link-item:hover {
          background-color: #16a34a;
          color: white;
          text-decoration: none;
        }
        .hamburger-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          justify-content: center;
        }
        .hamburger-btn span {
          display: block;
          width: 24px;
          height: 2.5px;
          background: white;
          border-radius: 2px;
          transition: all 0.3s ease;
        }
        .mobile-menu {
          display: none;
          flex-direction: column;
          background: #05055f;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 6px 0;
        }
        .mobile-menu.open {
          display: flex;
        }
        .mobile-menu .nav-link-item {
          padding: 13px 20px;
          font-size: 15px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }
        @media (max-width: 640px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
        @media (min-width: 641px) {
          .nav-desktop { display: flex !important; }
          .nav-hamburger { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}} />

      {/* Desktop Nav */}
      <div className="grid-container nav-desktop" style={{ display: 'none', padding: '0 10px' }}>
        <ul style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', margin: 0 }}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="nav-link-item">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Hamburger Nav */}
      <div
        className="nav-hamburger"
        style={{ display: 'none', alignItems: 'center', justifyContent: 'space-between', padding: '0 16px' }}
      >
        <span style={{ color: 'white', fontWeight: '700', fontSize: '14px', letterSpacing: '0.5px' }}>
          📋 Menu
        </span>
        <button
          className="hamburger-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span style={{ transform: menuOpen ? 'rotate(45deg) translate(5px, 5px)' : 'none' }}></span>
          <span style={{ opacity: menuOpen ? 0 : 1 }}></span>
          <span style={{ transform: menuOpen ? 'rotate(-45deg) translate(5px, -5px)' : 'none' }}></span>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="nav-link-item"
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
