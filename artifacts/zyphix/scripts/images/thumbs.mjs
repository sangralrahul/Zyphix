// Generates 480px WebP thumbnails for every product image already in R2 (fast, no external lookups).
// Usage: node scripts/images/thumbs.mjs [--base https://zyphix.in] [--size 480]   (ADMIN_TOKEN from env or .dev.vars)
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
const args = Object.fromEntries(process.argv.slice(2).map((a, i, arr) => a.startsWith('--') ? [a.slice(2), arr[i + 1]] : []).filter(Boolean));
const base = (args.base ?? 'https://zyphix.in').replace(/\/$/, '');
const size = Number(args.size ?? 480);
let token = process.env.ADMIN_TOKEN;
if (!token) { try { token = readFileSync(join(dirname(fileURLToPath(import.meta.url)), '..', '..', '.dev.vars'), 'utf8').match(/^\s*ADMIN_TOKEN\s*=\s*"?([^"\r\n]+)"?/m)?.[1]; } catch {} }
if (!token) { console.error('ADMIN_TOKEN is required (env or artifacts/zyphix/.dev.vars)'); process.exit(1); }
const headers = { authorization: `Bearer ${token}` };
let sharp; try { sharp = (await import('sharp')).default; } catch { console.error('sharp is required: run `corepack pnpm install` in the repo root'); process.exit(1); }

const keys = await fetch(`${base}/admin/images/thumbs/pending`, { headers }).then(r => r.json());
if (!Array.isArray(keys)) { console.error('could not list pending thumbs:', keys); process.exit(1); }
console.log(`${keys.length} images need thumbnails`);
let done = 0, failed = 0;
const worker = async () => {
  while (keys.length) {
    const key = keys.shift();
    try {
      const res = await fetch(`${base}/img/${key}`);
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      const buf = await sharp(Buffer.from(await res.arrayBuffer())).rotate().resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true }).webp({ quality: 82 }).toBuffer();
      const put = await fetch(`${base}/admin/images/thumb?key=${encodeURIComponent(key)}`, { method: 'PUT', headers: { ...headers, 'content-type': 'image/webp' }, body: buf });
      if (!put.ok) throw new Error(`upload ${put.status}`);
      done++; if (done % 25 === 0) console.log(`  ${done} done`);
    } catch (e) { failed++; console.log(`failed ${key} – ${e.message}`); }
  }
};
await Promise.all(Array.from({ length: 6 }, worker));
console.log(`done: ${done} thumbnails, ${failed} failed`);
