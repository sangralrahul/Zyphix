/* Zyphix service worker: kept deliberately small so it never slows a visit down.
 *  - Pages: the browser starts downloading the page while this worker boots
 *    (navigation preload), so there is no start-up delay. A copy of each page is
 *    kept only as an offline fallback.
 *  - Everything else (scripts, styles, fonts, images, API) is left to the
 *    browser's own HTTP cache: assets are content-hashed and served with
 *    `immutable`, which is faster than routing them through a worker.
 */
const HTML = 'zx-html-v3';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Drop older caches (including the old per-asset cache).
    for (const key of await caches.keys()) if (key !== HTML) await caches.delete(key);
    if (self.registration.navigationPreload) await self.registration.navigationPreload.enable();
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.mode !== 'navigate' || req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin') || url.pathname.startsWith('/mobile')) return;
  event.respondWith(page(event, req, url));
});

async function page(event, req, url) {
  const key = url.pathname + url.search;
  try {
    const res = (await event.preloadResponse) || (await fetch(req));
    if (res.ok && (res.headers.get('content-type') || '').includes('text/html')) {
      const copy = res.clone();
      event.waitUntil(caches.open(HTML).then((c) => c.put(key, copy)).catch(() => {}));
    }
    return res;
  } catch (err) {
    const cached = await caches.open(HTML).then((c) => c.match(key)).catch(() => null);
    if (cached) return cached;
    throw err;
  }
}
