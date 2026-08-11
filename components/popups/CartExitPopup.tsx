"use client";

import Link from "next/link";
import { CartItem } from "@/lib/store";

interface Props {
  onClose: () => void;
  items: CartItem[];
}

export default function CartExitPopup({ onClose, items }: Props) {
  const handleClose = () => {
    sessionStorage.setItem("lumo_cart_exit_shown", "true");
    onClose();
  };

  const handleComplete = () => {
    sessionStorage.setItem("lumo_cart_exit_shown", "true");
    onClose();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(26,24,20,0.85)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        animation: "fadeIn 0.2s ease",
      }}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          backgroundColor: "#1A1814",
          borderTop: "3px solid #B8624A",
          padding: "40px 36px",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "16px",
            right: "16px",
            background: "none",
            border: "none",
            color: "#B8624A",
            fontSize: "20px",
            cursor: "pointer",
            lineHeight: 1,
            padding: "4px 8px",
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Label */}
        <div
          className="font-mono uppercase"
          style={{ fontSize: "9px", letterSpacing: "3px", color: "#C89A3C", marginBottom: "14px" }}
        >
          YOUR CART
        </div>

        {/* Heading */}
        <h2
          className="font-display"
          style={{
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            color: "#F5EFE4",
            lineHeight: 1.15,
            marginBottom: "20px",
          }}
        >
          Your lot is reserved.
        </h2>

        {/* Cart Items */}
        <div style={{ marginBottom: "20px", borderTop: "1px solid rgba(235,226,207,0.1)", paddingTop: "16px" }}>
          {items.map((item, i) => (
            <div
              key={i}
              className="font-mono"
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "11px",
                color: "#EBE2CF",
                letterSpacing: "0.05em",
                padding: "6px 0",
                borderBottom: "1px solid rgba(235,226,207,0.06)",
              }}
            >
              <span>{item.productName} · {item.variant}</span>
              <span style={{ opacity: 0.6 }}>×{item.quantity}</span>
            </div>
          ))}
        </div>

        {/* Body */}
        <p
          className="font-editorial"
          style={{
            fontSize: "14px",
            color: "#EBE2CF",
            opacity: 0.7,
            lineHeight: 1.65,
            marginBottom: "24px",
          }}
        >
          Complete your order to lock in this batch. Lot availability is limited.
        </p>

        {/* CTA */}
        <Link href="/checkout" onClick={handleComplete}>
          <div
            style={{
              width: "100%",
              padding: "14px 20px",
              backgroundColor: "#B8624A",
              textAlign: "center",
              cursor: "pointer",
              marginBottom: "12px",
            }}
          >
            <span
              className="font-mono uppercase"
              style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#F5EFE4" }}
            >
              → COMPLETE ORDER
            </span>
          </div>
        </Link>

        {/* Ghost button */}
        <button
          onClick={handleClose}
          style={{
            width: "100%",
            padding: "10px 20px",
            background: "none",
            border: "1px solid rgba(235,226,207,0.2)",
            cursor: "pointer",
          }}
        >
          <span
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(235,226,207,0.55)" }}
          >
            Continue browsing
          </span>
        </button>
      </div>
    </div>
  );
}
