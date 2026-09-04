-- Promo codes table
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('percent', 'free_shipping')),
  value NUMERIC,
  usage_limit INTEGER,
  usage_count INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Orders table
-- NOTE: If migrating an existing table, run the ALTER TABLE statements below instead.
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT UNIQUE NOT NULL,       -- NOWPayments order ID (e.g. LUMO-XXXXXXXXX)
  payment_id TEXT,                      -- NOWPayments payment ID
  email TEXT NOT NULL,
  customer_name TEXT,
  address1 TEXT,
  address2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  items JSONB NOT NULL DEFAULT '[]',
  subtotal NUMERIC NOT NULL,
  discount_amount NUMERIC DEFAULT 0,
  discount_type TEXT,
  discount_code TEXT,
  shipping_amount NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  currency TEXT,                        -- crypto currency code (btc, eth, etc.)
  status TEXT NOT NULL DEFAULT 'pending', -- pending | paid | failed
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX orders_email_idx ON orders(email);
CREATE INDEX orders_order_id_idx ON orders(order_id);

-- Migration: run these if the orders table already exists
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS order_id TEXT UNIQUE;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS customer_name TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS address1 TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS address2 TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS city TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS state TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS zip TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS country TEXT DEFAULT 'US';
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS items JSONB NOT NULL DEFAULT '[]';
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS currency TEXT;
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'pending';
-- ALTER TABLE orders ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT now();
-- CREATE INDEX IF NOT EXISTS orders_order_id_idx ON orders(order_id);

-- PSC embed columns (additive). Lumo runs these; routes log missing-column failures
-- and never 500 the buyer.
ALTER TABLE orders ADD COLUMN IF NOT EXISTS provider text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_intent_id text;
ALTER TABLE orders ADD COLUMN IF NOT EXISTS expected_total_cents integer;
CREATE INDEX IF NOT EXISTS orders_payment_intent_id_idx ON orders(payment_intent_id);
