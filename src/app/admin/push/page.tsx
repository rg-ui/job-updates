import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Push Notification Admin',
  description: 'Send push notifications to Jobniti subscribers',
};

export default function PushAdminPage() {
  return (
    <div className="grid-container" style={{ paddingTop: '30px', paddingBottom: '50px' }}>
      <style dangerouslySetInnerHTML={{__html: `
        .admin-card {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          padding: 32px;
          box-shadow: 0 8px 30px rgba(0,0,0,0.08);
          border: 1px solid #e5e7eb;
        }
        .admin-title {
          font-size: 24px;
          font-weight: 800;
          color: #0A2540;
          margin-bottom: 6px;
        }
        .admin-desc {
          font-size: 14px;
          color: #6b7280;
          margin-bottom: 24px;
        }
        .admin-field {
          margin-bottom: 16px;
        }
        .admin-label {
          display: block;
          font-size: 13px;
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
        }
        .admin-input, .admin-textarea {
          width: 100%;
          padding: 10px 14px;
          border: 1.5px solid #e5e7eb;
          border-radius: 8px;
          font-size: 14px;
          font-family: 'Open Sans', sans-serif;
          outline: none;
          transition: border-color 0.2s;
        }
        .admin-input:focus, .admin-textarea:focus {
          border-color: #059669;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.08);
        }
        .admin-textarea { resize: vertical; min-height: 80px; }
        .admin-btn {
          padding: 12px 28px;
          background: linear-gradient(135deg, #059669, #10b981);
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
        }
        .admin-btn:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(16,185,129,0.3); }
        .admin-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .admin-result {
          margin-top: 16px;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
        }
        .admin-result.success { background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; }
        .admin-result.error { background: #fef2f2; color: #991b1b; border: 1px solid #fecaca; }
        .admin-note {
          margin-top: 20px;
          padding: 12px;
          background: #f9fafb;
          border-radius: 8px;
          font-size: 12px;
          color: #6b7280;
          line-height: 1.6;
        }
      `}} />

      <div className="admin-card">
        <h1 className="admin-title">Push Notification Admin</h1>
        <p className="admin-desc">Send a push notification to all subscribed users.</p>

        <form id="push-form">
          <div className="admin-field">
            <label className="admin-label" htmlFor="admin-secret">Admin Secret</label>
            <input className="admin-input" type="password" id="admin-secret" placeholder="Enter admin secret" required />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="notif-title">Title *</label>
            <input className="admin-input" type="text" id="notif-title" placeholder="e.g. New Railway Vacancy Released" required />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="notif-body">Message *</label>
            <textarea className="admin-textarea" id="notif-body" placeholder="e.g. RRB has released 10,000+ new vacancies. Apply before 30 Aug 2026." required></textarea>
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="notif-url">URL (optional)</label>
            <input className="admin-input" type="text" id="notif-url" placeholder="/latest-jobs" />
          </div>
          <div className="admin-field">
            <label className="admin-label" htmlFor="notif-tag">Tag (optional)</label>
            <input className="admin-input" type="text" id="notif-tag" placeholder="railway-vacancy" />
          </div>
          <button type="submit" className="admin-btn" id="send-btn">Send Notification</button>
          <div id="result"></div>
        </form>

        <div className="admin-note">
          <strong>API Endpoint:</strong> POST /api/push/send<br />
          <strong>Auth:</strong> Bearer token using PUSH_ADMIN_SECRET<br />
          <strong>cURL example:</strong><br />
          <code style={{ fontSize: '11px', wordBreak: 'break-all' }}>
            curl -X POST https://jobniti.in/api/push/send -H &quot;Authorization: Bearer YOUR_SECRET&quot; -H &quot;Content-Type: application/json&quot; -d &apos;{`{"title":"Test","body":"Hello"}`}&apos;
          </code>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{__html: `
        document.getElementById('push-form').addEventListener('submit', async (e) => {
          e.preventDefault();
          const btn = document.getElementById('send-btn');
          const resultEl = document.getElementById('result');
          btn.disabled = true;
          btn.textContent = 'Sending...';
          resultEl.innerHTML = '';

          const secret = document.getElementById('admin-secret').value;
          const payload = {
            title: document.getElementById('notif-title').value,
            body: document.getElementById('notif-body').value,
            url: document.getElementById('notif-url').value || '/',
            tag: document.getElementById('notif-tag').value || 'jobniti-push',
          };

          try {
            const res = await fetch('/api/push/send', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + secret,
              },
              body: JSON.stringify(payload),
            });
            const data = await res.json();
            if (res.ok) {
              resultEl.innerHTML = '<div class="admin-result success">Sent to ' + data.sent + ' subscribers (total: ' + data.total + ', cleaned: ' + data.cleaned + ')</div>';
            } else {
              resultEl.innerHTML = '<div class="admin-result error">Error: ' + (data.error || 'Unknown error') + '</div>';
            }
          } catch (err) {
            resultEl.innerHTML = '<div class="admin-result error">Network error: ' + err.message + '</div>';
          }

          btn.disabled = false;
          btn.textContent = 'Send Notification';
        });
      `}} />
    </div>
  );
}
