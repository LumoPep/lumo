import { NextRequest, NextResponse } from "next/server";
import {
  NOWPayments,
  generateOrderId,
  createOrderDescription,
} from "@/lib/nowpayments";
import { CartItem } from "@/lib/store";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency, email, customerInfo, items } = body;

    // Validate environment variables
    const apiKey = process.env.NOWPAYMENTS_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { success: false, error: "Payment system not configured" },
        { status: 500 }
      );
    }

    // Validate request data
    if (!amount || !currency || !email || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Initialize NOWPayments client
    const nowPayments = new NOWPayments(apiKey);

    // Generate order ID and description
    const orderId = generateOrderId();
    const orderDescription = createOrderDescription(items as CartItem[]);

    // Get the base URL for callbacks
    const baseUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    // Create payment request
    const paymentRequest = {
      price_amount: parseFloat(amount.toFixed(2)),
      price_currency: "usd",
      pay_currency: currency,
      ipn_callback_url: `${baseUrl}/api/payment-webhook`,
      order_id: orderId,
      order_description: orderDescription,
      success_url: `${baseUrl}/order-confirmation?order_id=${orderId}`,
      cancel_url: `${baseUrl}/checkout`,
    };

    // Create payment with NOWPayments
    const payment = await nowPayments.createPayment(paymentRequest);

    // In a production app, you would store the order details in a database here
    console.log("Payment created:", {
      orderId,
      paymentId: payment.payment_id,
      amount,
      currency,
      email,
      customerInfo,
    });

    return NextResponse.json({
      success: true,
      payment: {
        payment_id: payment.payment_id,
        order_id: orderId,
        pay_address: payment.pay_address,
        pay_amount: payment.pay_amount,
        pay_currency: payment.pay_currency,
        price_amount: payment.price_amount,
        price_currency: payment.price_currency,
        invoice_url: `https://nowpayments.io/payment/?iid=${payment.payment_id}`,
        expiration_estimate_date: payment.expiration_estimate_date,
      },
    });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error ? error.message : "Payment creation failed",
      },
      { status: 500 }
    );
  }
}
