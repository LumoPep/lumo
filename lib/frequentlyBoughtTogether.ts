import { PRODUCTS, Product } from "@/data/products";
import { CartItem } from "@/lib/store";

const pairings: Record<string, string[]> = {
  // GLP-1s / Metabolic
  "lumo-1-smg":   ["bac-water", "lumo-2-trz", "glow-blend"],
  "semaglutide":  ["bac-water", "lumo-2-trz", "glow-blend"],
  "lumo-2-trz":   ["bac-water", "lumo-1-smg", "lumo-3-rt"],
  "lumo-3-rt":    ["bac-water", "lumo-2-trz", "lumo-1-smg"],
  // Secretagogues
  "cjc-ipamorelin":   ["bac-water", "ipamorelin", "sermorelin"],
  "ipamorelin":       ["bac-water", "cjc-ipamorelin", "sermorelin"],
  "sermorelin":       ["bac-water", "cjc-ipamorelin", "ipamorelin"],
  "cjc-1295-no-dac":  ["bac-water", "ipamorelin", "cjc-ipamorelin"],
  "tesamorelin":      ["bac-water", "cjc-ipamorelin", "ipamorelin"],
  // Tissue repair
  "bpc-157":      ["bac-water", "tb-500", "bpc-tb-blend"],
  "tb-500":       ["bac-water", "bpc-157", "bpc-tb-blend"],
  "bpc-tb-blend": ["bac-water", "bpc-157", "tb-500"],
  // Cellular / Anti-aging
  "epithalon": ["bac-water", "ghk-cu", "nad-plus"],
  "ghk-cu":    ["bac-water", "epithalon", "nad-plus"],
  "nad-plus":  ["ghk-cu", "epithalon", "mots-c"],
  "mots-c":    ["bac-water", "nad-plus", "epithalon"],
  // Neuro
  "semax":  ["bac-water", "selank", "dsip"],
  "selank": ["bac-water", "semax", "dsip"],
  "dsip":   ["bac-water", "semax", "selank"],
  "kpv":    ["bac-water", "bpc-157", "ghk-cu"],
  // Blends
  "glow-blend": ["bac-water", "nad-plus", "ghk-cu"],
  "klow-blend": ["bac-water", "semax", "selank"],
  // Tanning / Other
  "pt-141":      ["bac-water", "melanotan-2"],
  "melanotan-2": ["bac-water", "pt-141"],
  "igf-1-lr3":   ["bac-water", "ipamorelin", "cjc-ipamorelin"],
  // Default fallback
  default: ["bac-water"],
};

/**
 * Returns up to 3 suggested products based on the first cart item's slug.
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
    if (suggestions.length >= 3) break;
  }

  return suggestions;
}
