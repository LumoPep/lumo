import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../../data/products.ts';
import { mapOrderItems } from '../orderMapping.ts';
import { buildQuote } from './quote.ts';
import { amountMatches, itemsWithSlugs, newOrderId, orderRowFromQuote, rapidOrderId } from './order.ts';

test('itemsWithSlugs maps every catalog line to a supplier code via mapOrderItems (0 unmapped)', () => {
  const lines = PRODUCTS.flatMap((product) =>
    product.sizes.map((size, i) => ({
      slug: product.slug,
      size,
      qty: 1,
      unit_cents: Math.round(product.prices[i] * 100),
    })),
  );
  assert.equal(lines.length, 27);
  const items = itemsWithSlugs(lines);
  const { mapped, unmapped } = mapOrderItems(items);
  assert.equal(unmapped.length, 0);
  assert.equal(mapped.length, 27);
});

test('orderRowFromQuote writes the PI id to payment_id and the signed total to total', () => {
  const p = PRODUCTS[0];
  const q = buildQuote([{ productId: String(p.id), variant: p.sizes[0], quantity: 1 }], null, false);
  const row = orderRowFromQuote(
    q,
    { order_id: 'LUMO-1788466393000-ABC', payment_id: 'pi_3Abc' },
    { email: 'a@b.co', name: 'A B' },
    { address1: '1 St', city: 'C', state: 'S', zip: '00000', country: 'US' },
  );
  assert.equal(row.payment_id, 'pi_3Abc');
  assert.equal(row.order_id, 'LUMO-1788466393000-ABC');
  assert.equal(Math.round(row.total * 100), q.cart.total_cents);
  assert.equal(row.status, 'pending');
  assert.equal(amountMatches({ amount: q.cart.total_cents, currency: 'usd' }, row), true);
});

test('newOrderId matches the LUMO-<ms>-<rand> shape and keeps rapidOrderId numeric', () => {
  const id = newOrderId(1788466393000);
  assert.match(id, /^LUMO-1788466393000-[0-9A-F]{6}$/);
  assert.equal(rapidOrderId(id), 66393000);
});

test('amountMatches is true on equal usd cents (number and numeric-string totals)', () => {
  assert.equal(amountMatches({ amount: 19800, currency: 'usd' }, { total: 198 }), true);
  assert.equal(amountMatches({ amount: 19800, currency: 'usd' }, { total: '198.00' }), true);
  assert.equal(amountMatches({ amount: 6329, currency: 'usd' }, { total: 63.29 }), true);
});

test('amountMatches is false on ±1 cent', () => {
  assert.equal(amountMatches({ amount: 19801, currency: 'usd' }, { total: 198 }), false);
  assert.equal(amountMatches({ amount: 19799, currency: 'usd' }, { total: 198 }), false);
});

test('amountMatches is false on non-usd', () => {
  assert.equal(amountMatches({ amount: 19800, currency: 'eur' }, { total: 198 }), false);
});

test('rapidOrderId keeps LUMO timestamp-segment math', () => {
  assert.equal(rapidOrderId('LUMO-1788466393000-ABC'), 66393000);
});

test('rapidOrderId hashes non-numeric ids to a stable 1..99999999 integer', () => {
  const a = rapidOrderId('PSC-pi_3Abc');
  const b = rapidOrderId('PSC-pi_3Abc');
  const c = rapidOrderId('PSC-pi_3Abd');
  assert.equal(Number.isInteger(a), true);
  assert.ok(a >= 1 && a <= 99999999);
  assert.equal(a, b);
  assert.notEqual(a, c);
});
