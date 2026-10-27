/* Zyphix service worker — makes return visits open instantly.
 *  - Pages (HTML): network first so every visit gets the latest deploy; the saved copy is
 *    used only when the network is slow (>2.5 s) or offline.
 *  - /assets/* and /fonts/*: content-hashed / versioned files, cache-first.
 *  - API, media, admin and the /mobile preview are never touched (always network).
 */
const HTML = 'zx-html-v2';
const ASSETS = 'zx-assets-v1';
const KEEP = [HTML, ASSETS];
const MAX_ASSETS = 400;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) if (!KEEP.includes(key)) await caches.delete(key);
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  const p = url.pathname;
  if (p.startsWith('/api/') || p.startsWith('/admin') || p.startsWith('/mobile') || p.startsWith('/media/') || p.startsWith('/img/') || p === '/sw.js') return;

  if (req.mode === 'navigate') {
    event.respondWith(page(event, req));
    return;
  }
  if (p.startsWith('/assets/') || p.startsWith('/fonts/')) {
    event.respondWith(cacheFirst(req));
  }
});

async function page(event, req) {
  const cache = await caches.open(HTML);
  const key = new Request(new URL(req.url).pathname + new URL(req.url).search);
  const network = fetch(req).then(async (res) => {
    if (res.ok && (res.headers.get('content-type') || '').includes('text/html')) await cache.put(key, res.clone());
    return res;
  });
  const slow = new Promise((resolve) => setTimeout(resolve, 2500, null));
  try {
    const first = await Promise.race([network, slow]);
    if (first) return first;
  } catch { /* offline: fall back to the saved copy */ }
  const cached = await cache.match(key);
  if (cached) { event.waitUntil(network.catch(() => {})); return cached; }
  return network;
}

async function cacheFirst(req) {
  const cache = await caches.open(ASSETS);
  const hit = await cache.match(req);
  if (hit) return hit;
  const res = await fetch(req);
  // Never cache the SPA fallback (index.html) under an asset URL.
  if (res.ok && !(res.headers.get('content-type') || '').includes('text/html')) {
    await cache.put(req, res.clone());
    trim(cache);
  }
  return res;
}

async function trim(cache) {
  const keys = await cache.keys();
  if (keys.length <= MAX_ASSETS) return;
  for (const k of keys.slice(0, keys.length - MAX_ASSETS)) await cache.delete(k);
}
