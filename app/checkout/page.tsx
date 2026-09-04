import CryptoCheckoutPage from '@/components/checkout/CryptoCheckoutPage';
import PscCheckoutPage from '@/components/checkout/PscCheckoutPage';

/**
 * Card checkout on the PRISM rail goes live the moment Lumo's Vercel project carries
 * PRISM_SERVER_KEY + PSC_QUOTE_SECRET (env is read at build time — redeploy after setting).
 * Until then the site keeps its working crypto checkout, so no deploy can leave the store
 * without a way to pay.
 */
export default function CheckoutPage() {
  const cardReady = Boolean(process.env.PRISM_SERVER_KEY && process.env.PSC_QUOTE_SECRET);
  return cardReady ? <PscCheckoutPage /> : <CryptoCheckoutPage />;
}
