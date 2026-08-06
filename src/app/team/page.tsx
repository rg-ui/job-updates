import React from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'Our Team',
  description: 'Meet the team behind Jobniti.in — the people working to make government job information accessible for every Indian job seeker.',
  alternates: { canonical: 'https://jobniti.in/team' },
};

const teamMembers = [
  {
    name: 'Manii Gupta',
    role: 'Founder & Director',
    image: null,
    initials: 'MG',
    color: '#0A2540',
    gradient: 'linear-gradient(135deg, #0A2540, #004D40)',
    bio: 'Visionary leader with a deep understanding of India\'s government job ecosystem. Manii founded Jobniti.in to bridge the gap between scattered government notifications and job seekers who need timely, accurate information.',
    highlights: [
      'Founded Jobniti.in with a mission to democratize government job information',
      'Oversees platform strategy, technology, and editorial direction',
      'Manages partnerships with content contributors and technology vendors',
      'Drives the vision of making Jobniti India\'s most trusted job information platform',
    ],
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Ranjeet Kumar',
    role: 'Head of Growth & Marketing',
    image: '/team/ranjeet.jpg',
    initials: 'RK',
    color: '#059669',
    gradient: 'linear-gradient(135deg, #059669, #10b981)',
    bio: 'An NIT graduate with a sharp eye for digital growth strategies. Ranjeet leads all marketing initiatives at Jobniti, from SEO and social media to community building across WhatsApp and Telegram channels.',
    highlights: [
      'NIT alumnus with expertise in digital marketing and growth hacking',
      'Architected Jobniti\'s social media presence across Instagram, Facebook, WhatsApp & Telegram',
      'Developed SEO strategies that drive organic traffic from across India',
      'Manages community engagement and user acquisition campaigns',
    ],
    socials: { linkedin: '#', twitter: '#' },
  },
  {
    name: 'Manish Kumar Bharati',
    role: 'Head of Operations & Research',
    image: '/team/manish.jpg',
    initials: 'MB',
    color: '#1e3a8a',
    gradient: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
    bio: 'An NIT-trained researcher with exceptional analytical skills. Manish ensures every piece of information on Jobniti is verified, accurate, and presented in the most helpful format for job seekers.',
    highlights: [
      'NIT alumnus with strong research and analytical background',
      'Leads the content verification workflow — cross-referencing all listings with official sources',
      'Oversees data accuracy, source validation, and content quality standards',
      'Manages the day-to-day operations and content publishing pipeline',
    ],
    socials: { linkedin: '#', twitter: '#' },
  },
];

