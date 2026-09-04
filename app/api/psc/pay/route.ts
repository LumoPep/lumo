import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import { CREATE_ATTEMPT_FAILED, RUO_REQUIRED } from '@/lib/psc/buyerCopy';
import { newOrderId, orderRowFromQuote, type Address } from '@/lib/psc/order';
import type { Quote } from '@/lib/psc/quote';
import { verifyQuote } from '@/lib/psc/sign';
import { RAIL_PAYMENT_INTENT_URL } from '@/lib/psc/stripe';

export const runtime = 'nodejs';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function reject(code: string, message: string, status: number) {
  return NextResponse.json({ error: { code, message } }, { status });
}

/**
 * The one server hop of the money path:
 *   signed quote → PRISM rail mints the PaymentIntent (3% fee, card+link, RUO attestation)
 *   → pending `orders` row keyed by the PI id → client_secret to the browser.
 * Fail-closed: no row, no client_secret. No fallback Stripe call (playbook rule 4a).
 */
export async function POST(request: NextRequest) {
  const secret = process.env.PSC_QUOTE_SECRET;
  const psk = process.env.PRISM_SERVER_KEY;
  if (!secret || !psk) {
    console.error('psc/pay: PSC_QUOTE_SECRET or PRISM_SERVER_KEY missing');
    return reject('payment_unavailable', CREATE_ATTEMPT_FAILED, 503);
  }

  let body: {
    quote?: Quote;
    sig?: string;
    contact?: { email?: string; name?: string; institution?: string };
    shipping?: Address;
    promoCode?: string;
    attested_at?: string;
  };
  try {
    body = await request.json();
  } catch {
    return reject('bad_body', 'Invalid request.', 400);
  }

  const { quote, sig, contact, shipping } = body;
  if (!quote || typeof sig !== 'string' || !verifyQuote(quote, sig, secret)) {
    return reject('bad_quote', 'Quote signature is invalid.', 400);
  }
  const email = String(contact?.email ?? '').trim();
  const name = String(contact?.name ?? '').trim();
  if (
    !EMAIL.test(email) || !name ||
    !shipping?.address1 || !shipping?.city || !shipping?.state || !shipping?.zip
  ) {
    return reject('bad_contact', 'Contact and shipping are required.', 400);
  }
  const attestedMs = Date.parse(String(body.attested_at ?? ''));
  if (!Number.isFinite(attestedMs)) {
    return reject('attestation_required', RUO_REQUIRED, 400);
  }

  const order_id = newOrderId();
  let railRes: Response;
  try {
    railRes = await fetch(RAIL_PAYMENT_INTENT_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${psk}` },
      body: JSON.stringify({
        order_id,
        amount_cents: quote.cart.total_cents,
        currency: 'usd',
        customer_email: email,
        // Buyer's RUO tick on this page; the rail enforces freshness (−24h … +5min).
        attestation: { accepted: true, accepted_at: new Date(attestedMs).toISOString() },
      }),
      cache: 'no-store',
    });
  } catch (err) {
    console.error('psc/pay: rail unreachable', err);
    return reject('payment_unavailable', CREATE_ATTEMPT_FAILED, 502);
  }
  const rail = (await railRes.json().catch(() => ({}))) as {
    client_secret?: unknown;
    payment_intent_id?: unknown;
    error?: unknown;
  };
  if (
    !railRes.ok ||
    typeof rail.client_secret !== 'string' ||
    typeof rail.payment_intent_id !== 'string'
  ) {
    console.error('psc/pay: rail rejected', railRes.status, rail.error);
    return reject('payment_unavailable', CREATE_ATTEMPT_FAILED, 502);
  }

  const row = orderRowFromQuote(
    quote,
    { order_id, payment_id: rail.payment_intent_id },
    { email, name, institution: contact?.institution },
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
    console.error('psc/pay: supabase env missing');
    return reject('order_unavailable', CREATE_ATTEMPT_FAILED, 503);
  }
  const { error } = await supabase.from('orders').insert(row);
  if (error) {
    console.error('psc/pay: order insert failed', error);
    return reject('order_unavailable', CREATE_ATTEMPT_FAILED, 503);
  }

  return NextResponse.json({ client_secret: rail.client_secret, order_ref: rail.payment_intent_id });
}
