"use client";

import Link from "next/link";

interface Props {
  onClose: () => void;
  itemCount: number;
}

export default function CartIdlePopup({ onClose, itemCount }: Props) {
  const handleClose = () => {
    sessionStorage.setItem("lumo_cart_idle_shown", "true");
    onClose();
  };

  const handleCheckout = () => {
    sessionStorage.setItem("lumo_cart_idle_shown", "true");
    onClose();
  };

  const label = itemCount === 1 ? "compound" : "compounds";

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 50,
        animation: "slideIn 0.2s ease",
      }}
    >
      <style>{`@keyframes slideIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }`}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "420px",
          backgroundColor: "#1A1814",
          borderLeft: "4px solid #C89A3C",
          padding: "24px 28px",
          position: "relative",
          boxShadow: "0 8px 32px rgba(26,24,20,0.4)",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            color: "#B8624A",
            fontSize: "18px",
            cursor: "pointer",
            lineHeight: 1,
            padding: "2px 6px",
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Label */}
        <div
          className="font-mono uppercase"
          style={{ fontSize: "9px", letterSpacing: "3px", color: "#C89A3C", marginBottom: "10px" }}
        >
          STILL RESEARCHING?
        </div>

        {/* Heading */}
        <h3
          className="font-display"
          style={{
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "1.4rem",
            color: "#F5EFE4",
            lineHeight: 1.2,
            marginBottom: "16px",
          }}
        >
          Your cart has {itemCount} {label} waiting.
        </h3>

        {/* CTA */}
        <Link href="/checkout" onClick={handleCheckout}>
          <div
            style={{
              width: "100%",
              padding: "12px 20px",
              backgroundColor: "#B8624A",
              textAlign: "center",
              cursor: "pointer",
            }}
          >
            <span
              className="font-mono uppercase"
              style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#F5EFE4" }}
            >
              → GO TO CHECKOUT
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
