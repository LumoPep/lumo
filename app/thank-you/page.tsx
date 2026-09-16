"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
import { useCartStore } from "@/lib/store";
import { POLL_UNAVAILABLE } from "@/lib/psc/buyerCopy";
import { PLATFORM_PK, STRIPE_ACCOUNT } from "@/lib/psc/stripe";

const PENDING_COPY = "Payment received by Stripe. We'll email you when it clears.";
const PAID_COPY = "Paid. Your order is being prepared.";
const FAILED_COPY = "This payment did not go through. Nothing was charged.";

const STATES = ["pending", "paid", "failed", "review", "unknown"] as const;
type OrderState = (typeof STATES)[number];

type StripeBrowser = (
  publishableKey: string,
  options?: { stripeAccount?: string },
) => {
  retrievePaymentIntent: (clientSecret: string) => Promise<{
    error?: { type?: string; code?: string };
    paymentIntent?: { id?: string; status?: string };
  }>;
};

function parseState(value: unknown): OrderState {
  return STATES.includes(value as OrderState) ? (value as OrderState) : "unknown";
}

function copyFor(state: OrderState): string {
  if (state === "pending") return PENDING_COPY;
  if (state === "paid") return PAID_COPY;
  if (state === "failed") return FAILED_COPY;
  return POLL_UNAVAILABLE;
}

function mergeState(poll: OrderState | null, intent: OrderState | null): OrderState {
  if (poll === "failed" || intent === "failed") return "failed";
  if (poll === "paid") return "paid";
  if (intent === "paid") return "paid";
  if (poll === "review") return "review";
  if (poll === "pending" || intent === "pending") return "pending";
  return "unknown";
}

function intentToState(status: string | undefined): OrderState {
  if (status === "succeeded") return "paid";
  if (
    status === "processing" ||
    status === "requires_action" ||
    status === "requires_confirmation" ||
    status === "requires_capture"
  ) {
    return "pending";
  }
  if (status === "requires_payment_method" || status === "canceled") return "failed";
  return "unknown";
}

async function fetchOrderState(orderRef: string): Promise<OrderState> {
  try {
    const res = await fetch(`/api/psc/order-status?order_ref=${encodeURIComponent(orderRef)}`);
    const body = await res.json().catch(() => ({}));
    return parseState(body.state);
  } catch {
    return "unknown";
  }
}

function waitForStripe(ms: number): Promise<StripeBrowser> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      const ctor = (window as Window & { Stripe?: StripeBrowser }).Stripe;
      if (ctor) {
        resolve(ctor);
        return;
      }
      if (Date.now() - started > ms) {
        reject(new Error("timed out waiting for Stripe.js"));
        return;
      }
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

