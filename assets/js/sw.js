const CACHE_NAME = 'meet-tawananyasha-v1';
const ASSETS_TO_CACHE = [
  '/', // Cache the root page
  '/index.html', // Main HTML file
  '/assets/css/fonts.css',
  '/assets/css/material-icons.woff2', // Your CSS file (replace with actual path)
  '/assets/css/merriweather-sans.woff2', // Your JavaScript file (replace with actual path)
  '/assets/manifest.json', // Favicon
  '/assets/css/style.css', // Example logo image
  '/assets/js/main.js', // Example image
  'https://unpkg.com/peerjs@1.5.4/dist/peerjs.min.js', // Peer.js CDN (optional)
];

// Install Event: Cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching all assets');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Activate Event: Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Fetch Event: Serve cached content
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      // If not in cache, fetch from network
      return fetch(event.request).catch(() => {
        console.error('[Service Worker] Failed to fetch:', event.request.url);
      });
    })
  );
});
