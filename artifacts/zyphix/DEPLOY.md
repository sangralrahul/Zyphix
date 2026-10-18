# Deploying Zyphix Now on Cloudflare

Stack: **Workers** (API + static Vite build) · **D1** (catalog) · **R2** (product images) · **Workers AI** (produce photos).
One `wrangler deploy` ships everything. Run all commands from `artifacts/zyphix`.

## 0. One-time setup

```bash
pnpm install                       # pulls wrangler + workers-types
pnpm exec wrangler login           # opens browser, pick the account holding the $10k credits

pnpm exec wrangler d1 create zyphix-catalog      # copy the database_id it prints
pnpm exec wrangler r2 bucket create zyphix-images
```

Paste the `database_id` into `wrangler.toml` (replace `REPLACE_WITH_ID_FROM_wrangler_d1_create`).

```bash
pnpm exec wrangler secret put ADMIN_TOKEN        # any long random string; keep it, the image sync needs it
```

## 1. Load the catalog into D1

```bash
pnpm run catalog:export            # mockData.ts -> db/seed.sql (already generated, re-run after editing mockData)
pnpm run db:schema                 # creates tables
pnpm run db:seed                   # 2,946 products, 26 categories
```

## 2. Deploy

```bash
pnpm run cf:deploy                 # vite build -> dist/public, then wrangler deploy
```

You get a `*.workers.dev` URL immediately. Check `https://<url>/api/products?category=Dairy%20%26%20Eggs&limit=3`.

## 3. Fill product images (one-off, ~20–30 min)

```bash
ADMIN_TOKEN=<your token> node scripts/images/sync.mjs --base https://<your-workers-dev-url>
```

What it does, per unique brand+name (989 of them; weight variants share one image):

| Kind | Source | Stored as |
|---|---|---|
| Packaged goods (Amul, Britannia, Tata Sampann, MDH, …) | Open Food Facts / Open Beauty Facts – CC-BY-SA product photos, matched on brand + name, barcode saved | `R2: products/<brand>/<name>-<barcode>.jpg` |
| Produce (`Local Farm`, Fruits & Veg) | Workers AI `flux-1-schnell`, studio-style on white | `R2: produce/<name>.jpg` |
| No confident match | left as `not_found`, keeps placeholder, surfaces in `/admin/images/status` for merchant upload later | — |

Re-run the same command any time; it only touches `pending` rows. To retry misses after fixing a name:

```bash
curl -X POST -H "Authorization: Bearer $ADMIN_TOKEN" "https://<url>/admin/images/reset?status=not_found"
```

Images are served from `/img/<key>` by the Worker with a one-year immutable cache, so R2 reads are near zero after the first hit.

## 4. Point zyphix.in at it

1. Cloudflare dashboard → add the `zyphix.in` zone (or if it's already there, skip).
2. Uncomment the `routes` block in `wrangler.toml` and deploy again. Cloudflare provisions the cert.

## 5. CI (optional)

`.github/workflows/deploy-cloudflare.yml` deploys on every push to `main`. Add these repo secrets:
`CLOUDFLARE_API_TOKEN` (Workers Scripts:Edit, D1:Edit, R2:Edit, Account:Read), `CLOUDFLARE_ACCOUNT_ID`,
and the three `VITE_SUPABASE_*` values from `.env`.

## How the frontend uses it

`src/lib/catalog.ts` → `useCatalog()` fetches `/api/products` + `/api/categories` once per session.
If the API is unreachable (local `vite dev`, outage) it silently uses the bundled `mockData.ts`, so `/now` never goes blank.
`ZyphixNow.tsx` and `ProductDetail.tsx` now read from the hook; `Home.tsx` and `Admin.tsx` still import `mockData` directly and can be switched the same way.

Local dev against real data: `pnpm run cf:dev` (wrangler dev with remote D1/R2) — or set `VITE_API_BASE=https://<url>` for plain `vite dev`.

## Rough cost on credits

D1 and R2 free tiers cover this catalog many times over (~3k rows, ~1k images ≈ 100 MB). Workers AI: ~1,000 flux-schnell images ≈ a few dollars. The bulk of the credits stays untouched.
