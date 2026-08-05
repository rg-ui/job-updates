import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Disclaimer',
  description: 'Disclaimer for Jobniti.in - Important information about the aggregated job listings and educational content on our platform.',
  alternates: { canonical: 'https://jobniti.in/disclaimer' },
};

export default function DisclaimerPage() {
  return (
    <div className="grid-container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
      <div className="compliance-page">
        <h1 className="compliance-title">Disclaimer</h1>
        <p className="compliance-updated">Effective Date: August 05, 2026</p>

        <div className="compliance-section">
          <h2>General Disclaimer</h2>
          <p>
            The information provided by <strong>Jobniti.in</strong> (the &quot;Service&quot;) is for general informational purposes only. All information on the Service is provided in good faith; however, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Service.
          </p>
        </div>

        <div className="compliance-section">
          <h2>Aggregated Content</h2>
          <p>
            Jobniti.in aggregates publicly available job listings, exam notifications, admit cards, results, answer keys, syllabi, and admission updates from various government and public sector organization websites. This content is sourced from official portals and public domain sources.
          </p>
          <ul>
            <li>We do not create, alter, or fabricate job postings</li>
            <li>We do not guarantee the accuracy, completeness, or timeliness of aggregated content</li>
            <li>We do not endorse any recruiting organization or its hiring process</li>
            <li>We are not affiliated with any government body, recruiting agency, or examination board</li>
          </ul>
        </div>

        <div className="compliance-section">
          <h2>Professional Advice Disclaimer</h2>
          <p>
            The Service may contain career advice, preparation tips, interview guidelines, and editorial content. This content is for educational and informational purposes only and should not be construed as professional career counseling, legal advice, or employment guarantees.
          </p>
        </div>

        <div className="compliance-section">
          <h2>External Links Disclaimer</h2>
          <p>
            The Service may contain links to external websites that are not provided or maintained by Jobniti.in. We do not guarantee the accuracy, relevance, timeliness, or completeness of any information on these external websites.
          </p>
        </div>

        <div className="compliance-section">
          <h2>Errors and Omissions</h2>
          <p>
            While we have made every attempt to ensure that the information contained on the Service has been obtained from reliable sources, Jobniti.in is not responsible for any errors or omissions, or for the results obtained from the use of this information. All information is provided &quot;as is,&quot; with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information.
          </p>
        </div>

        <div className="compliance-section">
          <h2>Fair Use Disclaimer</h2>
          <p>
            This Service may contain copyrighted material the use of which has not always been specifically authorized by the copyright owner. We believe this constitutes a &quot;fair use&quot; of any such copyrighted material for the purposes of news reporting, criticism, comment, education, and research.
          </p>
        </div>

        <div className="compliance-section">
          <h2>User Responsibility</h2>
          <p>
            Users of Jobniti.in are solely responsible for verifying all job-related information — including eligibility criteria, application deadlines, salary details, and selection procedures — directly from the official website of the respective recruiting organization before applying.
          </p>
        </div>

        <div className="compliance-section">
          <h2>Consent</h2>
          <p>
            By using our Service, you hereby consent to our disclaimer and agree to its terms.
          </p>
        </div>

        <div className="compliance-section">
          <h2>Contact Us</h2>
          <p>If you require any more information or have questions about our disclaimer, please contact us at:</p>
          <ul>
            <li>Email: <a href="mailto:support@jobniti.in">support@jobniti.in</a></li>
            <li>Website: <a href="https://jobniti.in/contact">jobniti.in/contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
