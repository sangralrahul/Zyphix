/// <reference types="@cloudflare/workers-types" />
import { PhotonImage, resize, SamplingFilter } from '@cf-wasm/photon';
/**
 * Zyphix Now – Cloudflare Worker
 *
 *   GET  /api/categories                       list grocery categories
 *   GET  /api/products?category=&q=&limit=&offset=
 *   GET  /api/products/:id                     single product
 *   GET  /api/products/:id/related             same-category products
 *   GET  /img/:key                             product image from R2 (cached at edge)
 *   GET  /admin/images/status                  counts by image_status      (Bearer ADMIN_TOKEN)
 *   POST /admin/images/sync?limit=20           fill images for `pending` products (Bearer ADMIN_TOKEN)
 *   POST /admin/images/reset?status=failed     put failed/not_found back to pending (Bearer ADMIN_TOKEN)
 *
 *   Accounts (cookie `zsid`, shared across *.zyphix.in; see "accounts" section at the bottom)
 *   POST /api/auth/verify                      {email, otp, token, name?} → session cookie + {user}
 *   POST /api/auth/logout
 *   GET  /api/me · PATCH /api/me               {name?, phone?}
 *   GET|POST /api/me/addresses · PATCH|DELETE /api/me/addresses/:id · POST /api/me/addresses/:id/default
 *   POST /api/orders (guest or user) · GET /api/me/orders · GET /api/orders/:id
 *
 * Everything else falls through to the static Vite build (SPA).
 */

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  AI: Ai;
  ASSETS: Fetcher;
  ADMIN_TOKEN: string;
  PUBLIC_IMAGE_BASE?: string; // optional, e.g. https://img.zyphix.in  (defaults to same-origin /img)
  SUPABASE_URL?: string;      // legacy, unused
  SUPABASE_KEY?: string;
  BREVO_API_KEY?: string;     // transactional email (sign-in codes) — `wrangler secret put BREVO_API_KEY`
  MAIL_FROM?: string;         // sender address verified in Brevo (default noreply@zyphix.in)
}

type ProductRow = {
  id: string; name: string; brand: string; price: number; orig_price: number | null;
  category: string; weight: string | null; image_url: string | null; image_source: string | null;
  image_status: string; image_kind: string; barcode: string | null; tag: string | null;
  store_name: string | null; distance: string | null; in_stock: number;
};

const JSON_HEADERS = { 'content-type': 'application/json; charset=utf-8', 'access-control-allow-origin': '*' };
const json = (data: unknown, status = 200, extra: Record<string, string> = {}) =>
  new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...extra } });

const placeholder = (name: string) =>
  `https://placehold.co/400x400/E8F7EE/0DA366/png?text=${encodeURIComponent(name.split(' ').slice(0, 3).join(' '))}&font=poppins`;

/** Convert a D1 row to the shape the React app already uses (mockData.ts). */
function toClient(r: ProductRow, origin: string, env: Env) {
  let image = r.image_url ?? placeholder(r.name);
  if (image.startsWith('/img/')) image = (env.PUBLIC_IMAGE_BASE ?? origin) + image;
  return {
    id: r.id, name: r.name, brand: r.brand, price: r.price, origPrice: r.orig_price,
    category: r.category, weight: r.weight ?? '', image, tag: r.tag,
    storeName: r.store_name ?? '', distance: r.distance ?? '',
    inStock: r.in_stock === 1, imageStatus: r.image_status,
  };
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const { pathname } = url;

    // Account routes answer with credentialed CORS (cookie shared across *.zyphix.in).
    if (isAccountPath(pathname)) {
      const cors = accountCors(request);
      if (request.method === 'OPTIONS') {
        return new Response(null, { status: 204, headers: { ...cors, 'access-control-allow-headers': 'content-type, authorization', 'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS', 'access-control-max-age': '86400' } });
      }
      try {
        const res = await handleAccount(request, env, url);
        const h = new Headers(res.headers);
        for (const [k, v] of Object.entries(cors)) h.set(k, v);
        return new Response(res.body, { status: res.status, headers: h });
      } catch (err) {
        console.error(err);
        return json({ error: (err as Error).message }, 500, cors);
      }
    }

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: { ...JSON_HEADERS, 'access-control-allow-headers': 'authorization, content-type', 'access-control-allow-methods': 'GET,POST,OPTIONS' } });
    }

    try {
      if (pathname.startsWith('/api/')) return await handleApi(request, env, url);
      if (pathname.startsWith('/img/')) return await handleImage(request, env, ctx, pathname.slice('/img/'.length));
      if (pathname.startsWith('/media/')) return await handleMedia(request, env, ctx, url);
      // The admin page itself (SPA) vs the admin API: only API paths go to handleAdmin.
      if (pathname === '/admin/' || pathname === '/admin/index.html') return env.ASSETS.fetch(new Request(new URL('/', url).toString(), request));
      if (pathname.startsWith('/admin/')) return await handleAdmin(request, env, url);
    } catch (err) {
      console.error(err);
      return json({ error: (err as Error).message }, 500);
    }

    // zyphix.in/mobile — browser preview of the Android/iOS app (Expo web build in public/mobile).
    if (pathname === '/mobile' || pathname.startsWith('/mobile/')) return await serveMobileApp(request, env, url);

    return env.ASSETS.fetch(request);
  },

  /**
   * Cron (see wrangler.toml [triggers]): fills product images on its own.
   * Each run resolves a small batch of packaged goods from Open Food Facts, generates
   * produce photos with Workers AI, and creates 480px WebP thumbnails — no laptop needed.
   */
  async scheduled(_event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil((async () => {
      try {
        const packaged = await syncImages(env, 5, 'packaged');
        const produce = await syncImages(env, 10, 'produce');
        const thumbs = await makeMissingThumbs(env, 40);
        console.log(JSON.stringify({ cron: 'images', packaged: packaged.processed, produce: produce.processed, remaining: produce.remaining, thumbs }));
      } catch (err) { console.error('cron images failed', (err as Error).message); }
    })());
  },
} satisfies ExportedHandler<Env>;

/** Files under /mobile/ are served as-is; every other /mobile path gets the app's index.html (client-side routes). */
async function serveMobileApp(request: Request, env: Env, url: URL): Promise<Response> {
  if (/\.[a-z0-9]+$/i.test(url.pathname)) {
    const res = await env.ASSETS.fetch(request);
    if (res.status !== 404) {
      const h = new Headers(res.headers);
      if (url.pathname.includes('/_expo/') || url.pathname.includes('/assets/')) h.set('cache-control', 'public, max-age=31536000, immutable');
      return new Response(res.body, { status: res.status, headers: h });
    }
    return res;
  }
  const index = await env.ASSETS.fetch(new Request(new URL('/mobile/', url).toString(), { headers: request.headers }));
  const h = new Headers(index.headers);
  h.set('cache-control', 'no-cache');
  h.set('content-type', 'text/html; charset=utf-8');
  return new Response(index.body, { status: 200, headers: h });
}

/* ───────────────────────── media proxy ─────────────────────────
   Stock videos/photos (Pexels) are served from our own domain:
   first request copies the file into R2, every later request is
   answered from R2 / the edge cache with long-lived caching and
   byte-range support (needed for <video> seeking on Safari).
     /media/v/<id>/<file>.mp4        → videos.pexels.com/video-files/<id>/<file>
     /media/vp/<id>/<name>.jpg?w=N   → images.pexels.com/videos/<id>/<name>   (poster)
     /media/p/<id>?w=N               → images.pexels.com/photos/<id>/pexels-photo-<id>.jpeg
   If Pexels refuses the Worker, we redirect the browser straight to Pexels. */
const MEDIA_WIDTHS = [320, 480, 640, 960, 1280, 1600, 1920];
const IMMUTABLE = 'public, max-age=31536000, immutable';

