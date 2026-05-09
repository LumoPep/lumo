import { NextRequest, NextResponse } from "next/server";
import { verifyIPNSignature } from "@/lib/nowpayments";

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
    switch (payload.payment_status) {
      case "finished":
        // Payment completed successfully
        // In production, you would:
        // 1. Update order status in database
        // 2. Send confirmation email to customer
        // 3. Trigger fulfillment process
        console.log(`Order ${payload.order_id} payment completed`);
        break;

      case "partially_paid":
        // Payment received but amount is less than expected
        console.log(`Order ${payload.order_id} partially paid`);
        break;

      case "confirmed":
        // Payment confirmed on blockchain
        console.log(`Order ${payload.order_id} payment confirmed`);
        break;

      case "sending":
        // Payment is being processed
        console.log(`Order ${payload.order_id} payment sending`);
        break;

      case "failed":
        // Payment failed
        console.log(`Order ${payload.order_id} payment failed`);
        break;

      case "refunded":
        // Payment was refunded
        console.log(`Order ${payload.order_id} payment refunded`);
        break;

      case "expired":
        // Payment expired (customer didn't pay in time)
        console.log(`Order ${payload.order_id} payment expired`);
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
