// Client-side Omnisend event helpers
// These call the window.omnisend JS API loaded by the snippet

export function omnisendTrackAddToCart(params: {
  productId: string;
  productName: string;
  variant: string;
  price: number;
  imageUrl?: string;
  productUrl?: string;
}): void {
  try {
    const win = window as Window & { omnisend?: unknown[] };
    if (!win.omnisend) return;
    win.omnisend.push(['track', '$addedProductToCart', {
      $productID: params.productId,
      $variantID: params.variant,
      $currency: 'USD',
      $price: params.price,
      $quantity: 1,
      $title: params.productName,
      $imageUrl: params.imageUrl ?? '',
      $productUrl: params.productUrl ?? window.location.href,
    }]);
  } catch {
    // non-fatal
  }
}

export function omnisendTrackStartedCheckout(params: {
  cartTotal: number;
  items: Array<{ productId: string; productName: string; variant: string; price: number; quantity: number }>;
}): void {
  try {
    const win = window as Window & { omnisend?: unknown[] };
    if (!win.omnisend) return;
    win.omnisend.push(['track', '$startedCheckout', {
      $currency: 'USD',
      $value: params.cartTotal,
      $cartID: `cart-${Date.now()}`,
      $products: params.items.map(item => ({
        $productID: item.productId,
        $variantID: item.variant,
        $title: item.productName,
        $price: item.price,
        $quantity: item.quantity,
      })),
    }]);
  } catch {
    // non-fatal
  }
}