async function handleMedia(request: Request, env: Env, ctx: ExecutionContext, url: URL): Promise<Response> {
  if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('method not allowed', { status: 405 });
  const parts = url.pathname.split('/').filter(Boolean); // ['media', kind, ...]
  const kind = parts[1];
  const w = (() => { const n = Number(url.searchParams.get('w') || 1280); return MEDIA_WIDTHS.reduce((a, b) => (Math.abs(b - n) < Math.abs(a - n) ? b : a)); })();

  if (kind === 'v') {
    const [id, file] = [parts[2], parts[3]];
    if (!/^\d+$/.test(id || '') || !/^[\w.-]+\.mp4$/.test(file || '')) return new Response('bad request', { status: 400 });
    const upstream = `https://videos.pexels.com/video-files/${id}/${file}`;
    const key = `media/v/${id}/${file}`;
    let head = await env.IMAGES.head(key);
    if (!head) {
      const up = await fetch(upstream, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; ZyphixMedia/1.0)' } });
      if (!up.ok) return Response.redirect(upstream, 302);
      const buf = await up.arrayBuffer();
      await env.IMAGES.put(key, buf, { httpMetadata: { contentType: 'video/mp4', cacheControl: IMMUTABLE } });
      head = await env.IMAGES.head(key);
      if (!head) return Response.redirect(upstream, 302);
    }
    return rangedR2(request, env, key, head.size, 'video/mp4');
  }

  if (kind === 'vp' || kind === 'p') {
    const cache = caches.default;
    const cacheKey = new Request(`${url.origin}${url.pathname}?w=${w}`, { method: 'GET' });
    const hit = await cache.match(cacheKey);
    if (hit) return hit;
    let upstream: string, key: string;
    if (kind === 'p') {
      const id = parts[2];
      if (!/^\d+$/.test(id || '')) return new Response('bad request', { status: 400 });
      upstream = `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;
      key = `media/p/${id}-${w}.jpg`;
    } else {
      const [id, name] = [parts[2], parts[3]];
      if (!/^\d+$/.test(id || '') || !/^[\w.-]+\.(jpe?g|png)$/.test(name || '')) return new Response('bad request', { status: 400 });
      upstream = `https://images.pexels.com/videos/${id}/${name}?auto=compress&cs=tinysrgb&w=${w}`;
      key = `media/vp/${id}-${w}.jpg`;
    }
    let obj = await env.IMAGES.get(key);
    let body: ArrayBuffer;
    if (obj) body = await obj.arrayBuffer();
    else {
      const up = await fetch(upstream, { headers: { 'user-agent': 'Mozilla/5.0 (compatible; ZyphixMedia/1.0)', accept: 'image/jpeg,image/*' } });
      if (!up.ok) return Response.redirect(upstream, 302);
      body = await up.arrayBuffer();
      ctx.waitUntil(env.IMAGES.put(key, body, { httpMetadata: { contentType: 'image/jpeg', cacheControl: IMMUTABLE } }));
    }
    const res = new Response(body, { headers: { 'content-type': 'image/jpeg', 'cache-control': IMMUTABLE, 'access-control-allow-origin': '*' } });
    ctx.waitUntil(cache.put(cacheKey, res.clone()));
    return res;
  }
  return new Response('not found', { status: 404 });
}

async function rangedR2(request: Request, env: Env, key: string, size: number, type: string): Promise<Response> {
  const base: Record<string, string> = { 'content-type': type, 'accept-ranges': 'bytes', 'cache-control': IMMUTABLE, 'access-control-allow-origin': '*' };
  const range = request.headers.get('range');
  const m = range && /^bytes=(\d*)-(\d*)$/.exec(range.trim());
  if (m && (m[1] || m[2])) {
    let start: number, end: number;
    if (m[1] === '') { const n = Number(m[2]); start = Math.max(0, size - n); end = size - 1; }
    else { start = Number(m[1]); end = m[2] ? Math.min(Number(m[2]), size - 1) : size - 1; }
    if (start >= size || start > end) return new Response(null, { status: 416, headers: { ...base, 'content-range': `bytes */${size}` } });
    if (request.method === 'HEAD') return new Response(null, { status: 206, headers: { ...base, 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': String(end - start + 1) } });
    const obj = await env.IMAGES.get(key, { range: { offset: start, length: end - start + 1 } });
    if (!obj) return new Response('not found', { status: 404 });
    return new Response(obj.body, { status: 206, headers: { ...base, 'content-range': `bytes ${start}-${end}/${size}`, 'content-length': String(end - start + 1) } });
  }
  if (request.method === 'HEAD') return new Response(null, { headers: { ...base, 'content-length': String(size) } });
  const obj = await env.IMAGES.get(key);
  if (!obj) return new Response('not found', { status: 404 });
  return new Response(obj.body, { headers: { ...base, 'content-length': String(size) } });
}

/* ───────────────────────── public API ───────────────────────── */

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  const p = url.pathname;
  const origin = url.origin;
  const cache = { 'cache-control': 'public, max-age=60, s-maxage=300' };

  /* ── Partner directory (stores, restaurants, service pros, riders) ── */
  if (p === '/api/partners' && request.method === 'POST') return await createPartner(request, env);
  if (p === '/api/partners' && request.method === 'GET') return await listPartners(env, url);

  /* ── Forms: partner sign-ups, advertiser inquiries, support requests, "notify me" ── */
  if (p === '/api/partner-register' && request.method === 'POST') return await partnerRegister(request, env);
  if (p === '/api/support' && request.method === 'POST') return await saveMessage(request, env, 'support');
  if (p === '/api/notify' && request.method === 'POST') return await saveMessage(request, env, 'notify');
  if (p === '/api/client-error' && request.method === 'POST') {
    const b = await readJson(request); if (!b) return json({ ok: false }, 400);
    await ensureMessages(env);
    const recent = await env.DB.prepare("SELECT COUNT(*) AS n FROM messages WHERE kind = 'client-error' AND created_at > datetime('now', '-1 hour')").first<{ n: number }>();
    if ((recent?.n ?? 0) < 200) await env.DB.prepare("INSERT INTO messages (kind, data) VALUES ('client-error', ?)").bind(JSON.stringify({ message: str(b.message, 500), stack: str(b.stack, 2000), url: str(b.url, 300), ua: str(b.ua, 300), ip_country: request.headers.get('cf-ipcountry') || '' })).run();
    return json({ ok: true });
  }

  if (p === '/api/categories') {
    const { results } = await env.DB.prepare('SELECT name, icon, color, image_url AS image, sort FROM categories ORDER BY sort').all();
    return json(results, 200, cache);
  }

  if (p === '/api/products') {
    const category = url.searchParams.get('category');
    const q = url.searchParams.get('q')?.trim();
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 500), 5000);
    const offset = Math.max(Number(url.searchParams.get('offset') ?? 0), 0);

    const where: string[] = ['in_stock = 1'];
    const binds: unknown[] = [];
    if (category) { where.push('category = ?'); binds.push(category); }
    if (q) { where.push('(name LIKE ? OR brand LIKE ?)'); binds.push(`%${q}%`, `%${q}%`); }

    const sql = `SELECT * FROM products WHERE ${where.join(' AND ')} ORDER BY rowid LIMIT ? OFFSET ?`;
    const { results } = await env.DB.prepare(sql).bind(...binds, limit, offset).all<ProductRow>();
    return json(results.map(r => toClient(r, origin, env)), 200, cache);
  }

  const m = p.match(/^\/api\/products\/([^/]+)(\/related)?$/);
  if (m) {
    const id = decodeURIComponent(m[1]);
    const row = await env.DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).first<ProductRow>();
    if (!row) return json({ error: 'not found' }, 404);
    if (!m[2]) return json(toClient(row, origin, env), 200, cache);
    const { results } = await env.DB.prepare('SELECT * FROM products WHERE category = ? AND id != ? AND in_stock = 1 LIMIT 8').bind(row.category, id).all<ProductRow>();
    return json(results.map(r => toClient(r, origin, env)), 200, cache);
  }

  return json({ error: 'not found' }, 404);
}

