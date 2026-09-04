import {
  CARD_DECLINED,
  CONFIRM_PENDING,
  CREATE_ATTEMPT_FAILED,
  PE_INCOMPLETE,
  THREEDS_PENDING,
  WALLET_CANCEL,
} from './buyerCopy.ts';

export type PaymentSurface = {
  clientSecret: string;
  publishableKey: string;
  stripeAccount: string;
  orderRef: string;
};

export type PscEmbedInstance = {
  getPaymentSurface: () => PaymentSurface | null;
};

type StripeConfirmResult = {
  error?: { type?: string; code?: string };
  paymentIntent?: { id?: string; status?: string };
};

type StripeElements = {
  submit: () => Promise<{ error?: { type?: string; code?: string } }>;
  create: (
    type: string,
    options?: Record<string, unknown>,
  ) => {
    mount: (selector: string) => void;
    on: (event: string, handler: (event: ExpressConfirmEvent) => void | Promise<void>) => void;
    unmount?: () => void;
  };
};

type StripeInstance = {
  elements: (options: { clientSecret: string }) => StripeElements;
  confirmPayment: (args: {
    elements: StripeElements;
    confirmParams: { return_url: string };
    redirect: 'if_required';
  }) => Promise<StripeConfirmResult>;
};

type ExpressConfirmEvent = {
  billingDetails?: { email?: string };
  paymentFailed: (payload: { reason: string }) => void;
};

type WalletHandoff = {
  markActive: () => void;
  handleCancel: (payload: Record<string, unknown>) => void;
};

type PscEmbedStatic = {
  init: (cfg: Record<string, unknown>) => PscEmbedInstance;
  createWalletHandoff: (opts: { updateSheetAmount: (amount?: number) => void }) => WalletHandoff;
  assertNoPaymentMethodTypes: (options: object) => void;
};

declare global {
  interface Window {
    Stripe?: (publishableKey: string, options?: { stripeAccount?: string }) => StripeInstance;
    PscEmbed?: PscEmbedStatic;
  }
}

export type GlueOpts = {
  onPaid: (orderRef: string) => void;
  onError: (msg: string) => void;
  onSurface?: (surface: PaymentSurface) => Promise<boolean>;
};

export type GlueHandle = {
  unmount: () => void;
};

function stripeErrorMessage(err: { type?: string; code?: string } | undefined): string {
  const code = err?.code || '';
  if (code === 'incomplete' || err?.type === 'validation_error') return PE_INCOMPLETE;
  if (code === 'card_declined') return CARD_DECLINED;
  if (code === 'canceled' || code === 'cancelled') return WALLET_CANCEL;
  return CREATE_ATTEMPT_FAILED;
}

function paidSucceeded(result: StripeConfirmResult, orderRef: string): boolean {
  const pi = result.paymentIntent;
  return pi?.status === 'succeeded' && pi.id === orderRef;
}

function pendingMessage(status: string | undefined): string {
  if (status === 'requires_action') return THREEDS_PENDING;
  return CONFIRM_PENDING;
}

