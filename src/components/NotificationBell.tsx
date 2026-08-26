'use client';

import React, { useState } from 'react';
import { usePushNotifications } from '@/hooks/usePushNotifications';

export default function NotificationBell() {
  const { isSupported, isSubscribed, permission, subscribe, unsubscribe } = usePushNotifications();
  const [justSubscribed, setJustSubscribed] = useState(false);
  const [showDeniedMsg, setShowDeniedMsg] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isSupported) return null;

  const handleClick = async () => {
    if (loading) return;

    if (permission === 'denied') {
      setShowDeniedMsg(true);
      setTimeout(() => setShowDeniedMsg(false), 4000);
      return;
    }

    if (isSubscribed) {
      await unsubscribe();
      setJustSubscribed(false);
    } else {
      setLoading(true);
      const success = await subscribe();
      setLoading(false);
      if (success) {
        setJustSubscribed(true);
        setTimeout(() => setJustSubscribed(false), 4000);
      }
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        .notif-fab {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 18px;
          border: none;
          border-radius: 50px;
          cursor: pointer;
          font-family: inherit;
          font-size: 14px;
          font-weight: 700;
          letter-spacing: 0.3px;
          transition: all 0.25s ease;
          box-shadow: 0 4px 20px rgba(0,0,0,0.25);
          outline: none;
          white-space: nowrap;
          min-width: 140px;
          justify-content: center;
        }
        .notif-fab-default {
          background: linear-gradient(135deg, #ff6b00, #ff9500);
          color: white;
          animation: fabPulseGlow 2.5s ease-in-out infinite;
        }
        .notif-fab-active {
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          box-shadow: 0 4px 18px rgba(16, 185, 129, 0.4);
          animation: none;
        }
        .notif-fab-denied {
          background: linear-gradient(135deg, #6b7280, #9ca3af);
          color: white;
          opacity: 0.9;
          animation: none;
        }
        .notif-fab-loading {
          background: linear-gradient(135deg, #ff6b00, #ff9500);
          color: white;
          opacity: 0.85;
          cursor: wait;
          animation: none;
        }
        .notif-fab:hover:not(.notif-fab-loading) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.3);
        }
        .notif-fab:active:not(.notif-fab-loading) {
          transform: scale(0.97);
        }
        @keyframes fabPulseGlow {
          0%, 100% { box-shadow: 0 4px 20px rgba(255, 107, 0, 0.4); }
          50% { box-shadow: 0 4px 30px rgba(255, 107, 0, 0.7), 0 0 0 6px rgba(255,107,0,0.12); }
        }
        .notif-bell-svg {
          width: 22px;
          height: 22px;
          flex-shrink: 0;
        }
        .notif-fab-active .notif-bell-svg {
          animation: bellShake 3s ease-in-out infinite;
        }
        @keyframes bellShake {
          0%, 85%, 100% { transform: rotate(0deg); }
          87% { transform: rotate(12deg); }
          89% { transform: rotate(-10deg); }
          91% { transform: rotate(8deg); }
          93% { transform: rotate(-6deg); }
          95% { transform: rotate(4deg); }
        }
        .notif-success-msg {
          position: fixed;
          bottom: 90px;
          right: 20px;
          background: #059669;
          color: white;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 700;
          box-shadow: 0 6px 20px rgba(5,150,105,0.4);
          z-index: 10000;
          animation: slideUpFade 0.3s ease;
        }
        .notif-denied-msg {
          position: fixed;
          bottom: 90px;
          right: 20px;
          background: #dc2626;
          color: white;
          padding: 10px 18px;
          border-radius: 12px;
          font-size: 13px;
          font-weight: 600;
          box-shadow: 0 6px 20px rgba(220,38,38,0.4);
          z-index: 10000;
          max-width: 220px;
          text-align: center;
          animation: slideUpFade 0.3s ease;
        }
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .notif-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.4);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          flex-shrink: 0;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @media (max-width: 400px) {
          .notif-fab {
            min-width: 120px;
            font-size: 13px;
            padding: 11px 14px;
          }
          .notif-bell-svg { width: 20px; height: 20px; }
        }
      `}} />

      {/* Main Button */}
      <button
        className={`notif-fab ${
          loading ? 'notif-fab-loading' :
          permission === 'denied' ? 'notif-fab-denied' :
          isSubscribed ? 'notif-fab-active' :
          'notif-fab-default'
        }`}
        onClick={handleClick}
        aria-label={isSubscribed ? 'Notification band karo' : 'Job Alert ON karo'}
      >
        {loading ? (
          <span className="notif-spinner" />
        ) : (
          <svg className="notif-bell-svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
          </svg>
        )}

        <span>
          {loading ? 'ON हो रहा...' :
           permission === 'denied' ? '🚫 Blocked' :
           isSubscribed ? '✅ Alert ON' :
           '🔔 Job Alert'}
        </span>
      </button>

      {/* Success Message */}
      {justSubscribed && (
        <div className="notif-success-msg">
          ✅ Job Alert चालू हो गया!
        </div>
      )}

      {/* Denied Message */}
      {showDeniedMsg && (
        <div className="notif-denied-msg">
          ⚠️ Notification band hai. Browser Settings mein Allow karo.
        </div>
      )}
    </>
  );
}


