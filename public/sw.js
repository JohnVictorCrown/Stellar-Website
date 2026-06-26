const CACHE = 'stellarium-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/main.js',
  '/index.css',
  '/icon.png',
  '/manifest.webmanifest',
  '/icons/icon-48.png',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-128.png',
  '/icons/icon-192.png',
  '/icons/icon-256.png',
  '/icons/icon-384.png',
  '/icons/icon-512.png',
  '/neue_frutiger_world_regular.ttf',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (request.method !== 'GET') return;

  if (url.pathname === '/ws') return;

  const isDataFile = /\.(json)$/.test(url.pathname);
  const isNavigational = request.mode === 'navigate';
  const isStatic = /\.(js|css|png|webp|jpg|jpeg|svg|ico|woff2?|ttf|otf|eot)$/.test(url.pathname);

  if (isStatic) {
    event.respondWith(cacheFirst(request));
  } else if (isDataFile) {
    event.respondWith(networkFirst(request));
  } else if (isNavigational) {
    event.respondWith(networkFirst(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  return cached || fetchAndCache(request);
}

async function networkFirst(request) {
  try {
    return await fetchAndCache(request);
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    if (request.mode === 'navigate') {
      const index = await caches.match('/index.html');
      if (index) return index;
    }
    throw new Error('Offline');
  }
}

async function fetchAndCache(request) {
  const response = await fetch(request);
  if (response.ok) {
    const clone = response.clone();
    caches.open(CACHE).then((cache) => cache.put(request, clone));
  }
  return response;
}
