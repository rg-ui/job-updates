import React from 'react';

interface SeoContentProps {
  topNotices?: { text: string; href: string }[];
}

export default function SeoContent({ topNotices = [] }: SeoContentProps) {
  let dynamicHeading = "🚀 Jobniti - Your Trusted Source for Latest Govt Jobs";
  if (topNotices.length > 0) {
    const topText = topNotices.slice(0, 2).map(n => n.text).join(' & ');
    dynamicHeading = `🚀 Latest Updates: ${topText} | Sarkari Result on Jobniti`;
  }

  return (
    <div className="seo-content-container" style={{ marginTop: '50px', marginBottom: '30px', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      
      {/* Block 1 */}
      <section className="glass-card">
        <h1 className="glass-title">{dynamicHeading}</h1>
        <div className="glass-body">
          <p>
            Welcome to <strong>Jobniti</strong>, India's most dependable and lightning-fast platform for <strong>Sarkari Result 2026</strong>, <strong>latest Govt Jobs</strong>, <strong>Admit card updates</strong>, Answer Keys, Syllabus, and Admissions updates. 
          </p>
          <p>
            We bring you prompt, accurate, and real-time information sourced directly from official government portals. Whether you're preparing for <strong>SSC, UPSC, Railways, Police, Defence, Banking, Teaching</strong>, or looking for the fastest <strong>Sarkari Naukri</strong> and <strong>Sarkari Result 2026</strong> notifications, we ensure you never miss an important update.
          </p>
          <div style={{ marginTop: '20px' }}>
            <span className="modern-badge">🔥 Govt Job Notifications</span>
            <span className="modern-badge">📈 Live Updates & Alerts</span>
          </div>
          <div className="disclaimer-box" style={{ marginTop: '25px' }}>
            <p style={{ margin: 0 }}><em>Note: Jobniti is an independent aggregator and is not affiliated with any government agency. All information is for public awareness.</em></p>
          </div>
        </div>
      </section>

      {/* Block 2 */}
      <section className="glass-card">
        <h2 className="glass-title">💡 Why Are Government Jobs a Smart Career Choice?</h2>
        <div className="glass-body">
          <p>
            In India, a Sarkari Naukri is more than just a profession; it's a symbol of stability, respect, and long-term security. With unpredictable private sector markets, a government job offers unmatched peace of mind.
          </p>
          <ul>
            <li><strong>Job Security:</strong> Immunity from sudden layoffs and market recessions.</li>
            <li><strong>Dependable Benefits:</strong> Comprehensive health insurance, pensions, and allowances.</li>
            <li><strong>Work-Life Balance:</strong> Fixed working hours and generous leave policies.</li>
            <li><strong>Social Impact:</strong> An opportunity to contribute directly to the nation's growth and public welfare.</li>
          </ul>
        </div>
      </section>

      {/* Block 3 */}
      <section className="glass-card">
        <h2 className="glass-title">🎯 What Kind of Jobs Are Available on Jobniti?</h2>
        <div className="glass-body">
          <p>
            India offers a massive variety of Jobniti openings across multiple fields matching different qualifications and interests:
          </p>
          <div className="job-types-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginTop: '20px' }}>
            <div className="job-type-card">
              <h3>🛡️ Defence & Police</h3>
              <p>Army, Navy, Air Force, State Police</p>
            </div>
            <div className="job-type-card">
              <h3>🏦 Banking & Finance</h3>
              <p>SBI, IBPS, RBI, NABARD</p>
            </div>
            <div className="job-type-card">
              <h3>🚆 Indian Railways</h3>
              <p>NTPC, Group D, ALP</p>
            </div>
            <div className="job-type-card">
              <h3>📚 Teaching & Admin</h3>
              <p>UPSC, TET, KVS, NVS</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
