---
name: ZYPHIX product images
description: Why product cards use downloaded real photos instead of Unsplash stock, and the local path convention.
---

Generic Unsplash stock photos don't match specific Indian FMCG packaging (e.g. a Lay's card showing fried food, Maggi showing an egg, Oreo showing chocolate bars) — visually wrong to users who recognize the actual brand packaging.

**Decision:** For branded product entries in `mockData.ts`, search for and download real product photos (Amazon/Flipkart/brand CDN sources) via the image-search skill, save them locally under `artifacts/zyphix/public/images/products/<id>.<ext>`, and reference them as `/images/products/<id>.<ext>` (Vite serves `public/` at root, no import needed).

**Why:** Avoids hotlink/CORS/expiry risk from external stock sources, and ensures the product image actually matches the named brand/product instead of a generic category photo.

**How to apply:** When adding or fixing product images in this app, prefer this local-download approach over Unsplash URLs. Watch for oversized source images (one candidate was 3200x3200 / 2.2MB) — resize with `magick convert -resize 400x400 -quality 85` before committing, since product cards render small.

As of this session, only the Snacks & Munchies category (sn1–sn15) was converted. Other categories (Noodles np1-10, remaining Beauty, Bakery/Biscuits, Chocolates, Dry Fruits, Dairy) still use generic/repeated Unsplash stock and are candidates for the same treatment if the user reports similar mismatches there.
