var cacheName = 'hello_world_1';
var filesToCache = [
    '/',
    '/second.html',
    '/manifest.json',
    '/style/style.css',
    '/script/app.js',
    '/images/ag_insurance.png',
    '/images/favicon.ico'
];

self.addEventListener('install', function(e){
    e.waitUntil(caches.open(cacheName).then(function(cache){
        return cache.addAll(filesToCache);
    })
               );
});

self.addEventListener('activate', function(e) {
    console.log('[ServiceWorker] Activate');
    e.waitUntil(
        caches.keys().then(function(keyList) {
            return Promise.all(keyList.map(function(key) {
                if (key !== cacheName) {
                    console.log('[ServiceWorker] Removing old cache', key);
                    return caches.delete(key);
                }
            }));
        })
    );
    return self.clients.claim();
});

self.addEventListener('fetch', function(e){
    e.respondWith(caches.match(e.request).then(function(response){
        if (response) {
          return response;
        }
        return fetch(event.request);
    })
                  );
});