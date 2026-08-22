// network-first service worker
// (cache-first는 예전 게임들에서 "업데이트해도 반영 안 됨" 버그의 원인이었어서
//  처음부터 network-first + no-store로 구성)
const CACHE_NAME = 'stress-smash-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(new Request(event.request.url, { cache: 'no-store' }))
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
