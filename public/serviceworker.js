const cacheName = 'version-1';
const urlsToCache = ['index.html', 'offline.html'];

const self = this;

// install service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches
            .open(cacheName)
            .then(cache => {
                console.log('cache opened');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('cache opening failed: ', err))
    );
});

// listen for requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(() => fetch(event.request).catch(() => caches.match('offline.html')))
    );
});

// activate the service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [];
    cacheWhitelist.push(cacheName);

    event.waitUntil(
        caches.keys().then(cacheNames =>
            Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) return caches.delete(cacheName);
                })
            )
        )
    );
});
