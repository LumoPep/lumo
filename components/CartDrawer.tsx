"use client";

import { useCartStore } from "@/lib/store";
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
  } = useCartStore();

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
          className="fixed inset-0 bg-ink/40 z-50"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-bone border-l hairline-border z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
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
              <div className="space-y-4">
                {items.map((item) => (
                  <div
                    key={`${item.productId}-${item.variant}`}
                    className="bg-cream hairline-border p-4"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-display text-lg text-ink" style={{ fontWeight: 300, fontStyle: "italic" }}>
                          {item.productName}
                        </h3>
                        <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                          {item.variant}
                        </p>
                        <p className="font-display text-sm text-ink mt-1">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() =>
                          removeItem(item.productId, item.variant)
                        }
                        className="font-mono text-xs text-ink opacity-55 hover:text-clay hover:opacity-100 transition-all"
                      >
                        ✕
                      </button>
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
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {items.length > 0 && (
            <div className="border-t hairline-border p-6 space-y-4 bg-cream">
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
