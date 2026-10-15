/**
 * Huzefa Airlines Service Worker
 * Offline Caching & Progressive Web App Engine
 */

const CACHE_NAME = 'huzefa-airlines-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/welcome.html',
  '/login.html',
  '/signup.html',
  '/index.html',
  '/flights.html',
  '/destinations.html',
  '/offers.html',
  '/about.html',
  '/contact.html',
  '/status.html',
  '/dashboard.html',
  '/admin.html',
  '/style.css',
  '/script.js',
  '/auth.js',
  '/theme.js',
  '/manifest.json',
  '/images/logo_gold.png'
];

// 1. Install Event — Pre-cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Pre-caching Huzefa Airlines app shell & static assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).then(() => self.skipWaiting())
  );
});

// 2. Activate Event — Clean up stale caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[SW] Clearing legacy cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch Event — Network First with Offline Cache Fallback
self.addEventListener('fetch', (event) => {
  // Bypass API requests to ensure real-time backend responses
  if (event.request.url.includes('/api/')) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Dynamic caching of successful static resources
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        // Fallback to offline cache
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          // Return generic offline response for navigation
          if (event.request.mode === 'navigate') {
            return caches.match('/welcome.html');
          }
        });
      })
  );
});
