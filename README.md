<div align="center">

<a href="https://zyphix.in"><img src="https://zyphix.in/og/main.jpg" alt="Zyphix — your neighbourhood, delivered" width="100%" /></a>

<br />

# Zyphix

**The SuperLocal app.** Groceries in minutes, food from local kitchens and verified home services, from the businesses already in your neighbourhood.

[![Website](https://img.shields.io/badge/zyphix.in-live-0DA366?style=flat-square)](https://zyphix.in)
[![Cloudflare Workers](https://img.shields.io/badge/Cloudflare-Workers%20%C2%B7%20D1%20%C2%B7%20R2-F38020?style=flat-square&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/workers/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-F69220?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io)

[Website](https://zyphix.in) · [Zyphix Now](https://now.zyphix.in) · [Zyphix Eats](https://eats.zyphix.in) · [Zyphix Book](https://book.zyphix.in) · [Partners](https://partner.zyphix.in) · [Help centre](https://support.zyphix.in)

</div>

---

## Overview

Zyphix connects people with the corner stores, kitchens and professionals already on their street. Instead of dark stores and warehouses, orders are fulfilled by independent local businesses at their own prices, with riders from the same neighbourhood.

One account works across every product, and every product runs on a single edge deployment.

## Products

| Product | Domain | What it does |
| --- | --- | --- |
| **Zyphix Now** | [now.zyphix.in](https://now.zyphix.in) | Groceries and daily essentials from nearby stores, delivered in about 30 minutes |
| **Zyphix Eats** | [eats.zyphix.in](https://eats.zyphix.in) | Restaurants, cafés, dhabas and home kitchens, cooked to order |
| **Zyphix Book** | [book.zyphix.in](https://book.zyphix.in) | Plumbers, electricians, cleaners and other verified home-service professionals |
| **Partners** | [partner.zyphix.in](https://partner.zyphix.in) | Onboarding for stores, restaurants, professionals and delivery partners |
| **Advertise** | [advertise.zyphix.in](https://advertise.zyphix.in) | Sponsored placements for local businesses and brands |
| **Support** | [support.zyphix.in](https://support.zyphix.in) | Help centre, articles and contact |
| **Accounts** | [auth.zyphix.in](https://auth.zyphix.in) · [accounts.zyphix.in](https://accounts.zyphix.in) | Passwordless email sign-in and the customer account |
| **Operations** | admin.zyphix.in | Partner review, orders, requests, inbox and email delivery |

## Highlights

- **One codebase, every subdomain.** A single React app detects the host and renders the right product.
- **Edge-first.** Pages, APIs, images and media are served from Cloudflare's network. Per-page titles, canonicals, Open Graph tags and structured data are rendered at the edge, so crawlers get them without running JavaScript.
- **Passwordless sign-in.** Six-digit email codes are stored hashed in D1, expire after ten minutes, and are rate-limited. One session cookie is shared across `*.zyphix.in`.
- **Partner pipeline.** Applications arrive as *pending*. The operations console approves, rejects or hides them, and approved partners go live on the public sites. Applicants and the team both receive an email with a PDF of the application.
- **Self-maintaining catalog.** A scheduled Worker resolves product photos, generates produce imagery with Workers AI and builds WebP thumbnails in R2.
- **Production hygiene.** Per-host `robots.txt` and sitemaps, 301 redirects, real 404 status codes, security headers (HSTS, CSP baseline, frame protection), rate limiting and spam traps on public forms, and an admin lockout after repeated failed keys.

## Architecture

```text
               Browser / mobile app
                       │
        *.zyphix.in  (Cloudflare edge)
                       │
   ┌───────────────────┴──────────────────────────┐
   │  Worker  (artifacts/zyphix/worker)            │
   │  edge.ts       redirects · SEO tags · robots  │
   │                sitemaps · security headers    │
   │  index.ts      /api/*  catalog, orders, auth  │
   │                /admin/*  operations API       │
   │                /img/*  /media/*  proxies      │
   │  partnerMail   Brevo email + PDF (pdf-lib)    │
   └──────┬──────────────┬──────────────┬─────────┘
          │              │              │
     D1 (SQLite)     R2 (images)    Workers AI
 products · orders   thumbnails     produce photos
 users · sessions
 partners · inbox
          │
   Static assets  →  React 19 + Vite SPA (one build, all hosts)
```

## Tech stack

| Layer | Technology |
| --- | --- |
| Frontend | React 19, Vite 7, TypeScript, Tailwind CSS v4, wouter, Framer Motion, lucide-react |
| Edge and API | Cloudflare Workers, HTMLRewriter, static assets binding |
| Data | Cloudflare D1, R2, Workers AI |
| Email | Brevo transactional API; PDFs generated with pdf-lib |
| Mobile | Expo / React Native (`mobile/`) |
| Tooling | pnpm workspaces, Wrangler, Playwright for audits |

## Repository layout

```text
Zyphix/
├── artifacts/
│   └── zyphix/                 # the web app and the Worker (deployed to Cloudflare)
│       ├── src/                # React app: pages, sites (partner, support, auth…), UI kit
│       ├── worker/             # Cloudflare Worker: API, edge layer, email
│       ├── shared/             # page map shared by the Worker and the app (SEO, sitemaps)
│       ├── public/             # static files: fonts, images, OG images, service worker
│       ├── db/                 # D1 schema and seed data
│       ├── scripts/            # build, catalog export and image pipeline scripts
│       ├── wrangler.toml       # Worker configuration and bindings
│       └── DEPLOY.md           # first-time Cloudflare setup
├── mobile/                     # Expo app for Android and iOS
├── lib/                        # shared workspace libraries
└── package.json                # pnpm workspace root
```

## Getting started

**Prerequisites:** Node.js 20+, pnpm 10, and a Cloudflare account with Wrangler signed in (`pnpm exec wrangler login`).

```bash
git clone https://github.com/sangralrahul/Zyphix.git
cd Zyphix
pnpm install

cd artifacts/zyphix
pnpm run dev          # front-end only, Vite dev server
pnpm run cf:dev       # full stack: build + Worker with local D1/R2
```

To preview a subdomain locally, add `?site=` to any URL: `now`, `eats`, `book`, `partner`, `advertise`, `support`, `auth`, `accounts` or `admin`.

## Configuration

Secrets are stored on the Worker and never committed:

```bash
pnpm exec wrangler secret put ADMIN_TOKEN      # key for the operations console
pnpm exec wrangler secret put BREVO_API_KEY    # transactional email
```

| Variable | Required | Purpose |
| --- | --- | --- |
| `ADMIN_TOKEN` | Yes | Bearer key for `/admin/*` and the operations console |
| `BREVO_API_KEY` | Yes | Sign-in codes, partner and contact emails |
| `MAIL_FROM` | No | Default sender (`noreply@zyphix.in`) |
| `PARTNER_FROM` | No | Partner email sender (`partnerships@zyphix.in`) |
| `PARTNER_NOTIFY_EMAIL` | No | Who is told about new partner applications |
| `NOTIFY_EMAIL` | No | Who receives contact, support and advertiser messages |

For local development, put the same keys in `artifacts/zyphix/.dev.vars`, which is ignored by git.

## Deployment

```bash
cd artifacts/zyphix
pnpm run cf:deploy    # builds the app and deploys the Worker with its assets
```

Each subdomain is attached to the `zyphix` Worker as a custom domain (Workers & Pages → zyphix → Settings → Domains & Routes). First-time setup for D1, R2 and the catalog seed is covered in [`artifacts/zyphix/DEPLOY.md`](artifacts/zyphix/DEPLOY.md).

## Scripts

Run these from `artifacts/zyphix`:

| Command | Description |
| --- | --- |
| `pnpm run dev` | Vite dev server |
| `pnpm run build:cf` | Production build for Cloudflare |
| `pnpm run cf:dev` | Build and run the Worker locally |
| `pnpm run cf:deploy` | Build and deploy to Cloudflare |
| `pnpm run typecheck` | Type-check the app |
| `pnpm run db:schema` / `db:seed` | Create and seed the remote D1 database |
| `pnpm run images:sync` | Resolve missing product images |

## Contributing

1. Branch from `main`: `git switch -c feature/short-description`
2. Keep changes focused and run `pnpm run typecheck` and `pnpm run build:cf` before pushing.
3. Open a pull request that describes the change and how it was tested.

## Security

Please don't report vulnerabilities in public issues. Email **security@zyphix.in** instead; see [`/.well-known/security.txt`](https://zyphix.in/.well-known/security.txt).

## License and company

Zyphix is a product of [Clavix Technologies Pvt. Ltd.](https://clavix.in) The source code is proprietary; all rights reserved unless stated otherwise.

<div align="center">
<br />
<sub>© 2026 Clavix Technologies Pvt. Ltd. · <a href="https://zyphix.in">zyphix.in</a> · <a href="https://zyphix.in/privacy">Privacy</a> · <a href="https://zyphix.in/terms">Terms</a></sub>
</div>
