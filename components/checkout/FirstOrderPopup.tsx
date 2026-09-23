"use client";

import { useState } from "react";

interface FirstOrderPopupProps {
  onDismiss: () => void;
  onUnlock: (email: string) => void;
}

export default function FirstOrderPopup({ onDismiss, onUnlock }: FirstOrderPopupProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      await fetch("/api/capture-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      onUnlock(email);
    } catch {
      onUnlock(email);
    } finally {
      setLoading(false);
    }
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
      onClick={(e) => { if (e.target === e.currentTarget) onDismiss(); }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#1A1814",
          borderRadius: "16px",
          borderTop: "3px solid #C89A3C",
          padding: "40px 36px",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={onDismiss}
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
          FIRST ORDER OFFER
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
            marginBottom: "14px",
          }}
        >
          Unlock 20% off your first order.
        </h2>

        {/* Body */}
        <p
          className="font-editorial"
          style={{
            fontSize: "14px",
            color: "#EBE2CF",
            opacity: 0.7,
            lineHeight: 1.65,
            marginBottom: "28px",
          }}
        >
          Enter your email to unlock 20% off. We'll also keep you updated on new compounds and research.
        </p>

        {/* Input */}
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); setError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          placeholder="your@email.com"
          style={{
            width: "100%",
            padding: "12px 14px",
            backgroundColor: "#F5EFE4",
            border: "1px solid rgba(235,226,207,0.3)",
            fontSize: "14px",
            color: "#1A1814",
            outline: "none",
            boxSizing: "border-box",
            borderRadius: "8px",
            marginBottom: "12px",
            fontFamily: "Inter Tight, sans-serif",
          }}
        />

        {error && (
          <p className="font-mono" style={{ fontSize: "11px", color: "#B8624A", marginBottom: "10px" }}>
            {error}
          </p>
        )}

        {/* CTA */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px 20px",
            backgroundColor: loading ? "rgba(184,98,74,0.6)" : "#B8624A",
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            borderRadius: "8px",
            marginBottom: "16px",
          }}
        >
          <span
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#F5EFE4" }}
          >
            {loading ? "Unlocking…" : "→ Unlock 20% off"}
          </span>
        </button>

        {/* Dismiss */}
        <button
          onClick={onDismiss}
          style={{
            display: "block",
            width: "100%",
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <span
            className="font-mono uppercase"
            style={{ fontSize: "9px", letterSpacing: "2px", color: "#EBE2CF", opacity: 0.4 }}
          >
            No thanks
          </span>
        </button>
      </div>
    </div>
  );
}
