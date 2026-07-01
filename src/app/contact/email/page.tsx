import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Email Directory | Jobniti',
  description: 'Find the official email addresses to contact the Jobniti team or the founder directly.',
};

export default function ContactEmailPage() {
  return (
    <div className="grid-container" style={{ paddingTop: '20px', paddingBottom: '40px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .contact-container {
          max-width: 850px;
          margin: 0 auto;
          padding: 30px 20px;
          background: rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          border-radius: 24px;
          border: 1px solid rgba(46, 204, 113, 0.25);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.05);
        }
        .contact-title {
          font-size: 32px;
          font-weight: 800;
          text-align: center;
          background: linear-gradient(135deg, #0A2540 0%, #004D40 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        .contact-subtitle {
          font-size: 16px;
          color: #4b5563;
          text-align: center;
          font-weight: 500;
          margin-bottom: 40px;
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
          line-height: 1.5;
        }
        .contact-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-bottom: 30px;
        }
        .contact-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 30px 25px;
          text-align: center;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.02);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .contact-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.12);
          border-color: rgba(16, 185, 129, 0.3);
        }
        .contact-icon-wrapper {
          width: 70px;
          height: 70px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          margin-bottom: 20px;
          color: #059669;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
        .contact-card-title {
          font-size: 20px;
          font-weight: 700;
          color: #0A2540;
          margin-bottom: 12px;
        }
        .contact-card-desc {
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
          margin-bottom: 24px;
          flex-grow: 1;
          min-height: 70px;
        }
        .contact-email-btn {
          width: 100%;
          padding: 12px 20px;
          border-radius: 12px;
          font-weight: 700;
          font-size: 15px;
          color: white;
          text-decoration: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.2s ease;
          border: none;
          cursor: pointer;
        }
        .btn-team {
          background: linear-gradient(135deg, #059669, #10b981);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25);
        }
        .btn-team:hover {
          background: linear-gradient(135deg, #047857, #059669);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
        }
        .btn-founder {
          background: linear-gradient(135deg, #0A2540, #1e3a8a);
          box-shadow: 0 4px 12px rgba(10, 37, 64, 0.25);
        }
        .btn-founder:hover {
          background: linear-gradient(135deg, #001f3f, #0A2540);
          box-shadow: 0 6px 18px rgba(10, 37, 64, 0.4);
        }
        .contact-email-address {
          margin-top: 15px;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          background: #f3f4f6;
          padding: 6px 14px;
          border-radius: 8px;
          letter-spacing: 0.5px;
        }
        .back-home-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-top: 20px;
          color: #4b5563;
          text-decoration: none;
          font-weight: 600;
          font-size: 14px;
          transition: color 0.2s ease;
        }
        .back-home-btn:hover {
          color: #059669;
        }
        @media (max-width: 640px) {
          .contact-container {
            padding: 20px 15px;
          }
          .contact-title {
            font-size: 26px;
          }
          .contact-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}} />

      <div className="contact-container">
        <h1 className="contact-title">Contact Directory</h1>
        <p className="contact-subtitle">
          Please choose from the options below to contact either the Jobniti Support Team or the Founder directly.
        </p>

        <div className="contact-grid">
          {/* Card 1: Jobniti Team / Support */}
          <div className="contact-card">
            <div className="contact-icon-wrapper">
              <span>👥</span>
            </div>
            <h2 className="contact-card-title">Jobniti Support Team</h2>
            <p className="contact-card-desc">
              For general inquiries, job update errors, advertising requests, technical assistance, or reporting website bugs.
            </p>
            <a href="mailto:support@jobniti.in" className="contact-email-btn btn-team">
              <span>✉️</span> Email Support Team
            </a>
            <span className="contact-email-address">support@jobniti.in</span>
          </div>

          {/* Card 2: Founder / Owner */}
          <div className="contact-card">
            <div className="contact-icon-wrapper">
              <span>👑</span>
            </div>
            <h2 className="contact-card-title">Jobniti Founder</h2>
            <p className="contact-card-desc">
              For urgent matters, business partnerships, legal notices, or feedback directed specifically to the founder.
            </p>
            <a href="mailto:founders@jobniti.in" className="contact-email-btn btn-founder">
              <span>✉️</span> Email Founder
            </a>
            <span className="contact-email-address">founders@jobniti.in</span>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <Link href="/" className="back-home-btn">
            <span>←</span> Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