/* ───────────────────────── R2 images ───────────────────────── */

async function handleImage(request: Request, env: Env, ctx: ExecutionContext, key: string): Promise<Response> {
  const cache = caches.default;
  const hit = await cache.match(request);
  if (hit) return hit;

  // Small variant for product cards: /img/<key>?w=thumb → thumbs/<key>.webp (falls back to the original).
  const wantThumb = new URL(request.url).searchParams.get('w') === 'thumb';
  const obj = (wantThumb ? await env.IMAGES.get(`thumbs/${key}.webp`) : null) ?? await env.IMAGES.get(key);
  if (!obj) return new Response('not found', { status: 404 });

  const headers = new Headers();
  obj.writeHttpMetadata(headers);
  headers.set('etag', obj.httpEtag);
  headers.set('cache-control', 'public, max-age=31536000, immutable');
  headers.set('access-control-allow-origin', '*');
  const res = new Response(obj.body, { headers });
  ctx.waitUntil(cache.put(request, res.clone()));
  return res;
}

/* ───────────────────────── admin: image pipeline ───────────────────────── */

function authorized(request: Request, env: Env) {
  const h = request.headers.get('authorization') ?? '';
  return env.ADMIN_TOKEN && h === `Bearer ${env.ADMIN_TOKEN}`;
}

async function handleAdmin(request: Request, env: Env, url: URL): Promise<Response> {
  if (!authorized(request, env)) return json({ error: 'unauthorized' }, 401);
  const p = url.pathname;

  if (p === '/admin/partners' && request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM partners ORDER BY created_at DESC LIMIT 500').all();
    return json(results);
  }
  if (p === '/admin/orders' && request.method === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM orders ORDER BY created_at DESC LIMIT 300').all<OrderRow>();
    return json((results ?? []).map(orderToClient));
  }
  if (p === '/admin/whoami') return json({ ok: true });
  if (p === '/admin/waitlist' && request.method === 'GET') {
    await ensureWaitlist(env);
    const { results } = await env.DB.prepare('SELECT * FROM waitlist ORDER BY created_at DESC LIMIT 1000').all();
    return json(results);
  }
  if (p === '/admin/messages' && request.method === 'GET') {
    await ensureMessages(env);
    const { results } = await env.DB.prepare('SELECT * FROM messages ORDER BY id DESC LIMIT 1000').all();
    return json(results);
  }
  if (p === '/admin/mail-status') return json({ configured: !!env.BREVO_API_KEY, from: env.MAIL_FROM || 'noreply@zyphix.in' });
  const pm = p.match(/^\/admin\/partners\/([^/]+)\/status$/);
  if (pm && request.method === 'POST') {
    const status = url.searchParams.get('status');
    if (!status || !['live', 'hidden', 'pending', 'rejected'].includes(status)) return json({ error: 'status must be live | hidden | pending | rejected' }, 400);
    const r = await env.DB.prepare("UPDATE partners SET status = ?, updated_at = datetime('now') WHERE id = ?").bind(status, decodeURIComponent(pm[1])).run();
    return json({ updated: r.meta.changes });
  }

  if (p === '/admin/images/status') {
    const { results } = await env.DB.prepare('SELECT image_status AS status, image_source AS source, COUNT(*) AS n FROM products GROUP BY 1,2 ORDER BY 1,2').all();
    return json(results);
  }

  if (p === '/admin/images/reset' && request.method === 'POST') {
    const status = url.searchParams.get('status') ?? 'failed';
    const r = await env.DB.prepare("UPDATE products SET image_status = 'pending' WHERE image_status = ?").bind(status).run();
    return json({ reset: r.meta.changes });
  }

  // List unique pending products so a local script can resolve them off-platform.
  if (p === '/admin/images/pending') {
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 1000), 5000);
    const kind = url.searchParams.get('kind') ?? 'packaged';
    const { results } = await env.DB.prepare(
      "SELECT brand, name, category, image_kind FROM products WHERE image_status = 'pending' AND image_kind = ? GROUP BY brand, name ORDER BY rowid LIMIT ?"
    ).bind(kind, limit).all();
    return json(results);
  }

  // Store an image resolved elsewhere: raw bytes in the body, metadata in the query string.
  // Thumbnails: list originals that still need a thumb, and store one.
  if (p === '/admin/images/thumbs/pending') {
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 2000), 5000);
    const { results } = await env.DB.prepare("SELECT DISTINCT image_url FROM products WHERE image_status = 'ready' AND image_url LIKE '/img/%' LIMIT ?").bind(limit).all<{ image_url: string }>();
    const keys = results.map(r => r.image_url.slice('/img/'.length));
    const have = new Set<string>();
    let cursor: string | undefined;
    do {
      const page = await env.IMAGES.list({ prefix: 'thumbs/', cursor, limit: 1000 });
      for (const o of page.objects) have.add(o.key);
      cursor = page.truncated ? page.cursor : undefined;
    } while (cursor);
    return json(keys.filter(k => !have.has(`thumbs/${k}.webp`)));
  }
  if (p === '/admin/images/thumb' && request.method === 'PUT') {
    const key = url.searchParams.get('key');
    if (!key) return json({ error: 'key required' }, 400);
    await env.IMAGES.put(`thumbs/${key}.webp`, await request.arrayBuffer(), { httpMetadata: { contentType: 'image/webp', cacheControl: 'public, max-age=31536000, immutable' } });
    return json({ ok: true, key: `thumbs/${key}.webp` });
  }

  if (p === '/admin/images/put' && request.method === 'PUT') {
    const brand = url.searchParams.get('brand'); const name = url.searchParams.get('name');
    const source = url.searchParams.get('source') ?? 'manual'; const barcode = url.searchParams.get('barcode');
    if (!brand || !name) return json({ error: 'brand and name required' }, 400);
    const ct = request.headers.get('content-type') ?? 'image/jpeg';
    const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
    const key = `products/${slug(brand)}/${slug(name)}${barcode ? '-' + barcode : ''}.${ext}`;
    const imgUrl = await putImage(env, key, await request.arrayBuffer(), ct);
    const r = await env.DB.prepare("UPDATE products SET image_url = ?, image_source = ?, barcode = COALESCE(?, barcode), image_status = 'ready', updated_at = datetime('now') WHERE brand = ? AND name = ?")
      .bind(imgUrl, source, barcode, brand, name).run();
    return json({ url: imgUrl, updated: r.meta.changes });
  }

  // Mark a product as not found (local resolver gave up on it).
  if (p === '/admin/images/not-found' && request.method === 'POST') {
    const brand = url.searchParams.get('brand'); const name = url.searchParams.get('name');
    if (!brand || !name) return json({ error: 'brand and name required' }, 400);
    const r = await env.DB.prepare("UPDATE products SET image_status = 'not_found', updated_at = datetime('now') WHERE brand = ? AND name = ? AND image_status = 'pending'").bind(brand, name).run();
    return json({ updated: r.meta.changes });
  }

  if (p === '/admin/images/sync' && request.method === 'POST') {
    const limit = Math.min(Number(url.searchParams.get('limit') ?? 20), 40);
    const kind = url.searchParams.get('kind'); // optional: packaged | produce
    return json(await syncImages(env, limit, kind));
  }

  return json({ error: 'not found' }, 404);
}

/**
 * Processes one batch of products with image_status = 'pending'.
 * Products that share brand+name (weight variants) are resolved once and share the R2 object.
 */
