import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Privacy Policy for Jobniti.in - Learn how we collect, use, and protect your personal information. Full AdSense compliance disclosure.',
  alternates: { canonical: 'https://jobniti.in/privacy-policy' },
};

export default function PrivacyPolicyPage() {
  const lastUpdated = 'August 05, 2026';

  return (
    <div className="grid-container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
      <div className="compliance-page">
        <h1 className="compliance-title">Privacy Policy</h1>
        <p className="compliance-updated">Last Updated: {lastUpdated}</p>

        <div className="compliance-section">
          <h2>1. Introduction</h2>
          <p>
            Welcome to <strong>Jobniti.in</strong> (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We operate the website jobniti.in (the &quot;Service&quot;) and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website.
          </p>
          <p>
            By accessing or using our Service, you agree to the collection and use of information in accordance with this policy. If you do not agree with the terms of this policy, please discontinue use of our Service immediately.
          </p>
        </div>

        <div className="compliance-section">
          <h2>2. Information We Collect</h2>
          <h3>2.1 Non-Personal Information</h3>
          <p>We may collect non-personal information about you whenever you interact with our Service, including:</p>
          <ul>
            <li>Browser type and version</li>
            <li>Operating system</li>
            <li>Referring/exit pages and URLs</li>
            <li>Date and time stamps of visits</li>
            <li>Pages viewed and time spent on pages</li>
            <li>Device type and screen resolution</li>
            <li>General geographic location (country/city level only)</li>
          </ul>
          <h3>2.2 Personal Information</h3>
          <p>We may collect personal information only when you voluntarily provide it, such as when you:</p>
          <ul>
            <li>Use our contact form to send us an email or inquiry</li>
            <li>Subscribe to our updates via WhatsApp or Telegram channels</li>
          </ul>
          <p>This may include your name and email address. We do not collect financial data, government IDs, or sensitive personal data.</p>
        </div>

        <div className="compliance-section">
          <h2>3. How We Use Your Information</h2>
          <p>We use the information we collect for the following purposes:</p>
          <ul>
            <li>To operate and maintain the Service</li>
            <li>To improve user experience and website functionality</li>
            <li>To respond to your inquiries and provide customer support</li>
            <li>To monitor and analyze usage patterns and trends</li>
            <li>To detect, prevent, and address technical issues</li>
            <li>To comply with legal obligations</li>
          </ul>
        </div>

        <div className="compliance-section">
          <h2>4. Google AdSense & Third-Party Advertising</h2>
          <p>
            Our Service uses <strong>Google AdSense</strong>, a web advertising service provided by Google Inc. (&quot;Google&quot;). Google AdSense uses &quot;cookies&quot; — text files placed on your device — and web beacons to collect information about your visits to our Service and other websites in order to serve relevant advertisements.
          </p>
          <h3>4.1 Google AdSense Cookies</h3>
          <p>
            Google AdSense uses cookies to serve ads based on your prior visits to our website and other websites. Google&apos;s use of advertising cookies enables it and its partners to serve advertisements based on your visit to our Service and/or other sites on the internet.
          </p>
          <p>You may opt out of personalized advertising by visiting <strong>Google Ads Settings</strong> at: <a href="https://adssettings.google.com/" target="_blank" rel="noopener noreferrer">https://adssettings.google.com/</a>.</p>
          <h3>4.2 Third-Party Vendors</h3>
          <p>Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to our website or other websites. Google&apos;s use of advertising cookies enables it and its partners to serve advertisements based on your visit to this site and/or other sites on the internet.</p>
          <p>You may opt out of some, but not all, third-party vendor cookies by visiting the <strong>Network Advertising Initiative opt-out page</strong>: <a href="http://www.networkadvertising.org/choices/" target="_blank" rel="noopener noreferrer">http://www.networkadvertising.org/choices/</a>.</p>
        </div>

        <div className="compliance-section">
          <h2>5. Cookies Policy</h2>
          <p>Cookies are small text files that are placed on your device when you visit a website. Our Service may use the following types of cookies:</p>
          <ul>
            <li><strong>Essential Cookies:</strong> Necessary for the Service to function properly.</li>
            <li><strong>Analytics Cookies:</strong> Used by Google Analytics to understand how visitors interact with our Service.</li>
            <li><strong>Advertising Cookies:</strong> Used by Google AdSense to serve relevant advertisements.</li>
          </ul>
          <p>You can choose to disable cookies through your browser settings. However, some features of the Service may not function properly if cookies are disabled.</p>
        </div>

        <div className="compliance-section">
          <h2>6. Google Analytics</h2>
          <p>
            We use Google Analytics to analyze the use of our Service. Google Analytics gathers information about website use by means of cookies. The information gathered relating to our website is used to create reports about the use of our website. Google&apos;s privacy policy is available at: <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">https://policies.google.com/privacy</a>.
          </p>
        </div>

        <div className="compliance-section">
          <h2>7. Data Retention</h2>
          <p>
            We retain your information only for as long as necessary to fulfill the purposes for which it was collected, or as required by applicable law. Non-personal data collected through cookies may be retained for analytical purposes in aggregated form.
          </p>
        </div>

        <div className="compliance-section">
          <h2>8. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </div>

        <div className="compliance-section">
          <h2>9. Children&apos;s Privacy</h2>
          <p>
            Our Service is not directed to individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we become aware that we have inadvertently collected personal information from a child under 18, we will take steps to delete such information promptly.
          </p>
        </div>

        <div className="compliance-section">
          <h2>10. Third-Party Links</h2>
          <p>
            Our Service may contain links to external websites operated by third parties. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services. We encourage you to review the privacy policies of every website you visit.
          </p>
        </div>

        <div className="compliance-section">
          <h2>11. Your Rights</h2>
          <p>Depending on your location, you may have the following rights:</p>
          <ul>
            <li>The right to access the personal information we hold about you</li>
            <li>The right to request correction of inaccurate data</li>
            <li>The right to request deletion of your personal data</li>
            <li>The right to opt out of targeted advertising</li>
          </ul>
          <p>To exercise any of these rights, please contact us at: <a href="mailto:support@jobniti.in">support@jobniti.in</a>.</p>
        </div>

        <div className="compliance-section">
          <h2>12. Changes to This Privacy Policy</h2>
          <p>
            We reserve the right to update or modify this Privacy Policy at any time. Changes will be effective immediately upon posting on this page with an updated revision date. We encourage you to review this page periodically for any changes.
          </p>
        </div>

        <div className="compliance-section">
          <h2>13. Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us:</p>
          <ul>
            <li>Email: <a href="mailto:support@jobniti.in">support@jobniti.in</a></li>
            <li>Website: <a href="https://jobniti.in/contact">jobniti.in/contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
