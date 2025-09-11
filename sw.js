'use strict';

// [1] - Define cache name and assets to cache
const staticCacheName = 'pwa-v1';
const assets = [
  // Root and HTML files
  '/',
  '/index.html',
  '/pages/about.html',
  '/pages/contact.html',
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
      .open(staticCacheName)
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
  console.log(`Service worker activated at ${new Date().toLocaleTimeString()}`);
});

// [4] - Fetch event
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request);
    })
  );
});
