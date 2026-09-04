"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import { getSuggestions } from "@/lib/frequentlyBoughtTogether";
import { calculateBestDiscount, type DiscountResult } from "@/lib/discount";
import { validatePromoCode } from "@/lib/validatePromoCode";
import { isFirstOrder } from "@/lib/checkFirstOrder";
import PscCheckout from "@/components/psc/PscCheckout";
import type { Quote } from "@/lib/psc/quote";
import { CART_STALE_JS, CREATE_ATTEMPT_FAILED } from "@/lib/psc/buyerCopy";

const SMOKE_QUOTE: Quote = {
  cart: {
    items: [
      { name: "LP-Sm 5mg", qty: 1, amount_cents: 6300 },
      { name: "LP-Tz 10mg", qty: 2, amount_cents: 13500 },
    ],
    total_cents: 19800,
    currency: "usd",
  },
  subtotal_cents: 22000,
  bundle_rate: 0.1,
  discount_label: "Bundle discount — 10% off",
  discount_cents: 2200,
  shipping_cents: 0,
  lines: [
    { slug: "lp-sm", size: "5mg", qty: 1, unit_cents: 7000 },
    { slug: "lp-tz", size: "10mg", qty: 2, unit_cents: 7500 },
  ],
};

function cartFingerprint(
  cartItems: { productId: string; variant: string; quantity: number }[],
) {
  return cartItems.map((item) => `${item.productId}:${item.variant}:${item.quantity}`).join("|");
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart, addItem, updateQuantity, removeItem } = useCartStore();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    institution: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "US",
  });

  const [step, setStep] = useState<"review" | "pay">("review");
  const [quotePack, setQuotePack] = useState<{ quote: Quote; sig: string } | null>(null);
  const [quoteError, setQuoteError] = useState("");
  const [staleNotice, setStaleNotice] = useState("");
  const [payError, setPayError] = useState("");
  const [isQuoting, setIsQuoting] = useState(false);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCode, setPromoCode] = useState<{ type: 'percent' | 'free_shipping'; value?: number } | null>(null);
  const [promoCodeStatus, setPromoCodeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [promoCodeError, setPromoCodeError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // First order detection
  const [isFirstOrderFlag, setIsFirstOrderFlag] = useState(false);
  const [isCheckingFirstOrder, setIsCheckingFirstOrder] = useState(false);
  const [boot, setBoot] = useState<"wait" | "smoke" | "live">("wait");

  useEffect(() => {
    const smoke =
      process.env.NODE_ENV !== "production" &&
      new URLSearchParams(window.location.search).get("psc") === "smoke";
    setBoot(smoke ? "smoke" : "live");
  }, []);

  useEffect(() => {
    if (boot !== "live") return;
    if (step === "pay") return;
    if (items.length === 0) {
      router.push("/products");
    }
  }, [boot, step, items, router]);

  useEffect(() => {
    if (step !== "pay") return;
    const snap = cartFingerprint(useCartStore.getState().items);
    return useCartStore.subscribe((state) => {
      if (cartFingerprint(state.items) !== snap) {
        setQuotePack(null);
        setStep("review");
        setStaleNotice(CART_STALE_JS);
        setPayError("");
      }
    });
  }, [step]);

  // Debounced first order check
  useEffect(() => {
    if (!formData.email || formData.email.length < 5) {
      setIsFirstOrderFlag(false);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsCheckingFirstOrder(true);
      try {
        const result = await isFirstOrder(formData.email);
        setIsFirstOrderFlag(result);
      } catch (error) {
        console.error("Error checking first order:", error);
        setIsFirstOrderFlag(false);
      } finally {
        setIsCheckingFirstOrder(false);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPromoCode = async () => {
    if (!promoCodeInput.trim()) return;

    setIsApplyingPromo(true);
    setPromoCodeError("");
    setPromoCodeStatus('idle');

    try {
      const result = await validatePromoCode(promoCodeInput.trim());

      if (result.valid) {
        setPromoCode(result.promo);
        setPromoCodeStatus('success');
      } else {
        setPromoCodeError(result.error);
        setPromoCodeStatus('error');
        setPromoCode(null);
      }
    } catch (error) {
      console.error("Error validating promo code:", error);
      setPromoCodeError("Failed to validate code");
      setPromoCodeStatus('error');
      setPromoCode(null);
    } finally {
      setIsApplyingPromo(false);
    }
  };

  const addressValid = Boolean(
    formData.name.trim() &&
      formData.address1.trim() &&
      formData.city.trim() &&
      formData.state.trim() &&
      formData.zip.trim() &&
      formData.country.trim(),
  );

  const handleContinueToPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addressValid || isQuoting) return;
    setIsQuoting(true);
    setQuoteError("");
    try {
      const response = await fetch("/api/psc/quote", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            variant: item.variant,
            quantity: item.quantity,
          })),
          promoCode: promoCode ? promoCodeInput.trim() : undefined,
          email: formData.email.trim() || undefined,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setQuoteError(data?.error?.message || data?.error?.code || "");
        return;
      }
      setQuotePack({ quote: data.quote, sig: data.sig });
      setStaleNotice("");
      setPayError("");
      setStep("pay");
    } catch {
      setQuoteError(CREATE_ATTEMPT_FAILED);
    } finally {
      setIsQuoting(false);
    }
  };

  const backToReview = () => {
    setQuotePack(null);
    setStep("review");
    setPayError("");
  };

  const handlePaid = (orderRef: string) => {
    clearCart();
    router.push("/thank-you?order_ref=" + orderRef);
  };

  const handleRecordOrder = async (surface: { orderRef: string }) => {
    if (!quotePack) return false;
    const gateEmail = (document.getElementById("psc-gate-email") as HTMLInputElement | null)?.value?.trim() || "";
    const response = await fetch("/api/psc/order", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        quote: quotePack.quote,
        sig: quotePack.sig,
        order_ref: surface.orderRef,
        contact: {
          email: gateEmail,
          name: formData.name,
          institution: formData.institution,
        },
        shipping: {
          address1: formData.address1,
          address2: formData.address2,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
        promoCode: promoCode ? promoCodeInput.trim() : undefined,
      }),
    });
    const body = await response.json().catch(() => ({}));
    return response.ok && body.ok === true;
  };

  // Build id → first image lookup from product catalog
  const productImageMap: Record<string, string> = {};
  PRODUCTS.forEach((p) => {
    if (p.images && p.images.length > 0) {
      productImageMap[p.id.toString()] = p.images[0];
    }
  });

  const subtotal = getTotal(); // already bundle-discounted
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);
  const originalSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const bundleRate = totalQty >= 10 ? 0.20 : totalQty >= 6 ? 0.15 : totalQty >= 3 ? 0.10 : 0;
  const bundleSavings = originalSubtotal - subtotal;

  // Bundle discount is already applied in item prices via the cart store.
  // Pass 0 for quantity so calculateBestDiscount does not apply a bundle tier on top.
  // Promo codes and first-order discounts still evaluate against the subtotal.
  const discountResult: DiscountResult = calculateBestDiscount(
    subtotal,
    0,
    promoCode,
    isFirstOrderFlag
  );

  const reviewTotal = discountResult.finalTotal;

  const suggestions = getSuggestions(items);

  if (boot === "wait") {
    return null;
  }
  if (boot === "smoke") {
    return (
      <PscCheckout
        quote={SMOKE_QUOTE}
        sig="smoke"
        theme="light"
        pcid={process.env.NEXT_PUBLIC_PSC_PCID!}
        serviceBase={process.env.NEXT_PUBLIC_PSC_SERVICE_BASE!}
        onPaid={() => {}}
        onError={() => {}}
        onSurface={async () => true}
      />
    );
  }

  return (
    <div style={{ backgroundColor: "#F5EFE4", minHeight: "100vh" }} className="py-16 px-6">
      <div className="container mx-auto max-w-7xl">

        {/* RUO Banner */}
        <div
          className="mb-10 flex items-center justify-center gap-3"
          style={{
            backgroundColor: "#607A5C",
            padding: "12px 24px",
          }}
        >
          <span style={{ color: "#F5EFE4", fontSize: "8px" }}>●</span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "2px", color: "#F5EFE4" }}
          >
            For lawful in vitro research only · Not for human use · RUO
          </span>
          <span style={{ color: "#F5EFE4", fontSize: "8px" }}>●</span>
        </div>

        {/* Header */}
        <div className="mb-10">
          <div
            className="font-mono uppercase mb-2"
            style={{ fontSize: "11px", letterSpacing: "3px", color: "#1A1814" }}
          >
            07.1 — SECURE CHECKOUT
          </div>
          <h1
            className="font-display"
            style={{ fontWeight: 300, fontSize: "clamp(2.2rem, 4vw, 3.5rem)", color: "#1A1814", letterSpacing: "-0.02em" }}
          >
            Complete your order.
          </h1>
          {staleNotice ? (
            <p
              className="font-editorial mt-4"
              style={{ fontSize: "15px", color: "#B8624A" }}
              role="alert"
            >
              {staleNotice}
            </p>
          ) : null}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT: FORM or PAY ───────────────────────────── */}
          <div className="lg:col-span-2">
            {step === "pay" && quotePack ? (
              <div className="space-y-6">
                <a
                  href="#review"
                  onClick={(e) => {
                    e.preventDefault();
                    backToReview();
                  }}
                  className="font-mono uppercase"
                  style={{ fontSize: "11px", letterSpacing: "2px", color: "#1A1814" }}
                >
                  ← Edit order
                </a>
                {payError ? (
                  <p
                    className="font-editorial"
                    style={{ fontSize: "14px", color: "#B8624A" }}
                    role="alert"
                  >
                    {payError}
                  </p>
                ) : null}
                <PscCheckout
                  quote={quotePack.quote}
                  sig={quotePack.sig}
                  theme="light"
                  pcid={process.env.NEXT_PUBLIC_PSC_PCID!}
                  serviceBase={process.env.NEXT_PUBLIC_PSC_SERVICE_BASE!}
                  onPaid={handlePaid}
                  onError={setPayError}
                  onSurface={handleRecordOrder}
                />
              </div>
            ) : (
            <form onSubmit={handleContinueToPayment} className="space-y-6">

              {/* Contact Information */}
              <div
                style={{
                  backgroundColor: "#EBE2CF",
                  borderLeft: "3px solid #B8624A",
                  padding: "32px",
                }}
              >
                <div
                  className="font-mono uppercase mb-1"
                  style={{ fontSize: "9px", letterSpacing: "3px", color: "#B8624A" }}
                >
                  01
                </div>
                <h2
                  className="font-display mb-6"
                  style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1.4rem", color: "#1A1814", letterSpacing: "-0.02em" }}
                >
                  Contact information
                </h2>

                <div className="space-y-5">
                  <div>
                    <label
                      className="block font-functional uppercase mb-1.5"
                      style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#1A1814" }}
                    >
                      Email for your quote
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full focus:outline-none font-functional text-sm"
                      style={{
                        backgroundColor: "#F5EFE4",
                        border: "1px solid rgba(26,24,20,0.15)",
                        padding: "11px 14px",
                        color: "#1A1814",
                      }}
                      placeholder="your@email.com"
                    />
                  </div>

                  <div>
                    <label
                      className="block font-functional uppercase mb-1.5"
                      style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#1A1814" }}
                    >
                      Full name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full focus:outline-none font-functional text-sm"
                      style={{
                        backgroundColor: "#F5EFE4",
                        border: "1px solid rgba(26,24,20,0.15)",
                        padding: "11px 14px",
                        color: "#1A1814",
                      }}
                      placeholder="Dr. Jane Smith"
                    />
                  </div>

                  <div>
                    <label
                      className="block font-functional uppercase mb-1.5"
                      style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#1A1814" }}
                    >
                      Institution
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      className="w-full focus:outline-none font-functional text-sm"
                      style={{
                        backgroundColor: "#F5EFE4",
                        border: "1px solid rgba(26,24,20,0.15)",
                        padding: "11px 14px",
                        color: "#1A1814",
                      }}
                      placeholder="Optional"
                    />
                  </div>

                </div>
              </div>

              {/* Shipping Address */}
              <div
                style={{
                  backgroundColor: "#EBE2CF",
                  borderLeft: "3px solid #C89A3C",
                  padding: "32px",
                }}
              >
                <div
                  className="font-mono uppercase mb-1"
                  style={{ fontSize: "9px", letterSpacing: "3px", color: "#C89A3C" }}
                >
                  02
                </div>
                <h2
                  className="font-display mb-6"
                  style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1.4rem", color: "#1A1814", letterSpacing: "-0.02em" }}
                >
                  Shipping address
                </h2>

                <div className="space-y-5">
                  <div>
                    <label
                      className="block font-functional uppercase mb-1.5"
                      style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#1A1814" }}
                    >
                      Address line 1 *
                    </label>
                    <input
                      type="text"
                      name="address1"
                      value={formData.address1}
                      onChange={handleChange}
                      required
                      className="w-full focus:outline-none font-functional text-sm"
                      style={{
                        backgroundColor: "#F5EFE4",
                        border: "1px solid rgba(26,24,20,0.15)",
                        padding: "11px 14px",
                        color: "#1A1814",
                      }}
                      placeholder="123 Research Drive"
                    />
                  </div>

                  <div>
                    <label
                      className="block font-functional uppercase mb-1.5"
                      style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#1A1814" }}
                    >
                      Address line 2
                    </label>
                    <input
                      type="text"
                      name="address2"
                      value={formData.address2}
                      onChange={handleChange}
                      className="w-full focus:outline-none font-functional text-sm"
                      style={{
                        backgroundColor: "#F5EFE4",
                        border: "1px solid rgba(26,24,20,0.15)",
                        padding: "11px 14px",
                        color: "#1A1814",
                      }}
                      placeholder="Suite 400, Lab Building C (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block font-functional uppercase mb-1.5"
                        style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#1A1814" }}
                      >
                        City *
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className="w-full focus:outline-none font-functional text-sm"
                        style={{
                          backgroundColor: "#F5EFE4",
                          border: "1px solid rgba(26,24,20,0.15)",
                          padding: "11px 14px",
                          color: "#1A1814",
                        }}
                        placeholder="Boston"
                      />
                    </div>
                    <div>
                      <label
                        className="block font-functional uppercase mb-1.5"
                        style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#1A1814" }}
                      >
                        State / Province *
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        className="w-full focus:outline-none font-functional text-sm"
                        style={{
                          backgroundColor: "#F5EFE4",
                          border: "1px solid rgba(26,24,20,0.15)",
                          padding: "11px 14px",
                          color: "#1A1814",
                        }}
                        placeholder="MA"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block font-functional uppercase mb-1.5"
                        style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#1A1814" }}
                      >
                        ZIP / Postal code *
                      </label>
                      <input
                        type="text"
                        name="zip"
                        value={formData.zip}
                        onChange={handleChange}
                        required
                        className="w-full focus:outline-none font-functional text-sm"
                        style={{
                          backgroundColor: "#F5EFE4",
                          border: "1px solid rgba(26,24,20,0.15)",
                          padding: "11px 14px",
                          color: "#1A1814",
                        }}
                        placeholder="02115"
                      />
                    </div>
                    <div>
                      <label
                        className="block font-functional uppercase mb-1.5"
                        style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#1A1814" }}
                      >
                        Country *
                      </label>
                      <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        required
                        className="w-full focus:outline-none font-functional text-sm"
                        style={{
                          backgroundColor: "#F5EFE4",
                          border: "1px solid rgba(26,24,20,0.15)",
                          padding: "11px 14px",
                          color: "#1A1814",
                        }}
                        placeholder="US"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {quoteError ? (
                <p
                  className="font-editorial"
                  style={{ fontSize: "14px", color: "#B8624A" }}
                  role="alert"
                >
                  {quoteError}
                </p>
              ) : null}

              <button
                type="submit"
                disabled={!addressValid || isQuoting}
                className="w-full flex items-center justify-center gap-3 transition-all font-mono uppercase"
                style={{
                  backgroundColor: !addressValid || isQuoting ? "rgba(26,24,20,0.5)" : "#1A1814",
                  color: "#EBE2CF",
                  padding: "18px 32px",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  cursor: !addressValid || isQuoting ? "not-allowed" : "pointer",
                  border: "none",
                }}
              >
                Continue to payment
              </button>

            </form>
            )}
          </div>

          {/* ── RIGHT: ORDER SUMMARY ────────────────────────── */}
          <div className="lg:col-span-1 lg:sticky lg:top-28 order-first lg:order-last">

            {/* Summary Panel */}
            <div style={{ border: "1px solid rgba(26,24,20,0.15)", overflow: "hidden" }}>

              {/* Dark header */}
              <div
                style={{
                  backgroundColor: "#1A1814",
                  padding: "18px 24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div
                    className="font-mono uppercase"
                    style={{ fontSize: "9px", letterSpacing: "3px", color: "#B8624A", marginBottom: "3px" }}
                  >
                    ● ORDER SUMMARY
                  </div>
                  <div
                    className="font-display"
                    style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1.15rem", color: "#EBE2CF" }}
                  >
                    {totalQty} {totalQty === 1 ? "compound" : "compounds"}
                  </div>
                </div>
                {/* Verified seal mark */}
                <svg width="36" height="36" viewBox="0 0 36 36" opacity={0.35}>
                  <circle cx="18" cy="18" r="16" stroke="#C89A3C" strokeWidth="1" fill="none" />
                  <circle cx="18" cy="18" r="5" fill="#C89A3C" />
                </svg>
              </div>

              <div style={{ backgroundColor: "#F5EFE4", padding: "20px 24px" }}>

                {/* Promo Code — review only */}
                {step === "review" ? (
                <div
                  style={{
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid rgba(26,24,20,0.1)",
                  }}
                >
                  <label
                    className="block font-mono uppercase mb-2"
                    style={{ fontSize: "10px", letterSpacing: "2px", color: "#1A1814" }}
                  >
                    Promo code
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={promoCodeInput}
                      onChange={(e) => setPromoCodeInput(e.target.value.toUpperCase())}
                      placeholder="ENTER CODE"
                      className="flex-1 font-mono uppercase focus:outline-none"
                      style={{
                        backgroundColor: "#EBE2CF",
                        border: "1px solid rgba(26,24,20,0.15)",
                        padding: "9px 12px",
                        fontSize: "10px",
                        letterSpacing: "1.5px",
                        color: "#1A1814",
                      }}
                      disabled={isApplyingPromo}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromoCode}
                      disabled={isApplyingPromo || !promoCodeInput.trim()}
                      className="font-mono uppercase transition-colors"
                      style={{
                        backgroundColor: "#1A1814",
                        color: "#EBE2CF",
                        padding: "9px 14px",
                        fontSize: "10px",
                        letterSpacing: "1.5px",
                        opacity: isApplyingPromo || !promoCodeInput.trim() ? 0.45 : 1,
                        cursor: isApplyingPromo || !promoCodeInput.trim() ? "not-allowed" : "pointer",
                        border: "none",
                      }}
                    >
                      {isApplyingPromo ? "..." : "APPLY"}
                    </button>
                  </div>
                  {promoCodeStatus === 'success' && (
                    <div
                      className="mt-2 flex items-center gap-2 font-mono"
                      style={{ fontSize: "10px", color: "#607A5C" }}
                    >
                      <span>✓</span>
                      <span>Code applied</span>
                    </div>
                  )}
                  {promoCodeStatus === 'error' && (
                    <div
                      className="mt-2 font-mono"
                      style={{ fontSize: "10px", color: "#B8624A" }}
                    >
                      {promoCodeError}
                    </div>
                  )}
                </div>
                ) : null}

                {/* Item List */}
                <div
                  style={{
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid rgba(26,24,20,0.1)",
                  }}
                >
                  {step === "pay" && quotePack
                    ? quotePack.quote.lines.map((line, index) => {
                        const product = PRODUCTS.find((p) => p.slug === line.slug);
                        const cartLine = quotePack.quote.cart.items[index];
                        return (
                          <div
                            key={`${line.slug}:${line.size}`}
                            style={{
                              paddingBottom: index < quotePack.quote.lines.length - 1 ? "14px" : 0,
                              marginBottom: index < quotePack.quote.lines.length - 1 ? "14px" : 0,
                              borderBottom:
                                index < quotePack.quote.lines.length - 1
                                  ? "1px solid rgba(26,24,20,0.07)"
                                  : "none",
                            }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <span
                                  className="font-display"
                                  style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1rem", color: "#1A1814" }}
                                >
                                  {product?.name ?? line.slug}
                                </span>
                                <div className="font-mono mt-0.5" style={{ fontSize: "11px", color: "#1A1814" }}>
                                  {line.size} × {line.qty}
                                </div>
                              </div>
                              <span
                                className="font-display flex-shrink-0"
                                style={{ fontWeight: 300, fontSize: "1rem", color: "#1A1814" }}
                              >
                                ${((cartLine?.amount_cents ?? line.unit_cents * line.qty) / 100).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    : items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        paddingBottom: index < items.length - 1 ? "14px" : 0,
                        marginBottom: index < items.length - 1 ? "14px" : 0,
                        borderBottom: index < items.length - 1 ? "1px solid rgba(26,24,20,0.07)" : "none",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Product vial image — overflow:hidden clips transparent top/bottom padding */}
                        {productImageMap[item.productId] && (
                          <div
                            style={{
                              width: 91,
                              height: 80,
                              overflow: "hidden",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              filter: "drop-shadow(0 4px 8px rgba(26,24,20,0.12))",
                            }}
                          >
                            <img
                              src={productImageMap[item.productId]}
                              alt=""
                              aria-hidden="true"
                              style={{
                                width: 91,
                                height: 116,
                                objectFit: "contain",
                              }}
                            />
                          </div>
                        )}
                        <div style={{ flex: 1 }}>
                          <div className="flex items-start justify-between gap-2">
                            <span
                              className="font-display"
                              style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1rem", color: "#1A1814", lineHeight: 1.2 }}
                            >
                              {item.productName}
                            </span>
                            <span
                              className="font-display flex-shrink-0"
                              style={{ fontWeight: 300, fontSize: "1rem", color: "#1A1814" }}
                            >
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                          <div
                            className="font-mono mt-0.5"
                            style={{ fontSize: "11px", color: "#1A1814" }}
                          >
                            {item.variant}
                          </div>
                          <div className="flex items-center justify-between mt-1.5">
                            <div className="flex items-center">
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.variant, item.quantity - 1)}
                                className="w-7 h-7 border border-[#1A1814]/15 font-mono text-sm text-[#1A1814] hover:border-[#B8624A] hover:text-[#B8624A] transition-colors flex items-center justify-center"
                              >−</button>
                              <span className="font-mono text-xs text-[#1A1814] font-medium w-7 text-center">{item.quantity}</span>
                              <button
                                type="button"
                                onClick={() => updateQuantity(item.productId, item.variant, item.quantity + 1)}
                                className="w-7 h-7 border border-[#1A1814]/15 font-mono text-sm text-[#1A1814] hover:border-[#B8624A] hover:text-[#B8624A] transition-colors flex items-center justify-center"
                              >+</button>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeItem(item.productId, item.variant)}
                              className="font-mono text-xs text-[#1A1814]/70 hover:text-[#B8624A] transition-colors"
                            >✕</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping callouts */}
                <div
                  style={{
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid rgba(26,24,20,0.1)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {/* Free shipping */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      backgroundColor: "rgba(200,154,60,0.08)",
                      border: "1px solid rgba(200,154,60,0.3)",
                      padding: "10px 14px",
                    }}
                  >
                    {/* Truck icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <path d="M1 3h15v13H1zM16 8h4l3 3v5h-7V8z" stroke="#C89A3C" strokeWidth="1.5" strokeLinejoin="round" />
                      <circle cx="5.5" cy="18.5" r="2" stroke="#C89A3C" strokeWidth="1.5" />
                      <circle cx="18.5" cy="18.5" r="2" stroke="#C89A3C" strokeWidth="1.5" />
                    </svg>
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#C89A3C", fontWeight: 500 }}
                    >
                      Free shipping on orders over $150
                    </span>
                  </div>
                  {/* 2-day delivery */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      backgroundColor: "rgba(184,98,74,0.07)",
                      border: "1px solid rgba(184,98,74,0.25)",
                      padding: "10px 14px",
                    }}
                  >
                    {/* Calendar/clock icon */}
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ flexShrink: 0 }}>
                      <circle cx="12" cy="12" r="9" stroke="#B8624A" strokeWidth="1.5" />
                      <path d="M12 7v5l3 3" stroke="#B8624A" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: "11px", letterSpacing: "1.5px", color: "#B8624A", fontWeight: 500 }}
                    >
                      2-Day Delivery
                    </span>
                  </div>
                </div>

                {/* Price Rows */}
                <div className="space-y-3" style={{ marginBottom: "16px" }}>
                  {step === "pay" && quotePack ? (
                    <>
                      <div className="flex justify-between items-center">
                        <span
                          className="font-mono uppercase"
                          style={{ fontSize: "10px", letterSpacing: "2px", color: "#1A1814" }}
                        >
                          Subtotal
                        </span>
                        <span
                          className="font-mono"
                          style={{ fontSize: "13px", color: "#1A1814" }}
                        >
                          ${(quotePack.quote.subtotal_cents / 100).toFixed(2)}
                        </span>
                      </div>
                      {quotePack.quote.discount_cents > 0 && (
                        <div className="flex justify-between items-center">
                          <span
                            className="font-mono uppercase"
                            style={{ fontSize: "9px", letterSpacing: "2px", color: "#B8624A" }}
                          >
                            {quotePack.quote.discount_label}
                          </span>
                          <span
                            className="font-mono"
                            style={{ fontSize: "13px", color: "#B8624A" }}
                          >
                            −${(quotePack.quote.discount_cents / 100).toFixed(2)}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span
                          className="font-mono uppercase"
                          style={{ fontSize: "10px", letterSpacing: "2px", color: "#1A1814" }}
                        >
                          Shipping
                        </span>
                        {quotePack.quote.shipping_cents === 0 ? (
                          <span
                            className="font-mono uppercase"
                            style={{ fontSize: "11px", letterSpacing: "1px", color: "#607A5C", fontWeight: 500 }}
                          >
                            FREE
                          </span>
                        ) : (
                          <span
                            className="font-mono"
                            style={{ fontSize: "13px", color: "#1A1814" }}
                          >
                            ${(quotePack.quote.shipping_cents / 100).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                  {bundleSavings > 0 && (
                    <div className="flex justify-between items-center">
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: "9px", letterSpacing: "2px", color: "#B8624A" }}
                      >
                        Bundle discount — {(bundleRate * 100).toFixed(0)}% off
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: "13px", color: "#B8624A" }}
                      >
                        −${bundleSavings.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: "10px", letterSpacing: "2px", color: "#1A1814" }}
                    >
                      Subtotal
                    </span>
                    <span
                      className="font-mono"
                      style={{ fontSize: "13px", color: "#1A1814" }}
                    >
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discountResult.discountAmount > 0 && (
                    <div className="flex justify-between items-center">
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: "9px", letterSpacing: "2px", color: "#B8624A" }}
                      >
                        {discountResult.label}
                      </span>
                      <span
                        className="font-mono"
                        style={{ fontSize: "13px", color: "#B8624A" }}
                      >
                        −${discountResult.discountAmount.toFixed(2)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: "10px", letterSpacing: "2px", color: "#1A1814" }}
                    >
                      Shipping
                    </span>
                    {discountResult.shippingAmount === 0 ? (
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: "11px", letterSpacing: "1px", color: "#607A5C", fontWeight: 500 }}
                      >
                        FREE
                      </span>
                    ) : (
                      <span
                        className="font-mono"
                        style={{ fontSize: "13px", color: "#1A1814" }}
                      >
                        ${discountResult.shippingAmount.toFixed(2)}
                      </span>
                    )}
                  </div>
                    </>
                  )}

                </div>

                {/* Total */}
                <div
                  style={{
                    borderTop: "1px solid rgba(26,24,20,0.15)",
                    paddingTop: "16px",
                    marginBottom: "20px",
                  }}
                >
                  <div className="flex justify-between items-end">
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: "10px", letterSpacing: "2px", color: "#1A1814" }}
                    >
                      Total
                    </span>
                    <span
                      className="font-display"
                      style={{
                        fontWeight: 300,
                        fontSize: "2.4rem",
                        color: "#1A1814",
                        lineHeight: 1,
                        letterSpacing: "-0.02em",
                      }}
                    >
                      ${((step === "pay" && quotePack
                        ? quotePack.quote.cart.total_cents
                        : Math.round(reviewTotal * 100)) / 100).toFixed(2)}
                    </span>
                  </div>
                  {/* Ochre accent underline under total */}
                  <div
                    style={{
                      height: "2px",
                      backgroundColor: "#C89A3C",
                      width: "64px",
                      marginLeft: "auto",
                      marginTop: "6px",
                    }}
                  />
                </div>

                {/* Trust Indicators */}
                <div
                  style={{
                    borderTop: "1px solid rgba(26,24,20,0.1)",
                    paddingTop: "16px",
                    marginBottom: "20px",
                  }}
                >
                  {[
                    { text: "CoA included with every lot", color: "#607A5C" },
                    { text: "Room-temp stable packaging", color: "#607A5C" },
                  ].map((item) => (
                    <div
                      key={item.text}
                      className="flex items-center gap-2 font-mono mb-2"
                      style={{ fontSize: "11px", color: "#1A1814" }}
                    >
                      <span style={{ color: item.color, fontSize: "7px" }}>●</span>
                      {item.text}
                    </div>
                  ))}
                </div>

                {/* RUO Disclaimer — inside panel, below trust indicators */}
                <div
                  style={{
                    backgroundColor: "#EBE2CF",
                    borderTop: "2px solid #B8624A",
                    padding: "14px 16px",
                  }}
                >
                  <div className="flex items-start gap-2">
                    <span style={{ color: "#B8624A", fontSize: "7px", marginTop: "3px", flexShrink: 0 }}>●</span>
                    <div>
                      <p
                        className="font-mono uppercase mb-1"
                        style={{ fontSize: "8px", letterSpacing: "2px", color: "#1A1814" }}
                      >
                        Research use only
                      </p>
                      <p
                        className="font-editorial leading-snug"
                        style={{ fontSize: "12px", color: "#1A1814", opacity: 0.8 }}
                      >
                        For in vitro laboratory use only. Not for human consumption, clinical, therapeutic, or veterinary use. Qualified researchers only.
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ── OTHERS ARE ALSO RESEARCHING ── */}
            {step === "review" && suggestions.length > 0 && (
              <div
                style={{
                  marginTop: "12px",
                  border: "1px solid rgba(26,24,20,0.15)",
                  borderLeft: "2px solid #B8624A",
                  backgroundColor: "#EBE2CF",
                  overflow: "hidden",
                }}
              >
                {/* Header */}
                <div
                  style={{
                    padding: "12px 20px",
                    borderBottom: "1px solid rgba(26,24,20,0.1)",
                  }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: "9px", letterSpacing: "3px", color: "#B8624A" }}
                  >
                    OTHERS ARE ALSO RESEARCHING
                  </span>
                </div>

                {/* Product rows */}
                <div>
                  {suggestions.map((product, idx) => (
                    <div
                      key={product.slug}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        padding: "12px 20px",
                        borderBottom: idx < suggestions.length - 1 ? "1px solid rgba(26,24,20,0.08)" : "none",
                      }}
                    >
                      {/* Vial image */}
                      {product.images[0] && (
                        <div
                          style={{
                            width: 64,
                            height: 72,
                            flexShrink: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            overflow: "hidden",
                          }}
                        >
                          <img
                            src={product.images[0]}
                            alt=""
                            aria-hidden="true"
                            style={{
                              width: 64,
                              height: 82,
                              objectFit: "contain",
                              filter: "drop-shadow(0 2px 6px rgba(26,24,20,0.12))",
                            }}
                          />
                        </div>
                      )}

                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          className="font-display"
                          style={{
                            fontWeight: 300,
                            fontStyle: "italic",
                            fontSize: "0.95rem",
                            color: "#1A1814",
                            lineHeight: 1.2,
                          }}
                        >
                          {product.name}
                        </div>
                        <div
                          className="font-mono"
                          style={{ fontSize: "10px", color: "#C89A3C", marginTop: "3px" }}
                        >
                          {product.purity}
                        </div>
                        <div
                          className="font-mono"
                          style={{ fontSize: "11px", color: "#1A1814", marginTop: "2px" }}
                        >
                          ${product.prices[0]}
                        </div>
                      </div>

                      {/* Add to order button */}
                      <button
                        type="button"
                        onClick={() =>
                          addItem({
                            productId: product.id.toString(),
                            productName: product.name,
                            variant: product.sizes[0],
                            price: product.prices[0],
                            sku: product.skus[0],
                          })
                        }
                        style={{
                          backgroundColor: "#B8624A",
                          border: "none",
                          cursor: "pointer",
                          padding: "9px 12px",
                          flexShrink: 0,
                        }}
                      >
                        <span
                          className="font-mono uppercase"
                          style={{ fontSize: "9px", letterSpacing: "1.5px", color: "#F5EFE4" }}
                        >
                          ADD TO ORDER
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Corner Mark */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">
        L-008
      </div>
    </div>
  );
}
