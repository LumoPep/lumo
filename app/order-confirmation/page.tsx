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

  if (!order) {
    return (
      <div className="min-h-screen bg-bone py-24 px-6 flex items-center justify-center">
        <div className="text-center max-w-md">
          <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-6">
            <circle cx="30" cy="30" r="29" stroke="#607A5C" strokeWidth="2" fill="none" />
            <polyline points="20,30 28,38 42,22" stroke="#607A5C" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-3">
            Order Received
          </div>
          <h1 className="font-display text-4xl text-ink mb-4" style={{ fontWeight: 300 }}>
            Payment confirmed
          </h1>
          <p className="font-editorial text-ink opacity-70 mb-8">
            Your order has been received. A confirmation has been sent to your email.
          </p>
          <Link
            href="/products"
            className="font-mono text-xs uppercase tracking-mono text-clay hover:text-ink transition-colors"
          >
            → Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bone py-16 px-6">
      <div className="container mx-auto max-w-2xl">

        <div className="text-center mb-12">
          <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-6">
            <circle cx="30" cy="30" r="29" stroke="#607A5C" strokeWidth="2" fill="none" />
            <polyline points="20,30 28,38 42,22" stroke="#607A5C" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-3">
            Order confirmed · {order.orderId}
          </div>
          <h1 className="font-display text-4xl text-ink mb-4" style={{ fontWeight: 300 }}>
            Payment confirmed
          </h1>
          <p className="font-editorial text-ink opacity-70">
            Your order has been received and is being prepared. A confirmation has been sent to your email.
          </p>
        </div>

        <div className="bg-cream hairline-border p-8 mb-6">
          <div className="flex justify-between items-start mb-6 pb-6 border-b hairline-border">
            <div>
              <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-1">
                Order ID
              </p>
              <p className="font-mono text-sm text-ink">{order.orderId}</p>
            </div>
            <div className="text-right">
              <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-1">
                Payment method
              </p>
              <p className="font-mono text-sm text-ink">Card</p>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <p className="font-display text-sm text-ink" style={{ fontWeight: 300, fontStyle: "italic" }}>
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
              <span className="font-display text-2xl text-ink" style={{ fontWeight: 300 }}>
                ${order.amount.toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-cream hairline-border p-8 mb-8">
          <h2 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-6">
            What happens next
          </h2>
          <div className="space-y-5">
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-clay flex-shrink-0 mt-0.5">01 —</span>
              <p className="font-editorial text-sm text-ink opacity-80">
                A confirmation email is on its way to you now.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-clay flex-shrink-0 mt-0.5">02 —</span>
              <p className="font-editorial text-sm text-ink opacity-80">
                Your order will be dispatched within 1–2 business days.
              </p>
            </div>
            <div className="flex items-start space-x-4">
              <span className="font-mono text-xs text-clay flex-shrink-0 mt-0.5">03 —</span>
              <p className="font-editorial text-sm text-ink opacity-80">
                Certificates of analysis are available in your account.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/products"
            className="py-3 px-8 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors text-center"
          >
            → Continue shopping
          </Link>
          <Link
            href="/contact"
            className="py-3 px-8 hairline-border text-ink font-mono text-xs uppercase tracking-mono hover:border-clay hover:text-clay transition-colors text-center"
          >
            Contact support
          </Link>
        </div>

        <p className="font-mono text-xs text-ink opacity-30 text-center mt-12">
          For research use only. Not for human or veterinary use.
        </p>

      </div>
    </div>
  );
}
