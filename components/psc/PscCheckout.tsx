'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Script from 'next/script';
import type { Address } from '@/lib/psc/order';
import type { Quote } from '@/lib/psc/quote';
import { PAYMENT_METHOD_TYPES, PLATFORM_PK, STRIPE_ACCOUNT } from '@/lib/psc/stripe';
import {
  CARD_DECLINED,
  CONFIRM_PENDING,
  CREATE_ATTEMPT_FAILED,
  PE_INCOMPLETE,
  RUO_REQUIRED,
  THREEDS_PENDING,
  WALLET_CANCEL,
} from '@/lib/psc/buyerCopy';

type StripeError = { type?: string; code?: string; message?: string };
type ConfirmResult = { error?: StripeError; paymentIntent?: { id?: string; status?: string } };
type ExpressClickEvent = { resolve: (options?: Record<string, unknown>) => void; reject: () => void };
type ExpressConfirmEvent = { paymentFailed: (payload: { reason: 'fail' }) => void };
type StripeElement = {
  mount: (target: HTMLElement) => void;
  unmount: () => void;
  on: (
    event: string,
    handler: (event: ExpressClickEvent & ExpressConfirmEvent) => void | Promise<void>,
  ) => void;
};
type StripeElements = {
  submit: () => Promise<{ error?: StripeError }>;
  create: (type: string, options?: Record<string, unknown>) => StripeElement;
};
type StripeInstance = {
  elements: (options: Record<string, unknown>) => StripeElements;
  confirmPayment: (args: {
    elements: StripeElements;
    clientSecret: string;
    confirmParams: { return_url: string };
    redirect: 'if_required';
  }) => Promise<ConfirmResult>;
};
type StripeCtor = (publishableKey: string, options?: { stripeAccount?: string }) => StripeInstance;

export type PscCheckoutProps = {
  quote: Quote;
  sig: string;
  contact: { email: string; name: string; institution?: string };
  shipping: Address;
  promoCode?: string;
  onPaid: (orderRef: string) => void;
  onError: (msg: string) => void;
};

function stripeErrorMessage(err: StripeError | undefined): string {
  const code = err?.code || '';
  if (code === 'incomplete' || err?.type === 'validation_error') return PE_INCOMPLETE;
  if (code === 'card_declined') return CARD_DECLINED;
  if (code === 'canceled' || code === 'cancelled') return WALLET_CANCEL;
  return CREATE_ATTEMPT_FAILED;
}

function pendingMessage(status: string | undefined): string {
  return status === 'requires_action' ? THREEDS_PENDING : CONFIRM_PENDING;
}

function waitForStripe(ms: number): Promise<StripeCtor> {
  return new Promise((resolve, reject) => {
    const started = Date.now();
    const tick = () => {
      const ctor = (window as Window & { Stripe?: StripeCtor }).Stripe;
      if (ctor) return resolve(ctor);
      if (Date.now() - started > ms) return reject(new Error('timed out waiting for Stripe.js'));
      window.setTimeout(tick, 50);
    };
    tick();
  });
}

const APPEARANCE = {
  theme: 'stripe',
  variables: {
    colorPrimary: '#1A1814',
    colorBackground: '#F5EFE4',
    colorText: '#1A1814',
    colorDanger: '#B8624A',
    borderRadius: '0px',
    fontSizeBase: '14px',
  },
};

/**
 * The pay box on the PRISM live rail: deferred Payment Element (card + Link) and
 * Express Checkout (Apple Pay / Google Pay / Link), confirmed in PLATFORM context.
 * Flow: RUO tick → elements.submit() → POST /api/psc/pay (rail mints the fee-bearing
 * PaymentIntent, pending order row written) → confirmPayment(client_secret) → onPaid.
 */