export default function TeamPage() {
  return (
    <div className="grid-container" style={{ paddingTop: '30px', paddingBottom: '60px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .team-hero {
          text-align: center;
          margin-bottom: 50px;
        }
        .team-hero-title {
          font-size: 38px;
          font-weight: 800;
          background: linear-gradient(135deg, #0A2540 0%, #004D40 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        .team-hero-sub {
          font-size: 17px;
          color: #6b7280;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.7;
        }
        .team-grid {
          display: flex;
          flex-direction: column;
          gap: 40px;
          max-width: 900px;
          margin: 0 auto;
        }
        .team-card {
          display: flex;
          gap: 32px;
          align-items: flex-start;
          background: white;
          border-radius: 20px;
          padding: 32px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 4px 20px rgba(0,0,0,0.04);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .team-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0,0,0,0.08);
          border-color: rgba(16, 185, 129, 0.2);
        }
        .team-card:nth-child(even) {
          flex-direction: row-reverse;
        }
        .team-avatar-wrap {
          flex-shrink: 0;
          position: relative;
        }
        .team-avatar {
          width: 160px;
          height: 160px;
          border-radius: 20px;
          object-fit: cover;
          border: 3px solid #e5e7eb;
        }
        .team-avatar-placeholder {
          width: 160px;
          height: 160px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 48px;
          font-weight: 800;
          color: white;
          border: 3px solid #e5e7eb;
        }
        .team-badge {
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          color: white;
          white-space: nowrap;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }
        .team-info {
          flex: 1;
          min-width: 0;
        }
        .team-name {
          font-size: 24px;
          font-weight: 800;
          color: #0A2540;
          margin-bottom: 4px;
        }
        .team-role {
          font-size: 14px;
          font-weight: 600;
          margin-bottom: 14px;
          display: inline-block;
          padding: 3px 12px;
          border-radius: 20px;
          background: rgba(16, 185, 129, 0.08);
          color: #059669;
        }
        .team-bio {
          font-size: 15px;
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 16px;
        }
        .team-highlights {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        .team-highlights li {
          position: relative;
          padding-left: 20px;
          margin-bottom: 8px;
          font-size: 13.5px;
          color: #6b7280;
          line-height: 1.6;
        }
        .team-highlights li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 7px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #10b981, #059669);
        }
        .team-divider {
          width: 60px;
          height: 3px;
          background: linear-gradient(135deg, #10b981, #059669);
          border-radius: 2px;
          margin: 50px auto 30px;
        }
        .team-cta {
          text-align: center;
          margin-top: 20px;
        }
        .team-cta-title {
          font-size: 22px;
          font-weight: 700;
          color: #0A2540;
          margin-bottom: 10px;
        }
        .team-cta-text {
          font-size: 15px;
          color: #6b7280;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .team-cta-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 700;
          text-decoration: none;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }
        .team-cta-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(16, 185, 129, 0.4);
          color: white;
        }
        @media (max-width: 768px) {
          .team-card,
          .team-card:nth-child(even) {
            flex-direction: column;
            align-items: center;
            text-align: center;
            padding: 28px 20px;
          }
          .team-avatar,
          .team-avatar-placeholder {
            width: 140px;
            height: 140px;
          }
          .team-hero-title {
            font-size: 28px;
          }
          .team-highlights li {
            text-align: left;
          }
          .team-name {
            font-size: 20px;
          }
        }
        @media (max-width: 480px) {
          .team-card {
            padding: 24px 16px;
          }
          .team-avatar,
          .team-avatar-placeholder {
            width: 120px;
            height: 120px;
            font-size: 40px;
          }
        }
      `}} />

      <div className="team-hero">
        <h1 className="team-hero-title">Meet the Team Behind Jobniti</h1>
        <p className="team-hero-sub">
          A passionate team of NIT graduates and industry professionals working to make government job information accessible for every Indian.
        </p>
      </div>

      <div className="team-grid">
        {teamMembers.map((member, index) => (
          <div className="team-card" key={member.name}>
            <div className="team-avatar-wrap">
              {member.image ? (
                <Image
                  src={member.image}
                  alt={member.name}
                  width={160}
                  height={160}
                  className="team-avatar"
                  priority={index === 0}
                />
              ) : (
                <div className="team-avatar-placeholder" style={{ background: member.gradient }}>
                  {member.initials}
                </div>
              )}
              <div className="team-badge" style={{ background: member.gradient }}>
                {member.role.split(' ')[0] === 'Founder' ? 'Founder' : 'NITian'}
              </div>
            </div>

            <div className="team-info">
              <h2 className="team-name">{member.name}</h2>
              <span className="team-role">{member.role}</span>
              <p className="team-bio">{member.bio}</p>
              <ul className="team-highlights">
                {member.highlights.map((h, i) => (
                  <li key={i}>{h}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="team-divider"></div>

      <div className="team-cta">
        <h2 className="team-cta-title">Want to Join Our Mission?</h2>
        <p className="team-cta-text">
          We&apos;re always looking for passionate people who want to help job seekers across India. Reach out to us.
        </p>
        <a href="/contact" className="team-cta-btn">
          Get in Touch →
        </a>
      </div>
    </div>
  );
}
