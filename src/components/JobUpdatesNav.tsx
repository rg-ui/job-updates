'use client';
import React, { useState } from 'react';
import Link from 'next/link';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Latest Job', href: '/latest-jobs' },
  { label: 'Admit Card', href: '/admit-card' },
  { label: 'Result', href: '/result' },
  { label: 'Admission', href: '/admission' },
  { label: 'Syllabus', href: '/syllabus' },
  { label: 'Answer Key', href: '/answer-key' },
  { label: 'Career Guides', href: '/guides' },
  { label: 'Contact Us', href: '/contact' },
];

const complianceLinks = [
  { label: 'About', href: '/about' },
  { label: 'Team', href: '/team' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Disclaimer', href: '/disclaimer' },
];

export default function JobUpdatesNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{ background: '#051324', borderBottom: '2px solid rgba(16, 185, 129, 0.6)', position: 'relative', zIndex: 100, boxShadow: '0 4px 14px rgba(0,0,0,0.25)' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .nav-link-item {
          display: block;
          color: #E2E8F0;
          padding: 10px 13px;
          font-weight: 600;
          font-size: 13.5px;
          text-decoration: none;
          white-space: nowrap;
          border-radius: 6px;
          margin: 2px 2px;
          transition: all 0.2s ease;
        }
        .nav-link-item:hover {
          background-color: rgba(16, 185, 129, 0.18);
          color: #34D399;
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
          background: #051324;
          border-top: 1px solid rgba(255,255,255,0.1);
          padding: 6px 0;
        }
        .mobile-menu.open {
          display: flex;
        }
        .mobile-menu .nav-link-item {
          padding: 12px 20px;
          font-size: 14.5px;
          border-radius: 0;
          margin: 0;
          border-bottom: 1px solid rgba(255,255,255,0.06);
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
      <div className="grid-container nav-desktop" style={{ display: 'none', padding: '2px 10px' }}>
        <ul style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', margin: 0, width: '100%' }}>
          {navLinks.map((link) => (
            <li key={link.label}>
              <Link href={link.href} className="nav-link-item">
                {link.label}
              </Link>
            </li>
          ))}
          <li style={{ marginLeft: 'auto' }}>
            <span style={{ display: 'flex', gap: '2px' }}>
              {complianceLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="nav-link-item"
                  style={{ fontSize: '11.5px', padding: '9px 8px', color: '#94A3B8' }}
                >
                  {link.label}
                </Link>
              ))}
            </span>
          </li>
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
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '4px' }}>
          {complianceLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="nav-link-item"
              style={{ fontSize: '12px', opacity: 0.8 }}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
