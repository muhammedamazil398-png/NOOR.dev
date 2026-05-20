const CACHE_NAME = 'noor-pwa-cache-v1';
const SHELL_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon.svg',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(SHELL_ASSETS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
    ))
  );
  self.clients.claim();
});

const isNavigationRequest = (request) => request.mode === 'navigate' ||
  (request.method === 'GET' && request.headers.get('accept')?.includes('text/html'));
const isSameOrigin = (request) => new URL(request.url).origin === self.location.origin;
const isHadithApi = (request) => request.url.includes('cdn.jsdelivr.net');
const isQuranApi = (request) => request.url.startsWith('https://api.alquran.cloud/v1/');
const isQuranAudio = (request) => request.url.startsWith('https://cdn.islamic.network/quran/audio/');

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  if (isNavigationRequest(event.request)) {
    event.respondWith(
      caches.match('/index.html').then((cached) => cached || fetch(event.request)).catch(() => caches.match('/index.html'))
    );
    return;
  }

  if (isSameOrigin(event.request) || isHadithApi(event.request) || isQuranApi(event.request) || isQuranAudio(event.request)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => cache.match(event.request).then((cachedResponse) => {
        const networkFetch = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => cachedResponse);

        return cachedResponse || networkFetch;
      })))
    );
  }
});
