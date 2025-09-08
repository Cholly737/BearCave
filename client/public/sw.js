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

// Import Firebase Scripts for messaging
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js');

// Firebase Configuration for service worker
const firebaseConfig = {
  apiKey: " AIzaSyBh77pf4PQ23dvBDqZ_vFCBicLG2b9jZeE",
  authDomain: " AIzaSyBh77pf4PQ23dvBDqZ_vFCBicLG2b9jZeE.firebaseapp.com", 
  projectId: " AIzaSyBh77pf4PQ23dvBDqZ_vFCBicLG2b9jZeE",
  storageBucket: " AIzaSyBh77pf4PQ23dvBDqZ_vFCBicLG2b9jZeE.appspot.com",
  appId: "1:267658947052:web:da865f310bc2ae876478c9"
};

// Initialize Firebase in service worker
firebase.initializeApp(firebaseConfig);

// Initialize Firebase Messaging
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  
  const notificationTitle = payload.notification?.title || 'Deepdene Bears Cricket Club';
  const notificationOptions = {
    body: payload.notification?.body || 'You have a new update',
    icon: '/attached_assets/logo_1753257070954.jpg',
    badge: '/attached_assets/logo_1753257070954.jpg',
    tag: 'deepdene-bears-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'open',
        title: 'Open App'
      },
      {
        action: 'close',
        title: 'Close'
      }
    ]
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
  console.log('Notification click received.');
  
  event.notification.close();
  
  if (event.action === 'open' || !event.action) {
    // Open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

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