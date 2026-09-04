"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Script from "next/script";
import { useSearchParams } from "next/navigation";
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
  const clientSecret = searchParams.get("payment_intent_client_secret") ?? "";
  const pollRef = useRef<OrderState | null>(null);
  const intentRef = useRef<OrderState | null>(null);
  const [state, setState] = useState<OrderState>("unknown");

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-bone py-24 px-6 flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-3">
          Order
        </div>
        {orderRef ? (
          <p className="font-mono text-sm text-ink mb-6 break-all">{orderRef}</p>
        ) : null}
        <p className="font-editorial text-ink opacity-70">{copyFor(state)}</p>
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
