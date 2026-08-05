import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Jobniti.in - India\'s trusted job information aggregator. Our mission, editorial team, verification process, and vision.',
  alternates: { canonical: 'https://jobniti.in/about' },
};

export default function AboutPage() {
  return (
    <div className="grid-container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
      <div className="compliance-page">
        <h1 className="compliance-title">About Jobniti.in</h1>
        <p className="compliance-subtitle">
          India&apos;s trusted platform for government job updates, exam results, and career opportunities.
        </p>

        <div className="compliance-section">
          <h2>Our Mission</h2>
          <p>
            Jobniti.in was founded with a singular mission: to make government job information accessible, timely, and easy to understand for every Indian job seeker. In a landscape where information is scattered across dozens of government portals, we serve as a centralized, reliable hub that brings it all together.
          </p>
          <p>
            We believe that every candidate deserves access to accurate and prompt information about Sarkari Result 2026, Latest Govt Jobs, Admit Cards, Answer Keys, Syllabi, and Admission updates — regardless of their technical literacy or geographic location.
          </p>
        </div>

        <div className="compliance-section">
          <h2>What We Do</h2>
          <ul>
            <li><strong>Real-Time Aggregation:</strong> We continuously monitor official government portals and public sources to bring you the latest job notifications as soon as they are published.</li>
            <li><strong>Structured Presentation:</strong> Raw notifications are organized into clear, categorized sections — Results, Latest Jobs, Admit Cards, Answer Keys, Syllabus, and Admissions — making it easy to find what you need.</li>
            <li><strong>Original Editorial Content:</strong> We publish original career advice, interview preparation guides, skill development tips, and exam strategy content to help candidates prepare effectively.</li>
            <li><strong>State-wise Filtering:</strong> Our platform allows you to filter job opportunities by state and region, so you can focus on opportunities most relevant to you.</li>
          </ul>
        </div>

        <div className="compliance-section">
          <h2>Our Editorial Team</h2>
          <p>
            Jobniti is managed by a dedicated team of content professionals and technology enthusiasts. Our editorial team includes:
          </p>
          <ul>
            <li><strong>Manii Gupta</strong> — Founder &amp; Managing Editor. Responsible for platform strategy, content direction, and editorial oversight.</li>
            <li><strong>Content Writers</strong> — Our team of writers creates original articles on career guidance, exam preparation strategies, and job market insights.</li>
            <li><strong>Technical Team</strong> — Handles platform maintenance, performance optimization, and data accuracy verification.</li>
          </ul>
          <p>
            All editorial content is fact-checked against official government sources before publication. We maintain strict editorial independence from any recruiting organization or political entity.
          </p>
        </div>

        <div className="compliance-section">
          <h2>Content Verification Workflow</h2>
          <p>We follow a rigorous multi-step process to ensure the accuracy of information on our platform:</p>
          <ul>
            <li><strong>Step 1 — Source Identification:</strong> Our monitoring systems track official government portals (SSC, UPSC, RRB, IBPS, state PSCs, etc.) for new notifications.</li>
            <li><strong>Step 2 — Data Extraction:</strong> Key details — post name, eligibility, vacancies, salary, deadlines — are extracted from official notifications.</li>
            <li><strong>Step 3 — Verification:</strong> Extracted data is cross-referenced with the official notification PDF or webpage to confirm accuracy.</li>
            <li><strong>Step 4 — Publication:</strong> Verified information is published in our standardized format with direct links to official sources.</li>
            <li><strong>Step 5 — Updates:</strong> If corrections or updates are issued by the recruiting body, we update our listings accordingly.</li>
          </ul>
        </div>

        <div className="compliance-section">
          <h2>Our Vision</h2>
          <p>
            We envision a future where no Indian job seeker misses an opportunity due to lack of timely information. By combining technology with editorial integrity, we aim to become the most trusted and comprehensive government job information platform in India.
          </p>
        </div>

        <div className="compliance-section">
          <h2>Our Commitment</h2>
          <ul>
            <li>100% free access to all job information — no paywalls, no premium tiers</li>
            <li>Prompt updates as soon as official notifications are released</li>
            <li>Transparent sourcing — every listing links back to the official source</li>
            <li>Original content that adds genuine value to job seekers</li>
            <li>User privacy protection in compliance with applicable laws</li>
          </ul>
        </div>

        <div className="compliance-section">
          <h2>Contact Us</h2>
          <p>We welcome your feedback, suggestions, and collaboration inquiries:</p>
          <ul>
            <li>Email: <a href="mailto:support@jobniti.in">support@jobniti.in</a></li>
            <li>Founder: <a href="mailto:founders@jobniti.in">founders@jobniti.in</a></li>
            <li>Website: <a href="https://jobniti.in/contact">jobniti.in/contact</a></li>
          </ul>
        </div>
      </div>
    </div>
  );
}
