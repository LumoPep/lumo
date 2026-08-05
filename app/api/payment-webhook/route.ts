import { NextRequest, NextResponse } from "next/server";
import { verifyIPNSignature } from "@/lib/nowpayments";
import { getSupabase } from "@/lib/supabase";
import { submitOrderWithSession, type RapidOrder } from "@/lib/rapidfulfillment";
import { mapOrderItems, type CartItemLike } from "@/lib/orderMapping";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function submitToRapid(order: any): Promise<void> {
  try {

    const items: CartItemLike[] = Array.isArray(order.items) ? order.items : [];
    const { mapped, unmapped } = mapOrderItems(items);

    if (unmapped.length > 0) {
      console.warn(
        `Rapid: ${unmapped.length} item(s) missing supplier code mapping:`,
        unmapped.map((i) => `${i.productId}:${i.variant}`)
      );
    }

    if (mapped.length === 0) {
      console.error(`Rapid: order ${order.order_id} has no mappable items — skipping submission`);
      return;
    }

    // Split full name into firstname / surname for ordersAddressData
    const fullName = (order.customer_name || 'Research Customer').trim();
    const spaceIdx = fullName.lastIndexOf(' ');
    const firstname = spaceIdx > 0 ? fullName.slice(0, spaceIdx) : fullName;
    const surname   = spaceIdx > 0 ? fullName.slice(spaceIdx + 1) : '';

    // Combine address lines for the single `address` field
    const addressLine = [order.address1, order.address2].filter(Boolean).join(', ');

    const addressData: RapidOrder['shipping'] = {
      customer_id: 0,
      firstname,
      surname,
      address:  addressLine || '',
      town:     order.city    || '',
      postcode: order.zip     || '',
      country:  order.country || 'US',
      phone:    order.phone   || '',
      email:    order.email   || '',
    };

    // order_date must be YYYY-MM-DD HH:MM:SS
    const orderDate = new Date().toISOString().replace('T', ' ').substring(0, 19);

    const rapidOrder: RapidOrder = {
      orderIdPrefix: process.env.RAPID_ORDER_PREFIX ?? '1',
      orderId:       order.order_id,
      source:        'lumo-web',
      orderDate,
      currency:      'USD',
      billing:       addressData,
      shipping:      addressData,
      items:         mapped,
      totalCost:     order.total ?? 0,
    };

    const result = await submitOrderWithSession(rapidOrder);
    console.log(`Rapid: order ${rapidOrder.orderIdPrefix}-${rapidOrder.orderId} submitted — response: ${result}`);
  } catch (err) {
    // Non-fatal: payment is already confirmed; log and continue
    console.error(`Rapid: failed to submit order ${order?.order_id}:`, err);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the IPN secret from environment
    const ipnSecret = process.env.NOWPAYMENTS_IPN_SECRET;
    if (!ipnSecret) {
      console.error("IPN secret not configured");
      return NextResponse.json(
        { success: false, error: "Webhook not configured" },
        { status: 500 }
      );
    }

    // Get the signature from headers
    const signature = request.headers.get("x-nowpayments-sig");
    if (!signature) {
      console.error("Missing signature in webhook request");
      return NextResponse.json(
        { success: false, error: "Missing signature" },
        { status: 400 }
      );
    }

    // Get the raw body
    const body = await request.text();

    // Verify signature
    const isValid = verifyIPNSignature(signature, ipnSecret, body);
    if (!isValid) {
      console.error("Invalid webhook signature");
      return NextResponse.json(
        { success: false, error: "Invalid signature" },
        { status: 401 }
      );
    }

    // Parse the payload
    const payload = JSON.parse(body);

    // Log the payment notification
    console.log("Payment webhook received:", {
      payment_id: payload.payment_id,
      payment_status: payload.payment_status,
      order_id: payload.order_id,
      pay_amount: payload.pay_amount,
      actually_paid: payload.actually_paid,
      pay_currency: payload.pay_currency,
      price_amount: payload.price_amount,
      price_currency: payload.price_currency,
    });

    // Handle different payment statuses
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const supabase = getSupabase() as any;
    const now = new Date().toISOString();

    switch (payload.payment_status) {
      case "finished": {
        // Mark order paid and fetch the row for fulfillment submission
        const { data: orderData, error } = await supabase
          .from("orders")
          .update({ status: "paid", updated_at: now })
          .eq("order_id", payload.order_id)
          .select()
          .single();

        if (error) {
          console.error(`Failed to update order ${payload.order_id} to paid:`, error);
        } else {
          console.log(`Order ${payload.order_id} marked as paid`);
          await submitToRapid(orderData);
        }
        break;
      }

      case "failed":
      case "expired": {
        const { error } = await supabase
          .from("orders")
          .update({ status: "failed", updated_at: now })
          .eq("order_id", payload.order_id);
        if (error) console.error(`Failed to update order ${payload.order_id} to failed:`, error);
        else console.log(`Order ${payload.order_id} marked as failed (${payload.payment_status})`);
        break;
      }

      case "partially_paid":
        console.log(`Order ${payload.order_id} partially paid`);
        break;

      case "confirmed":
        console.log(`Order ${payload.order_id} payment confirmed on blockchain`);
        break;

      case "sending":
        console.log(`Order ${payload.order_id} payment sending`);
        break;

      case "refunded":
        console.log(`Order ${payload.order_id} payment refunded`);
        break;

      default:
        console.log(
          `Order ${payload.order_id} status: ${payload.payment_status}`
        );
    }

    // Return success response
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Webhook failed",
      },
      { status: 500 }
    );
  }
}
