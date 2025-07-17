const staticCacheName = 's-app-v1';

const assetUrls = [
    'index.html'
];

self.addEventListener('install', async event => {
    const cache = await caches.open(staticCacheName);
    await cache.addAll(assetUrls);
});

self.addEventListener('activate', event => {
    console.log('[SW]: activate');
});

self.addEventListener('fetch', event => {
    console.log('Fetch', event.request.url);
    event.respondWith(cacheFirst(event.request));
});

async function cacheFirst(request) {
    const cached = await caches.match(request);
    return cached ?? await fetch(request);
}