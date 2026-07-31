"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface OrderItem {
  productName: string;
  variant: string;
  quantity: number;
  price: number;
}

interface PendingOrder {
  paymentId: string;
  orderId: string;
  amount: number;
  currency: string;
  items: OrderItem[];
}

const cryptoLabel: Record<string, string> = {
  btc: "Bitcoin (BTC)",
  eth: "Ethereum (ETH)",
  usdttrc20: "USDT (TRC-20)",
  usdcerc20: "USDC (ERC-20)",
  ltc: "Litecoin (LTC)",
};

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<PendingOrder | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem("pendingOrder");
      if (raw) {
        setOrder(JSON.parse(raw));
        sessionStorage.removeItem("pendingOrder");
      }
    } catch {
      // sessionStorage unavailable or data malformed
    }
    setLoaded(true);
  }, []);

  if (!loaded) return null;

  // Fallback: sessionStorage was cleared (e.g. page refresh)
  if (!order) {
    return (
      <div className="min-h-screen bg-bone py-24 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-6">
            <circle cx="30" cy="30" r="29" stroke="#B8624A" strokeWidth="2" fill="none" />
            <circle cx="30" cy="30" r="8" fill="#B8624A" />
          </svg>
          <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-3">
            ORDER RECEIVED
          </div>
          <h1
            className="font-display text-4xl text-ink mb-4"
            style={{ fontWeight: 300 }}
          >
            Payment Initiated
          </h1>
          <p className="font-editorial text-ink opacity-70 mb-8">
            Your payment has been submitted. Check your email for confirmation
            once the blockchain transaction is confirmed.
          </p>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-mono text-clay hover:text-ink transition-colors"
          >
            → CONTINUE SHOPPING
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone py-16 px-6">
      <div className="container mx-auto max-w-2xl">
        {/* Header */}
        <div className="text-center mb-12">
          <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-6">
            <circle cx="30" cy="30" r="29" stroke="#B8624A" strokeWidth="2" fill="none" />
            <circle cx="30" cy="30" r="8" fill="#B8624A" />
          </svg>
          <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-3">
            ORDER CONFIRMED · L-012
          </div>
          <h1
            className="font-display text-4xl text-ink mb-4"
            style={{ fontWeight: 300 }}
          >
            Payment Initiated
          </h1>
          <p className="font-editorial text-ink opacity-70">
            Your order has been received. We'll confirm shipment once your
            blockchain payment clears.
          </p>
        </div>

        {/* Order Details */}
        <div className="bg-cream hairline-border p-8 mb-6">
          <div className="flex justify-between items-start mb-6 pb-6 border-b hairline-border">
            <div>
              <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-1">
                ORDER ID
              </p>
              <p className="font-mono text-sm text-ink">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-1">
                PAYMENT METHOD
              </p>
              <p className="font-mono text-sm text-ink">
                {cryptoLabel[order.currency] || order.currency.toUpperCase()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p
                    className="font-display text-sm text-ink"
                    style={{ fontWeight: 300, fontStyle: "italic" }}
                  >
                    {item.productName}
                  </p>
                  <p className="font-mono text-xs text-ink opacity-55 mt-0.5">
                    {item.variant} × {item.quantity}
                  </p>
                </div>
                <p className="font-mono text-sm text-ink">
                  ${(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>

          <div className="border-t hairline-border pt-4">
            <div className="flex justify-between items-center">
              <span className="font-mono text-xs uppercase tracking-mono text-ink font-medium">
                Total
              </span>
              <span
                className="font-display text-2xl text-ink"
                style={{ fontWeight: 300 }}
              >
                ${order.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Email Notice */}
        <div className="bg-ink p-6 mb-6">
          <p className="font-mono text-xs uppercase tracking-mono text-clay mb-2">
            CHECK YOUR EMAIL
          </p>
          <p className="font-editorial text-sm text-bone opacity-80">
            A confirmation will be sent to your email once your crypto payment
            is confirmed on the blockchain. This typically takes 10–60 minutes
            depending on network congestion.
          </p>
        </div>

        {/* What Happens Next */}
        <div className="bg-cream hairline-border p-8 mb-8">
          <h2 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-6">
            WHAT HAPPENS NEXT
          </h2>
          <div className="space-y-5">
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-clay flex-shrink-0 mt-0.5">
                01 —
              </span>
              <p className="font-editorial text-sm text-ink opacity-80">
                Your crypto payment is confirmed on the blockchain (10–60 min)
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-clay flex-shrink-0 mt-0.5">
                02 —
              </span>
              <p className="font-editorial text-sm text-ink opacity-80">
                We prepare your order and include your Certificate of Analysis
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-clay flex-shrink-0 mt-0.5">
                03 —
              </span>
              <p className="font-editorial text-sm text-ink opacity-80">
                Your order ships in room-temperature stable packaging with
                2-day delivery
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="py-3 px-8 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors text-center"
          >
            → CONTINUE SHOPPING
          </Link>
          <Link
            href="/contact"
            className="py-3 px-8 hairline-border text-ink font-mono text-xs uppercase tracking-mono hover:border-clay hover:text-clay transition-colors text-center"
          >
            CONTACT SUPPORT
          </Link>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">
        L-012
      </div>
    </div>
  );
}
