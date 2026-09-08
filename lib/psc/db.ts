import { createClient } from '@supabase/supabase-js';

/**
 * PSC order records live in PRISM's own Supabase (PSC_SUPABASE_*), not Lumo's:
 * Lumo's `orders` table blocks inserts (RLS) and lacks the discount/shipping columns.
 * Falls back to Lumo's public values so local dev without PSC_* still runs.
 */
export const ORDERS_TABLE = process.env.PSC_ORDERS_TABLE || 'orders';

export function pscDb() {
  const url = process.env.PSC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.PSC_SUPABASE_SERVICE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}
