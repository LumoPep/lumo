import { test } from 'node:test';
import assert from 'node:assert/strict';
import { PRODUCTS } from '../../data/products.ts';
import { mapOrderItems } from '../orderMapping.ts';
import { amountMatches, itemsWithSlugs } from './order.ts';

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

test('amountMatches is true on equal usd cents', () => {
  assert.equal(
    amountMatches({ amount: 19800, currency: 'usd' }, { expected_total_cents: 19800 }),
    true,
  );
});

test('amountMatches is false on +1 cent', () => {
  assert.equal(
    amountMatches({ amount: 19801, currency: 'usd' }, { expected_total_cents: 19800 }),
    false,
  );
});

test('amountMatches is false on -1 cent', () => {
  assert.equal(
    amountMatches({ amount: 19799, currency: 'usd' }, { expected_total_cents: 19800 }),
    false,
  );
});

test('amountMatches is false on non-usd', () => {
  assert.equal(
    amountMatches({ amount: 19800, currency: 'eur' }, { expected_total_cents: 19800 }),
    false,
  );
});