async function syncImages(env: Env, limit: number, kind: string | null) {
  const sql = `SELECT * FROM products WHERE image_status = 'pending' ${kind ? 'AND image_kind = ?' : ''}
               GROUP BY brand, name ORDER BY rowid LIMIT ?`;
  const stmt = kind ? env.DB.prepare(sql).bind(kind, limit) : env.DB.prepare(sql).bind(limit);
  const { results } = await stmt.all<ProductRow>();

  const report: Array<{ product: string; status: string; source?: string; barcode?: string; error?: string }> = [];

  for (const row of results) {
    const label = `${row.brand} ${row.name}`;
    try {
      const result = row.image_kind === 'produce'
        ? await generateProduceImage(env, row)
        : await findPackagedImage(env, row);

      if (!result) {
        await env.DB.prepare("UPDATE products SET image_status = 'not_found', updated_at = datetime('now') WHERE brand = ? AND name = ? AND image_status = 'pending'")
          .bind(row.brand, row.name).run();
        report.push({ product: label, status: 'not_found' });
        continue;
      }

      await env.DB.prepare("UPDATE products SET image_url = ?, image_source = ?, barcode = COALESCE(?, barcode), image_status = 'ready', updated_at = datetime('now') WHERE brand = ? AND name = ? AND image_status = 'pending'")
        .bind(result.url, result.source, result.barcode ?? null, row.brand, row.name).run();
      report.push({ product: label, status: 'ready', source: result.source, barcode: result.barcode });
    } catch (err) {
      const msg = (err as Error).message;
      if (msg === 'rate limited') { report.push({ product: label, status: 'rate_limited' }); break; } // leave it pending
      await env.DB.prepare("UPDATE products SET image_status = 'failed', updated_at = datetime('now') WHERE brand = ? AND name = ? AND image_status = 'pending'")
        .bind(row.brand, row.name).run();
      report.push({ product: label, status: 'failed', error: msg });
    }
  }

  const remaining = await env.DB.prepare("SELECT COUNT(DISTINCT brand || '|' || name) AS n FROM products WHERE image_status = 'pending'").first<{ n: number }>();
  return { processed: report.length, remaining: remaining?.n ?? 0, report };
}

type ImageResult = { url: string; source: string; barcode?: string };

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);

async function putImage(env: Env, key: string, body: ArrayBuffer, contentType: string) {
  await env.IMAGES.put(key, body, { httpMetadata: { contentType, cacheControl: 'public, max-age=31536000, immutable' } });
  try { await putThumb(env, key, body); } catch (err) { console.warn('thumb failed', key, (err as Error).message); }
  return `/img/${key}`;
}

/* ---- Thumbnails (480px WebP) made in the Worker with photon (WASM) ---- */
const THUMB_PX = 480;
async function putThumb(env: Env, key: string, body: ArrayBuffer) {
  const img = PhotonImage.new_from_byteslice(new Uint8Array(body));
  try {
    const w = img.get_width(), h = img.get_height();
    const scale = Math.min(1, THUMB_PX / Math.max(w, h));
    const out = scale < 1 ? resize(img, Math.max(1, Math.round(w * scale)), Math.max(1, Math.round(h * scale)), SamplingFilter.Lanczos3) : img;
    const webp = out.get_bytes_webp();
    await env.IMAGES.put(`thumbs/${key}.webp`, webp, { httpMetadata: { contentType: 'image/webp', cacheControl: 'public, max-age=31536000, immutable' } });
    if (out !== img) out.free();
  } finally { img.free(); }
}

/** Creates thumbnails for ready images that don't have one yet (bounded per run). */
async function makeMissingThumbs(env: Env, limit: number): Promise<number> {
  const { results } = await env.DB.prepare("SELECT DISTINCT image_url FROM products WHERE image_status = 'ready' AND image_url LIKE '/img/%' LIMIT 1500").all<{ image_url: string }>();
  let made = 0;
  for (const r of results) {
    if (made >= limit) break;
    const key = r.image_url.slice('/img/'.length);
    if (await env.IMAGES.head(`thumbs/${key}.webp`)) continue;
    const obj = await env.IMAGES.get(key);
    if (!obj) continue;
    try { await putThumb(env, key, await obj.arrayBuffer()); made++; } catch (err) { console.warn('thumb failed', key, (err as Error).message); }
  }
  return made;
}

/* ---- Open Food Facts / Open Beauty Facts ---- */

const BEAUTY_CATEGORIES = new Set(['Personal Care', 'Beauty & Cosmetics', 'Baby Care']);
const OFF_UA = 'Zyphix/1.0 (https://zyphix.in; hello@zyphix.in)'; // OFF asks for an identifying UA

const tokens = (s: string) => new Set(s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter(t => t.length > 2));

function scoreHit(hit: any, brand: string, name: string): number {
  const hb = String(hit.brands ?? '').toLowerCase();
  const hn = String(hit.product_name ?? hit.product_name_en ?? '').toLowerCase();
  if (!hit.image_front_url && !hit.image_url) return -1;
  let score = 0;
  if (hb.includes(brand.toLowerCase().split(' ')[0])) score += 3;
  const want = tokens(name);
  const have = tokens(hn + ' ' + hb);
  for (const t of want) if (have.has(t)) score += 1;
  if (String(hit.countries_tags ?? '').includes('india')) score += 1;
  return score;
}

async function findPackagedImage(env: Env, row: ProductRow): Promise<ImageResult | null> {
  const host = BEAUTY_CATEGORIES.has(row.category) ? 'world.openbeautyfacts.org' : 'world.openfoodfacts.org';
  const hosts = [host, host === 'world.openfoodfacts.org' ? 'world.openbeautyfacts.org' : 'world.openfoodfacts.org'];

  // strip the brand from the product name if it was prefixed, e.g. "Amul Butter" -> "Butter"
  const bareName = row.name.toLowerCase().startsWith(row.brand.toLowerCase())
    ? row.name.slice(row.brand.length).trim() || row.name
    : row.name;

  let best: any = null; let bestScore = 2; // require at least a brand hit or 3 token hits
  // Prefer the modern search service (search-a-licious): far less throttled than the legacy search.pl,
  // which blocks most cloud IPs. Fall back to search.pl on the two legacy hosts.
  const queries: Array<() => Promise<any[]>> = [
    async () => {
      const u = new URL('https://search.openfoodfacts.org/search');
      u.searchParams.set('q', `${row.brand} ${bareName}`); u.searchParams.set('page_size', '10'); u.searchParams.set('langs', 'en');
      u.searchParams.set('fields', 'code,product_name,product_name_en,brands,image_front_url,image_url,countries_tags');
      const res = await fetch(u.toString(), { headers: { 'user-agent': OFF_UA, accept: 'application/json' } });
      if (res.status === 429 || res.status === 503) throw new Error('rate limited');
      if (!res.ok) throw new Error(`search-a-licious ${res.status}`);
      const data: any = await res.json(); return data.hits ?? data.products ?? [];
    },
    ...hosts.map(h => async () => {
      const u = new URL(`https://${h}/cgi/search.pl`);
      u.searchParams.set('search_terms', `${row.brand} ${bareName}`); u.searchParams.set('search_simple', '1'); u.searchParams.set('action', 'process');
      u.searchParams.set('json', '1'); u.searchParams.set('page_size', '10');
      u.searchParams.set('fields', 'code,product_name,product_name_en,brands,image_front_url,image_url,countries_tags');
      const res = await fetch(u.toString(), { headers: { 'user-agent': OFF_UA, accept: 'application/json' } });
      if (res.status === 429 || res.status === 503) throw new Error('rate limited');
      if (!res.ok) throw new Error(`search ${res.status}`);
      const data: any = await res.json().catch(() => { throw new Error('search returned non-JSON (likely blocked)'); });
      return data.products ?? [];
    }),
  ];
  let lastErr: Error | null = null;
  for (const q of queries) {
    let hits: any[] = [];
    try { hits = await q(); } catch (err) { lastErr = err as Error; if ((err as Error).message === 'rate limited') throw err; continue; }
    for (const hit of hits) {
      const sc = scoreHit(hit, row.brand, bareName);
      if (sc > bestScore) { bestScore = sc; best = { ...hit, _host: String(hit.code ?? '').length && BEAUTY_CATEGORIES.has(row.category) ? 'beauty' : 'food' }; }
    }
    if (best || hits.length) break;
  }
  if (!best && lastErr) throw lastErr;
  if (!best) return null;

  const imgUrl0: string = best.image_front_url ?? best.image_url;
  const full = imgUrl0.replace(/\.(\d{3})\.jpg$/i, '.full.jpg');
  let imgRes = await fetch(full, { headers: { 'user-agent': OFF_UA } });
  if (!imgRes.ok && full !== imgUrl0) imgRes = await fetch(imgUrl0, { headers: { 'user-agent': OFF_UA } });
  if (!imgRes.ok) throw new Error(`image fetch ${imgRes.status}`);
  const ct = imgRes.headers.get('content-type') ?? 'image/jpeg';
  const ext = ct.includes('png') ? 'png' : ct.includes('webp') ? 'webp' : 'jpg';
  const key = `products/${slug(row.brand)}/${slug(row.name)}-${best.code}.${ext}`;
  const url = await putImage(env, key, await imgRes.arrayBuffer(), ct);
  return { url, source: best._host.includes('beauty') ? 'openbeautyfacts' : 'openfoodfacts', barcode: String(best.code) };
}

