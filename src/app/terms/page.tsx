import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms & Conditions',
  description: 'Terms and Conditions for using Jobniti.in - Read our terms of service for job seekers and visitors.',
  alternates: { canonical: 'https://jobniti.in/terms' },
};

export default function TermsPage() {
  const lastUpdated = 'August 05, 2026';

  return (
    <div className="grid-container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
      <div className="compliance-page">
        <h1 className="compliance-title">Terms &amp; Conditions</h1>
        <p className="compliance-updated">Last Updated: {lastUpdated}</p>

        <div className="compliance-section">
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using the website <strong>jobniti.in</strong> (the &quot;Service&quot;), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our Service.
          </p>
        </div>

        <div className="compliance-section">
          <h2>2. Description of Service</h2>
          <p>
            Jobniti.in is an independent information aggregation platform that collects and publishes publicly available job postings, government exam results, admit cards, answer keys, syllabi, and admission notifications from various official sources. Our Service is designed to help job seekers stay informed about opportunities across government and public sector organizations in India.
          </p>
          <p><strong>We are not a government entity and do not directly recruit or hire for any position.</strong></p>
        </div>

        <div className="compliance-section">
          <h2>3. User Responsibilities</h2>
          <p>By using our Service, you agree to:</p>
          <ul>
            <li>Use the Service only for lawful purposes and in accordance with these Terms</li>
            <li>Not use the Service to transmit any harmful, fraudulent, or misleading content</li>
            <li>Not attempt to gain unauthorized access to any part of the Service</li>
            <li>Not use automated tools (bots, scrapers) to access or collect content from the Service</li>
            <li>Verify all job information directly with the official recruiting organization before applying</li>
          </ul>
        </div>

        <div className="compliance-section">
          <h2>4. Accuracy of Information</h2>
          <p>
            While we strive to provide accurate and up-to-date information, we make no warranties or representations regarding the completeness, reliability, or accuracy of the content published on our Service. Job listings, exam dates, eligibility criteria, and other details are sourced from official portals and public domain.
          </p>
          <p>
            <strong>Users are strongly advised to verify all details directly from the official website of the recruiting organization.</strong> We are not responsible for any discrepancies between the information displayed on our platform and the official notifications.
          </p>
        </div>

        <div className="compliance-section">
          <h2>5. Intellectual Property</h2>
          <p>
            All content created by Jobniti.in — including but not limited to editorial articles, career advice, SEO content, page layouts, design elements, logos, and branding — is the intellectual property of Jobniti and is protected by applicable copyright laws.
          </p>
          <p>
            Job postings and official notifications are sourced from public domains and government websites. We present them in a curated format for informational convenience. Original editorial content on Jobniti is not to be reproduced without written permission.
          </p>
        </div>

        <div className="compliance-section">
          <h2>6. External Links</h2>
          <p>
            Our Service contains links to external websites, including official government portals and third-party services. We are not responsible for the content, practices, or privacy policies of these external sites. Clicking on external links is at your own discretion.
          </p>
        </div>

        <div className="compliance-section">
          <h2>7. Limitation of Liability</h2>
          <p>
            To the fullest extent permitted by applicable law, Jobniti.in and its operators shall not be held liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:
          </p>
          <ul>
            <li>Your use of or inability to use the Service</li>
            <li>Any inaccuracies or omissions in the content provided</li>
            <li>Actions taken based on the information available on the Service</li>
            <li>Unauthorized access to or alteration of your data</li>
          </ul>
        </div>

        <div className="compliance-section">
          <h2>8. No Warranty</h2>
          <p>
            The Service is provided on an &quot;as is&quot; and &quot;as available&quot; basis without any warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.
          </p>
        </div>

        <div className="compliance-section">
          <h2>9. Changes to Terms</h2>
          <p>
            We reserve the right to modify these Terms and Conditions at any time. Changes will take effect upon posting on this page with an updated revision date. Continued use of the Service after changes constitutes acceptance of the modified Terms.
          </p>
        </div>

        <div className="compliance-section">
          <h2>10. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising under these Terms shall be subject to the exclusive jurisdiction of the courts located in India.
          </p>
        </div>

        <div className="compliance-section">
          <h2>11. Contact Us</h2>
          <p>If you have any questions regarding these Terms, please contact us at:</p>
          <ul>
            <li>Email: <a href="mailto:support@jobniti.in">support@jobniti.in</a></li>
            <li>Website: <a href="https://jobniti.in/contact">jobniti.in/contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
