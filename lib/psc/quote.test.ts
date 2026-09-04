import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../../data/products.ts';
import {
  QuoteError,
  allocateByLargestRemainder,
  buildQuote,
  type QuoteItemInput,
} from './quote.ts';

const AUDIT_CART: QuoteItemInput[] = [
  { productId: '20', variant: '5mg', quantity: 1 },
  { productId: '1', variant: '10mg', quantity: 2 },
];

function productLines(quote: { cart: { items: { name: string; qty: number; amount_cents: number }[] } }) {
  return quote.cart.items.filter((line) => line.name !== 'Shipping');
}

test('audit cart LP-Sm 5mg ×1 + LP-Tz 10mg ×2 → 6300 + 13500, no shipping, total 19800', () => {
  const quote = buildQuote(AUDIT_CART, null, false);
  const lines = productLines(quote);
  assert.equal(lines.length, 2);
  assert.equal(lines[0].name, 'LP-Sm 5mg');
  assert.equal(lines[0].qty, 1);
  assert.equal(lines[0].amount_cents, 6300);
  assert.equal(lines[1].name, 'LP-Tz 10mg');
  assert.equal(lines[1].qty, 2);
  assert.equal(lines[1].amount_cents, 13500);
  assert.equal(quote.shipping_cents, 0);
  assert.equal(quote.cart.items.some((line) => line.name === 'Shipping'), false);
  assert.equal(quote.cart.total_cents, 19800);
  assert.equal(quote.cart.currency, 'usd');
  assert.equal(quote.bundle_rate, 0.1);
  assert.equal(quote.lines[0].slug, 'lp-sm');
  assert.equal(quote.lines[0].size, '5mg');
  assert.equal(quote.lines[0].qty, 1);
  assert.equal(quote.lines[0].unit_cents, 7000);
  assert.equal(quote.lines[1].slug, 'lp-tz');
  assert.equal(quote.lines[1].size, '10mg');
  assert.equal(quote.lines[1].qty, 2);
  assert.equal(quote.lines[1].unit_cents, 7500);
  const summed = quote.cart.items.reduce((sum, line) => sum + line.amount_cents, 0);
  assert.equal(summed, quote.cart.total_cents);
});

test('under-threshold cart bpc-157 ×1 → 7000 + shipping 999 = 7999', () => {
  const quote = buildQuote(
    [{ productId: '3', variant: '10mg', quantity: 1 }],
    null,
    false,
  );
  const lines = productLines(quote);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].name, 'BPC-157 10mg');
  assert.equal(lines[0].amount_cents, 7000);
  assert.equal(quote.shipping_cents, 999);
  const shipping = quote.cart.items.find((line) => line.name === 'Shipping');
  assert.ok(shipping);
  assert.equal(shipping.qty, 1);
  assert.equal(shipping.amount_cents, 999);
  assert.equal(quote.cart.total_cents, 7999);
  assert.equal(quote.bundle_rate, 0);
});

test('6 units → 15% bundle', () => {
  const quote = buildQuote(
    [{ productId: '3', variant: '10mg', quantity: 6 }],
    null,
    false,
  );
  assert.equal(quote.bundle_rate, 0.15);
  const lines = productLines(quote);
  assert.equal(lines.length, 1);
  assert.equal(lines[0].amount_cents, 35700);
  assert.equal(quote.shipping_cents, 0);
  assert.equal(quote.cart.total_cents, 35700);
});

test('percent promo 0.25 beats first-order 0.20 on a 3-unit cart with a single label', () => {
  const quote = buildQuote(AUDIT_CART, { type: 'percent', value: 0.25 }, true);
  assert.equal(quote.discount_label, 'Promo code applied — 25% off');
  assert.equal(quote.discount_label.includes('First order'), false);
  assert.equal(quote.bundle_rate, 0.1);
  const lines = productLines(quote);
  assert.equal(lines[0].amount_cents + lines[1].amount_cents, 14850);
  assert.equal(quote.shipping_cents, 0);
  assert.equal(quote.cart.total_cents, 14850);
  const summed = quote.cart.items.reduce((sum, line) => sum + line.amount_cents, 0);
  assert.equal(summed, quote.cart.total_cents);
});

test('promo percent value 1 → bad_promo', () => {
  assert.throws(
    () => buildQuote(AUDIT_CART, { type: 'percent', value: 1 }, false),
    (err: unknown) => err instanceof QuoteError && err.code === 'bad_promo',
  );
});

test('largest-remainder: three 3333-cent lines at 10% sum exactly', () => {
  const target = Math.round(9999 * 0.9);
  const allocated = allocateByLargestRemainder([3333, 3333, 3333], target);
  assert.equal(target, 8999);
  assert.equal(allocated.reduce((sum, n) => sum + n, 0), 8999);
  assert.ok(allocated.every((n) => n === 2999 || n === 3000));
  assert.ok(allocated.every((n) => n > 0));
});

test('27 catalog pairs are all quotable at qty 1', () => {
  let pairs = 0;
  for (const product of PRODUCTS) {
    for (let i = 0; i < product.sizes.length; i++) {
      pairs += 1;
      const quote = buildQuote(
        [{ productId: String(product.id), variant: product.sizes[i], quantity: 1 }],
        null,
        false,
      );
      const line = productLines(quote)[0];
      assert.ok(line.amount_cents > 0);
      assert.equal(quote.lines[0].slug, product.slug);
      assert.equal(quote.lines[0].size, product.sizes[i]);
      assert.equal(quote.lines[0].unit_cents, Math.round(product.prices[i] * 100));
      const summed = quote.cart.items.reduce((sum, item) => sum + item.amount_cents, 0);
      assert.equal(summed, quote.cart.total_cents);
    }
  }
  assert.equal(pairs, 27);
});
