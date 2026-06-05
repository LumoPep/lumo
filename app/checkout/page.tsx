"use client";

import { useState, useEffect } from "react";
import { useCartStore } from "@/lib/store";
import { useRouter } from "next/navigation";
import ResearchDisclaimerBox from "@/components/ResearchDisclaimerBox";

const cryptoCurrencies = [
  { code: "btc", name: "Bitcoin", symbol: "BTC" },
  { code: "eth", name: "Ethereum", symbol: "ETH" },
  { code: "usdttrc20", name: "USDT (TRC-20)", symbol: "USDT" },
  { code: "usdcerc20", name: "USDC (ERC-20)", symbol: "USDC" },
  { code: "ltc", name: "Litecoin", symbol: "LTC" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();

  const [formData, setFormData] = useState({
    email: "",
    name: "",
    institution: "",
    confirmResearch: false,
    confirmAge: false,
    confirmAccurate: false,
  });

  const [selectedCrypto, setSelectedCrypto] = useState("btc");
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.push("/products");
    }
  }, [items, router]);

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

  const total = getTotal();

  return (
    <div className="py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* RUO Banner */}
        <div className="bg-clay p-4 mb-8 text-center" style={{ borderRadius: "8px" }}>
          <span className="font-mono uppercase text-cream" style={{ fontSize: "11px", letterSpacing: "1.5px" }}>
            <span className="text-white">⚠</span> By completing this purchase you confirm these
            compounds will be used exclusively for lawful in vitro research. Not for human use.
          </span>
        </div>

        {/* Header */}
        <div className="mb-12">
          <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-3">
            07.1 — SECURE CHECKOUT
          </div>
          <h1 className="font-display text-5xl text-ink mb-4" style={{ fontWeight: 300 }}>
            Complete Your Order
          </h1>
          <p className="font-editorial text-ink opacity-60">
            Secure cryptocurrency payment
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleCheckout} className="space-y-8">
              {/* Contact Information */}
              <div className="bg-cream hairline-border p-8">
                <h2 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-6">
                  CONTACT INFORMATION
                </h2>

                <div className="space-y-6">
                  <div>
                    <label className="block font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-2">
                      EMAIL ADDRESS *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-bone hairline-border text-ink placeholder-ink placeholder-opacity-40 focus:outline-none focus:border-clay font-functional text-sm"
                      placeholder="your.email@institution.edu"
                    />
                    <p className="font-mono text-xs text-ink opacity-40 mt-1">
                      Order confirmation and tracking will be sent here
                    </p>
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-2">
                      FULL NAME *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-bone hairline-border text-ink placeholder-ink placeholder-opacity-40 focus:outline-none focus:border-clay font-functional text-sm"
                      placeholder="Dr. Jane Smith"
                    />
                  </div>

                  <div>
                    <label className="block font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-2">
                      RESEARCH INSTITUTION / ORGANIZATION *
                    </label>
                    <input
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-3 bg-bone hairline-border text-ink placeholder-ink placeholder-opacity-40 focus:outline-none focus:border-clay font-functional text-sm"
                      placeholder="University Research Laboratory"
                    />
                  </div>
                </div>
              </div>

              {/* Cryptocurrency Selection */}
              <div className="bg-cream hairline-border p-8">
                <h2 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-2">
                  PAYMENT METHOD
                </h2>
                <p className="font-editorial text-sm text-ink opacity-60 mb-6">
                  Select your preferred cryptocurrency
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {cryptoCurrencies.map((crypto) => (
                    <button
                      key={crypto.code}
                      type="button"
                      onClick={() => setSelectedCrypto(crypto.code)}
                      className={`p-4 hairline-border transition-all flex items-center space-x-3 ${
                        selectedCrypto === crypto.code
                          ? "border-clay bg-bone"
                          : "hover:border-clay"
                      }`}
                    >
                      <span className="text-clay">●</span>
                      <div className="text-left">
                        <div className="font-mono text-xs uppercase tracking-mono text-ink font-medium">
                          {crypto.name}
                        </div>
                        <div className="font-mono text-xs text-ink opacity-40">
                          {crypto.symbol}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="mt-6 flex items-start space-x-3 bg-bone hairline-border p-4">
                  <svg width="20" height="20" viewBox="0 0 20 20" className="flex-shrink-0 mt-0.5">
                    <circle cx="10" cy="10" r="9" stroke="#B8624A" strokeWidth="1.5" fill="none" />
                    <circle cx="10" cy="10" r="3" fill="#B8624A" />
                  </svg>
                  <div>
                    <p className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-1">
                      SECURE CRYPTO PAYMENTS
                    </p>
                    <p className="font-editorial text-xs text-ink opacity-60">
                      Payments are processed securely through NOWPayments.
                      Transactions are confirmed automatically via blockchain.
                    </p>
                  </div>
                </div>
              </div>

              {/* Required Confirmations */}
              <div className="bg-bone hairline-border p-8">
                <h3 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-4">
                  REQUIRED ACKNOWLEDGMENTS
                </h3>
                <div className="space-y-4">
                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="confirmResearch"
                      checked={formData.confirmResearch}
                      onChange={handleChange}
                      required
                      className="mt-1 w-5 h-5 border hairline-border bg-cream text-clay focus:ring-clay focus:ring-offset-0 flex-shrink-0"
                    />
                    <span className="font-editorial text-sm text-ink opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity">
                      I confirm that all products will be used{" "}
                      <span className="font-medium text-ink">
                        exclusively for in vitro research and laboratory purposes
                      </span>
                      . These products are NOT for human consumption, clinical
                      use, therapeutic applications, or veterinary use.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="confirmAge"
                      checked={formData.confirmAge}
                      onChange={handleChange}
                      required
                      className="mt-1 w-5 h-5 border hairline-border bg-cream text-clay focus:ring-clay focus:ring-offset-0 flex-shrink-0"
                    />
                    <span className="font-editorial text-sm text-ink opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity">
                      I confirm that I am at least 21 years of age and
                      affiliated with a qualified research institution,
                      university, or laboratory.
                    </span>
                  </label>

                  <label className="flex items-start space-x-3 cursor-pointer group">
                    <input
                      type="checkbox"
                      name="confirmAccurate"
                      checked={formData.confirmAccurate}
                      onChange={handleChange}
                      required
                      className="mt-1 w-5 h-5 border hairline-border bg-cream text-clay focus:ring-clay focus:ring-offset-0 flex-shrink-0"
                    />
                    <span className="font-editorial text-sm text-ink opacity-80 leading-relaxed group-hover:opacity-100 transition-opacity">
                      I confirm that all information provided is accurate and I
                      agree to comply with all applicable laws and regulations
                      governing research chemical use.
                    </span>
                  </label>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <span className="animate-spin">◌</span>
                    <span>PROCESSING...</span>
                  </>
                ) : (
                  <span>→ PROCEED TO PAYMENT</span>
                )}
              </button>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-cream hairline-border p-6 lg:sticky lg:top-32">
              <h2 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-6">
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 mb-6">
                {items.map((item, index) => (
                  <div
                    key={index}
                    className="pb-4 border-b hairline-border last:border-0"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <span className="font-display text-sm text-ink" style={{ fontWeight: 300, fontStyle: "italic" }}>
                        {item.productName}
                      </span>
                      <span className="font-display text-sm text-ink" style={{ fontWeight: 300 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                    <div className="font-mono text-xs text-ink opacity-40">
                      {item.variant} × {item.quantity}
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t hairline-border pt-4 space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                    Subtotal
                  </span>
                  <span className="font-mono text-sm text-ink">
                    ${total.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                    Shipping
                  </span>
                  <span className="font-mono text-sm text-ink">Calculated</span>
                </div>
              </div>

              <div className="border-t hairline-border pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs uppercase tracking-mono text-ink font-medium">
                    Total
                  </span>
                  <span className="font-display text-3xl text-ink" style={{ fontWeight: 300 }}>
                    ${total.toFixed(2)}
                  </span>
                </div>
                <p className="font-mono text-xs text-ink opacity-40 text-center mt-2">
                  USD equivalent in selected cryptocurrency
                </p>
              </div>

              {/* Trust Indicators */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2 font-mono text-xs text-ink opacity-60">
                  <span className="text-clay">●</span>
                  <span>Secure blockchain payment</span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-xs text-ink opacity-60">
                  <span className="text-clay">●</span>
                  <span>CoA included with every order</span>
                </div>
                <div className="flex items-center space-x-2 font-mono text-xs text-ink opacity-60">
                  <span className="text-clay">●</span>
                  <span>Room temp stable packaging</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <ResearchDisclaimerBox />
            </div>
          </div>
        </div>
      </div>

      {/* Corner Marks */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">
        L-008
      </div>
    </div>
  );
}
