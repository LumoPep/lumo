import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { pscDb, ORDERS_TABLE } from '@/lib/psc/db';

function lumoClient() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) return null;
  return createClient('https://auqspvdbelxnhluikifc.supabase.co', key);
}

/** Direct DB check — safe to call server-side without an HTTP round-trip. */
export async function checkIsFirstOrder(email: string): Promise<boolean> {
  const trimmedEmail = email.trim();

  // --- Check 1: PRISM Supabase ---
  let prismHasOrders = false;
  try {
    const supabase = pscDb();
    if (!supabase) {
      console.error('check-first-order: PSC Supabase not configured');
    } else {
      console.log('check-first-order: querying PRISM table', ORDERS_TABLE, 'for email', trimmedEmail);
      const { data, error } = await supabase
        .from(ORDERS_TABLE)
        .select('id')
        .ilike('email', trimmedEmail)
        .limit(1);
      if (error) {
        console.error('check-first-order: PRISM query failed', error);
      } else {
        prismHasOrders = !!(data && data.length > 0);
        console.log('check-first-order: PRISM found', data?.length ?? 0, 'orders');
      }
    }
  } catch (err) {
    console.error('check-first-order: PRISM check threw', err);
  }

  if (prismHasOrders) return false;

  // --- Check 2: Lumo Supabase (lumo_orders) ---
  let lumoHasOrders = false;
  try {
    const lumo = lumoClient();
    if (!lumo) {
      console.error('check-first-order: Lumo Supabase not configured (missing SUPABASE_SERVICE_ROLE_KEY)');
    } else {
      console.log('check-first-order: querying lumo_orders for email', trimmedEmail);
      const { data, error } = await lumo
        .from('lumo_orders')
        .select('id')
        .ilike('email', trimmedEmail)
        .limit(1);
      if (error) {
        console.error('check-first-order: lumo_orders query failed', error);
      } else {
        lumoHasOrders = !!(data && data.length > 0);
        console.log('check-first-order: lumo_orders found', data?.length ?? 0, 'orders');
      }
    }
  } catch (err) {
    console.error('check-first-order: Lumo check threw', err);
  }

  return !lumoHasOrders;
}

export async function GET(request: NextRequest) {
  const email = request.nextUrl.searchParams.get('email');
  if (!email) {
    return NextResponse.json({ isFirstOrder: true });
  }
  const isFirstOrder = await checkIsFirstOrder(email);
  return NextResponse.json({ isFirstOrder });
}
