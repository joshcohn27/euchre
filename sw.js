// Cache name is generated at build time as 'euchre-v<version>-<unix timestamp>'.
// Never edit this by hand — it is updated automatically on each build.
const CACHE = 'euchre-v1.1-1785706850';
const ASSETS = [
  './',
  './index.html',
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;600;700&display=swap'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    ).then(() => self.clients.claim()).then(() => {
      self.clients.matchAll({type:'window'}).then(clients => {
        clients.forEach(client => client.postMessage({type:'SW_UPDATED'}));
      });
    })
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') {
    e.respondWith(fetch(e.request));
    return;
  }
  const url = new URL(e.request.url);
  const isRootHtml = url.pathname === '/' || url.pathname.endsWith('/') || url.pathname.endsWith('index.html');
  if (isRootHtml) {
    e.respondWith(
      fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match(e.request).then(cached => cached || caches.match('./index.html')))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (!res || res.status !== 200 || res.type === 'opaque') return res;
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
