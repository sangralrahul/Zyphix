# Zyphix — Product Requirements & Progress

## Original Problem Statement
User connected an existing GitHub site (Zyphix) and asked to (1) run it in the live preview, then (2) "ADD EVERYTHING YOU RECOMMENDED": Location Picker, Live Search, and Cart Checkout.

## Architecture
- Monorepo (pnpm workspaces), NOT the standard Emergent structure.
- Main app: `artifacts/zyphix` — React 19 + Vite 7 + Tailwind 4 + wouter routing + Supabase.
- Runs on port 3000 via supervisor `frontend` program (which runs `yarn start` in `/app/frontend`, a launcher that calls `pnpm --filter @workspace/zyphix run dev`).
- Data: static mock data in `src/data/mockData.ts`. Cart & orders persisted in localStorage (keys: `zyphix_cart_v1`, `zyphix_orders_v1`, location `zyphix_loc`). No backend used.

## Environment setup done (2026-08-15)
- Installed pnpm deps; added missing ARM64 native binaries (rollup, @tailwindcss/oxide, lightningcss) that workspace overrides stripped for x64.
- Created `/app/frontend/package.json` launcher so supervisor serves the Vite app on port 3000.

## Implemented (2026-08-15)
- **Location Picker**: pre-existing in Home.tsx navbar (GPS reverse-geocode + searchable city/area list + custom entry); persists to `zyphix_loc`. Verified working.
- **Live Search** (NEW): global search input in Home.tsx navbar with instant results dropdown across groceries (products), dishes (menuItems) and restaurants. Includes empty state, clear button, Escape/outside-click close, and quick "Add" to cart for grocery items. Fixed invisible input text (dark-on-dark).
- **Cart + Checkout** (NEW wiring): navbar Cart button now reads real CartContext count and navigates to `/now/cart`. Full flow already existed: `/now/cart` → `/now/checkout` (address + COD/Online) → `/now/order/:id` confirmation. Verified end-to-end.
- Fixed nested `<a>` React warning in Cart.tsx (wouter Link + inner anchor).

### data-testids added
`global-search-input`, `global-search-clear`, `global-search-results`, `search-grocery-*`, `search-dish-*`, `search-restaurant-*`, `search-add-*`, `navbar-cart-button`, `navbar-cart-count`.

## Testing
- iteration_1.json: 5/5 core features pass (100%). Only MEDIUM issue (nested `<a>` on Cart) — fixed.
- iteration_2.json: Emergent Google Auth — backend 100% (8/8 pytest), frontend 95%. Only nit (lingering `#session_id` in URL) — fixed with deferred hash clear.

## Emergent Google Auth (added 2026-08-15)
- NEW FastAPI backend at `/app/backend/server.py` (port 8001, routed via `/api`): `POST /api/auth/session` (X-Session-ID → Emergent session-data exchange, upserts user, sets httpOnly `session_token` cookie), `GET /api/auth/me`, `POST /api/auth/logout`. MongoDB db `zyphix`, collections `users` + `user_sessions`.
- Frontend: `AuthContext.tsx` handles the OAuth redirect + `#session_id` callback exchange and server session verification; `loginWithGoogle()` redirects to `auth.emergentagent.com`. AuthModal "Continue with Google" now does the real redirect (was mocked). Navbar reflects logged-in user; Sign out revokes session.
- Testing playbook saved at `/app/auth_testing.md`; credentials/seed at `/app/memory/test_credentials.md`.

## Backlog / Next
- **Razorpay (IN PROGRESS / PAUSED)**: Backend `server.py` has the razorpay client initialized (reads `RAZORPAY_KEY_ID`/`RAZORPAY_KEY_SECRET` env, currently empty → disabled). Endpoints (create-order, verify) and Checkout "Online" wiring NOT yet added — paused when user switched to the app-page redesign. Resume: add `/api/payments/config|create-order|verify` + wire Checkout ONLINE path + load checkout.js.
- P2: Same nested-`<a>` console warning exists (pre-existing) in Wishlist, Notifications, ZyphixNow, Wallet, ProductDetail — cosmetic only.
- P2: Add data-testids to Checkout form fields for easier automation.
- P1 ideas: connect homepage product-grid Add buttons (currently local state) to CartContext for full consistency; wire search Enter to a dedicated results page.
