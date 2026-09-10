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
      const next = await fetchOrderState(orderRef);
      if (stopped) return;
      pollRef.current = next;
      apply();
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
    <div className="min-h-screen bg-bone py-16 px-6">
      <div className="container mx-auto max-w-2xl">

        {/* Header */}
        <div className="text-center mb-12">
          <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-6">
            {isFailed ? (
              <>
                <circle cx="30" cy="30" r="29" stroke="#B8624A" strokeWidth="2" fill="none" />
                <line x1="20" y1="20" x2="40" y2="40" stroke="#B8624A" strokeWidth="2" strokeLinecap="round" />
                <line x1="40" y1="20" x2="20" y2="40" stroke="#B8624A" strokeWidth="2" strokeLinecap="round" />
              </>
            ) : (
              <>
                <circle cx="30" cy="30" r="29" stroke="#607A5C" strokeWidth="2" fill="none" />
                <polyline points="20,30 28,38 42,22" stroke="#607A5C" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
              </>
            )}
          </svg>
          <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-3">
            {isFailed ? "Payment failed" : isPending ? "Processing" : "Order confirmed"}
          </div>
          <h1 className="font-display text-4xl text-ink mb-4" style={{ fontWeight: 300 }}>
            {isFailed
              ? "Payment not completed"
              : isPending
              ? "Payment processing"
              : "Payment confirmed"}
          </h1>
          <p className="font-editorial text-ink opacity-70">
            {isFailed
              ? "This payment did not go through. Nothing was charged. Please try again."
              : isPending
              ? "Your payment has been received and is being processed. We'll email you once confirmed."
              : "Your order has been received and is being prepared. A confirmation has been sent to your email."}
          </p>
        </div>

        {!isFailed && (
          <>
            {/* Order ref */}
            <div className="bg-cream hairline-border p-8 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-1">
                    Order reference
                  </p>
                  <p className="font-mono text-sm text-ink break-all">{orderRef}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-1">
                    Status
                  </p>
                  <p className="font-mono text-sm text-ink">
                    {isPending ? "Processing" : "Confirmed"}
                  </p>
                </div>
              </div>
            </div>

            {/* What happens next */}
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
          </>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isFailed ? (
            <a
              href="/checkout"
              className="py-3 px-8 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors text-center"
            >
              → Try again
            </a>
          ) : (
            <a
              href="/products"
              className="py-3 px-8 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors text-center"
            >
              → Continue shopping
            </a>
          )}
          <a
            href="/contact"
            className="py-3 px-8 hairline-border text-ink font-mono text-xs uppercase tracking-mono hover:border-clay hover:text-clay transition-colors text-center"
          >
            Contact support
          </a>
        </div>

        <p className="font-mono text-xs text-ink opacity-30 text-center mt-12">
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
