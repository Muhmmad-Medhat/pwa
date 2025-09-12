'use strict';

// [1] - Define cache name and assets to cache
const staticCache = 'pwa-static-v1';
const dynamicCache = 'pwa-dynamic-v1';
const assets = [
  // Root and HTML files
  '/',
  '/index.html',
  // CSS files
  '/css/materialize.min.css',
  '/css/styles.css',
  // JS files
  '/js/materialize.min.js',
  '/js/ui.js',
  '/js/app.js',
  // google fonts
  'https://fonts.googleapis.com/icon?family=Material+Icons',
  'https://fonts.gstatic.com/s/materialicons/v144/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2',
  'https://fonts.gstatic.com/s/materialicons/v144/flUhRq6tzZclQEJ-Vdg-IuiaDsNc.woff2',
  // Images
  '/img/dish.png',
  '/img/screenshot-wide.svg',
  '/img/icons/icon-72x72.png',
  '/img/icons/icon-96x96.png',
  '/img/icons/icon-128x128.png',
  '/img/icons/icon-144x144.png',
  '/img/icons/icon-152x152.png',
  '/img/icons/icon-192x192.png',
  '/img/icons/icon-384x384.png',
  '/img/icons/icon-512x512.png',
];

// [2] - Install service worker
self.addEventListener('install', (event) => {
  // console.log(`Service worker installed at ${new Date().toLocaleTimeString()}`);
  event.waitUntil(
    caches
      .open(staticCache)
      .then((cache) => {
        console.log(`Caching assets during install: ${assets.length} items`);
        cache.addAll(assets);
      })
      .catch((error) => {
        console.error('Failed to cache assets during installation:', error);
      })
  );
});

// [3] - Activate service worker
self.addEventListener('activate', (event) => {
  // console.log(`Service worker activated at ${new Date().toLocaleTimeString()}`);
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== staticCache)
          .map((cache) => {
            console.log(`Deleting old cache: ${cache}`);
            return caches.delete(cache);
          })
      );
    })
  );
});

// [4] - Fetch event
self.addEventListener('fetch', (event) => {
  // console.log('fetch event', event);
  event.respondWith(
    (async () => {
      // Only handle GET requests in the service worker caching flow
      if (event.request.method !== 'GET') {
        return fetch(event.request);
      }

      // Return cached response if available
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // Avoid trying to cache unsupported or non-http(s) schemes (e.g., chrome-extension:, data:)
      let urlProtocol = '';
      try {
        urlProtocol = new URL(event.request.url).protocol;
      } catch (err) {
        // If URL parsing fails, just perform a network fetch
        return fetch(event.request);
      }
      if (urlProtocol !== 'http:' && urlProtocol !== 'https:') {
        return fetch(event.request);
      }

      try {
        const networkResponse = await fetch(event.request);

        // Only cache successful responses (status 200)
        if (networkResponse && networkResponse.status === 200) {
          const cache = await caches.open(dynamicCache);
          // Use the Request object rather than the raw URL string
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch (error) {
        // On network failure, return a simple fallback response
        return new Response('Network error', {
          status: 408,
          statusText: 'Network request failed',
        });
      }
    })()
  );
});
