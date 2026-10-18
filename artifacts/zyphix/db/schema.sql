-- Zyphix Now catalog (Cloudflare D1)
CREATE TABLE IF NOT EXISTS categories (
  name       TEXT PRIMARY KEY,
  icon       TEXT,
  color      TEXT,
  image_url  TEXT,
  sort       INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id            TEXT PRIMARY KEY,
  name          TEXT NOT NULL,
  brand         TEXT NOT NULL,
  price         INTEGER NOT NULL,
  orig_price    INTEGER,
  category      TEXT NOT NULL REFERENCES categories(name),
  weight        TEXT,
  image_url     TEXT,                 -- absolute URL or /img/<r2-key>
  image_source  TEXT,                 -- 'openfoodfacts' | 'openbeautyfacts' | 'workers-ai' | 'merchant' | 'unsplash'
  image_status  TEXT NOT NULL DEFAULT 'pending',  -- pending | ready | not_found | failed
  image_kind    TEXT NOT NULL DEFAULT 'packaged', -- packaged | produce
  barcode       TEXT,
  tag           TEXT,
  store_name    TEXT,
  distance      TEXT,
  in_stock      INTEGER NOT NULL DEFAULT 1,
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_brand    ON products(brand);
CREATE INDEX IF NOT EXISTS idx_products_image    ON products(image_status);
