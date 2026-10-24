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

-- Partner directory: registrations from the sign-up forms, listed on the sub-sites
CREATE TABLE IF NOT EXISTS partners (
  id            TEXT PRIMARY KEY,
  type          TEXT NOT NULL,                 -- store | restaurant | service | delivery
  name          TEXT NOT NULL,                 -- owner / person
  business_name TEXT NOT NULL,                 -- store / restaurant name (person for riders & pros)
  email         TEXT NOT NULL,
  phone         TEXT NOT NULL,
  city          TEXT,
  locality      TEXT,
  category      TEXT,                          -- store type / cuisine type / primary service / vehicle
  tags          TEXT,                          -- comma list: cuisines, categories, skills
  details       TEXT,                          -- JSON of the full form payload
  status        TEXT NOT NULL DEFAULT 'live',  -- live | hidden | pending
  created_at    TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at    TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_partners_type_status ON partners(type, status);
CREATE UNIQUE INDEX IF NOT EXISTS idx_partners_type_email ON partners(type, email);

-- Accounts (auth.zyphix.in): email-OTP sessions shared across *.zyphix.in via cookie
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY, email TEXT NOT NULL UNIQUE, name TEXT, phone TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY, user_id TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')), expires_at TEXT NOT NULL, user_agent TEXT
);
CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id);
CREATE TABLE IF NOT EXISTS addresses (
  id TEXT PRIMARY KEY, user_id TEXT NOT NULL, label TEXT, name TEXT, phone TEXT,
  line1 TEXT NOT NULL, line2 TEXT, city TEXT, pincode TEXT, is_default INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_addresses_user ON addresses(user_id);
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY, user_id TEXT, email TEXT, status TEXT NOT NULL DEFAULT 'placed',
  items TEXT NOT NULL, subtotal INTEGER NOT NULL, delivery_fee INTEGER NOT NULL DEFAULT 0,
  discount INTEGER NOT NULL DEFAULT 0, total INTEGER NOT NULL, payment_mode TEXT, address TEXT,
  eta_minutes INTEGER, created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id, created_at);
