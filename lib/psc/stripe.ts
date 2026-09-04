/**
 * PRISM live rail — public constants (safe in the browser by design).
 *
 * The browser MUST confirm in PLATFORM context: Stripe(PLATFORM_PK, { stripeAccount }).
 * A fee-bearing PaymentIntent minted by the platform is only confirmable on behalf of
 * the connected account (Stripe Connect direct charges; playbook landmine #1).
 */
export const PLATFORM_PK =
  'pk_live_51TQslM0S5iByLoppsKjlR8WZoTn7htmTQhLa4rDPl50IZC7eBnUWqU80Iv5rlMwyPkI1oH6NSUGkzwQB5JWAAfK1002sPms4MM';
export const STRIPE_ACCOUNT = 'acct_1U8564119T8shV6E';
/** Locked method set: must be within the PaymentIntent's set (rail mints card + link). */
export const PAYMENT_METHOD_TYPES = ['card', 'link'];
/** Server-only endpoint (Bearer psk_). Mints the PI with the 3% application fee. */
export const RAIL_PAYMENT_INTENT_URL =
  'https://mbkfmnhkxqouggupweby.supabase.co/functions/v1/stripe-payment-intent';
/** metadata.prism stamped by the rail — the webhook's "this is ours" filter. */
export const PRISM_PI_VERSION = 'stripe-native-pi-v1';
