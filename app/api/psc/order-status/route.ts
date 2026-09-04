import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const ORDER_REF = /^pi_[A-Za-z0-9]+$/;
const STATES = ['pending', 'paid', 'failed', 'review'] as const;

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function jsonState(state: 'pending' | 'paid' | 'failed' | 'review' | 'unknown') {
  return NextResponse.json(
    { state },
    { headers: { 'cache-control': 'no-store' } },
  );
}

export async function GET(request: NextRequest) {
  const orderRef = request.nextUrl.searchParams.get('order_ref') ?? '';
  if (!ORDER_REF.test(orderRef)) {
    return jsonState('unknown');
  }

  const supabase = serverClient();
  if (!supabase) {
    console.error('psc/order-status: supabase env missing');
    return jsonState('unknown');
  }

  try {
    const { data, error } = await supabase
      .from('orders')
      .select('status')
      .eq('payment_intent_id', orderRef)
      .maybeSingle();
    if (error) {
      console.error('psc/order-status: lookup failed', error);
      return jsonState('unknown');
    }
    const status = typeof data?.status === 'string' ? data.status : '';
    if ((STATES as readonly string[]).includes(status)) {
      return jsonState(status as (typeof STATES)[number]);
    }
    return jsonState('unknown');
  } catch (err) {
    console.error('psc/order-status: failed', err);
    return jsonState('unknown');
  }
}
