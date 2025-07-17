const CACHE_NAME = 'todo-pwa-cache-v1';
const urlsToCache = [
  '/List.html',
  '/styles.css', // Если есть отдельный файл стилей
  '/script.js',  // Если есть отдельный файл скриптов
  '/icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});