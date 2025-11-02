// Service Worker for offline support
// Version 1.0.0

// Bump this when changing cached assets so browsers will pick up the new SW
const CACHE_NAME = 'navyk-cache-v2';
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
      .then(async (cache) => {
        console.log('[ServiceWorker] Caching static assets (resilient)');

        // Try to add each asset individually and ignore failures so install won't fail
        const results = await Promise.allSettled(
          STATIC_ASSETS.map(async (asset) => {
            try {
              const resp = await fetch(asset, { cache: 'no-cache' });
              if (!resp.ok) throw new Error(`Failed to fetch ${asset}: ${resp.status}`);
              await cache.put(asset, resp.clone());
              return { asset, ok: true };
            } catch (err) {
              console.warn('[ServiceWorker] Failed to cache', asset, err);
              return { asset, ok: false, error: String(err) };
            }
          })
        );

        const failed = results.filter(r => r.status === 'fulfilled' ? !r.value.ok : true);
        if (failed.length) {
          console.warn('[ServiceWorker] Some assets failed to cache during install', failed.map(f => (f.status === 'fulfilled' ? f.value.asset : f)));
        }

        return;
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
