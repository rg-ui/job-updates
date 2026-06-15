'use client';

import React from 'react';
import Link from 'next/link';

export default function JobUpdatesNav() {
  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Latest Job', href: '/latest-jobs' },
    { label: 'Admit Card', href: '/admit-card' },
    { label: 'Result', href: '/result' },
    { label: 'Admission', href: '/admission' },
    { label: 'Syllabus', href: '/syllabus' },
    { label: 'Answer Key', href: '/answer-key' },
    { label: 'Contact Us', href: '/contact' },
  ];

  return (
    <nav className="bg-darkblue" style={{ borderBottom: '5px solid #000' }}>
      <div className="grid-container" style={{ padding: '0 30px' }}>
        <ul style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
          {navLinks.map((link) => (
            <li key={link.label} style={{ margin: 0 }}>
              <Link
                href={link.href}
                style={{
                  display: 'block',
                  color: 'white',
                  padding: '10px 15px',
                  fontWeight: '600',
                  fontSize: '15px',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#982704';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