export function mountGlue(inst: PscEmbedInstance, opts: GlueOpts): GlueHandle {
  let pollTimer: ReturnType<typeof setInterval> | null = null;
  let unmounted = false;
  let mounted = false;
  let mounting = false;
  let cardBtn: HTMLButtonElement | null = null;
  let paymentEl: { unmount?: () => void } | null = null;
  let expressEl: { unmount?: () => void } | null = null;
  const embed = window.PscEmbed;
  const wallet = embed
    ? embed.createWalletHandoff({ updateSheetAmount: () => {} })
    : { markActive() {}, handleCancel() {} };

  function stopPoll() {
    if (pollTimer != null) {
      clearInterval(pollTimer);
      pollTimer = null;
    }
  }

  function confirmArgs(elements: StripeElements, orderRef: string) {
    // confirmPayment + redirect if_required: https://docs.stripe.com/js/payment_intents/confirm_payment
    return {
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/thank-you?order_ref=${orderRef}`,
      },
      redirect: 'if_required' as const,
    };
  }

  async function mountStripe(surface: PaymentSurface) {
    if (unmounted || mounted) return;
    if (!surface.publishableKey.startsWith('pk_test_')) {
      opts.onError(CREATE_ATTEMPT_FAILED);
      return;
    }
    if (opts.onSurface) {
      try {
        const recorded = await opts.onSurface(surface);
        if (!recorded) {
          opts.onError(CREATE_ATTEMPT_FAILED);
          return;
        }
      } catch {
        opts.onError(CREATE_ATTEMPT_FAILED);
        return;
      }
    }
    if (unmounted || mounted) return;
    const StripeCtor = window.Stripe;
    if (!StripeCtor || !embed) {
      opts.onError(CREATE_ATTEMPT_FAILED);
      return;
    }

    const stripeOptions = { stripeAccount: surface.stripeAccount };
    embed.assertNoPaymentMethodTypes(stripeOptions);
    const stripe = StripeCtor(surface.publishableKey, stripeOptions);

    const elementsOptions = { clientSecret: surface.clientSecret };
    embed.assertNoPaymentMethodTypes(elementsOptions);
    const elements = stripe.elements(elementsOptions);

    const payment = elements.create('payment', { fields: { billingDetails: 'auto' } });
    payment.mount('#psc-payment-element');
    paymentEl = payment;

    const express = elements.create('expressCheckout', {
      emailRequired: true,
      billingAddressRequired: true,
    });
    express.mount('#psc-express-checkout-element');
    expressEl = express;

    express.on('confirm', async (event) => {
      wallet.markActive();
      try {
        const submitted = await elements.submit();
        if (submitted?.error) {
          event.paymentFailed({ reason: 'fail' });
          opts.onError(stripeErrorMessage(submitted.error));
          return;
        }
        const result = await stripe.confirmPayment(confirmArgs(elements, surface.orderRef));
        if (result.error) {
          event.paymentFailed({ reason: 'fail' });
          opts.onError(stripeErrorMessage(result.error));
          return;
        }
        if (!paidSucceeded(result, surface.orderRef)) {
          event.paymentFailed({ reason: 'fail' });
          opts.onError(pendingMessage(result.paymentIntent?.status));
          return;
        }
        opts.onPaid(surface.orderRef);
      } catch {
        event.paymentFailed({ reason: 'fail' });
        opts.onError(CREATE_ATTEMPT_FAILED);
      } finally {
        wallet.handleCancel({});
      }
    });

    const payMount = document.getElementById('psc-payment-element');
    if (payMount) {
      cardBtn = document.createElement('button');
      cardBtn.type = 'button';
      cardBtn.textContent = 'Complete card payment';
      cardBtn.disabled = false;
      cardBtn.addEventListener('click', async () => {
        if (!cardBtn || cardBtn.disabled) return;
        cardBtn.disabled = true;
        try {
          const result = await stripe.confirmPayment(confirmArgs(elements, surface.orderRef));
          if (result.error) {
            opts.onError(stripeErrorMessage(result.error));
            return;
          }
          if (!paidSucceeded(result, surface.orderRef)) {
            opts.onError(pendingMessage(result.paymentIntent?.status));
            return;
          }
          opts.onPaid(surface.orderRef);
        } catch {
          opts.onError(CREATE_ATTEMPT_FAILED);
        } finally {
          if (cardBtn) cardBtn.disabled = false;
        }
      });
      payMount.insertAdjacentElement('afterend', cardBtn);
    }

    mounted = true;
  }

  function startPoll() {
    if (pollTimer != null || mounted || mounting) return;
    const deadline = Date.now() + 15000;
    pollTimer = setInterval(() => {
      if (unmounted) return;
      const surface = inst.getPaymentSurface();
      if (surface && window.Stripe && !mounted && !mounting) {
        mounting = true;
        stopPoll();
        void mountStripe(surface).finally(() => {
          mounting = false;
        });
      } else if (Date.now() >= deadline) {
        stopPoll();
        if (!mounted) opts.onError(CREATE_ATTEMPT_FAILED);
      }
    }, 200);
  }

  function onToggleCapture() {
    startPoll();
  }

  const toggle = document.getElementById('psc-card-toggle');
  toggle?.addEventListener('click', onToggleCapture, true);

  return {
    unmount() {
      unmounted = true;
      stopPoll();
      toggle?.removeEventListener('click', onToggleCapture, true);
      try {
        paymentEl?.unmount?.();
      } catch {
        /* already gone */
      }
      try {
        expressEl?.unmount?.();
      } catch {
        /* already gone */
      }
      cardBtn?.remove();
      cardBtn = null;
    },
  };
}