/* ---- Workers AI for produce (no brand, so generated imagery is fine) ---- */

async function generateProduceImage(env: Env, row: ProductRow): Promise<ImageResult | null> {
  const subject = row.name.replace(/^local farm\s*/i, '').trim();
  const prompt = `Studio product photograph of fresh ${subject}, grocery delivery app listing, centered on a clean white background, soft even lighting, high detail, no text, no packaging, no hands`;
  const out: any = await env.AI.run('@cf/black-forest-labs/flux-1-schnell', { prompt, steps: 6 });
  if (!out?.image) throw new Error('AI returned no image');
  const bytes = Uint8Array.from(atob(out.image), c => c.charCodeAt(0));
  const key = `produce/${slug(subject)}.jpg`;
  const url = await putImage(env, key, bytes.buffer, 'image/jpeg');
  return { url, source: 'workers-ai' };
}

/* ───────────────────────── partner directory ─────────────────────────
   Registrations from the sign-up forms (store / restaurant / service / delivery)
   are stored here and listed on now.zyphix.in, eats.zyphix.in, book.zyphix.in and
   partner.zyphix.in. New entries start as 'pending' and appear publicly once approved
   on zyphix.in/admin (POST /admin/partners/:id/status). Contact details are never returned by the public GET.          */

const PARTNER_TYPES: Record<string, string> = { merchant: 'store', store: 'store', restaurant: 'restaurant', service: 'service', delivery: 'delivery' };
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v : Array.isArray(v) ? v.join(', ') : v == null ? '' : String(v)).trim().slice(0, max);

async function createPartner(request: Request, env: Env): Promise<Response> {
  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400); }
  const type = PARTNER_TYPES[str(body.role)];
  if (!type) return json({ error: 'unknown role' }, 400);
  const name = str(body.name, 120), email = str(body.email, 160).toLowerCase(), phone = str(body.phone, 20).replace(/\D/g, ''), city = str(body.city, 80);
  if (!name || phone.length < 10 || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) return json({ error: 'name and a 10-digit phone are required; email must be valid if given' }, 400);
  const d = (body.details ?? {}) as Record<string, unknown>;
  const businessName = str(d.storeName ?? d.restaurantName ?? d.businessName ?? (type === 'delivery' || type === 'service' ? name : ''), 140) || name;
  const category = str(d.primaryCategory ?? d.restaurantType ?? d.storeType ?? d.vehicleType ?? d.vehicle ?? '', 80);
  const tags = str(d.cuisines ?? d.categories ?? d.additionalSkills ?? '', 300);
  const locality = str(d.locality ?? d.area ?? d.address ?? '', 160);
  const id = `${type.slice(0, 2)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  // one listing per (type, email) — or (type, phone) when no email: re-registering updates instead of duplicating
  const existing = email
    ? await env.DB.prepare('SELECT id FROM partners WHERE type = ? AND email = ?').bind(type, email).first<{ id: string }>()
    : await env.DB.prepare('SELECT id FROM partners WHERE type = ? AND phone = ?').bind(type, phone).first<{ id: string }>();
  if (existing) {
    await env.DB.prepare("UPDATE partners SET name=?, business_name=?, phone=?, city=?, locality=?, category=?, tags=?, details=?, status=CASE WHEN status='rejected' THEN 'pending' ELSE status END, updated_at=datetime('now') WHERE id=?")
      .bind(name, businessName, phone, city, locality, category, tags, JSON.stringify(d).slice(0, 8000), existing.id).run();
    return json({ success: true, id: existing.id, updated: true });
  }
  await env.DB.prepare('INSERT INTO partners (id, type, name, business_name, email, phone, city, locality, category, tags, details, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(id, type, name, businessName, email, phone, city, locality, category, tags, JSON.stringify(d).slice(0, 8000), 'pending').run();
  return json({ success: true, id }, 201);
}

async function listPartners(env: Env, url: URL): Promise<Response> {
  const type = PARTNER_TYPES[url.searchParams.get('type') ?? ''] ?? url.searchParams.get('type');
  const city = url.searchParams.get('city')?.trim();
  const limit = Math.min(Number(url.searchParams.get('limit') ?? 200), 500);
  const where = ["status = 'live'"]; const binds: unknown[] = [];
  if (type) { where.push('type = ?'); binds.push(type); }
  if (city) { where.push('LOWER(city) = LOWER(?)'); binds.push(city); }
  const { results } = await env.DB.prepare(`SELECT id, type, name, business_name, city, locality, category, tags, created_at FROM partners WHERE ${where.join(' AND ')} ORDER BY created_at DESC LIMIT ?`).bind(...binds, limit).all();
  const pub = results.map((r: any) => ({
    id: r.id, type: r.type,
    name: r.type === 'delivery' ? String(r.name).split(' ')[0] : r.business_name, // riders: first name only
    city: r.city, locality: r.type === 'delivery' ? '' : r.locality, category: r.category, tags: r.tags, joinedAt: r.created_at,
  }));
  return json(pub, 200, { 'cache-control': 'public, max-age=30, s-maxage=60' });
}

/* ───────────────────────── accounts (auth.zyphix.in) ─────────────────────────
   Email-OTP sign-in. The OTP itself is sent/checked by the Supabase `email-otp`
   edge function; this Worker only calls it server-side on verify, then owns the
   session: a random token in an HttpOnly cookie `zsid` (Domain=.zyphix.in so
   now.|eats.|book.|auth.zyphix.in share it), SHA-256 hash in `sessions`.
   Addresses and orders live in D1 and are scoped to the session user.      */

const SESSION_COOKIE = 'zsid';
const SESSION_TTL_S = 90 * 24 * 60 * 60; // 90 days
const MAX_ADDRESSES = 10;

type UserRow = { id: string; email: string; name: string | null; phone: string | null; created_at: string; updated_at: string };
type AddressRow = { id: string; user_id: string; label: string | null; name: string | null; phone: string | null; line1: string; line2: string | null; city: string | null; pincode: string | null; is_default: number; created_at: string };
type OrderRow = { id: string; user_id: string | null; email: string | null; status: string; items: string; subtotal: number; delivery_fee: number; discount: number; total: number; payment_mode: string | null; address: string | null; eta_minutes: number | null; created_at: string };

const ACCOUNT_PATH = /^\/api\/(auth\/|me($|\/)|orders($|\/)|waitlist$)/;
const isAccountPath = (p: string) => ACCOUNT_PATH.test(p);

/** Credentialed CORS for https://zyphix.in and https://*.zyphix.in (plus localhost for dev). */
function accountCors(request: Request): Record<string, string> {
  const origin = request.headers.get('origin');
  if (!origin) return {};
  let ok = false;
  try {
    const u = new URL(origin);
    ok = (u.protocol === 'https:' && (u.hostname === 'zyphix.in' || u.hostname.endsWith('.zyphix.in')))
      || (u.hostname === 'localhost' || u.hostname === '127.0.0.1');
  } catch { ok = false; }
  if (!ok) return {};
  return { 'access-control-allow-origin': origin, 'access-control-allow-credentials': 'true', 'vary': 'Origin' };
}

const b64url = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const randomId = (prefix = '') => prefix + b64url(crypto.getRandomValues(new Uint8Array(12)));
async function sha256Hex(s: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(s));
  return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

function readCookie(request: Request, name: string): string | null {
  const raw = request.headers.get('cookie') ?? '';
  for (const part of raw.split(';')) {
    const [k, ...v] = part.trim().split('=');
    if (k === name) return decodeURIComponent(v.join('='));
  }
  return null;
}

function cookieHeader(request: Request, value: string, maxAge: number) {
  const host = new URL(request.url).hostname.toLowerCase();
  const domain = host === 'zyphix.in' || host.endsWith('.zyphix.in') ? '; Domain=.zyphix.in' : '';
  return `${SESSION_COOKIE}=${value}${domain}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

