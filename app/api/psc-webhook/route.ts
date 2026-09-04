import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { amountMatches } from '@/lib/psc/order';
import { submitToRapid } from '@/lib/psc/rapid';

export const runtime = 'nodejs';

function serverClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

async function incrementPromo(code: string | null | undefined) {
  if (!code) return;
  const supabase = serverClient();
  if (!supabase) return;
  const { data, error } = await supabase
    .from('promo_codes')
    .select('id, usage_count')
    .eq('code', code.toUpperCase())
    .maybeSingle();
  if (error || !data) {
    if (error) console.error('psc-webhook: promo lookup failed', error);
    return;
  }
  const { error: updateError } = await supabase
    .from('promo_codes')
    .update({ usage_count: (data.usage_count ?? 0) + 1 })
    .eq('id', data.id);
  if (updateError) console.error('psc-webhook: promo increment failed', updateError);
}

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.LUMO_STRIPE_WEBHOOK_SECRET;
  const sig = request.headers.get('stripe-signature');
  const rawBody = await request.text();
  if (!webhookSecret || !sig) {
    console.error('psc-webhook: missing LUMO_STRIPE_WEBHOOK_SECRET or stripe-signature');
    return NextResponse.json({ error: { code: 'invalid_signature' } }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    // https://docs.stripe.com/webhooks#verify-official-libraries
    event = Stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
  } catch (err) {
    console.error('psc-webhook: constructEvent failed', err);
    return NextResponse.json({ error: { code: 'invalid_signature' } }, { status: 400 });
  }

  const supabase = serverClient();
  if (!supabase) {
    console.error('psc-webhook: supabase env missing');
    return NextResponse.json({ received: true });
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object as Stripe.PaymentIntent;
      if (pi.metadata?.psc_embed_pcid !== process.env.NEXT_PUBLIC_PSC_PCID) {
        return NextResponse.json({ received: true });
      }
      const { data: row, error } = await supabase
        .from('orders')
        .select('*')
        .eq('payment_intent_id', pi.id)
        .maybeSingle();
      if (error) {
        console.error('psc-webhook: lookup failed', error);
        return NextResponse.json({ received: true });
      }
      if (!row) {
        console.error('psc-webhook: no order for', pi.id);
        return NextResponse.json({ received: true });
      }
      if (row.status === 'paid') {
        return NextResponse.json({ received: true });
      }
      const now = new Date().toISOString();
      if (!amountMatches({ amount: pi.amount, currency: pi.currency }, { expected_total_cents: row.expected_total_cents })) {
        const { error: reviewError } = await supabase
          .from('orders')
          .update({ status: 'review', updated_at: now })
          .eq('payment_intent_id', pi.id);
        if (reviewError) console.error('psc-webhook: review update failed', reviewError);
        return NextResponse.json({ received: true });
      }
      const { error: paidError } = await supabase
        .from('orders')
        .update({ status: 'paid', updated_at: now })
        .eq('payment_intent_id', pi.id);
      if (paidError) {
        console.error('psc-webhook: paid update failed', paidError);
        return NextResponse.json({ received: true });
      }
      await submitToRapid({ ...row, status: 'paid' });
      await incrementPromo(row.discount_code);
    } else if (event.type === 'payment_intent.payment_failed') {
      const pi = event.data.object as Stripe.PaymentIntent;
      const now = new Date().toISOString();
      const { error } = await supabase
        .from('orders')
        .update({ status: 'failed', updated_at: now })
        .eq('payment_intent_id', pi.id);
      if (error) console.error('psc-webhook: failed update failed', error);
    }
  } catch (err) {
    console.error('psc-webhook: handler failed', err);
  }

  return NextResponse.json({ received: true });
}
