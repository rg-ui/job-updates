'use client';

import React, { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function BellOffIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      <path d="M18.63 13A17.89 17.89 0 0 1 18 8" />
      <path d="M6.26 6.26A5.86 5.86 0 0 0 6 8c0 7-3 9-3 9h14" />
      <path d="M18 8a6 6 0 0 0-9.33-5" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function NotificationBell() {
  const { isSupported, isSubscribed, permission, subscribe, unsubscribe } = usePushNotifications();
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDeniedMsg, setShowDeniedMsg] = useState(false);
  const [justSubscribed, setJustSubscribed] = useState(false);

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

  const getStateClass = () => {
    if (permission === 'denied') return 'notif-bell-btn denied';
    if (isSubscribed) return 'notif-bell-btn active';
    return 'notif-bell-btn';
  };

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .notif-bell-btn {
          position: relative;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          flex-shrink: 0;
          outline: none;
          background: linear-gradient(135deg, #1e293b, #334155);
          color: #e2e8f0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.1);
        }
        .notif-bell-btn:hover {
          transform: scale(1.1);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255,255,255,0.15);
        }
        .notif-bell-btn:active {
          transform: scale(0.95);
        }
        .notif-bell-btn.active {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          box-shadow: 0 4px 15px rgba(16, 185, 129, 0.4), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .notif-bell-btn.active:hover {
          box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5), inset 0 1px 0 rgba(255,255,255,0.2);
        }
        .notif-bell-btn.denied {
          background: linear-gradient(135deg, #991b1b, #dc2626);
          color: white;
          opacity: 0.85;
          box-shadow: 0 4px 15px rgba(220, 38, 38, 0.3);
        }
        .bell-pulse-dot {
          position: absolute;
          top: 6px;
          right: 8px;
          width: 9px;
          height: 9px;
          background: #f59e0b;
          border-radius: 50%;
          border: 2px solid #10b981;
          animation: dotPulse 2s ease-in-out infinite;
        }
        @keyframes dotPulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }
        .notif-ring {
          position: absolute;
          top: -3px;
          right: -3px;
          width: 14px;
          height: 14px;
          background: #ef4444;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          animation: ringBounce 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        .notif-ring svg {
          width: 8px;
          height: 8px;
          color: white;
        }
        @keyframes ringBounce {
          0% { transform: scale(0); }
          100% { transform: scale(1); }
        }
        .notif-tooltip {
          position: absolute;
          bottom: calc(100% + 10px);
          right: 0;
          background: white;
          color: #1f2937;
          padding: 12px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 500;
          box-shadow: 0 10px 40px rgba(0,0,0,0.15);
          white-space: nowrap;
          z-index: 1000;
          animation: tooltipSlide 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid #e5e7eb;
          line-height: 1.5;
        }
        .notif-tooltip::after {
          content: '';
          position: absolute;
          bottom: -6px;
          right: 16px;
          width: 12px;
          height: 12px;
          background: white;
          border: 1px solid #e5e7eb;
          border-top: none;
          border-left: none;
          transform: rotate(45deg);
        }
        @keyframes tooltipSlide {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .notif-tooltip-sub { color: #059669; font-weight: 700; }
        .notif-tooltip-unsub { color: #dc2626; font-weight: 700; }
        .notif-tooltip-denied { color: #dc2626; }
        @media (max-width: 640px) {
          .notif-bell-btn { width: 40px; height: 40px; }
          .notif-bell-btn svg { width: 18px; height: 18px; }
        }
      `}} />

      <button
        className={getStateClass()}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        aria-label={isSubscribed ? 'Unsubscribe from notifications' : 'Subscribe to notifications'}
      >
        {isSubscribed ? (
          <BellIcon />
        ) : permission === 'denied' ? (
          <BellOffIcon />
        ) : (
          <BellIcon />
        )}

        {isSubscribed && <span className="bell-pulse-dot"></span>}
      </button>

      {showTooltip && !showDeniedMsg && !justSubscribed && (
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
        <div className="notif-tooltip" style={{ color: '#059669', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
          <CheckIcon /> Alerts enabled!
        </div>
      )}

      {showDeniedMsg && !justSubscribed && (
        <div className="notif-tooltip notif-tooltip-denied">
          Notifications blocked. Enable in browser settings.
        </div>
      )}
    </div>
  );
}
