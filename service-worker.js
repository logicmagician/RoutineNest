/**
 * RoutineNest Service Worker
 * Phase 1: Placeholder
 * Phase 6: Will implement offline caching
 */

const CACHE_VERSION = 'routineNest-v1';

// ===== Install Event =====
self.addEventListener('install', (event) => {
  console.log('📦 Service Worker installing...');
  
  // Skip waiting to activate immediately
  self.skipWaiting();
});

// ===== Activate Event =====
self.addEventListener('activate', (event) => {
  console.log('🚀 Service Worker activated');
  
  // Clean up old caches (Phase 6)
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_VERSION) {
            console.log(`🗑️ Deleting old cache: ${cacheName}`);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages
  return self.clients.claim();
});

// ===== Fetch Event =====
self.addEventListener('fetch', (event) => {
  // For Phase 1, just let requests go through normally
  // Phase 6 will implement cache-first strategy
  
  // Don't intercept cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Just use network for now
  event.respondWith(
    fetch(event.request).catch(() => {
      // Fallback for offline (Phase 6)
      console.log('⚠️ Offline - fetch failed:', event.request.url);
      return new Response('Offline', {
        status: 503,
        statusText: 'Service Unavailable',
        headers: new Headers({
          'Content-Type': 'text/plain'
        })
      });
    })
  );
});

// ===== Message Event (for future use) =====
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('✅ Service Worker loaded (Phase 1 placeholder)');