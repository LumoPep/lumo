import { PRODUCTS } from '../../data/products.ts';

export type QuoteItemInput = { productId: string; variant: string; quantity: number };
export type PromoInput = { type: 'percent' | 'free_shipping'; value?: number } | null;
export type QuoteLine = { name: string; qty: number; amount_cents: number };
export type Quote = {
  cart: { items: QuoteLine[]; total_cents: number; currency: 'usd' };
  subtotal_cents: number;
  bundle_rate: number;
  discount_label: string;
  discount_cents: number;
  shipping_cents: number;
  lines: { slug: string; size: string; qty: number; unit_cents: number }[];
};

export class QuoteError extends Error {
  readonly code: string;
  constructor(code: string) {
    super(code);
    this.name = 'QuoteError';
    this.code = code;
  }
}

export function allocateByLargestRemainder(weights: number[], targetTotal: number): number[] {
  const n = weights.length;
  if (n === 0) return [];
  const sum = weights.reduce((acc, w) => acc + w, 0);
  if (sum <= 0) return weights.map(() => 0);
  const parts = weights.map((w, i) => {
    const exact = (w * targetTotal) / sum;
    const floor = Math.floor(exact);
    return { i, floor, frac: exact - floor };
  });
  const used = parts.reduce((acc, p) => acc + p.floor, 0);
  let leftover = targetTotal - used;
  const order = [...parts].sort((a, b) => b.frac - a.frac || a.i - b.i);
  const out = parts.map((p) => p.floor);
  for (let k = 0; k < leftover; k++) {
    out[order[k % order.length].i] += 1;
  }
  return out;
}

function bundleRateForQty(totalQty: number): number {
  if (totalQty >= 10) return 0.2;
  if (totalQty >= 6) return 0.15;
  if (totalQty >= 3) return 0.1;
  return 0;
}

function extraDiscount(
  promo: PromoInput,
  firstOrder: boolean,
): { rate: number; kind: 'promo' | 'first_order' | null } {
  let rate = 0;
  let kind: 'promo' | 'first_order' | null = null;
  if (promo?.type === 'percent') {
    const value = promo.value;
    if (typeof value !== 'number' || !(value > 0 && value < 1)) {
      throw new QuoteError('bad_promo');
    }
    rate = value;
    kind = 'promo';
  } else if (promo && promo.type !== 'free_shipping') {
    throw new QuoteError('bad_promo');
  }
  if (firstOrder && 0.2 > rate) {
    rate = 0.2;
    kind = 'first_order';
  }
  return { rate, kind };
}

function discountLabel(
  extraKind: 'promo' | 'first_order' | null,
  extraRate: number,
  bundleRate: number,
  freeShippingPromo: boolean,
  shippingCents: number,
): string {
  if (extraKind === 'promo') {
    return `Promo code applied — ${(extraRate * 100).toFixed(0)}% off`;
  }
  if (extraKind === 'first_order') {
    return 'First order — 20% off';
  }
  if (bundleRate > 0) {
    return `Bundle discount — ${(bundleRate * 100).toFixed(0)}% off`;
  }
  if (freeShippingPromo) {
    return 'Promo code applied — Free shipping';
  }
  if (shippingCents === 0) {
    return 'Free shipping';
  }
  return 'No discount';
}

export function buildQuote(items: QuoteItemInput[], promo: PromoInput, firstOrder: boolean): Quote {
  if (items.length === 0) {
    throw new QuoteError('too_small');
  }

  const resolved: {
    name: string;
    slug: string;
    size: string;
    qty: number;
    unit_cents: number;
    gross_cents: number;
  }[] = [];

  for (const item of items) {
    if (!Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new QuoteError('bad_item');
    }
    const product = PRODUCTS.find((p) => String(p.id) === String(item.productId));
    const sizeIndex = product?.sizes.indexOf(item.variant) ?? -1;
    if (!product || sizeIndex < 0) {
      throw new QuoteError('bad_item');
    }
    const unit_cents = Math.round(product.prices[sizeIndex] * 100);
    resolved.push({
      name: `${product.name} ${item.variant}`,
      slug: product.slug,
      size: item.variant,
      qty: item.quantity,
      unit_cents,
      gross_cents: unit_cents * item.quantity,
    });
  }

  const subtotal_cents = resolved.reduce((sum, row) => sum + row.gross_cents, 0);
  const totalQty = resolved.reduce((sum, row) => sum + row.qty, 0);
  const bundle_rate = bundleRateForQty(totalQty);
  const afterBundle = Math.round(subtotal_cents * (1 - bundle_rate));
  const extra = extraDiscount(promo, firstOrder);
  const afterExtra = Math.round(afterBundle * (1 - extra.rate));
  const allocated = allocateByLargestRemainder(
    resolved.map((row) => row.gross_cents),
    afterExtra,
  );

  for (const amount of allocated) {
    if (amount <= 0) {
      throw new QuoteError('line_not_positive');
    }
  }

  const freeShippingPromo = promo?.type === 'free_shipping';
  const shipping_cents = freeShippingPromo || afterBundle >= 15000 ? 0 : 999;
  const discount_cents = subtotal_cents - afterExtra;
  const discount_label = discountLabel(
    extra.kind,
    extra.rate,
    bundle_rate,
    freeShippingPromo,
    shipping_cents,
  );

  const cartItems: QuoteLine[] = resolved.map((row, i) => ({
    name: row.name,
    qty: row.qty,
    amount_cents: allocated[i],
  }));
  if (shipping_cents > 0) {
    cartItems.push({ name: 'Shipping', qty: 1, amount_cents: shipping_cents });
  }
  if (cartItems.length > 100) {
    throw new QuoteError('too_many_lines');
  }

  const total_cents = cartItems.reduce((sum, line) => sum + line.amount_cents, 0);
  if (total_cents < 17) {
    throw new QuoteError('too_small');
  }

  return {
    cart: { items: cartItems, total_cents, currency: 'usd' },
    subtotal_cents,
    bundle_rate,
    discount_label,
    discount_cents,
    shipping_cents,
    lines: resolved.map((row) => ({
      slug: row.slug,
      size: row.size,
      qty: row.qty,
      unit_cents: row.unit_cents,
    })),
  };
}
