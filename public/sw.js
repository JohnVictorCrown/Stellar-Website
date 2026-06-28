const CACHE = 'stellarium-v2';
const STATIC_ASSETS = [
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
  '/fonts/thin.woff2',
  '/fonts/regular.woff2',
  '/neue_frutiger_world_regular.ttf',
  '/dvorak.opus',
  '/egmont.opus',
  '/john_victor.jpg',
  '/Stellarium.Society.pdf',
  '/The.Stellarium.Book.pdf',
  '/resume.pdf',
  '/404.html',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
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

  const isStatic = /\.(js|css|png|webp|jpg|jpeg|svg|ico|woff2?|ttf|otf|eot|opus|pdf)$/.test(url.pathname);
  const isDataFile = /\.(json)$/.test(url.pathname);
  const isNavigational = request.mode === 'navigate';

  if (isStatic) {
    event.respondWith(cacheFirst(request));
  } else if (isDataFile) {
    event.respondWith(networkFirst(request));
  } else if (isNavigational) {
    event.respondWith(networkFirstWithFallback(request));
  }
});

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  try {
    return await fetchAndCache(request);
  } catch {
    return new Response('', { status: 404 });
  }
}

async function networkFirst(request) {
  try {
    return await fetchAndCache(request);
  } catch {
    const cached = await caches.match(request);
    if (cached) return cached;
    throw new Error('Offline');
  }
}

async function networkFirstWithFallback(request) {
  try {
    return await fetchAndCache(request);
  } catch {
    const cached = await caches.match('/index.html');
    if (cached) return cached;
    const fallback = await caches.match('/404.html');
    if (fallback) return fallback;
    return new Response('Offline', { status: 503 });
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
