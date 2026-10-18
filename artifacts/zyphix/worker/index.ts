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
 * Everything else falls through to the static Vite build (SPA).
 */

export interface Env {
  DB: D1Database;
  IMAGES: R2Bucket;
  AI: Ai;
  ASSETS: Fetcher;
  ADMIN_TOKEN: string;
  PUBLIC_IMAGE_BASE?: string; // optional, e.g. https://img.zyphix.in  (defaults to same-origin /img)
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

  const obj = await env.IMAGES.get(key);
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

  if (p === '/admin/images/status') {
    const { results } = await env.DB.prepare('SELECT image_status AS status, image_source AS source, COUNT(*) AS n FROM products GROUP BY 1,2 ORDER BY 1,2').all();
    return json(results);
  }

  if (p === '/admin/images/reset' && request.method === 'POST') {
    const status = url.searchParams.get('status') ?? 'failed';
    const r = await env.DB.prepare("UPDATE products SET image_status = 'pending' WHERE image_status = ?").bind(status).run();
    return json({ reset: r.meta.changes });
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
      await env.DB.prepare("UPDATE products SET image_status = 'failed', updated_at = datetime('now') WHERE brand = ? AND name = ? AND image_status = 'pending'")
        .bind(row.brand, row.name).run();
      report.push({ product: label, status: 'failed', error: (err as Error).message });
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
    if (!res.ok) continue;
    const data: any = await res.json();
    for (const hit of data.products ?? []) {
      const s = scoreHit(hit, row.brand, bareName);
      if (s > bestScore) { bestScore = s; best = { ...hit, _host: h }; }
    }
    if (best) break;
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
