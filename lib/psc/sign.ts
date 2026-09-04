import { createHmac, timingSafeEqual } from 'node:crypto';
import type { Quote } from './quote.ts';

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((entry) => stableStringify(entry)).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj)
    .filter((key) => obj[key] !== undefined)
    .sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(',')}}`;
}

export function signQuote(quote: Quote, secret: string): string {
  return createHmac('sha256', secret).update(stableStringify(quote)).digest('hex');
}

export function verifyQuote(quote: Quote, sig: string, secret: string): boolean {
  const expected = signQuote(quote, secret);
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(sig, 'hex');
  if (a.length !== b.length || a.length === 0) {
    return false;
  }
  return timingSafeEqual(a, b);
}
