import { test } from 'node:test';
import assert from 'node:assert/strict';
import { signQuote, verifyQuote } from './sign.ts';
import type { Quote } from './quote.ts';

const SECRET = 'test-quote-secret';

function sampleQuote(): Quote {
  return {
    cart: {
      items: [
        { name: 'LP-Sm 5mg', qty: 1, amount_cents: 6300 },
        { name: 'LP-Tz 10mg', qty: 2, amount_cents: 13500 },
      ],
      total_cents: 19800,
      currency: 'usd',
    },
    subtotal_cents: 22000,
    bundle_rate: 0.1,
    discount_label: 'Bundle discount — 10% off',
    discount_cents: 2200,
    shipping_cents: 0,
    lines: [
      { slug: 'lp-sm', size: '5mg', qty: 1, unit_cents: 7000 },
      { slug: 'lp-tz', size: '10mg', qty: 2, unit_cents: 7500 },
    ],
  };
}

test('signQuote returns 64-char hex HMAC', () => {
  const sig = signQuote(sampleQuote(), SECRET);
  assert.match(sig, /^[0-9a-f]{64}$/);
});

test('verifyQuote accepts a matching signature', () => {
  const quote = sampleQuote();
  const sig = signQuote(quote, SECRET);
  assert.equal(verifyQuote(quote, sig, SECRET), true);
});

test('verifyQuote rejects a wrong secret', () => {
  const quote = sampleQuote();
  const sig = signQuote(quote, SECRET);
  assert.equal(verifyQuote(quote, sig, 'other-secret'), false);
});

test('verifyQuote rejects a mutated quote', () => {
  const quote = sampleQuote();
  const sig = signQuote(quote, SECRET);
  const mutated: Quote = { ...quote, shipping_cents: 999, cart: { ...quote.cart, total_cents: 20799 } };
  assert.equal(verifyQuote(mutated, sig, SECRET), false);
});

test('signature is independent of object key insertion order', () => {
  const a = sampleQuote();
  const b: Quote = {
    lines: a.lines,
    shipping_cents: a.shipping_cents,
    discount_cents: a.discount_cents,
    discount_label: a.discount_label,
    bundle_rate: a.bundle_rate,
    subtotal_cents: a.subtotal_cents,
    cart: {
      currency: a.cart.currency,
      total_cents: a.cart.total_cents,
      items: a.cart.items,
    },
  };
  assert.equal(signQuote(a, SECRET), signQuote(b, SECRET));
});
