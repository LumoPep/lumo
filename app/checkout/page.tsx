"use client";

import { useState, useEffect, useCallback } from "react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import { PRODUCTS } from "@/data/products";
import ResearchDisclaimerBox from "@/components/ResearchDisclaimerBox";
import { calculateBestDiscount, type DiscountResult } from "@/lib/discount";
import { validatePromoCode } from "@/lib/validatePromoCode";
import { isFirstOrder } from "@/lib/checkFirstOrder";

const cryptoCurrencies = [
  { code: "btc", name: "Bitcoin", symbol: "BTC" },
  { code: "eth", name: "Ethereum", symbol: "ETH" },
  { code: "usdttrc20", name: "USDT (TRC-20)", symbol: "USDT" },
  { code: "usdcerc20", name: "USDC (ERC-20)", symbol: "USDC" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();

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
    confirmResearch: false,
    confirmAge: false,
    confirmAccurate: false,
  });

  const [selectedCrypto, setSelectedCrypto] = useState("btc");
  const [isProcessing, setIsProcessing] = useState(false);

  // Promo code state
  const [promoCodeInput, setPromoCodeInput] = useState("");
  const [promoCode, setPromoCode] = useState<{ type: 'percent' | 'free_shipping'; value?: number } | null>(null);
  const [promoCodeStatus, setPromoCodeStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [promoCodeError, setPromoCodeError] = useState("");
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  // First order detection
  const [isFirstOrderFlag, setIsFirstOrderFlag] = useState(false);
  const [isCheckingFirstOrder, setIsCheckingFirstOrder] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items, router]);

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
    const { name, value, type } = e.target;
    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
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

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.confirmResearch ||
      !formData.confirmAge ||
      !formData.confirmAccurate
    ) {
      alert("Please confirm all required statements to proceed.");
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment with NOWPayments
      const response = await fetch("/api/create-payment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: getTotal(),
          currency: selectedCrypto,
          email: formData.email,
          customerInfo: {
            name: formData.name,
            institution: formData.institution,
          },
          shippingAddress: {
            address1: formData.address1,
            address2: formData.address2 || undefined,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country,
          },
          items: items,
        }),
      });

      const data = await response.json();

      if (data.success && data.payment) {
        // Store order info in sessionStorage for confirmation page
        sessionStorage.setItem(
          "pendingOrder",
          JSON.stringify({
            paymentId: data.payment.payment_id,
            orderId: data.payment.order_id,
            amount: getTotal(),
            currency: selectedCrypto,
            items: items,
          })
        );

        // Clear cart
        clearCart();

        // Redirect to payment page or show payment details
        window.location.href = data.payment.invoice_url || "#";
      } else {
        throw new Error(data.error || "Payment creation failed");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert(
        "An error occurred during checkout. Please try again or contact support."
      );
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return null;
  }

  // Build id → first image lookup from product catalog
  const productImageMap: Record<string, string> = {};
  PRODUCTS.forEach((p) => {
    if (p.images && p.images.length > 0) {
      productImageMap[p.id.toString()] = p.images[0];
    }
  });

  const subtotal = getTotal();
  const totalQty = items.reduce((sum, item) => sum + item.quantity, 0);

  // Calculate best discount
  const discountResult: DiscountResult = calculateBestDiscount(
    subtotal,
    totalQty,
    promoCode,
    isFirstOrderFlag
  );

  return (
    <div style={{ backgroundColor: "#F5EFE4", minHeight: "100vh" }} className="py-16 px-6">
      <div className="container mx-auto max-w-7xl">

        {/* RUO Banner */}
        <div
          className="mb-10 flex items-center justify-center gap-3"
          style={{
            backgroundColor: "#1A1814",
            padding: "12px 24px",
          }}
        >
          <span style={{ color: "#B8624A", fontSize: "8px" }}>●</span>
          <span
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "2px", color: "#EBE2CF" }}
          >
            For lawful in vitro research only · Not for human use · RUO
          </span>
          <span style={{ color: "#B8624A", fontSize: "8px" }}>●</span>
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
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ── LEFT: FORM ──────────────────────────────────── */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-6">

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
                      Email address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full focus:outline-none font-functional text-sm"
                      style={{
                        backgroundColor: "#F5EFE4",
                        border: "1px solid rgba(26,24,20,0.15)",
                        padding: "11px 14px",
                        color: "#1A1814",
                      }}
                      placeholder="your.email@institution.edu"
                    />
                    <p
                      className="font-mono mt-1"
                      style={{ fontSize: "11px", color: "#1A1814", opacity: 0.8 }}
                    >
                      Order confirmation and tracking sent here
                    </p>
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

              {/* Payment Method */}
              <div
                style={{
                  backgroundColor: "#EBE2CF",
                  borderLeft: "3px solid #607A5C",
                  padding: "32px",
                }}
              >
                <div
                  className="font-mono uppercase mb-1"
                  style={{ fontSize: "9px", letterSpacing: "3px", color: "#607A5C" }}
                >
                  03
                </div>
                <h2
                  className="font-display mb-1"
                  style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1.4rem", color: "#1A1814", letterSpacing: "-0.02em" }}
                >
                  Payment method
                </h2>
                <p
                  className="font-editorial mb-6"
                  style={{ fontSize: "14px", color: "#1A1814" }}
                >
                  Select your preferred cryptocurrency
                </p>

                <div className="grid grid-cols-2 gap-3">
                  {cryptoCurrencies.map((crypto) => (
                    <button
                      key={crypto.code}
                      type="button"
                      onClick={() => setSelectedCrypto(crypto.code)}
                      className="flex items-center gap-3 transition-all"
                      style={{
                        padding: "14px 16px",
                        backgroundColor: selectedCrypto === crypto.code ? "#1A1814" : "#F5EFE4",
                        border: selectedCrypto === crypto.code
                          ? "1px solid #1A1814"
                          : "1px solid rgba(26,24,20,0.18)",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "8px",
                          color: selectedCrypto === crypto.code ? "#B8624A" : "rgba(26,24,20,0.3)",
                        }}
                      >
                        ●
                      </span>
                      <div className="text-left">
                        <div
                          className="font-mono uppercase"
                          style={{
                            fontSize: "10px",
                            letterSpacing: "1.5px",
                            color: selectedCrypto === crypto.code ? "#EBE2CF" : "#1A1814",
                          }}
                        >
                          {crypto.name}
                        </div>
                        <div
                          className="font-mono"
                          style={{
                            fontSize: "10px",
                            color: selectedCrypto === crypto.code ? "rgba(235,226,207,0.5)" : "rgba(26,24,20,0.4)",
                          }}
                        >
                          {crypto.symbol}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div
                  className="mt-5 flex items-start gap-3"
                  style={{
                    backgroundColor: "#F5EFE4",
                    border: "1px solid rgba(26,24,20,0.12)",
                    padding: "14px 16px",
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 20 20" className="flex-shrink-0 mt-0.5">
                    <circle cx="10" cy="10" r="9" stroke="#607A5C" strokeWidth="1.5" fill="none" />
                    <circle cx="10" cy="10" r="3" fill="#607A5C" />
                  </svg>
                  <div>
                    <p
                      className="font-mono uppercase mb-0.5"
                      style={{ fontSize: "9px", letterSpacing: "2px", color: "#1A1814" }}
                    >
                      Secure crypto payments
                    </p>
                    <p
                      className="font-editorial"
                      style={{ fontSize: "13px", color: "#1A1814", lineHeight: 1.5 }}
                    >
                      Processed securely through NOWPayments. Confirmed automatically via blockchain.
                    </p>
                  </div>
                </div>
              </div>

              {/* Required Acknowledgments */}
              <div
                style={{
                  backgroundColor: "#F5EFE4",
                  border: "1px solid rgba(26,24,20,0.15)",
                  padding: "28px 32px",
                }}
              >
                <h3
                  className="font-mono uppercase mb-5"
                  style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#1A1814" }}
                >
                  Required acknowledgments
                </h3>
                <div className="space-y-5">
                  {[
                    {
                      name: "confirmResearch",
                      checked: formData.confirmResearch,
                      text: (
                        <>
                          I confirm that all products will be used{" "}
                          <span style={{ fontWeight: 500 }}>exclusively for in vitro research and laboratory purposes</span>.
                          These products are NOT for human consumption, clinical use, therapeutic applications, or veterinary use.
                        </>
                      ),
                    },
                    {
                      name: "confirmAge",
                      checked: formData.confirmAge,
                      text: "I confirm that I am at least 21 years of age and affiliated with a qualified research institution, university, or laboratory.",
                    },
                    {
                      name: "confirmAccurate",
                      checked: formData.confirmAccurate,
                      text: "I confirm that all information provided is accurate and I agree to comply with all applicable laws and regulations governing research chemical use.",
                    },
                  ].map((item) => (
                    <label
                      key={item.name}
                      className="flex items-start gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        name={item.name}
                        checked={item.checked}
                        onChange={handleChange}
                        required
                        className="mt-1 flex-shrink-0"
                        style={{ width: "16px", height: "16px", accentColor: "#B8624A" }}
                      />
                      <span
                        className="font-editorial leading-relaxed"
                        style={{ fontSize: "14px", color: "#1A1814" }}
                      >
                        {item.text}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full flex items-center justify-center gap-3 transition-all font-mono uppercase"
                style={{
                  backgroundColor: isProcessing ? "rgba(26,24,20,0.5)" : "#1A1814",
                  color: "#EBE2CF",
                  padding: "18px 32px",
                  fontSize: "11px",
                  letterSpacing: "3px",
                  cursor: isProcessing ? "not-allowed" : "pointer",
                  border: "none",
                }}
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin inline-block">◌</span>
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <>
                    <span>→ PROCEED TO PAYMENT</span>
                  </>
                )}
              </button>

            </form>
          </div>

          {/* ── RIGHT: ORDER SUMMARY ────────────────────────── */}
          <div className="lg:col-span-1 lg:sticky lg:top-28">

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

                {/* Promo Code */}
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

                {/* Item List */}
                <div
                  style={{
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: "1px solid rgba(26,24,20,0.1)",
                  }}
                >
                  {items.map((item, index) => (
                    <div
                      key={index}
                      style={{
                        paddingBottom: index < items.length - 1 ? "14px" : 0,
                        marginBottom: index < items.length - 1 ? "14px" : 0,
                        borderBottom: index < items.length - 1 ? "1px solid rgba(26,24,20,0.07)" : "none",
                      }}
                    >
                      <div className="flex items-start gap-3">
                        {/* Product vial image */}
                        {productImageMap[item.productId] && (
                          <img
                            src={productImageMap[item.productId]}
                            alt=""
                            aria-hidden="true"
                            style={{
                              width: 52,
                              height: 66,
                              objectFit: "contain",
                              flexShrink: 0,
                              filter: "drop-shadow(0 4px 8px rgba(26,24,20,0.12))",
                            }}
                          />
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
                            {item.variant} · qty {item.quantity}
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
                      ${discountResult.finalTotal.toFixed(2)}
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
                  <p
                    className="font-mono text-right mt-2"
                    style={{ fontSize: "10px", letterSpacing: "1px", color: "#1A1814", opacity: 0.8 }}
                  >
                    USD equivalent in {selectedCrypto.toUpperCase()}
                  </p>
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
                    { text: "Blockchain-confirmed payment", color: "#607A5C" },
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
