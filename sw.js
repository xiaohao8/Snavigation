/* Snavigation service worker
 * - Pre-caches the app shell (index.html + manifest + PWA icons + favicon) on install,
 *   so the PWA launches offline with the correct icons.
 * - Runtime: cache-first for same-origin static assets (any new file is cached on
 *   first request), network-first with index.html fallback for navigations.
 * - Cross-origin requests pass straight through.
 * Bump CACHE when shipping a breaking change so old caches are evicted.
 */
const CACHE = 'snavigation-v2';
const SHELL = [
  './',
  './index.html',
  './manifest.webmanifest',
  './favicon.ico',
  './img/icon/apple-touch-icon.png',
  './img/icon/pwa-192.png',
  './img/icon/pwa-512.png',
  './img/icon/pwa-maskable-192.png',
  './img/icon/pwa-maskable-512.png',
  './img/icon/favicon_144.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      // addAll is atomic: if any URL fails the whole install fails; that's the
      // right behavior for a shell. Use { cache: 'reload' } to bypass HTTP cache
      // so we always get the fresh bytes for the shell.
      cache.addAll(SHELL.map((u) => new Request(u, { cache: 'reload' })))
    ).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);
  // Only handle same-origin; let cross-origin (CDN, analytics, favicon services) go to network.
  if (url.origin !== self.location.origin) return;

  // Navigations (HTML page loads): network-first, fall back to cached shell.
  if (req.mode === 'navigate') {
    event.respondWith(
      fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match('./index.html').then((r) => r || Response.error()))
    );
    return;
  }

  // Same-origin static assets: cache-first, fall back to network and cache on success.
  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req).then((res) => {
        // Only cache successful, basic/cors responses (avoid opaque + errors).
        if (res && res.status === 200 && (res.type === 'basic' || res.type === 'cors')) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy)).catch(() => {});
        }
        return res;
      }).catch(() => cached || Response.error());
    })
  );
});
