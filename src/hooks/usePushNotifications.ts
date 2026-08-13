'use client';

import { useState, useEffect, useCallback } from 'react';

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || '';

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

// Wait for service worker to be ready with timeout
function waitForSW(timeoutMs = 5000): Promise<ServiceWorkerRegistration> {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error('SW timeout')), timeoutMs);

    if (navigator.serviceWorker.controller) {
      // SW already active
      navigator.serviceWorker.ready.then(reg => {
        clearTimeout(timeout);
        resolve(reg);
      }).catch(err => {
        clearTimeout(timeout);
        reject(err);
      });
      return;
    }

    // Wait for SW to become active
    navigator.serviceWorker.ready.then(reg => {
      clearTimeout(timeout);
      resolve(reg);
    }).catch(err => {
      clearTimeout(timeout);
      reject(err);
    });
  });
}

export function usePushNotifications() {
  const [isSupported, setIsSupported] = useState(false);
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    async function initPush() {
      if (typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window) {
        setIsSupported(true);
        setPermission(Notification.permission);
        try {
          const reg = await waitForSW(3000);
          const sub = await reg.pushManager.getSubscription();
          if (sub) {
            setSubscription(sub);
            setIsSubscribed(true);
          }
        } catch {
          // SW not ready
        }
      }
    }

    initPush();
  }, []);

  const subscribe = useCallback(async () => {
    if (!isSupported || !VAPID_PUBLIC_KEY) return false;

    try {
      const permissionResult = await Notification.requestPermission();
      setPermission(permissionResult);

      if (permissionResult !== 'granted') {
        return false;
      }

      // INSTANT UI update — show green bell immediately
      setIsSubscribed(true);

      // Background: do the heavy lifting silently
      (async () => {
        try {
          const reg = await waitForSW(5000);
          let sub = await reg.pushManager.getSubscription();

          if (!sub) {
            sub = await reg.pushManager.subscribe({
              userVisibleOnly: true,
              applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
            });
          }

          setSubscription(sub);

          // Save to server (fire and forget)
          fetch('/api/push/subscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              endpoint: sub.endpoint,
              keys: {
                p256dh: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(sub.getKey('p256dh')!)))),
                auth: btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(sub.getKey('auth')!)))),
              },
            }),
          }).catch(() => {});
        } catch (bgErr) {
          console.error('Background push setup failed:', bgErr);
          // Revert UI if background setup fails
          setIsSubscribed(false);
        }
      })();

      return true;
    } catch (err) {
      console.error('Push subscription failed:', err);
      return false;
    }
  }, [isSupported]);

  const unsubscribe = useCallback(async () => {
    // INSTANT UI update
    setIsSubscribed(false);
    const currentSub = subscription;
    setSubscription(null);

    // Background cleanup
    if (currentSub) {
      (async () => {
        try {
          await currentSub.unsubscribe();
          fetch('/api/push/unsubscribe', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ endpoint: currentSub.endpoint }),
          }).catch(() => {});
        } catch (err) {
          console.error('Background unsubscribe failed:', err);
        }
      })();
    }
  }, [subscription]);

  return {
    isSupported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
  };
}
