import React from 'react';

export default function JobUpdatesHeader() {
  return (
    <header>
      <div className="bg-grey">
        <div className="grid-container" style={{ padding: '10px' }}>
          {/* Usually empty or has small links, top bar */}
        </div>
      </div>
      <div className="bg-red" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="grid-container">
          <h1 style={{ fontSize: '40px', fontWeight: 'bold', color: 'white', textTransform: 'uppercase' }}>
            <a href="/" style={{ color: 'white', textDecoration: 'none' }}>Job Updates</a>
          </h1>
          <p style={{ fontSize: '25px', color: 'white', marginTop: '10px', fontWeight: '600' }}>
            JobUpdates.com
          </p>
        </div>
      </div>
    </header>
  );
}
