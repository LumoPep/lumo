export type DiscountResult = {
  type: 'promo_percent' | 'promo_free_shipping' | 'bundle' | 'first_order' | 'free_shipping_threshold' | 'none';
  label: string;
  discountAmount: number;
  shippingAmount: number;
  finalTotal: number;
};

// Constants
const SHIPPING_COST = 9.99;
const FREE_SHIPPING_THRESHOLD = 150;
const FIRST_ORDER_DISCOUNT = 0.20;

// Bundle tiers
const BUNDLE_TIERS = [
  { minQty: 10, discount: 0.20 },
  { minQty: 6, discount: 0.15 },
  { minQty: 3, discount: 0.10 },
];

export function calculateBestDiscount(
  subtotal: number,
  totalQty: number,
  promoCode: { type: 'percent' | 'free_shipping'; value?: number } | null,
  isFirstOrder: boolean
): DiscountResult {
  // Calculate bundle discount based on quantity
  let bundleDiscount = 0;
  for (const tier of BUNDLE_TIERS) {
    if (totalQty >= tier.minQty) {
      bundleDiscount = tier.discount;
      break;
    }
  }

  // Determine free shipping eligibility
  const qualifiesForFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const promoGivesFreeShipping = promoCode?.type === 'free_shipping';

  // Calculate all possible discount scenarios
  const scenarios: Array<{
    type: DiscountResult['type'];
    label: string;
    discountAmount: number;
    shippingAmount: number;
  }> = [];

  // 1. Promo code discount
  if (promoCode) {
    if (promoCode.type === 'percent' && promoCode.value) {
      const discountAmount = subtotal * promoCode.value;
      scenarios.push({
        type: 'promo_percent',
        label: `Promo code applied — ${(promoCode.value * 100).toFixed(0)}% off`,
        discountAmount,
        shippingAmount: qualifiesForFreeShipping ? 0 : SHIPPING_COST,
      });
    } else if (promoCode.type === 'free_shipping') {
      scenarios.push({
        type: 'promo_free_shipping',
        label: 'Promo code applied — Free shipping',
        discountAmount: 0,
        shippingAmount: 0,
      });
    }
  }

  // 2. Bundle discount (only if no promo code)
  if (!promoCode && bundleDiscount > 0) {
    scenarios.push({
      type: 'bundle',
      label: `Bundle discount — ${(bundleDiscount * 100).toFixed(0)}% off`,
      discountAmount: subtotal * bundleDiscount,
      shippingAmount: qualifiesForFreeShipping ? 0 : SHIPPING_COST,
    });
  }

  // 3. First order discount (only if no promo code)
  if (!promoCode && isFirstOrder) {
    scenarios.push({
      type: 'first_order',
      label: `First order — ${(FIRST_ORDER_DISCOUNT * 100).toFixed(0)}% off`,
      discountAmount: subtotal * FIRST_ORDER_DISCOUNT,
      shippingAmount: qualifiesForFreeShipping ? 0 : SHIPPING_COST,
    });
  }

  // 4. No discount scenario
  scenarios.push({
    type: promoGivesFreeShipping ? 'promo_free_shipping' : (qualifiesForFreeShipping ? 'free_shipping_threshold' : 'none'),
    label: promoGivesFreeShipping ? 'Promo code applied — Free shipping' : (qualifiesForFreeShipping ? 'Free shipping' : 'No discount'),
    discountAmount: 0,
    shippingAmount: (qualifiesForFreeShipping || promoGivesFreeShipping) ? 0 : SHIPPING_COST,
  });

  // Find the scenario with the lowest final total
  const bestScenario = scenarios.reduce((best, current) => {
    const currentTotal = subtotal - current.discountAmount + current.shippingAmount;
    const bestTotal = subtotal - best.discountAmount + best.shippingAmount;
    return currentTotal < bestTotal ? current : best;
  });

  const finalTotal = subtotal - bestScenario.discountAmount + bestScenario.shippingAmount;

  return {
    type: bestScenario.type,
    label: bestScenario.label,
    discountAmount: bestScenario.discountAmount,
    shippingAmount: bestScenario.shippingAmount,
    finalTotal,
  };
}
