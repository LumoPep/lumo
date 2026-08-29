"use client";

import { useCartStore } from "@/lib/store";
import { PRODUCTS } from "@/data/products";
import { getSuggestions } from "@/lib/frequentlyBoughtTogether";
import Link from "next/link";
import { useEffect } from "react";

// Must match md:w-[420px] on the cart drawer
const CART_W = 420;

export default function CartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    getTotal,
    getProductDiscount,
    addItem,
  } = useCartStore();

  const suggestions = getSuggestions(items).slice(0, 2);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div className="fixed inset-0 bg-ink/40 z-40" onClick={closeCart} />
      )}

      {/* ADD button hover style */}
      <style>{`
        .lumo-fbt-add { border-left: 3px solid transparent; }
        .lumo-fbt-add:hover { border-left-color: rgba(26,24,20,0.35); }
      `}</style>

      {/* ── FBT Side Panel — desktop only, slides in 180ms after cart ── */}
      {suggestions.length > 0 && (
        <div
          className="hidden md:flex md:flex-col"
          style={{
            position: "fixed",
            top: "100px",
            right: CART_W,
            height: "calc(100% - 100px)",
            width: 220,
            zIndex: 49,
            backgroundColor: "#F5EFE4",
            borderTop: "3px solid #B8624A",
            borderRight: "1px solid #1A1814",
            overflowY: "auto",
            transform: isOpen
              ? "translateX(0)"
              : `translateX(calc(100% + ${CART_W}px))`,
            transition: isOpen
              ? "transform 300ms ease-in-out 180ms"
              : "transform 300ms ease-in-out",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: "20px 20px 14px",
              borderBottom: "1px solid rgba(200,154,60,0.2)",
              flexShrink: 0,
            }}
          >
            <span
              className="font-mono uppercase"
              style={{ fontSize: "10px", letterSpacing: "3px", color: "#C89A3C" }}
            >
              · FREQUENTLY BOUGHT TOGETHER
            </span>
            <div
              style={{
                width: 24,
                height: 2,
                backgroundColor: "#C89A3C",
                marginTop: 8,
              }}
            />
          </div>

          {/* Product cards */}
          <div className="flex flex-col">
            {suggestions.map((product, idx) => {
              const hasMultipleVariants = product.sizes.length > 1;
              return (
                <div
                  key={product.slug}
                  style={{
                    padding: "16px 20px",
                    borderBottom:
                      idx < suggestions.length - 1
                        ? "1px solid rgba(200,154,60,0.3)"
                        : "none",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "10px",
                  }}
                >
                  {/* Product image — Bone bg, Clay 1px border */}
                  {product.images[0] && (
                    <div
                      style={{
                        width: 96,
                        height: 96,
                        backgroundColor: "#F5EFE4",
                        border: "1px solid #B8624A",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: 96, height: 96, objectFit: "contain" }}
                      />
                    </div>
                  )}

                  {/* Product name — Fraunces italic, 15px */}
                  <div
                    className="font-display"
                    style={{
                      fontWeight: 300,
                      fontStyle: "italic",
                      fontSize: "15px",
                      color: "#1A1814",
                      textAlign: "center",
                      lineHeight: 1.3,
                    }}
                  >
                    {product.name}
                  </div>

                  {/* Price — Ochre */}
                  <div
                    className="font-mono"
                    style={{ fontSize: "12px", color: "#C89A3C", textAlign: "center" }}
                  >
                    ${product.prices[0]}
                  </div>

                  {/* ADD or SELECT */}
                  {hasMultipleVariants ? (
                    <Link
                      href={`/products/${product.slug}`}
                      onClick={closeCart}
                      style={{
                        display: "block",
                        width: "100%",
                        padding: "9px 0",
                        backgroundColor: "#1A1814",
                        textAlign: "center",
                        textDecoration: "none",
                      }}
                    >
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: "9px", letterSpacing: "2px", color: "#F5EFE4" }}
                      >
                        SELECT
                      </span>
                    </Link>
                  ) : (
                    <button
                      className="lumo-fbt-add"
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
                        width: "100%",
                        padding: "9px 0",
                        backgroundColor: "#B8624A",
                        border: "none",
                        cursor: "pointer",
                        transition: "border-left-color 150ms ease",
                      }}
                    >
                      <span
                        className="font-mono uppercase"
                        style={{ fontSize: "9px", letterSpacing: "2px", color: "#F5EFE4" }}
                      >
                        + ADD
                      </span>
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Cart Drawer — slides in first ── */}
      <div
        className="fixed top-0 right-0 h-full flex flex-col bg-bone border-l hairline-border w-screen md:w-[420px] z-50"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 300ms ease-in-out",
          borderTop: "2px solid #C89A3C",
        }}
      >
        {/* Header — Ink background */}
        <div
          className="flex items-center justify-between p-6"
          style={{ backgroundColor: "#1A1814", borderBottom: "3px solid #B8624A" }}
        >
          <h2
            className="font-display text-2xl"
            style={{ fontWeight: 300, color: "#EBE2CF" }}
          >
            Your Cart
          </h2>
          <button
            onClick={closeCart}
            className="font-mono text-xs uppercase tracking-mono hover:text-clay transition-colors"
            style={{ color: "#F5EFE4", opacity: 0.6 }}
          >
            ✕ CLOSE
          </button>
        </div>

        {/* RUO Disclaimer Bar */}
        <div className="bg-clay p-3 text-center">
          <span className="font-mono text-cream" style={{ fontSize: "9px", letterSpacing: "0.5px" }}>
            ● All items for research use only. Not for human consumption.
          </span>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-clay text-4xl mb-4">●</span>
              <p className="font-editorial text-[#1A1814]/80 mb-2">Your cart is empty</p>
              <p className="font-mono text-xs uppercase tracking-mono text-[#1A1814]/80">
                Add compounds to get started
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {items.map((item) => {
                  const { discount } = getProductDiscount(item.productId);
                  const discountedPrice = item.price * (1 - discount);
                  const lineTotal = discountedPrice * item.quantity;
                  const product = PRODUCTS.find(
                    (p) => p.id.toString() === item.productId
                  );

                  return (
                    <div
                      key={`${item.productId}-${item.variant}`}
                      className="bg-bone p-4"
                      style={{ borderLeft: "3px solid #B8624A" }}
                    >
                      {/* Top row: image + details + remove */}
                      <div className="flex gap-3 mb-3">
                        {/* Vial image — Bone bg, 64×64 */}
                        {product?.images[0] && (
                          <div
                            style={{
                              width: 64,
                              height: 64,
                              flexShrink: 0,
                              backgroundColor: "#F5EFE4",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <img
                              src={product.images[0]}
                              alt=""
                              aria-hidden="true"
                              style={{ width: 64, height: 64, objectFit: "contain" }}
                            />
                          </div>
                        )}

                        {/* Product name / variant / price */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="min-w-0 pr-2">
                              <h3
                                className="font-display text-lg text-ink"
                                style={{ fontWeight: 300, fontStyle: "italic" }}
                              >
                                {item.productName}
                              </h3>
                              {/* Variant — Ochre, opacity-80 */}
                              <p
                                className="font-mono text-xs uppercase tracking-mono opacity-80"
                                style={{ color: "#C89A3C" }}
                              >
                                {item.variant}
                              </p>
                              {discount > 0 ? (
                                <div className="mt-1">
                                  <p className="font-display text-sm text-ink line-through opacity-50">
                                    ${item.price.toFixed(2)}
                                  </p>
                                  <p className="font-display text-base text-ink">
                                    ${discountedPrice.toFixed(2)}{" "}
                                    <span className="text-[10px] font-mono text-[#607A5C]">
                                      ({(discount * 100).toFixed(0)}% off)
                                    </span>
                                  </p>
                                </div>
                              ) : (
                                <p className="font-display text-base text-ink mt-1">
                                  ${item.price.toFixed(2)}
                                </p>
                              )}
                            </div>
                            <button
                              onClick={() => removeItem(item.productId, item.variant)}
                              className="font-mono text-xs text-ink opacity-70 hover:text-clay hover:opacity-100 transition-all flex-shrink-0"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variant, item.quantity - 1)
                            }
                            className="w-8 h-8 hairline-border font-mono text-sm text-ink hover:border-clay transition-colors flex items-center justify-center"
                          >
                            −
                          </button>
                          <span className="font-mono text-sm text-ink font-medium w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.productId, item.variant, item.quantity + 1)
                            }
                            className="w-8 h-8 hairline-border font-mono text-sm text-ink hover:border-clay transition-colors flex items-center justify-center"
                          >
                            +
                          </button>
                        </div>
                        <div className="font-display text-ink" style={{ fontWeight: 300 }}>
                          ${lineTotal.toFixed(2)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Mobile FBT — compact, max 2, no images ── */}
              {suggestions.length > 0 && (
                <div
                  className="md:hidden"
                  style={{ marginTop: "20px", borderTop: "1px solid #EBE2CF" }}
                >
                  <div style={{ padding: "12px 0 8px" }}>
                    <span
                      className="font-mono uppercase"
                      style={{ fontSize: "9px", letterSpacing: "2.5px", color: "#C89A3C" }}
                    >
                      FREQUENTLY BOUGHT TOGETHER
                    </span>
                  </div>
                  <div>
                    {suggestions.map((product) => {
                      const hasMultipleVariants = product.sizes.length > 1;
                      return (
                        <div
                          key={product.slug}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            padding: "8px 0",
                            borderBottom: "1px solid rgba(26,24,20,0.07)",
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              className="font-display"
                              style={{
                                fontWeight: 300,
                                fontStyle: "italic",
                                fontSize: "0.875rem",
                                color: "#1A1814",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                              }}
                            >
                              {product.name}
                            </div>
                            <div
                              className="font-mono"
                              style={{ fontSize: "10px", color: "#C89A3C", marginTop: "2px" }}
                            >
                              ${product.prices[0]}
                            </div>
                          </div>
                          {hasMultipleVariants ? (
                            <Link
                              href={`/products/${product.slug}`}
                              onClick={closeCart}
                              style={{
                                backgroundColor: "#1A1814",
                                padding: "7px 12px",
                                textDecoration: "none",
                                flexShrink: 0,
                              }}
                            >
                              <span
                                className="font-mono uppercase"
                                style={{ fontSize: "9px", letterSpacing: "1.5px", color: "#F5EFE4" }}
                              >
                                SELECT
                              </span>
                            </Link>
                          ) : (
                            <button
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
                                padding: "7px 12px",
                                flexShrink: 0,
                              }}
                            >
                              <span
                                className="font-mono uppercase"
                                style={{ fontSize: "9px", letterSpacing: "1.5px", color: "#F5EFE4" }}
                              >
                                + ADD
                              </span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t hairline-border p-6 space-y-4 bg-cream">
            {/* Shipping pills */}
            <div
              style={{
                borderTop: "1px solid #EBE2CF",
                paddingTop: "10px",
                paddingBottom: "4px",
                display: "flex",
                justifyContent: "center",
                gap: "8px",
              }}
            >
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "9px",
                  letterSpacing: "1px",
                  color: "#F5EFE4",
                  backgroundColor: "#607A5C",
                  padding: "4px 10px",
                }}
              >
                🚚 FREE SHIPPING $150+
              </span>
              <span
                className="font-mono uppercase"
                style={{
                  fontSize: "9px",
                  letterSpacing: "1px",
                  color: "#F5EFE4",
                  backgroundColor: "#607A5C",
                  padding: "4px 10px",
                }}
              >
                ⚡ 2-DAY DELIVERY
              </span>
            </div>

            {/* Free shipping threshold */}
            <div className="text-center" style={{ paddingTop: "2px", paddingBottom: "2px" }}>
              {getTotal() < 150 ? (
                <span
                  className="font-mono"
                  style={{ fontSize: "11px", fontWeight: 700, color: "#607A5C" }}
                >
                  → Add ${(150 - getTotal()).toFixed(2)} more for free shipping
                </span>
              ) : (
                <span
                  className="font-mono"
                  style={{ fontSize: "11px", fontWeight: 700, color: "#B8624A" }}
                >
                  ✓ Free shipping unlocked
                </span>
              )}
            </div>

            {/* Subtotal — Clay amount */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-xs uppercase tracking-mono text-ink">Subtotal</span>
              <span
                className="font-display text-4xl"
                style={{ fontWeight: 300, color: "#B8624A" }}
              >
                ${getTotal().toFixed(2)}
              </span>
            </div>

            {/* Checkout button — Clay left border 4px */}
            <Link
              href="/checkout"
              onClick={closeCart}
              className="block w-full bg-ink text-bone font-mono text-xs uppercase tracking-mono py-4 text-center hover:bg-clay transition-colors"
              style={{ borderLeft: "4px solid #B8624A" }}
            >
              → PROCEED TO CHECKOUT
            </Link>

            <button
              onClick={closeCart}
              className="block w-full font-mono text-xs uppercase tracking-mono text-ink opacity-60 hover:opacity-100 text-center transition-opacity"
            >
              CONTINUE SHOPPING
            </button>
          </div>
        )}
      </div>
    </>
  );
}
