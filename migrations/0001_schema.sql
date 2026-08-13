CREATE TABLE products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  brand TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('kitchen', 'personal-care', 'clothing', 'baby', 'home')),
  price_cents INTEGER NOT NULL CHECK (price_cents > 0),
  materials TEXT NOT NULL,   -- JSON array of strings
  synthetics TEXT NOT NULL,  -- JSON array of strings
  packaging TEXT NOT NULL CHECK (packaging IN ('plastic-free', 'recycled-plastic', 'mixed')),
  description TEXT NOT NULL
);

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- id is the SHA-256 hash of the session token, never the token itself,
-- so a read of this table can't be used to forge a session.
CREATE TABLE sessions (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  expires_at TEXT NOT NULL
);
CREATE INDEX idx_sessions_user ON sessions(user_id);

CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | cancelled
  total_cents INTEGER NOT NULL,
  stripe_session_id TEXT UNIQUE,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX idx_orders_user ON orders(user_id);

CREATE TABLE order_items (
  id TEXT PRIMARY KEY,
  order_id TEXT NOT NULL REFERENCES orders(id),
  product_id TEXT NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price_cents INTEGER NOT NULL
);
CREATE INDEX idx_order_items_order ON order_items(order_id);
