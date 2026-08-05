import type { RapidOrderItem } from './rapidfulfillment';

// Maps "slug:size" → Rapid Fulfillment supplier code
// Keys are lowercase; variant strings are normalised to lowercase on lookup
const SUPPLIER_CODES: Record<string, string> = {
  'semaglutide:5mg':       'G1S5',
  'semaglutide:10mg':      'G1S10',
  'lumo-2-trz:10mg':       'TR10',
  'lumo-2-trz:20mg':       'TR20',
  'lumo-3-rt:10mg':        'RT10',
  'lumo-3-rt:30mg':        'RT30',
  'bpc-157:10mg':          'BCP10',
  'tb-500:10mg':           'TB10+',
  'bpc-tb-blend:10mg':     'BB10+',
  'kpv:10mg':              'KPV10',
  'cjc-1295-no-dac:10mg':  'CND10',
  'cjc-ipamorelin:10mg':   'CP10',
  'ipamorelin:10mg':       'IP10',
  'tesamorelin:10mg':      'TSM10',
  'igf-1-lr3:1mg':         'IGF1',
  'sermorelin:5mg':        'SMO5',
  'ghk-cu:100mg':          'CU100',
  'melanotan-2:10mg':      'ML10',
  'nad-plus:500mg':        'NAD500',
  'mots-c:10mg':           'MS10',
  'epithalon:10mg':        'ET10',
  'selank:5mg':            'SK5',
  'semax:5mg':             'AX5',
  'pt-141:10mg':           'P41',
  'glow-blend:70mg':       'GLOW',
  'klow-blend:80mg':       'KLOW',
  'bac-water:10ml':        'BAC10',
};

export interface CartItemLike {
  productId: string; // product slug
  variant: string;   // e.g. "10mg", "5mg", "10ml"
  price: number;
  quantity: number;
}

export function getSupplierCode(slug: string, size: string): string | null {
  const key = `${slug.toLowerCase()}:${size.toLowerCase()}`;
  return SUPPLIER_CODES[key] ?? null;
}

export function mapOrderItems(items: CartItemLike[]): {
  mapped: RapidOrderItem[];
  unmapped: CartItemLike[];
} {
  const mapped: RapidOrderItem[] = [];
  const unmapped: CartItemLike[] = [];

  for (const item of items) {
    const supplierCode = getSupplierCode(item.productId, item.variant);
    if (supplierCode) {
      mapped.push({ supplierCode, quantity: item.quantity, unitPrice: item.price });
    } else {
      unmapped.push(item);
    }
  }

  return { mapped, unmapped };
}
