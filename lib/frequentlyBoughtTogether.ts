import { PRODUCTS, Product } from "@/data/products";
import { CartItem } from "@/lib/store";

const pairings: Record<string, string[]> = {
  // GLP-1s / Metabolic — pair with each other, secretagogues, and cellular
  "lp-sm":  ["bac-water", "lp-tz", "lp-rt", "cjc-ipamorelin", "mots-c", "nad-plus"],
  "lp-tz":  ["bac-water", "lp-sm", "lp-rt", "cjc-ipamorelin", "mots-c", "tesamorelin"],
  "lp-rt":  ["bac-water", "lp-tz", "lp-sm", "tesamorelin", "cjc-ipamorelin", "mots-c"],

  // Secretagogues — pair within category + IGF-1 LR3
  "cjc-ipamorelin":   ["bac-water", "ipamorelin", "cjc-1295-no-dac", "sermorelin", "tesamorelin", "igf-1-lr3"],
  "ipamorelin":       ["bac-water", "cjc-ipamorelin", "cjc-1295-no-dac", "sermorelin", "igf-1-lr3", "tesamorelin"],
  "sermorelin":       ["bac-water", "cjc-ipamorelin", "ipamorelin", "cjc-1295-no-dac", "tesamorelin", "igf-1-lr3"],
  "cjc-1295-no-dac":  ["bac-water", "ipamorelin", "cjc-ipamorelin", "sermorelin", "tesamorelin", "igf-1-lr3"],
  "tesamorelin":      ["bac-water", "cjc-ipamorelin", "sermorelin", "ipamorelin", "cjc-1295-no-dac", "mots-c"],
  "igf-1-lr3":        ["bac-water", "ipamorelin", "cjc-ipamorelin", "mots-c", "nad-plus", "bpc-157"],

  // Tissue repair — pair within category + neuro + cellular
  "bpc-157":      ["bac-water", "tb-500", "bpc-tb-blend", "kpv", "ghk-cu", "semax"],
  "tb-500":       ["bac-water", "bpc-157", "bpc-tb-blend", "ghk-cu", "kpv", "nad-plus"],
  "bpc-tb-blend": ["bac-water", "bpc-157", "tb-500", "kpv", "ghk-cu", "epithalon"],
  "kpv":          ["bac-water", "bpc-157", "tb-500", "ghk-cu", "selank", "bpc-tb-blend"],

  // Cellular / Anti-aging — pair within category + tissue repair + neuro
  "epithalon": ["bac-water", "ghk-cu", "nad-plus", "mots-c", "selank", "semax"],
  "ghk-cu":    ["bac-water", "epithalon", "nad-plus", "mots-c", "bpc-157", "glow-blend"],
  "nad-plus":  ["bac-water", "epithalon", "mots-c", "ghk-cu", "bpc-157", "selank"],
  "mots-c":    ["bac-water", "nad-plus", "epithalon", "ipamorelin", "ghk-cu", "lp-sm"],

  // Neuro — pair within category + tissue repair + cellular
  "semax":  ["bac-water", "selank", "bpc-157", "ghk-cu", "epithalon", "kpv"],
  "selank": ["bac-water", "semax", "bpc-157", "ghk-cu", "epithalon", "kpv"],
  "pt-141": ["bac-water", "melanotan-2", "selank", "semax", "kpv", "ghk-cu"],

  // Dermal
  "melanotan-2": ["bac-water", "pt-141", "ghk-cu", "kpv", "selank", "epithalon"],

  // Blends — pair with component peptides + cellular
  "glow-blend": ["bac-water", "nad-plus", "ghk-cu", "bpc-157", "tb-500", "epithalon"],
  "klow-blend": ["bac-water", "semax", "selank", "bpc-157", "ghk-cu", "nad-plus"],

  // Default fallback
  default: ["bac-water"],
};

/**
 * Returns up to 6 suggested products based on the first cart item's slug.
 * Already-in-cart products are excluded.
 */
export function getSuggestions(cartItems: CartItem[]): Product[] {
  if (cartItems.length === 0) return [];

  // Build set of slugs already in cart
  const cartSlugs = new Set<string>();
  cartItems.forEach((item) => {
    const product = PRODUCTS.find((p) => p.id.toString() === item.productId);
    if (product) cartSlugs.add(product.slug);
  });

  // Determine slug for first cart item
  const firstProduct = PRODUCTS.find(
    (p) => p.id.toString() === cartItems[0].productId
  );
  const slug = firstProduct?.slug ?? "default";

  // Resolve pairings, fall back to default
  const suggestedSlugs =
    pairings[slug] ?? pairings["default"];

  const suggestions: Product[] = [];
  for (const sugSlug of suggestedSlugs) {
    if (cartSlugs.has(sugSlug)) continue;
    const product = PRODUCTS.find((p) => p.slug === sugSlug);
    if (product) suggestions.push(product);
    if (suggestions.length >= 6) break;
  }

  return suggestions;
}