const toUser = (u: UserRow) => ({ id: u.id, email: u.email, name: u.name ?? '', phone: u.phone ?? '' });

/** Session token from the `zsid` cookie (web) or `Authorization: Bearer <token>` (Android/iOS app). */
function sessionToken(request: Request): string | null {
  const cookie = readCookie(request, SESSION_COOKIE);
  if (cookie) return cookie;
  const m = /^Bearer\s+([A-Za-z0-9_-]{20,})$/.exec(request.headers.get('authorization') ?? '');
  return m ? m[1] : null;
}

/** Session → user row (null when missing, unknown or expired). */
async function getUser(request: Request, env: Env): Promise<UserRow | null> {
  const token = sessionToken(request);
  if (!token) return null;
  const hash = await sha256Hex(token);
  return await env.DB.prepare(
    "SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > datetime('now')"
  ).bind(hash).first<UserRow>();
}

async function createSession(request: Request, env: Env, userId: string): Promise<{ cookie: string; token: string }> {
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const hash = await sha256Hex(token);
  const ua = (request.headers.get('user-agent') ?? '').slice(0, 300);
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at, user_agent) VALUES (?, ?, datetime('now', ?), ?)")
    .bind(hash, userId, `+${SESSION_TTL_S} seconds`, ua).run();
  return { cookie: cookieHeader(request, token, SESSION_TTL_S), token };
}

async function readJson(request: Request): Promise<Record<string, any> | null> {
  try { const b = await request.json(); return b && typeof b === 'object' ? b as Record<string, any> : {}; } catch { return null; }
}

async function handleAccount(request: Request, env: Env, url: URL): Promise<Response> {
  const p = url.pathname;
  const m = request.method;

  /* ── auth ── */
  if (p === '/api/auth/send' && m === 'POST') return await authSend(request, env);
  if (p === '/api/auth/verify' && m === 'POST') return await authVerify(request, env);
  if (p === '/api/auth/logout' && m === 'POST') {
    const token = sessionToken(request);
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256Hex(token)).run();
    return json({ success: true }, 200, { 'set-cookie': cookieHeader(request, '', 0) });
  }

  /* ── orders: POST works for guests too; GET /api/orders/:id allows guest lookup of guest orders ── */
  if (p === '/api/orders' && m === 'POST') return await createOrder(request, env);
  if (p === '/api/waitlist' && m === 'POST') return await joinWaitlist(request, env);
  const om = p.match(/^\/api\/orders\/([^/]+)$/);
  if (om && m === 'GET') {
    const row = await env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(decodeURIComponent(om[1])).first<OrderRow>();
    if (!row) return json({ error: 'not found' }, 404);
    const user = await getUser(request, env);
    const allowed = row.user_id ? (user?.id === row.user_id) : true;
    if (!allowed) return json({ error: 'not found' }, 404);
    return json(orderToClient(row));
  }

  /* ── everything under /api/me needs a session ── */
  const user = await getUser(request, env);
  if (!user) return json({ error: 'unauthorized' }, 401);

  if (p === '/api/me' && m === 'GET') return json({ user: toUser(user) });
  if (p === '/api/me' && m === 'PATCH') {
    const body = await readJson(request); if (!body) return json({ error: 'invalid JSON' }, 400);
    const name = body.name !== undefined ? str(body.name, 120) : user.name;
    const phone = body.phone !== undefined ? str(body.phone, 20) : user.phone;
    if (phone && !/^\+?[\d\s-]{10,16}$/.test(phone)) return json({ error: 'invalid phone' }, 400);
    await env.DB.prepare("UPDATE users SET name = ?, phone = ?, updated_at = datetime('now') WHERE id = ?").bind(name || null, phone || null, user.id).run();
    return json({ user: { ...toUser(user), name: name ?? '', phone: phone ?? '' } });
  }

  if (p === '/api/me/orders' && m === 'GET') {
    const { results } = await env.DB.prepare('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC LIMIT 50').bind(user.id).all<OrderRow>();
    return json(results.map(orderToClient));
  }

  if (p === '/api/me/addresses' && m === 'GET') return json(await listAddresses(env, user.id));
  if (p === '/api/me/addresses' && m === 'POST') {
    const body = await readJson(request); if (!body) return json({ error: 'invalid JSON' }, 400);
    const a = addressInput(body); if ('error' in a) return json({ error: a.error }, 400);
    const count = await env.DB.prepare('SELECT COUNT(*) AS n FROM addresses WHERE user_id = ?').bind(user.id).first<{ n: number }>();
    if ((count?.n ?? 0) >= MAX_ADDRESSES) return json({ error: `you can save up to ${MAX_ADDRESSES} addresses` }, 400);
    const makeDefault = !!body.isDefault || (count?.n ?? 0) === 0;
    const id = randomId('ad_');
    if (makeDefault) await env.DB.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').bind(user.id).run();
    await env.DB.prepare('INSERT INTO addresses (id, user_id, label, name, phone, line1, line2, city, pincode, is_default) VALUES (?,?,?,?,?,?,?,?,?,?)')
      .bind(id, user.id, a.label, a.name, a.phone, a.line1, a.line2, a.city, a.pincode, makeDefault ? 1 : 0).run();
    const row = await env.DB.prepare('SELECT * FROM addresses WHERE id = ?').bind(id).first<AddressRow>();
    return json(addressToClient(row!), 201);
  }
  const am = p.match(/^\/api\/me\/addresses\/([^/]+)(\/default)?$/);
  if (am) {
    const id = decodeURIComponent(am[1]);
    const row = await env.DB.prepare('SELECT * FROM addresses WHERE id = ? AND user_id = ?').bind(id, user.id).first<AddressRow>();
    if (!row) return json({ error: 'not found' }, 404);
    if (am[2] && m === 'POST') {
      await env.DB.batch([
        env.DB.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').bind(user.id),
        env.DB.prepare('UPDATE addresses SET is_default = 1 WHERE id = ?').bind(id),
      ]);
      return json(await listAddresses(env, user.id));
    }
    if (!am[2] && m === 'PATCH') {
      const body = await readJson(request); if (!body) return json({ error: 'invalid JSON' }, 400);
      const merged = { label: row.label, name: row.name, phone: row.phone, line1: row.line1, line2: row.line2, city: row.city, pincode: row.pincode, ...body };
      const a = addressInput(merged); if ('error' in a) return json({ error: a.error }, 400);
      if (body.isDefault === true) await env.DB.prepare('UPDATE addresses SET is_default = 0 WHERE user_id = ?').bind(user.id).run();
      const isDefault = body.isDefault === true ? 1 : row.is_default;
      await env.DB.prepare('UPDATE addresses SET label=?, name=?, phone=?, line1=?, line2=?, city=?, pincode=?, is_default=? WHERE id=?')
        .bind(a.label, a.name, a.phone, a.line1, a.line2, a.city, a.pincode, isDefault, id).run();
      const updated = await env.DB.prepare('SELECT * FROM addresses WHERE id = ?').bind(id).first<AddressRow>();
      return json(addressToClient(updated!));
    }
    if (!am[2] && m === 'DELETE') {
      await env.DB.prepare('DELETE FROM addresses WHERE id = ?').bind(id).run();
      if (row.is_default) {
        // promote the oldest remaining address so there is always a default
        await env.DB.prepare('UPDATE addresses SET is_default = 1 WHERE id = (SELECT id FROM addresses WHERE user_id = ? ORDER BY created_at LIMIT 1)').bind(user.id).run();
      }
      return json({ success: true });
    }
  }

  return json({ error: 'not found' }, 404);
}

