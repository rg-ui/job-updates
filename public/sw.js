const CACHE_NAME = 'jobniti-v1';
const OFFLINE_URL = '/';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

self.addEventListener('push', (event) => {
  if (!event.data) return;

  let payload;
  try {
    payload = event.data.json();
  } catch {
    payload = {
      title: 'Jobniti Update',
      body: event.data.text(),
      icon: '/jobniti-favicon.png',
      badge: '/jobniti-favicon-48.png',
    };
  }

  const options = {
    body: payload.body || 'New job update available',
    icon: payload.icon || '/jobniti-favicon.png',
    badge: payload.badge || '/jobniti-favicon-48.png',
    vibrate: [100, 50, 100],
    data: {
      url: payload.url || '/',
      dateOfArrival: Date.now(),
    },
    actions: [
      { action: 'open', title: 'View Now' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
    tag: payload.tag || 'jobniti-push',
    renotify: true,
    requireInteraction: false,
  };

  event.waitUntil(
    self.registration.showNotification(payload.title || 'Jobniti', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const urlToOpen = event.notification.data?.url || '/';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(urlToOpen);
          return client.focus();
        }
      }
      return clients.openWindow(urlToOpen);
    })
  );
});
