import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with the Jobniti.in team. Contact our support team or founder for inquiries, feedback, or technical assistance.',
  alternates: { canonical: 'https://jobniti.in/contact' },
};

export default function ContactPage() {
  return (
    <div className="grid-container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .contact-page-container {
          max-width: 900px;
          margin: 0 auto;
        }
        .contact-page-title {
          font-size: 32px;
          font-weight: 800;
          text-align: center;
          background: linear-gradient(135deg, #0A2540 0%, #004D40 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }
        .contact-page-subtitle {
          font-size: 16px;
          color: #4b5563;
          text-align: center;
          font-weight: 500;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        .contact-methods-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 24px;
          margin-bottom: 40px;
        }
        .contact-method-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 18px;
          padding: 28px 22px;
          text-align: center;
          transition: all 0.3s ease;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
        }
        .contact-method-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 30px rgba(16, 185, 129, 0.1);
          border-color: rgba(16, 185, 129, 0.25);
        }
        .contact-method-icon {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.08));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 28px;
          margin: 0 auto 16px;
          border: 1px solid rgba(16, 185, 129, 0.15);
        }
        .contact-method-label {
          font-size: 13px;
          color: #6b7280;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 600;
          margin-bottom: 8px;
        }
        .contact-method-value {
          font-size: 16px;
          font-weight: 700;
          color: #0A2540;
          margin-bottom: 10px;
        }
        .contact-method-desc {
          font-size: 13px;
          color: #6b7280;
          line-height: 1.5;
        }
        .contact-form-card {
          background: rgba(255, 255, 255, 0.9);
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 8px 30px rgba(0, 0, 0, 0.04);
        }
        .contact-form-title {
          font-size: 22px;
          font-weight: 700;
          color: #0A2540;
          margin-bottom: 6px;
        }
        .contact-form-desc {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 28px;
          line-height: 1.5;
        }
        .form-group {
          margin-bottom: 20px;
        }
        .form-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 6px;
        }
        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 12px 16px;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          font-size: 15px;
          font-family: 'Open Sans', sans-serif;
          color: #1f2937;
          background: #fafafa;
          transition: border-color 0.2s, box-shadow 0.2s;
          outline: none;
        }
        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1);
          background: #fff;
        }
        .form-textarea {
          resize: vertical;
          min-height: 130px;
        }
        .form-submit-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 14px 32px;
          background: linear-gradient(135deg, #059669, #10b981);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }
        .form-submit-btn:hover {
          background: linear-gradient(135deg, #047857, #059669);
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.45);
          transform: translateY(-2px);
        }
        .response-note {
          background: rgba(16, 185, 129, 0.06);
          border-left: 4px solid #10b981;
          padding: 16px 20px;
          border-radius: 0 12px 12px 0;
          margin-top: 28px;
        }
        .response-note-title {
          font-size: 14px;
          font-weight: 700;
          color: #0A2540;
          margin-bottom: 6px;
        }
        .response-note-text {
          font-size: 13px;
          color: #4b5563;
          line-height: 1.6;
          margin: 0;
        }
        .social-links-row {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
          margin-top: 30px;
        }
        .social-link-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 10px 20px;
          border-radius: 30px;
          font-size: 14px;
          font-weight: 600;
          text-decoration: none;
          transition: all 0.2s;
        }
        .social-link-pill.whatsapp {
          background: rgba(37, 211, 102, 0.1);
          color: #16a34a;
          border: 1.5px solid rgba(37, 211, 102, 0.3);
        }
        .social-link-pill.whatsapp:hover {
          background: rgba(37, 211, 102, 0.2);
          transform: translateY(-2px);
        }
        .social-link-pill.telegram {
          background: rgba(0, 136, 204, 0.1);
          color: #0284c7;
          border: 1.5px solid rgba(0, 136, 204, 0.3);
        }
        .social-link-pill.telegram:hover {
          background: rgba(0, 136, 204, 0.2);
          transform: translateY(-2px);
        }
        .social-link-pill.instagram {
          background: rgba(225, 48, 108, 0.1);
          color: #e1306c;
          border: 1.5px solid rgba(225, 48, 108, 0.3);
        }
        .social-link-pill.instagram:hover {
          background: rgba(225, 48, 108, 0.2);
          transform: translateY(-2px);
        }
        @media (max-width: 640px) {
          .contact-page-title { font-size: 26px; }
          .contact-form-card { padding: 24px 18px; }
          .contact-methods-grid { grid-template-columns: 1fr; }
        }
      `}} />

      <div className="contact-page-container">
        <h1 className="contact-page-title">Contact Us</h1>
        <p className="contact-page-subtitle">
          Have a question, suggestion, or need help? We&apos;re here to assist you.
        </p>

        <div className="contact-methods-grid">
          <div className="contact-method-card">
            <div className="contact-method-icon">✉️</div>
            <p className="contact-method-label">Support Email</p>
            <p className="contact-method-value">support@jobniti.in</p>
            <p className="contact-method-desc">General inquiries, bug reports, and technical support</p>
          </div>
          <div className="contact-method-card">
            <div className="contact-method-icon">👑</div>
            <p className="contact-method-label">Founder Email</p>
            <p className="contact-method-value">founders@jobniti.in</p>
            <p className="contact-method-desc">Business partnerships, legal notices, and urgent matters</p>
          </div>
          <div className="contact-method-card">
            <div className="contact-method-icon">📱</div>
            <p className="contact-method-label">Phone Support</p>
            <p className="contact-method-value">9135293069</p>
            <p className="contact-method-desc">Available Mon-Sat, 10:00 AM - 6:00 PM IST</p>
          </div>
        </div>

        <div className="contact-form-card">
          <h2 className="contact-form-title">Send Us a Message</h2>
          <p className="contact-form-desc">
            Fill out the form below and we&apos;ll get back to you as soon as possible.
          </p>

          <form action="mailto:support@jobniti.in" method="post" encType="text/plain">
            <div className="form-group">
              <label className="form-label" htmlFor="contact-name">Your Name *</label>
              <input className="form-input" type="text" id="contact-name" name="name" placeholder="Enter your full name" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-email">Your Email *</label>
              <input className="form-input" type="email" id="contact-email" name="email" placeholder="Enter your email address" required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-subject">Subject *</label>
              <select className="form-select" id="contact-subject" name="subject" required>
                <option value="">Select a subject</option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Bug Report">Bug Report</option>
                <option value="Content Correction">Content Correction</option>
                <option value="Business Inquiry">Business Inquiry</option>
                <option value="Feedback">Feedback</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="contact-message">Message *</label>
              <textarea className="form-textarea" id="contact-message" name="message" placeholder="Type your message here..." required></textarea>
            </div>
            <button type="submit" className="form-submit-btn">Send Message →</button>
          </form>

          <div className="response-note">
            <p className="response-note-title">⏱️ Response Time</p>
            <p className="response-note-text">
              We typically respond within <strong>24-48 business hours</strong>. For urgent matters related to job application deadlines, please call us directly or reach out via our WhatsApp channel.
            </p>
          </div>
        </div>

        <div className="social-links-row">
          <a href="https://chat.whatsapp.com/BD8RX29KRA18PVvPoxJSBM" target="_blank" rel="noopener noreferrer" className="social-link-pill whatsapp">WhatsApp Group</a>
          <a href="https://t.me/job1updat8" target="_blank" rel="noopener noreferrer" className="social-link-pill telegram">Telegram Channel</a>
          <a href="https://www.instagram.com/jobniti.in" target="_blank" rel="noopener noreferrer" className="social-link-pill instagram">Instagram</a>
        </div>
      </div>
    </div>
  );
}