/* ---- email sign-in codes (stored in D1, sent with Brevo) ---- */

type OtpRow = { token: string; email: string; code_hash: string; name: string | null; attempts: number; expires_at: number; used: number; ip: string | null; created_at: number };
async function ensureOtp(env: Env) {
  await env.DB.prepare('CREATE TABLE IF NOT EXISTS otp_codes (token TEXT PRIMARY KEY, email TEXT NOT NULL, code_hash TEXT NOT NULL, name TEXT, attempts INTEGER NOT NULL DEFAULT 0, expires_at INTEGER NOT NULL, used INTEGER NOT NULL DEFAULT 0, ip TEXT, created_at INTEGER NOT NULL)').run();
}

async function sendMail(env: Env, to: string, subject: string, html: string, text: string): Promise<void> {
  if (!env.BREVO_API_KEY) throw new Error('mail-not-configured');
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({ sender: { name: 'Zyphix', email: env.MAIL_FROM || 'noreply@zyphix.in' }, to: [{ email: to }], subject, htmlContent: html, textContent: text }),
  });
  if (!res.ok) throw new Error(`mail-failed ${res.status} ${(await res.text()).slice(0, 200)}`);
}

function otpEmail(code: string) {
  const html = `<!doctype html><html><body style="margin:0;background:#F4F5F2;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:32px 12px"><tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#fff;border-radius:20px;overflow:hidden;border:1px solid #E5E7EB">
<tr><td style="background:#06080A;padding:22px 28px"><span style="display:inline-block;background:#0DA366;color:#fff;font-weight:800;border-radius:8px;padding:4px 8px;font-size:13px">//</span> <span style="color:#fff;font-weight:800;font-size:17px;letter-spacing:.02em;vertical-align:middle">ZYPHIX</span></td></tr>
<tr><td style="padding:30px 28px 8px"><p style="margin:0;font-size:20px;font-weight:700;color:#0B0F12">Your sign-in code</p>
<p style="margin:10px 0 0;font-size:14.5px;line-height:1.6;color:#4B5563">Enter this code to sign in to Zyphix. It expires in 10 minutes.</p>
<p style="margin:22px 0 4px;font-size:34px;font-weight:800;letter-spacing:10px;color:#0B0F12">${code}</p></td></tr>
<tr><td style="padding:14px 28px 28px"><p style="margin:0;font-size:12.5px;line-height:1.6;color:#9CA3AF">If you didn't ask for this, you can ignore this email. Never share this code with anyone.</p></td></tr>
</table><p style="margin:16px 0 0;font-size:11.5px;color:#9CA3AF">&copy; ${new Date().getFullYear()} Zyphix &middot; zyphix.in</p></td></tr></table></body></html>`;
  return { html, text: `Your Zyphix sign-in code is ${code}. It expires in 10 minutes. If you didn't ask for it, ignore this email.` };
}

async function authSend(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request); if (!body) return json({ error: 'invalid JSON' }, 400);
  const email = str(body.email, 160).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Enter a valid email address' }, 400);
  await ensureOtp(env);
  const now = Date.now(); const ip = request.headers.get('cf-connecting-ip') || '';
  // rate limits: 5 codes per email and 20 per IP in 15 minutes
  const since = now - 15 * 60_000;
  const byEmail = await env.DB.prepare('SELECT COUNT(*) AS n FROM otp_codes WHERE email = ? AND created_at > ?').bind(email, since).first<{ n: number }>();
  const byIp = ip ? await env.DB.prepare('SELECT COUNT(*) AS n FROM otp_codes WHERE ip = ? AND created_at > ?').bind(ip, since).first<{ n: number }>() : { n: 0 };
  if ((byEmail?.n ?? 0) >= 5 || (byIp?.n ?? 0) >= 20) return json({ error: 'Too many codes requested. Please wait a few minutes and try again.' }, 429);

  const code = String(crypto.getRandomValues(new Uint32Array(1))[0] % 1_000_000).padStart(6, '0');
  const token = randomId('otp_');
  await env.DB.prepare('INSERT INTO otp_codes (token, email, code_hash, name, expires_at, ip, created_at) VALUES (?,?,?,?,?,?,?)')
    .bind(token, email, await sha256Hex(`${token}:${code}`), str(body.name, 120) || null, now + 10 * 60_000, ip || null, now).run();
  // housekeeping
  await env.DB.prepare('DELETE FROM otp_codes WHERE created_at < ?').bind(now - 24 * 3600_000).run();
  try {
    const m = otpEmail(code);
    await sendMail(env, email, `${code} is your Zyphix sign-in code`, m.html, m.text);
  } catch (e) {
    const msg = (e as Error).message;
    console.error('otp mail', msg);
    return json({ error: msg === 'mail-not-configured' ? 'Sign-in email is not set up yet. Please try again later.' : 'We could not send the email. Please try again.' }, 503);
  }
  return json({ success: true, token });
}

/* ---- inbox: support requests, advertiser inquiries, "notify me" sign-ups ---- */

async function ensureMessages(env: Env) {
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, kind TEXT NOT NULL, name TEXT, email TEXT, phone TEXT, city TEXT, data TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')))").run();
}
async function storeMessage(env: Env, kind: string, b: Record<string, any>) {
  await ensureMessages(env);
  const { name, email, phone, city, ...rest } = b;
  await env.DB.prepare('INSERT INTO messages (kind, name, email, phone, city, data) VALUES (?,?,?,?,?,?)')
    .bind(kind, str(name, 120) || null, str(email, 160).toLowerCase() || null, str(phone, 20).replace(/\D/g, '') || null, str(city, 120) || null, JSON.stringify(rest).slice(0, 8000)).run();
}
async function saveMessage(request: Request, env: Env, kind: 'support' | 'notify' | 'advertise'): Promise<Response> {
  const body = await readJson(request); if (!body) return json({ error: 'invalid JSON' }, 400);
  const email = str(body.email, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Enter a valid email address' }, 400);
  if (kind === 'support' && str(body.message, 4000).length < 5) return json({ error: 'Describe the issue in a sentence or two' }, 400);
  await storeMessage(env, kind, body);
  return json({ success: true }, 201);
}
/** Legacy form endpoint: partner roles go to the partner directory, advertisers to the inbox. */
async function partnerRegister(request: Request, env: Env): Promise<Response> {
  const raw = await request.text();
  let body: Record<string, any> = {};
  try { body = JSON.parse(raw); } catch { return json({ error: 'invalid JSON' }, 400); }
  if (PARTNER_TYPES[str(body.role)]) return await createPartner(new Request(request.url, { method: 'POST', headers: { 'content-type': 'application/json' }, body: raw }), env);
  const email = str(body.email, 160);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ error: 'Enter a valid email address' }, 400);
  await storeMessage(env, str(body.role, 30) === 'advertiser' ? 'advertise' : 'partner-other', body);
  return json({ success: true }, 201);
}