export default function PscCheckout(props: PscCheckoutProps) {
  const { quote } = props;
  const expressRef = useRef<HTMLDivElement>(null);
  const paymentRef = useRef<HTMLDivElement>(null);
  const ctxRef = useRef<{ stripe: StripeInstance; elements: StripeElements } | null>(null);
  const ruoRef = useRef<string | null>(null);
  const busyRef = useRef(false);
  const propsRef = useRef(props);
  propsRef.current = props;
  const [ruo, setRuo] = useState(false);
  const [busy, setBusy] = useState(false);
  const [ready, setReady] = useState(false);

  const pay = useCallback(async (): Promise<boolean> => {
    const p = propsRef.current;
    const ctx = ctxRef.current;
    if (!ctx || busyRef.current) return false;
    if (!ruoRef.current) {
      p.onError(RUO_REQUIRED);
      return false;
    }
    busyRef.current = true;
    setBusy(true);
    p.onError('');
    try {
      const { error: submitError } = await ctx.elements.submit();
      if (submitError) {
        p.onError(stripeErrorMessage(submitError));
        return false;
      }
      const res = await fetch('/api/psc/pay', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          quote: p.quote,
          sig: p.sig,
          contact: p.contact,
          shipping: p.shipping,
          promoCode: p.promoCode,
          attested_at: ruoRef.current,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || typeof data.client_secret !== 'string' || typeof data.order_ref !== 'string') {
        p.onError(data?.error?.message || CREATE_ATTEMPT_FAILED);
        return false;
      }
      // https://docs.stripe.com/js/payment_intents/confirm_payment — elements + clientSecret
      const result = await ctx.stripe.confirmPayment({
        elements: ctx.elements,
        clientSecret: data.client_secret,
        confirmParams: {
          return_url: `${window.location.origin}/thank-you?order_ref=${encodeURIComponent(data.order_ref)}`,
        },
        redirect: 'if_required',
      });
      if (result.error) {
        p.onError(stripeErrorMessage(result.error));
        return false;
      }
      const pi = result.paymentIntent;
      if (pi?.status === 'succeeded' && pi.id === data.order_ref) {
        p.onPaid(data.order_ref);
        return true;
      }
      p.onError(pendingMessage(pi?.status));
      return false;
    } catch {
      p.onError(CREATE_ATTEMPT_FAILED);
      return false;
    } finally {
      busyRef.current = false;
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    let payment: StripeElement | null = null;
    let express: StripeElement | null = null;

    (async () => {
      const Stripe = await waitForStripe(15000);
      if (cancelled || !paymentRef.current || !expressRef.current) return;
      // Platform context (landmine #1): platform publishable key + Lumo's connected account.
      const stripe = Stripe(PLATFORM_PK, { stripeAccount: STRIPE_ACCOUNT });
      const elements = stripe.elements({
        mode: 'payment',
        amount: quote.cart.total_cents,
        currency: quote.cart.currency,
        paymentMethodTypes: PAYMENT_METHOD_TYPES,
        appearance: APPEARANCE,
      });
      ctxRef.current = { stripe, elements };

      // Link off in-box (docs: wallets.link 'never'). Link auto-enables its funding groups —
      // Instant Bank Payments and Klarna-on-Link — as extra tabs; hiding Link hides them.
      // Wallets live in the Express Checkout row below, not in the card box.
      payment = elements.create('payment', {
        layout: 'tabs',
        wallets: { applePay: 'never', googlePay: 'never', link: 'never' },
      });
      payment.mount(paymentRef.current);
      payment.on('ready', () => {
        if (!cancelled) setReady(true);
      });

      // Apple Pay / Google Pay only: card-funded wallets. Link + BNPL/PayPal/Amazon never.
      express = elements.create('expressCheckout', {
        paymentMethods: { link: 'never', klarna: 'never', paypal: 'never', amazonPay: 'never' },
      });
      express.mount(expressRef.current);
      express.on('click', (event) => {
        if (!ruoRef.current) {
          propsRef.current.onError(RUO_REQUIRED);
          event.reject();
          return;
        }
        event.resolve();
      });
      express.on('cancel', () => propsRef.current.onError(WALLET_CANCEL));
      express.on('confirm', async (event) => {
        const ok = await pay();
        if (!ok) event.paymentFailed({ reason: 'fail' });
      });
    })().catch(() => {
      if (!cancelled) propsRef.current.onError(CREATE_ATTEMPT_FAILED);
    });

    return () => {
      cancelled = true;
      ctxRef.current = null;
      try {
        payment?.unmount();
      } catch {
        /* already gone */
      }
      try {
        express?.unmount();
      } catch {
        /* already gone */
      }
    };
  }, [quote, pay]);

  const disabled = !ready || !ruo || busy;

  return (
    <div style={{ backgroundColor: '#EBE2CF', borderLeft: '3px solid #607A5C', padding: '32px' }}>
      <div
        className="font-mono uppercase mb-1"
        style={{ fontSize: '9px', letterSpacing: '3px', color: '#607A5C' }}
      >
        03
      </div>
      <h2
        className="font-display mb-6"
        style={{ fontWeight: 300, fontStyle: 'italic', fontSize: '1.4rem', color: '#1A1814', letterSpacing: '-0.02em' }}
      >
        Payment
      </h2>

      <div ref={expressRef} style={{ marginBottom: '16px' }} />
      <div ref={paymentRef} style={{ minHeight: ready ? 0 : 120 }} />

      <label className="flex items-start gap-3" style={{ marginTop: '24px', cursor: 'pointer' }}>
        <input
          type="checkbox"
          checked={ruo}
          onChange={(e) => {
            const on = e.target.checked;
            setRuo(on);
            ruoRef.current = on ? new Date().toISOString() : null;
          }}
          style={{ marginTop: '3px', accentColor: '#1A1814' }}
        />
        <span className="font-editorial" style={{ fontSize: '13px', lineHeight: 1.4, color: '#1A1814' }}>
          I certify this order is for lawful in vitro research use only. Not for human or veterinary use.
        </span>
      </label>

      <button
        type="button"
        onClick={() => void pay()}
        disabled={disabled}
        className="w-full flex items-center justify-center gap-3 transition-all font-mono uppercase"
        style={{
          marginTop: '24px',
          backgroundColor: disabled ? 'rgba(26,24,20,0.5)' : '#1A1814',
          color: '#EBE2CF',
          padding: '18px 32px',
          fontSize: '11px',
          letterSpacing: '3px',
          cursor: disabled ? 'not-allowed' : 'pointer',
          border: 'none',
        }}
      >
        {busy ? 'Processing…' : `Pay $${(quote.cart.total_cents / 100).toFixed(2)}`}
      </button>
      <p className="font-mono mt-3" style={{ fontSize: '10px', letterSpacing: '1px', color: '#1A1814', opacity: 0.6 }}>
        Card · Link · Apple Pay · Google Pay. Secured by Stripe.
      </p>

      {/* Stripe.js from js.stripe.com only: https://docs.stripe.com/js/including */}
      <Script src="https://js.stripe.com/v3/" strategy="afterInteractive" />
    </div>
  );
}
