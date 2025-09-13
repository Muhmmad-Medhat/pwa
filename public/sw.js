'use strict';

// [1] - Define cache name and assets to cache
const staticCache = 'pwa-static-v1';
const dynamicCache = 'pwa-dynamic-v1';
const assets = [
  // Root and HTML files
  '/',
  '/index.html',
  '/pages/fallback.html',
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

/** CACHE LIMITING FUNCTION
 * The function `limitCacheSize` deletes the oldest cached items in a specified cache if the number of
 * items exceeds a given limit.
 * @param cacheName - The `cacheName` parameter is a string that represents the name of the cache where
 * items are stored.
 * @param maxItems - The `maxItems` parameter specifies the maximum number of items allowed in the
 * cache before the oldest items are deleted to make room for new ones.
 */
const limitCacheSize = (cacheName, maxItems) => {
  caches.open(cacheName).then((cache) => {
    cache.keys().then((keys) => {
      if (keys.length > maxItems) {
        // Delete the oldest cached items
        cache.delete(keys[0]).then(() => {
          limitCacheSize(cacheName, maxItems);
        });
      }
    });
  });
};

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
          .filter((cache) => cache !== staticCache && cache !== dynamicCache)
          .map((cache) => {
            console.log(`Deleting old cache: ${cache}`);
            return caches.delete(cache);
          })
      );
    })
  );
});

// [4] - Fetch event
self.addEventListener('fetch', (evt) => {
  if (evt.request.url.indexOf('firestore.googleapis.com') === -1) {
    evt.respondWith(
      caches
        .match(evt.request)
        .then((cacheRes) => {
          return (
            cacheRes ||
            fetch(evt.request).then((fetchRes) => {
              return caches.open(dynamicCache).then((cache) => {
                cache.put(evt.request.url, fetchRes.clone());
                // check cached items size
                limitCacheSize(dynamicCache, 15);
                return fetchRes;
              });
            })
          );
        })
        .catch(() => {
          if (evt.request.url.indexOf('.html') > -1) {
            return caches.match('/pages/fallback.html');
          }
        })
    );
  }
});
