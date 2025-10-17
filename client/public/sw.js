const CACHE_NAME = 'deepdene-bears-v2-dev';
const urlsToCache = [
  '/',
  '/home',
  '/fixtures',
  '/events', 
  '/feed',
  '/links',
  '/settings',
  '/attached_assets/generated_images/Bears_Cricket_App_Icon_a41a97dd.png',
  '/attached_assets/logo_1753257070954.jpg',
  '/manifest.json'
];

// Install service worker and cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
      .catch(err => {
        console.log('Cache failed:', err);
      })
  );
});

// Network first strategy for development - always try network first
self.addEventListener('fetch', event => {
  // Skip caching for development to allow live updates
  if (event.request.url.includes('localhost') || event.request.url.includes('.replit.dev')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Always return fresh network response in development
          return response;
        })
        .catch(() => {
          // Only use cache as fallback for offline scenarios
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // Return offline fallback for navigation requests
              if (event.request.destination === 'document') {
                return caches.match('/');
              }
            });
        })
    );
    return;
  }
  
  // For production, use normal cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        }).catch(() => {
          if (event.request.destination === 'document') {
            return caches.match('/');
          }
        });
      })
  );
});

// Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});