function ThankYouContent() {
  const searchParams = useSearchParams();
  const orderRef = searchParams.get("order_ref") ?? "";
  const clearCart = useCartStore((s) => s.clearCart);
  const clientSecret = searchParams.get("payment_intent_client_secret") ?? "";
  const pollRef = useRef<OrderState | null>(null);
  const intentRef = useRef<OrderState | null>(null);
  const [state, setState] = useState<OrderState>("unknown");
  const [orderItems, setOrderItems] = useState<Array<{ productName: string; variant: string; quantity: number; price: number }>>([]);
  const [orderTotal, setOrderTotal] = useState<number | null>(null);
  const [cleanOrderId, setCleanOrderId] = useState<string | null>(null);

  useEffect(() => {
    clearCart();
    pollRef.current = null;
    intentRef.current = null;
    setState("unknown");

    let stopped = false;
    const apply = () => {
      if (!stopped) setState(mergeState(pollRef.current, intentRef.current));
    };

    const pollOnce = async () => {
      if (!orderRef) return;
      try {
        const res = await fetch(`/api/psc/order-status?order_ref=${encodeURIComponent(orderRef)}`);
        const body = await res.json().catch(() => ({}));
        if (stopped) return;
        pollRef.current = parseState(body.state);
        if (body.items?.length > 0) setOrderItems(body.items);
        if (body.total) setOrderTotal(body.total);
        if (body.order_id) setCleanOrderId(body.order_id);
        apply();
      } catch {
        pollRef.current = 'unknown';
        apply();
      }
    };

    void pollOnce();
    const started = Date.now();
    const timer = window.setInterval(() => {
      if (stopped) return;
      if (Date.now() - started >= 120000) {
        window.clearInterval(timer);
        return;
      }
      const current = mergeState(pollRef.current, intentRef.current);
      if (current === "paid" || current === "failed") {
        window.clearInterval(timer);
        return;
      }
      void pollOnce();
    }, 3000);

    return () => {
      stopped = true;
      window.clearInterval(timer);
    };
  }, [orderRef]);

  useEffect(() => {
    if (!clientSecret) return;
    let cancelled = false;

    (async () => {
      try {
        const StripeCtor = await waitForStripe(15000);
        // Platform context, same as the pay box.
        const stripe = StripeCtor(PLATFORM_PK, { stripeAccount: STRIPE_ACCOUNT });
        // https://docs.stripe.com/js/payment_intents/retrieve_payment_intent
        const result = await stripe.retrievePaymentIntent(clientSecret);
        if (cancelled) return;
        if (result.error || !result.paymentIntent) return;
        if (orderRef && result.paymentIntent.id && result.paymentIntent.id !== orderRef) return;
        intentRef.current = intentToState(result.paymentIntent.status);
        setState(mergeState(pollRef.current, intentRef.current));
      } catch {
        /* keep polling; never treat retrieve failure as paid */
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [clientSecret, orderRef]);

  const isPaid = state === "paid";
  const isPending = state === "pending";
  const isFailed = state === "failed";

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6" style={{ backgroundColor: "#F5EFE4" }}>
      <div className="container mx-auto max-w-2xl">

        {/* Header */}
        <div className="text-center mb-12">
          <svg width="56" height="56" viewBox="0 0 56 56" className="mx-auto mb-6">
            {isFailed ? (
              <>
                <circle cx="28" cy="28" r="27" stroke="#B8624A" strokeWidth="1.5" fill="none" />
                <line x1="19" y1="19" x2="37" y2="37" stroke="#B8624A" strokeWidth="1.5" strokeLinecap="round" />
                <line x1="37" y1="19" x2="19" y2="37" stroke="#B8624A" strokeWidth="1.5" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="28" cy="28" r="27" stroke="#607A5C" strokeWidth="1.5" fill="none" />
                <polyline points="18,28 26,36 40,21" stroke="#607A5C" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
          </svg>
          <p className="font-mono text-xs uppercase tracking-widest mb-3" style={{ color: "#1A1814", opacity: 0.6, letterSpacing: "0.15em" }}>
            {isFailed ? "Payment failed" : isPending ? "Processing" : "Order confirmed"}
          </p>
          <h1 className="font-display mb-4" style={{ fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 300, color: "#1A1814" }}>
            {isFailed ? "Payment not completed" : isPending ? "Payment processing" : "Payment confirmed"}
          </h1>
          <p className="font-editorial" style={{ fontSize: "1rem", color: "#1A1814", opacity: 0.75, maxWidth: "480px", margin: "0 auto", lineHeight: 1.6 }}>
            {isFailed
              ? "This payment did not go through. Nothing was charged. Please try again."
              : isPending
              ? "Your payment has been received and is being processed. We'll email you once confirmed."
              : "Your order has been received and is being prepared. A confirmation has been sent to your email."}
          </p>
        </div>

        {!isFailed && (
          <>
            {/* Order details card */}
            <div className="mb-6" style={{ backgroundColor: "#EBE2CF", border: "1px solid rgba(26,24,20,0.12)" }}>
              {/* Order meta */}
              <div className="flex justify-between items-start px-8 py-6" style={{ borderBottom: "1px solid rgba(26,24,20,0.12)" }}>
                <div>
                  <p className="font-mono text-xs uppercase mb-1" style={{ letterSpacing: "0.12em", color: "#1A1814", opacity: 0.55 }}>Order ID</p>
                  <p className="font-mono text-sm" style={{ color: "#1A1814" }}>{cleanOrderId ?? orderRef}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs uppercase mb-1" style={{ letterSpacing: "0.12em", color: "#1A1814", opacity: 0.55 }}>Status</p>
                  <p className="font-mono text-sm" style={{ color: isPending ? "#B8624A" : "#607A5C" }}>
                    {isPending ? "Processing" : "Confirmed"}
                  </p>
                </div>
              </div>

              {/* Items */}
              {orderItems.length > 0 && (
                <div className="px-8 py-6" style={{ borderBottom: "1px solid rgba(26,24,20,0.12)" }}>
                  <div className="space-y-4">
                    {orderItems.map((item, index) => (
                      <div key={index} className="flex justify-between items-start">
                        <div>
                          <p className="font-display" style={{ fontWeight: 300, fontStyle: "italic", fontSize: "0.95rem", color: "#1A1814" }}>
                            {item.productName}
                          </p>
                          <p className="font-mono mt-0.5" style={{ fontSize: "11px", color: "#1A1814", opacity: 0.6 }}>
                            {item.variant} × {item.quantity}
                          </p>
                        </div>
                        <p className="font-mono text-sm" style={{ color: "#1A1814" }}>
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Total */}
              {orderTotal && (
                <div className="flex justify-between items-center px-8 py-5">
                  <span className="font-mono text-xs uppercase" style={{ letterSpacing: "0.12em", color: "#1A1814", fontWeight: 600 }}>Total</span>
                  <span className="font-display" style={{ fontSize: "1.75rem", fontWeight: 300, color: "#1A1814" }}>${orderTotal.toFixed(2)}</span>
                </div>
              )}
            </div>

            {/* What happens next */}
            <div className="mb-6 px-8 py-7" style={{ backgroundColor: "#EBE2CF", border: "1px solid rgba(26,24,20,0.12)" }}>
              <h2 className="font-mono text-xs uppercase mb-5" style={{ letterSpacing: "0.12em", color: "#1A1814", fontWeight: 600 }}>
                What happens next
              </h2>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#B8624A" }}>01 —</span>
                  <p className="font-editorial text-sm" style={{ color: "#1A1814", opacity: 0.85, lineHeight: 1.6 }}>
                    A confirmation email is on its way to you now.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#B8624A" }}>02 —</span>
                  <p className="font-editorial text-sm" style={{ color: "#1A1814", opacity: 0.85, lineHeight: 1.6 }}>
                    Your order will be dispatched within 1–2 business days.
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <span className="font-mono text-xs flex-shrink-0 mt-0.5" style={{ color: "#B8624A" }}>03 —</span>
                  <p className="font-editorial text-sm" style={{ color: "#1A1814", opacity: 0.85, lineHeight: 1.6 }}>
                    Certificates of analysis for all products are available on each product page.
                  </p>
                </div>
              </div>
            </div>

            {/* Create account CTA */}
            <div className="mb-8 px-8 py-7 text-center" style={{ backgroundColor: "#1A1814", border: "1px solid rgba(26,24,20,0.12)" }}>
              <p className="font-mono text-xs uppercase mb-2" style={{ letterSpacing: "0.12em", color: "#F5EFE4", opacity: 0.6 }}>
                Track your orders
              </p>
              <h3 className="font-display mb-3" style={{ fontSize: "1.5rem", fontWeight: 300, fontStyle: "italic", color: "#F5EFE4" }}>
                Create an account
              </h3>
              <p className="font-editorial text-sm mb-5" style={{ color: "#F5EFE4", opacity: 0.7, lineHeight: 1.6 }}>
                View your order history, track shipments, and access your certificates of analysis in one place.
              </p>
              <a
                href="/signup"
                className="inline-block font-mono text-xs uppercase py-3 px-8 transition-colors"
                style={{ letterSpacing: "0.12em", backgroundColor: "#B8624A", color: "#F5EFE4", borderLeft: "3px solid #F5EFE4" }}
              >
                → Create account
              </a>
            </div>
          </>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {isFailed ? (
            <a href="/checkout" className="py-3 px-8 text-center font-mono text-xs uppercase transition-colors" style={{ letterSpacing: "0.12em", backgroundColor: "#1A1814", color: "#F5EFE4", borderLeft: "4px solid #B8624A" }}>
              → Try again
            </a>
          ) : (
            <a href="/products" className="py-3 px-8 text-center font-mono text-xs uppercase transition-colors" style={{ letterSpacing: "0.12em", backgroundColor: "#1A1814", color: "#F5EFE4", borderLeft: "4px solid #B8624A" }}>
              → Continue shopping
            </a>
          )}
          <a href="/contact" className="py-3 px-8 text-center font-mono text-xs uppercase transition-colors" style={{ letterSpacing: "0.12em", border: "1px solid rgba(26,24,20,0.3)", color: "#1A1814" }}>
            Contact support
          </a>
        </div>

        <p className="font-mono text-xs text-center mt-10" style={{ color: "#1A1814", opacity: 0.3, letterSpacing: "0.08em" }}>
          For research use only. Not for human or veterinary use.
        </p>

      </div>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <>
      {/* Stripe.js from js.stripe.com only: https://docs.stripe.com/js/including */}
      <Script src="https://js.stripe.com/v3/" strategy="afterInteractive" />
      <Suspense fallback={<div className="min-h-screen bg-bone" />}>
        <ThankYouContent />
      </Suspense>
    </>
  );
}
