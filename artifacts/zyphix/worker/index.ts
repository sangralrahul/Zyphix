/// <reference types="@cloudflare/workers-types" />
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
  SUPABASE_URL?: string;      // email-otp edge function host (same fallbacks as src/lib/api.ts)
  SUPABASE_KEY?: string;
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
        return new Response(null, { status: 204, headers: { ...cors, 'access-control-allow-headers': 'content-type', 'access-control-allow-methods': 'GET,POST,PATCH,DELETE,OPTIONS', 'access-control-max-age': '86400' } });
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
      if (pathname.startsWith('/admin/')) return await handleAdmin(request, env, url);
    } catch (err) {
      console.error(err);
      return json({ error: (err as Error).message }, 500);
    }

    return env.ASSETS.fetch(request);
  },
} satisfies ExportedHandler<Env>;

/* ───────────────────────── public API ───────────────────────── */

async function handleApi(request: Request, env: Env, url: URL): Promise<Response> {
  const p = url.pathname;
  const origin = url.origin;
  const cache = { 'cache-control': 'public, max-age=60, s-maxage=300' };

  /* ── Partner directory (stores, restaurants, service pros, riders) ── */
  if (p === '/api/partners' && request.method === 'POST') return await createPartner(request, env);
  if (p === '/api/partners' && request.method === 'GET') return await listPartners(env, url);

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
  const pm = p.match(/^\/admin\/partners\/([^/]+)\/status$/);
  if (pm && request.method === 'POST') {
    const status = url.searchParams.get('status');
    if (!status || !['live', 'hidden', 'pending'].includes(status)) return json({ error: 'status must be live | hidden | pending' }, 400);
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
  return `/img/${key}`;
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
  for (const h of hosts) {
    const u = new URL(`https://${h}/cgi/search.pl`);
    u.searchParams.set('search_terms', `${row.brand} ${bareName}`);
    u.searchParams.set('search_simple', '1');
    u.searchParams.set('action', 'process');
    u.searchParams.set('json', '1');
    u.searchParams.set('page_size', '10');
    u.searchParams.set('fields', 'code,product_name,product_name_en,brands,image_front_url,image_url,countries_tags');

    const res = await fetch(u.toString(), { headers: { 'user-agent': OFF_UA, accept: 'application/json' } });
    if (res.status === 429 || res.status === 503) throw new Error('rate limited');
    if (!res.ok) throw new Error(`search ${res.status}`);
    const data: any = await res.json().catch(() => { throw new Error('search returned non-JSON (likely blocked)'); });
    for (const hit of data.products ?? []) {
      const s = scoreHit(hit, row.brand, bareName);
      if (s > bestScore) { bestScore = s; best = { ...hit, _host: h }; }
    }
    if (best || (data.products ?? []).length > 0) break;
  }
  if (!best) return null;

  const imgUrl: string = best.image_front_url ?? best.image_url;
  const imgRes = await fetch(imgUrl, { headers: { 'user-agent': OFF_UA } });
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
   partner.zyphix.in. New entries go live immediately; /admin/partners/:id/status
   can hide one. Contact details are never returned by the public GET.          */

const PARTNER_TYPES: Record<string, string> = { merchant: 'store', store: 'store', restaurant: 'restaurant', service: 'service', delivery: 'delivery' };
const str = (v: unknown, max = 200) => (typeof v === 'string' ? v : Array.isArray(v) ? v.join(', ') : v == null ? '' : String(v)).trim().slice(0, max);

async function createPartner(request: Request, env: Env): Promise<Response> {
  let body: any;
  try { body = await request.json(); } catch { return json({ error: 'invalid JSON' }, 400); }
  const type = PARTNER_TYPES[str(body.role)];
  if (!type) return json({ error: 'unknown role' }, 400);
  const name = str(body.name, 120), email = str(body.email, 160).toLowerCase(), phone = str(body.phone, 20).replace(/\D/g, ''), city = str(body.city, 80);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || phone.length < 10) return json({ error: 'name, valid email and 10-digit phone are required' }, 400);
  const d = (body.details ?? {}) as Record<string, unknown>;
  const businessName = str(d.storeName ?? d.restaurantName ?? d.businessName ?? (type === 'delivery' || type === 'service' ? name : ''), 140) || name;
  const category = str(d.primaryCategory ?? d.restaurantType ?? d.storeType ?? d.vehicleType ?? d.vehicle ?? '', 80);
  const tags = str(d.cuisines ?? d.categories ?? d.additionalSkills ?? '', 300);
  const locality = str(d.locality ?? d.area ?? d.address ?? '', 160);
  const id = `${type.slice(0, 2)}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  // one live listing per (type, email): re-registering updates instead of duplicating
  const existing = await env.DB.prepare('SELECT id FROM partners WHERE type = ? AND email = ?').bind(type, email).first<{ id: string }>();
  if (existing) {
    await env.DB.prepare("UPDATE partners SET name=?, business_name=?, phone=?, city=?, locality=?, category=?, tags=?, details=?, updated_at=datetime('now') WHERE id=?")
      .bind(name, businessName, phone, city, locality, category, tags, JSON.stringify(d).slice(0, 8000), existing.id).run();
    return json({ success: true, id: existing.id, updated: true });
  }
  await env.DB.prepare('INSERT INTO partners (id, type, name, business_name, email, phone, city, locality, category, tags, details, status) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)')
    .bind(id, type, name, businessName, email, phone, city, locality, category, tags, JSON.stringify(d).slice(0, 8000), 'live').run();
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

const SUPABASE_URL_FALLBACK = 'https://awbccdtdszdxcxnsossy.supabase.co';
const SUPABASE_KEY_FALLBACK = 'sb_publishable_YE-BT6c07paKhTvlCiItZw_Mm2k6z5A';
const SESSION_COOKIE = 'zsid';
const SESSION_TTL_S = 90 * 24 * 60 * 60; // 90 days
const MAX_ADDRESSES = 10;

type UserRow = { id: string; email: string; name: string | null; phone: string | null; created_at: string; updated_at: string };
type AddressRow = { id: string; user_id: string; label: string | null; name: string | null; phone: string | null; line1: string; line2: string | null; city: string | null; pincode: string | null; is_default: number; created_at: string };
type OrderRow = { id: string; user_id: string | null; email: string | null; status: string; items: string; subtotal: number; delivery_fee: number; discount: number; total: number; payment_mode: string | null; address: string | null; eta_minutes: number | null; created_at: string };

const ACCOUNT_PATH = /^\/api\/(auth\/|me($|\/)|orders($|\/))/;
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

/** Session cookie → user row (null when missing, unknown or expired). */
async function getUser(request: Request, env: Env): Promise<UserRow | null> {
  const token = readCookie(request, SESSION_COOKIE);
  if (!token) return null;
  const hash = await sha256Hex(token);
  return await env.DB.prepare(
    "SELECT u.* FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > datetime('now')"
  ).bind(hash).first<UserRow>();
}

async function createSession(request: Request, env: Env, userId: string) {
  const token = b64url(crypto.getRandomValues(new Uint8Array(32)));
  const hash = await sha256Hex(token);
  const ua = (request.headers.get('user-agent') ?? '').slice(0, 300);
  await env.DB.prepare("INSERT INTO sessions (token_hash, user_id, expires_at, user_agent) VALUES (?, ?, datetime('now', ?), ?)")
    .bind(hash, userId, `+${SESSION_TTL_S} seconds`, ua).run();
  return cookieHeader(request, token, SESSION_TTL_S);
}

async function readJson(request: Request): Promise<Record<string, any> | null> {
  try { const b = await request.json(); return b && typeof b === 'object' ? b as Record<string, any> : {}; } catch { return null; }
}

async function handleAccount(request: Request, env: Env, url: URL): Promise<Response> {
  const p = url.pathname;
  const m = request.method;

  /* ── auth ── */
  if (p === '/api/auth/verify' && m === 'POST') return await authVerify(request, env);
  if (p === '/api/auth/logout' && m === 'POST') {
    const token = readCookie(request, SESSION_COOKIE);
    if (token) await env.DB.prepare('DELETE FROM sessions WHERE token_hash = ?').bind(await sha256Hex(token)).run();
    return json({ success: true }, 200, { 'set-cookie': cookieHeader(request, '', 0) });
  }

  /* ── orders: POST works for guests too; GET /api/orders/:id allows guest lookup of guest orders ── */
  if (p === '/api/orders' && m === 'POST') return await createOrder(request, env);
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

async function authVerify(request: Request, env: Env): Promise<Response> {
  const body = await readJson(request); if (!body) return json({ error: 'invalid JSON' }, 400);
  const email = str(body.email, 160).toLowerCase(); const otp = str(body.otp, 10); const token = str(body.token, 2000);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^\d{4,8}$/.test(otp) || !token) return json({ error: 'email, otp and token are required' }, 400);

  const base = (env.SUPABASE_URL ?? SUPABASE_URL_FALLBACK).replace(/\/$/, '');
  const key = env.SUPABASE_KEY ?? SUPABASE_KEY_FALLBACK;
  let data: any = null;
  try {
    const res = await fetch(`${base}/functions/v1/email-otp`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', apikey: key, authorization: `Bearer ${key}` },
      body: JSON.stringify({ action: 'verify', email, otp, token }),
    });
    data = await res.json().catch(() => null);
    if (!res.ok || !data?.success) return json({ error: str(data?.error, 300) || 'Incorrect or expired OTP' }, 400);
  } catch {
    return json({ error: 'Could not reach the verification service' }, 502);
  }

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
  const cookie = await createSession(request, env, user.id);
  return json({ user: toUser(user) }, 200, { 'set-cookie': cookie });
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
