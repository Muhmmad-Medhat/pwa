// [2] - Install service worker
self.addEventListener('install', (event) => {
  console.log(`Service worker installed at ${new Date().toLocaleTimeString()}`);
});

// [3] - Activate service worker
self.addEventListener('activate', (event) => {
  console.log(`Service worker activated at ${new Date().toLocaleTimeString()}`);
});
