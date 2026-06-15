import React from 'react';

export default function AdsSidebar() {
  return (
    <div className="ad-sidebar-container">
      <div style={{ textAlign: 'center' }}>
        <p>Advertisement</p>
        <p style={{ fontSize: '12px' }}>(Sidebar Zone)</p>
        {/* Actual Google AdSense code would be placed here */}
        {/* e.g., <ins className="adsbygoogle" ... /> */}
      </div>
    </div>
  );
}
