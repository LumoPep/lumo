import { createHash, randomBytes } from 'node:crypto';
import { PRODUCTS } from '../../data/products.ts';
import type { CartItemLike } from '../orderMapping.ts';
import type { Quote } from './quote.ts';

export type Address = {
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zip: string;
  country: string;
};

/** Existing `orders` columns only — no schema change on Lumo's Supabase. */
export type OrdersInsert = {
  order_id: string;
  /** Stripe PaymentIntent id (pi_…): the webhook / thank-you join key. */
  payment_id: string;
  email: string;
  customer_name: string;
  address1: string;
  address2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  items: CartItemLike[];
  subtotal: number;
  discount_amount: number;
  discount_type: string | null;
  discount_code: string | null;
  shipping_amount: number;
  total: number;
  currency: 'usd';
  status: 'pending';
};

/** Same shape as Lumo's crypto orders (LUMO-<ms>-<rand>) so rapidOrderId math is unchanged. */
export function newOrderId(now = Date.now()): string {
  return `LUMO-${now}-${randomBytes(3).toString('hex').toUpperCase()}`;
}

export function itemsWithSlugs(lines: Quote['lines']): CartItemLike[] {
  return lines.map((line) => {
    const product = PRODUCTS.find((p) => p.slug === line.slug);
    return {
      productId: line.slug,
      productName: product?.name ?? line.slug,
      variant: line.size,
      price: line.unit_cents / 100,
      quantity: line.qty,
    };
  });
}

export function orderRowFromQuote(
  q: Quote,
  ids: { order_id: string; payment_id: string },
  contact: { email: string; name: string; institution?: string },
  ship: Address,
  promoCode?: string | null,
): OrdersInsert {
  void contact.institution;
  return {
    order_id: ids.order_id,
    payment_id: ids.payment_id,
    email: contact.email,
    customer_name: contact.name,
    address1: ship.address1,
    address2: ship.address2?.trim() ? ship.address2 : null,
    city: ship.city,
    state: ship.state,
    zip: ship.zip,
    country: ship.country || 'US',
    items: itemsWithSlugs(q.lines),
    subtotal: q.subtotal_cents / 100,
    discount_amount: q.discount_cents / 100,
    discount_type: q.discount_label || null,
    discount_code: promoCode?.trim() ? promoCode.trim() : null,
    shipping_amount: q.shipping_cents / 100,
    total: q.cart.total_cents / 100,
    currency: 'usd',
    status: 'pending',
  };
}

/** The PaymentIntent must equal the row's `total` to the cent, in usd. */
export function amountMatches(
  pi: { amount: number; currency: string },
  row: { total: number | string },
): boolean {
  return (
    String(pi.currency).toLowerCase() === 'usd' &&
    pi.amount === Math.round(Number(row.total) * 100)
  );
}

export function rapidOrderId(order_id: string): number {
  const seg = String(order_id || '').split('-')[1] ?? '';
  const parsed = Number.parseInt(seg, 10);
  if (/^\d+$/.test(seg) && Number.isFinite(parsed)) {
    return parsed % 100000000;
  }
  const hex = createHash('sha256').update(order_id).digest('hex').slice(0, 12);
  const hashed = Number.parseInt(hex, 16) % 100000000;
  return hashed < 1 ? 1 : hashed;
}
