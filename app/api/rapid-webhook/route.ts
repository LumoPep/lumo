import { NextRequest, NextResponse } from 'next/server';
import { pscDb, ORDERS_TABLE } from '@/lib/psc/db';
import { rapidOrderId } from '@/lib/psc/order';

export const runtime = 'nodejs';

type RapidShipment = {
  rapid_order_id?: string | null;
  lumo_numeric_id?: number | string | null;
  tracking_number: string;
  carrier: string;
  shipped_at?: string | null;
  estimated_delivery?: string | null;
};

/** Extract the numeric order ID from a Rapid order ID string like "1-71468164" → 71468164. */
function parseRapidOrderId(rapid_order_id: string): number | null {
  const parts = rapid_order_id.split('-');
  const numeric = parts[parts.length - 1];
  const parsed = Number.parseInt(numeric, 10);
  return Number.isFinite(parsed) ? parsed : null;
}

/** Resolve the numeric ID to match against rapidOrderId(order.order_id). */
function resolveNumericId(shipment: RapidShipment): number | null {
  if (shipment.rapid_order_id) {
    return parseRapidOrderId(shipment.rapid_order_id);
  }
  if (shipment.lumo_numeric_id != null) {
    const n = Number(shipment.lumo_numeric_id);
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function trackingUrl(carrier: string, trackingNumber: string): string | null {
  const c = carrier.toUpperCase();
  if (c.includes('UPS')) return `https://www.ups.com/track?tracknum=${trackingNumber}`;
  if (c.includes('FEDEX')) return `https://www.fedex.com/fedextrack/?tracknumbers=${trackingNumber}`;
  if (c.includes('USPS')) return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingNumber}`;
  if (c.includes('DHL')) return `https://www.dhl.com/us-en/home/tracking.html?tracking-id=${trackingNumber}`;
  return null;
}

export async function POST(request: NextRequest) {
  // Authenticate with shared secret
  const secret = process.env.RAPID_WEBHOOK_SECRET;
  if (secret) {
    const provided =
      request.headers.get('x-rapid-secret') ||
      request.headers.get('authorization')?.replace(/^Bearer\s+/i, '');
    if (provided !== secret) {
      console.error('rapid-webhook: invalid secret');
      return NextResponse.json({ received: true });
    }
  }

  let shipments: RapidShipment[];
  try {
    const body = await request.json();
    shipments = Array.isArray(body) ? body : [body];
  } catch (err) {
    console.error('rapid-webhook: failed to parse body', err);
    return NextResponse.json({ received: true });
  }

  const db = pscDb();
  if (!db) {
    console.error('rapid-webhook: supabase env missing');
    return NextResponse.json({ received: true });
  }

  // Fetch all paid orders to match by numeric order ID
  const { data: orders, error: fetchError } = await db
    .from(ORDERS_TABLE)
    .select('*')
    .eq('status', 'paid');

  if (fetchError) {
    console.error('rapid-webhook: failed to fetch paid orders', fetchError);
    return NextResponse.json({ received: true });
  }

  for (const shipment of shipments) {
    try {
      const numericId = resolveNumericId(shipment);

      if (numericId === null) {
        console.error('rapid-webhook: could not resolve numeric ID from shipment', shipment);
        continue;
      }

      // Find the matching order via rapid_order_id (primary) or lumo_numeric_id (fallback)
      const order = (orders ?? []).find(
        (o: { order_id: string }) => rapidOrderId(o.order_id) === numericId,
      );

      if (!order) {
        console.error('rapid-webhook: no paid order found for numeric ID', numericId, shipment.rapid_order_id ?? shipment.lumo_numeric_id);
        continue;
      }

      // Update order status to fulfilled in Supabase
      const now = new Date().toISOString();
      const { error: updateError } = await db
        .from(ORDERS_TABLE)
        .update({ status: 'fulfilled', updated_at: now })
        .eq('order_id', order.order_id);

      if (updateError) {
        console.error('rapid-webhook: failed to update order status', updateError);
      }

      // Send shipping notification email via Resend
      try {
        const { shippingNotificationHtml } = await import('@/lib/email/shippingNotification');
        const url = trackingUrl(shipment.carrier, shipment.tracking_number);
        await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'Lumo <noreply@lumopep.com>',
            to: [order.email],
            subject: `Your order has shipped — ${order.order_id}`,
            html: shippingNotificationHtml({
              order_id: order.order_id,
              customer_name: order.customer_name,
              tracking_number: shipment.tracking_number,
              carrier: shipment.carrier,
              estimated_delivery: shipment.estimated_delivery ?? null,
              tracking_url: url,
              items: order.items ?? [],
            }),
          }),
        });
      } catch (emailErr) {
        console.error('rapid-webhook: failed to send shipping email', emailErr);
      }

      // Notify Omnisend of fulfillment
      try {
        const { omnisendOrderFulfilled } = await import('@/lib/omnisend');
        await omnisendOrderFulfilled(order.order_id, order.email);
      } catch (omniErr) {
        console.error('rapid-webhook: omnisend fulfillment failed', omniErr);
      }
    } catch (err) {
      console.error('rapid-webhook: error processing shipment', shipment.rapid_order_id ?? shipment.lumo_numeric_id, err);
    }
  }

  return NextResponse.json({ received: true });
}
