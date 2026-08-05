'use client';

import React, { useState, useEffect } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function NotificationBell() {
  const { isSupported, isSubscribed, permission, isLoading, subscribe, unsubscribe } = usePushNotifications();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDeniedMsg, setShowDeniedMsg] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);

  useEffect(() => {
    if (permission === 'denied') {
      setShowDeniedMsg(true);
    }
  }, [permission]);

  if (!isSupported) return null;

  const handleClick = async () => {
    if (permission === 'denied') {
      setShowDeniedMsg(true);
      setTimeout(() => setShowDeniedMsg(false), 4000);
      return;
    }

    if (isSubscribed) {
      await unsubscribe();
      setJustSubscribed(false);
    } else {
      const success = await subscribe();
      if (success) {
        setJustSubscribed(true);
        setTimeout(() => setJustSubscribed(false), 3000);
      }
    }
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .notif-bell-btn {
          position: relative;
          background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 50%;
          width: 38px;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 18px;
          color: white;
          flex-shrink: 0;
        }
        .notif-bell-btn:hover {
          background: linear-gradient(135deg, rgba(255,255,255,0.25), rgba(255,255,255,0.1));
          transform: scale(1.08);
        }
        .notif-bell-btn.active {
          background: linear-gradient(135deg, #16a34a, #22c55e);
          border-color: #22c55e;
          box-shadow: 0 0 12px rgba(34, 197, 94, 0.4);
        }
        .notif-bell-btn.denied {
          background: linear-gradient(135deg, #dc2626, #ef4444);
          border-color: #ef4444;
          opacity: 0.7;
        }
        .bell-pulse {
          position: absolute;
          top: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          background: #22c55e;
          border-radius: 50%;
          border: 2px solid #05055f;
          animation: bellPulse 2s infinite;
        }
        @keyframes bellPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.4); opacity: 0.6; }
        }
        .notif-tooltip {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          background: white;
          color: #1f2937;
          padding: 14px 16px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          white-space: nowrap;
          z-index: 1000;
          animation: tooltipIn 0.2s ease;
          border: 1px solid #e5e7eb;
        }
        .notif-tooltip::before {
          content: '';
          position: absolute;
          top: -6px;
          right: 14px;
          width: 12px;
          height: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-bottom: none;
          border-right: none;
          transform: rotate(45deg);
        }
        @keyframes tooltipIn { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
        .notif-tooltip-sub { color: #059669; font-weight: 700; }
        .notif-tooltip-unsub { color: #dc2626; font-weight: 700; }
        .notif-tooltip-denied { color: #dc2626; }
        @media (max-width: 640px) {
          .notif-bell-btn { width: 34px; height: 34px; font-size: 16px; }
        }
      `}} />

      <button
        className={`notif-bell-btn ${isSubscribed ? 'active' : ''} ${permission === 'denied' ? 'denied' : ''}`}
        onClick={handleClick}
        onMouseEnter={() => !isLoading && setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={isSubscribed ? 'Unsubscribe from notifications' : 'Subscribe to notifications'}
        disabled={isLoading}
      >
        {isLoading ? '⏳' : isSubscribed ? '🔔' : '🔕'}
        {isSubscribed && <span className="bell-pulse"></span>}
      </button>

      {showTooltip && !showDeniedMsg && (
        <div className="notif-tooltip">
          {isSubscribed ? (
            <span>
              <span className="notif-tooltip-unsub">Subscribed</span> — Click to turn off alerts
            </span>
          ) : (
            <span>
              Get instant job alerts — <span className="notif-tooltip-sub">Click to enable</span>
            </span>
          )}
        </div>
      )}

      {justSubscribed && (
        <div className="notif-tooltip" style={{ color: '#059669', fontWeight: 700 }}>
          ✓ Alerts enabled!
        </div>
      )}

      {showDeniedMsg && (
        <div className="notif-tooltip notif-tooltip-denied">
          Notifications blocked. Enable in browser settings.
        </div>
      )}
    </div>
  );
}
