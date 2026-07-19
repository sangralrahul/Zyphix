
# Zyphix Full q-commerce Build

Since the existing Zyphix app lives in `artifacts/zyphix/` (Vite + Wouter + Tanstack Query), I'll keep the same stack — no framework migration. Lovable Cloud (Supabase) is the backend.

## Phase 1 — Foundation (this turn)
1. Enable Lovable Cloud.
2. Create schema + RLS + grants in one migration:
   - `categories` (id, slug, name, icon_url, sort_order, parent_id)
   - `products` (id, sku, name, brand, category_id, price, mrp, unit, image_url, description, in_stock, rating, sort_order)
   - `addresses` (id, user_id, label, line1, line2, city, pincode, phone, is_default)
   - `carts` (id, user_id UNIQUE)
   - `cart_items` (id, cart_id, product_id, qty)
   - `orders` (id, user_id, address_id, subtotal, delivery_fee, total, status, created_at)
   - `order_items` (id, order_id, product_id, name, price, qty, image_url)
   - `user_roles` + `has_role()` helper (per platform rules)
3. Seed **12 categories + ~50 subcategories**:
   Fruits & Vegetables · Dairy, Bread & Eggs · Snacks & Munchies · Cold Drinks & Juices · Instant & Frozen Food · Tea, Coffee & Health Drinks · Bakery & Biscuits · Sweet Tooth · Atta, Rice & Dal · Masala, Oil & More · Sauces & Spreads · Chicken, Meat & Fish · Paan Corner · Personal Care · Home & Office · Baby Care · Pet Care · Cleaning Essentials
4. Seed **~800 real Indian FMCG products** with real brand names (Amul, Maggi, Britannia, Parle, Lay's, Kurkure, Dabur, Patanjali, Colgate, Surf Excel, Ariel, Nescafe, Red Bull, Coca-Cola, Pepsi, Tata, Aashirvaad, Fortune, MDH, Everest, Haldiram, Bikano, Cadbury, Nestle, Hershey, etc.) — prices in ₹, weights, MRP+discount, images from brand/marketplace CDNs.

## Phase 2 — Storefront pages (next turn)
- New home page: location bar, search, category grid (Blinkit-style circular icons), product rails ("Bestsellers", "Fresh Vegetables", "Deals under ₹99").
- Category page `/c/:slug` — subcategory sidebar + product grid.
- Product card with +/- qty stepper wired to cart.
- Search page with fuzzy match.
- Sticky mini-cart drawer.

## Phase 3 — Cart + Auth + Checkout (turn 3)
- Email/password + Google sign-in via Lovable Cloud.
- Cart page (edit qty, remove, subtotal, delivery fee, savings).
- Address book + add address modal.
- Checkout → COD only (payments deferred unless you want Stripe later).
- Order placed → clear cart → order confirmation page.

## Phase 4 — Account + Orders (turn 4)
- `/account` — profile, addresses, past orders.
- `/orders/:id` — order detail with items, status timeline.
- Polish: empty states, loading skeletons, mobile bottom nav wired to `/`, `/categories`, `/cart`, `/account`.

## Technical notes
- App lives in `artifacts/zyphix/`. Supabase client goes at `artifacts/zyphix/src/integrations/supabase/`.
- All product images referenced by URL (brand CDN / Amazon product images). No scraping.
- Existing pages (ZyphixEats, ZyphixBook, PartnerLanding, etc.) stay untouched.
- We'll replace the current `Home.tsx` with the new Blinkit-style storefront; old hero moves to `/about-zyphix` if you want to keep it (tell me if not).
- Every table gets RLS + explicit GRANT to `authenticated` (and `anon` for public reads like products/categories) per platform rules.

## What I'm NOT doing
- Not scraping Blinkit/Zepto/Instamart (IP/bot-block risk explained).
- Not adding real payments this pass (adds cost + verification steps). Say the word and I'll add Stripe after Phase 4.
- Not touching your existing `/eats`, `/book`, `/partner`, `/about`, splash, etc.

Approve and I'll execute Phase 1 immediately (Cloud + schema + 800-product seed). Each subsequent phase runs when you say "next".
