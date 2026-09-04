import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import type { Quote } from '@/lib/psc/quote';
import { orderRowFromQuote, type Address } from '@/lib/psc/order';
import { verifyQuote } from '@/lib/psc/sign';

const ORDER_REF = /^pi_[A-Za-z0-9]+$/;

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

export async function POST(request: NextRequest) {
  const secret = process.env.PSC_QUOTE_SECRET;
  if (!secret) {
    return NextResponse.json({ error: { code: 'quote_unavailable' } }, { status: 503 });
  }

  let body: {
    quote?: Quote;
    sig?: string;
    order_ref?: string;
    contact?: { email?: string; name?: string; institution?: string };
    shipping?: Address;
    promoCode?: string;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: { code: 'bad_order', message: 'Invalid order body.' } }, { status: 400 });
  }

  const quote = body.quote;
  const sig = body.sig;
  const orderRef = typeof body.order_ref === 'string' ? body.order_ref : '';
  const contact = body.contact;
  const shipping = body.shipping;

  if (!quote || typeof sig !== 'string' || !verifyQuote(quote, sig, secret)) {
    return NextResponse.json({ error: { code: 'bad_quote', message: 'Quote signature is invalid.' } }, { status: 400 });
  }
  if (!ORDER_REF.test(orderRef)) {
    return NextResponse.json({ error: { code: 'bad_order_ref', message: 'order_ref is invalid.' } }, { status: 400 });
  }
  if (!contact?.email || !contact?.name || !shipping?.address1 || !shipping?.city || !shipping?.state || !shipping?.zip) {
    return NextResponse.json({ error: { code: 'bad_contact', message: 'Contact and shipping are required.' } }, { status: 400 });
  }

  const row = orderRowFromQuote(
    quote,
    orderRef,
    { email: contact.email, name: contact.name, institution: contact.institution },
    {
      address1: shipping.address1,
      address2: shipping.address2,
      city: shipping.city,
      state: shipping.state,
      zip: shipping.zip,
      country: shipping.country || 'US',
    },
    typeof body.promoCode === 'string' ? body.promoCode : null,
  );

  const supabase = serverClient();
  if (!supabase) {
    console.error('psc/order: supabase env missing');
    return NextResponse.json({ ok: false });
  }

  try {
    const existing = await supabase
      .from('orders')
      .select('order_id')
      .eq('payment_id', orderRef)
      .maybeSingle();
    if (existing.data?.order_id) {
      return NextResponse.json({ ok: true, order_id: existing.data.order_id });
    }

    const { error } = await supabase.from('orders').upsert(row, { onConflict: 'order_id' });
    if (error) {
      console.error('psc/order: upsert failed', error);
      return NextResponse.json({ ok: false });
    }
    return NextResponse.json({ ok: true, order_id: row.order_id });
  } catch (err) {
    console.error('psc/order: failed', err);
    return NextResponse.json({ ok: false });
  }
}