async function authVerify(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request); if (!body) return json({ error: 'invalid JSON' }, 400);
  const email = str(body.email, 160).toLowerCase(); const otp = str(body.otp, 10); const token = str(body.token, 2000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{4,8}$/.test(otp) || !token) return json({ error: 'email, otp and token are required' }, 400);

  await ensureOtp(env);
  const row = await env.DB.prepare('SELECT * FROM otp_codes WHERE token = ?').bind(token).first<OtpRow>();
  if (!row || row.email !== email || row.used || row.expires_at < Date.now()) return json({ error: 'This code has expired. Request a new one.' }, 400);
  if (row.attempts >= 5) return json({ error: 'Too many attempts. Request a new code.' }, 429);
  if (await sha256Hex(`${token}:${otp}`) !== row.code_hash) {
    await env.DB.prepare('UPDATE otp_codes SET attempts = attempts + 1 WHERE token = ?').bind(token).run();
    return json({ error: 'Incorrect code. Check the email and try again.' }, 400);
  }
  await env.DB.prepare('UPDATE otp_codes SET used = 1 WHERE token = ?').bind(token).run();
  const data = { name: row.name };

  const name = str(body.name, 120) || str(data?.name, 120);
  let user = await env.DB.prepare('SELECT * FROM users WHERE email = ?').bind(email).first<UserRow>();
  if (!user) {
    const id = randomId('u_');
    await env.DB.prepare('INSERT INTO users (id, email, name) VALUES (?, ?, ?)').bind(id, email, name || null).run();
    user = (await env.DB.prepare('SELECT * FROM users WHERE id = ?').bind(id).first<UserRow>())!;
  } else if (name && !user.name) {
    await env.DB.prepare("UPDATE users SET name = ?, updated_at = datetime('now') WHERE id = ?").bind(name, user.id).run();
    user = { ...user, name };
  }
  const session = await createSession(request, env, user.id);
  // The mobile apps keep the token in the device keychain and send it as a Bearer header.
  const forApp = body.client === 'app';
  return json(forApp ? { user: toUser(user), token: session.token } : { user: toUser(user) }, 200, { 'set-cookie': session.cookie });
}

/* ---- addresses ---- */

type AddressInput = { label: string | null; name: string | null; phone: string | null; line1: string; line2: string | null; city: string | null; pincode: string | null };
function addressInput(b: Record<string, unknown>): AddressInput | { error: string } {
  const line1 = str(b.line1, 240);
  if (!line1) return { error: 'line1 is required' };
  const pincode = str(b.pincode, 10);
  if (pincode && !/^\d{6}$/.test(pincode)) return { error: 'pincode must be 6 digits' };
  const phone = str(b.phone, 20);
  return {
    label: str(b.label, 40) || null, name: str(b.name, 120) || null, phone: phone || null,
    line1, line2: str(b.line2, 240) || null, city: str(b.city, 80) || null, pincode: pincode || null,
  };
}
const addressToClient = (r: AddressRow) => ({
  id: r.id, label: r.label ?? '', name: r.name ?? '', phone: r.phone ?? '', line1: r.line1, line2: r.line2 ?? '',
  city: r.city ?? '', pincode: r.pincode ?? '', isDefault: r.is_default === 1, createdAt: r.created_at,
});
async function listAddresses(env: Env, userId: string) {
  const { results } = await env.DB.prepare('SELECT * FROM addresses WHERE user_id = ? ORDER BY is_default DESC, created_at').bind(userId).all<AddressRow>();
  return results.map(addressToClient);
}

/* ---- orders ---- */

const num = (v: unknown) => { const n = Number(v); return Number.isFinite(n) ? Math.round(n) : 0; };

async function createOrder(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request); if (!body) return json({ error: 'invalid JSON' }, 400);
  const items = Array.isArray(body.items) ? body.items : [];
  if (items.length === 0) return json({ error: 'items are required' }, 400);
  const id = str(body.id, 40) || `ZNW${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
  const user = await getUser(request, env);
  const subtotal = num(body.subtotal), deliveryFee = num(body.deliveryFee);
  const discount = num(body.couponDiscount) + num(body.walletUsed);
  const total = num(body.total);
  const paymentMode = str(body.paymentMode, 20) || 'COD';
  const address = body.address && typeof body.address === 'object' ? body.address : {};
  const eta = num(body.etaMinutes) || 30;
  const status = str(body.status, 20) || 'placed';
  const email = user?.email ?? (str(body.email, 160).toLowerCase() || null);
  const existing = await env.DB.prepare('SELECT id FROM orders WHERE id = ?').bind(id).first<{ id: string }>();
  if (existing) return json({ error: 'order already exists' }, 409);
  await env.DB.prepare('INSERT INTO orders (id, user_id, email, status, items, subtotal, delivery_fee, discount, total, payment_mode, address, eta_minutes) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(id, user?.id ?? null, email, status, JSON.stringify(items).slice(0, 60000), subtotal, deliveryFee, discount, total, paymentMode, JSON.stringify(address).slice(0, 4000), eta).run();
  const row = await env.DB.prepare('SELECT created_at FROM orders WHERE id = ?').bind(id).first<{ created_at: string }>();
  return json({ id, createdAt: sqliteToIso(row?.created_at) }, 201);
}

/* ── waitlist ("tell me when it opens near me") — table is created on first use ── */
async function ensureWaitlist(env: Env) {
  await env.DB.prepare("CREATE TABLE IF NOT EXISTS waitlist (id INTEGER PRIMARY KEY AUTOINCREMENT, product TEXT NOT NULL, name TEXT, phone TEXT NOT NULL, email TEXT, city TEXT, created_at TEXT NOT NULL DEFAULT (datetime('now')), UNIQUE(product, phone))").run();
}
async function joinWaitlist(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request); if (!body) return json({ error: 'invalid JSON' }, 400);
  const product = str(body.product, 20).toLowerCase();
  if (!['now', 'eats', 'book'].includes(product)) return json({ error: 'unknown product' }, 400);
  const phone = str(body.phone, 20).replace(/\D/g, '').slice(-10);
  if (phone.length !== 10) return json({ error: 'a 10-digit phone is required' }, 400);
  await ensureWaitlist(env);
  await env.DB.prepare('INSERT INTO waitlist (product, name, phone, email, city) VALUES (?,?,?,?,?) ON CONFLICT(product, phone) DO UPDATE SET name = excluded.name, city = excluded.city, email = excluded.email')
    .bind(product, str(body.name, 120) || null, phone, str(body.email, 160).toLowerCase() || null, str(body.city, 120) || null).run();
  return json({ success: true }, 201);
}

const sqliteToIso = (s: string | undefined | null) => s ? (s.includes('T') ? s : s.replace(' ', 'T') + 'Z') : new Date().toISOString();
const parseJson = <T,>(s: string | null, fallback: T): T => { try { return s ? JSON.parse(s) as T : fallback; } catch { return fallback; } };

function orderToClient(r: OrderRow) {
  return {
    id: r.id, createdAt: sqliteToIso(r.created_at), status: r.status,
    items: parseJson<unknown[]>(r.items, []), subtotal: r.subtotal, deliveryFee: r.delivery_fee, discount: r.discount, total: r.total,
    paymentMode: r.payment_mode ?? 'COD', address: parseJson<Record<string, unknown>>(r.address, {}), etaMinutes: r.eta_minutes ?? 30,
    email: r.email, userId: r.user_id,
  };
}
