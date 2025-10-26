// Service Worker for offline support
// Version 1.0.0

const CACHE_NAME = 'navyk-cache-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/logo.svg',
  '/assets/logo.svg',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => {
            console.log('[ServiceWorker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }
  
  // Skip Supabase API requests (always fetch fresh)
  if (request.url.includes('supabase.co')) {
    return;
  }
  
  event.respondWith(
    caches.match(request)
      .then((cachedResponse) => {
        // Return cached response if available
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Otherwise fetch from network
        return fetch(request)
          .then((response) => {
            // Cache successful responses for static assets
            if (
              response.status === 200 &&
              (request.url.endsWith('.js') ||
               request.url.endsWith('.css') ||
               request.url.endsWith('.svg') ||
               request.url.endsWith('.png') ||
               request.url.endsWith('.jpg'))
            ) {
              const responseClone = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseClone);
              });
            }
            
            return response;
          })
          .catch(() => {
            // Return offline page if available
            return caches.match('/index.html');
          });
      })
  );
});

// Message event - for cache updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
