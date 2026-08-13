"use client";

import { useCartStore } from "@/lib/store";
import { PRODUCTS } from "@/data/products";
import { getSuggestions } from "@/lib/frequentlyBoughtTogether";
import Link from "next/link";
import { useEffect } from "react";

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

  // Cap at 2 for both panels
  const suggestions = getSuggestions(items).slice(0, 2);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-ink/40 z-40"
          onClick={closeCart}
        />
      )}

      {/* Sliding container — FBT panel + cart drawer side by side */}
      <div
        className={`fixed top-0 right-0 h-full flex z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* ── FBT Side Panel (desktop only, hidden on mobile) ── */}
        {suggestions.length > 0 && (
          <div
            className="hidden md:flex flex-col h-full flex-shrink-0 overflow-y-auto"
            style={{
              width: "220px",
              backgroundColor: "#EBE2CF",
              borderRight: "1px solid #1A1814",
            }}
          >
            {/* FBT Header */}
            <div
              style={{
                padding: "16px 16px 12px",
                borderBottom: "1px solid rgba(26,24,20,0.12)",
                flexShrink: 0,
              }}
            >
              <span
                className="font-mono uppercase"
                style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#C89A3C" }}
              >
                FREQUENTLY BOUGHT TOGETHER
              </span>
            </div>

            {/* Suggestion cards */}
            <div className="flex flex-col">
              {suggestions.map((product, idx) => {
                const hasMultipleVariants = product.sizes.length > 1;
                return (
                  <div
                    key={product.slug}
                    style={{
                      padding: "16px",
                      borderBottom:
                        idx < suggestions.length - 1
                          ? "1px solid rgba(26,24,20,0.1)"
                          : "none",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    {/* Product image — Bone bg, 96×96 */}
                    {product.images[0] && (
                      <div
                        style={{
                          width: 96,
                          height: 96,
                          backgroundColor: "#F5EFE4",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          style={{
                            width: 96,
                            height: 96,
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}

                    {/* Product name — Fraunces italic */}
                    <div
                      className="font-display"
                      style={{
                        fontWeight: 300,
                        fontStyle: "italic",
                        fontSize: "14px",
                        color: "#1A1814",
                        textAlign: "center",
                        lineHeight: 1.3,
                      }}
                    >
                      {product.name}
                    </div>

                    {/* Price */}
                    <div
                      className="font-mono"
                      style={{
                        fontSize: "12px",
                        color: "#1A1814",
                        opacity: 0.65,
                        textAlign: "center",
                      }}
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
                          backgroundColor: "#B8624A",
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
                        }}
                      >
                        <span
                          className="font-mono uppercase"
                          style={{ fontSize: "9px", letterSpacing: "2px", color: "#F5EFE4" }}
                        >
                          ADD
                        </span>
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Cart Drawer ── */}
        <div
          className="flex flex-col h-full bg-bone border-l hairline-border w-screen md:w-[448px] flex-shrink-0"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b hairline-border">
            <h2 className="font-display text-2xl text-ink" style={{ fontWeight: 300 }}>
              Your Cart
            </h2>
            <button
              onClick={closeCart}
              className="font-mono text-xs uppercase tracking-mono text-ink hover:text-clay transition-colors"
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
                <p className="font-editorial text-ink opacity-60 mb-2">Your cart is empty</p>
                <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-55">
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
                        className="bg-cream hairline-border p-4"
                      >
                        {/* Top row: image + details + remove */}
                        <div className="flex gap-3 mb-3">
                          {/* Vial image — Bone bg, 64×64, no border-radius */}
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
                                style={{
                                  width: 64,
                                  height: 64,
                                  objectFit: "contain",
                                }}
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
                                <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                                  {item.variant}
                                </p>
                                {discount > 0 ? (
                                  <div className="mt-1">
                                    <p className="font-display text-sm text-ink line-through opacity-50">
                                      ${item.price.toFixed(2)}
                                    </p>
                                    <p className="font-display text-sm text-ink">
                                      ${discountedPrice.toFixed(2)}{" "}
                                      <span className="text-[10px] font-mono text-[#607A5C]">
                                        ({(discount * 100).toFixed(0)}% off)
                                      </span>
                                    </p>
                                  </div>
                                ) : (
                                  <p className="font-display text-sm text-ink mt-1">
                                    ${item.price.toFixed(2)}
                                  </p>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  removeItem(item.productId, item.variant)
                                }
                                className="font-mono text-xs text-ink opacity-55 hover:text-clay hover:opacity-100 transition-all flex-shrink-0"
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
                                updateQuantity(
                                  item.productId,
                                  item.variant,
                                  item.quantity - 1
                                )
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
                                updateQuantity(
                                  item.productId,
                                  item.variant,
                                  item.quantity + 1
                                )
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
                                style={{
                                  fontSize: "10px",
                                  color: "#1A1814",
                                  opacity: 0.55,
                                  marginTop: "2px",
                                }}
                              >
                                ${product.prices[0]}
                              </div>
                            </div>
                            {hasMultipleVariants ? (
                              <Link
                                href={`/products/${product.slug}`}
                                onClick={closeCart}
                                style={{
                                  backgroundColor: "#B8624A",
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
                                  ADD
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
              {/* Shipping Info Strip */}
              <div className="flex justify-between text-[10px] text-[#1A1814]/60 py-2 border-t border-[#EBE2CF]">
                <div className="flex items-center gap-1">
                  <i className="ti ti-truck" style={{ fontSize: "12px" }}></i>
                  <span>Free shipping on orders over $150</span>
                </div>
                <div className="flex items-center gap-1">
                  <i className="ti ti-clock" style={{ fontSize: "12px" }}></i>
                  <span>2-day delivery</span>
                </div>
              </div>

              {/* Free Shipping Threshold */}
              <div className="text-[10px] text-center py-1">
                {getTotal() < 150 ? (
                  <span className="text-[#607A5C]">
                    Add ${(150 - getTotal()).toFixed(2)} more for free shipping
                  </span>
                ) : (
                  <span className="text-[#607A5C]">✓ Free shipping applied</span>
                )}
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-mono text-ink">Subtotal</span>
                <span className="font-display text-3xl text-ink" style={{ fontWeight: 300 }}>
                  ${getTotal().toFixed(2)}
                </span>
              </div>
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full bg-ink text-bone font-mono text-xs uppercase tracking-mono py-4 text-center hover:bg-clay transition-colors"
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
      </div>
    </>
  );
}
