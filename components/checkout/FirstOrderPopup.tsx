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
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ backgroundColor: "rgba(26,24,20,0.7)" }}
    >
      <div
        className="w-full max-w-md"
        style={{ backgroundColor: "#F5EFE4", border: "1px solid rgba(26,24,20,0.15)" }}
      >
        {/* Header */}
        <div
          className="px-8 py-6 text-center"
          style={{ backgroundColor: "#1A1814", borderBottom: "3px solid #B8624A" }}
        >
          <p className="font-mono text-xs uppercase mb-2" style={{ letterSpacing: "0.15em", color: "#F5EFE4", opacity: 0.6 }}>
            First order offer
          </p>
          <h2 className="font-display" style={{ fontSize: "1.75rem", fontWeight: 300, fontStyle: "italic", color: "#F5EFE4" }}>
            Unlock 20% off
          </h2>
        </div>

        {/* Body */}
        <div className="px-8 py-8">
          <p className="font-editorial text-sm mb-6 text-center" style={{ color: "#1A1814", opacity: 0.75, lineHeight: 1.6 }}>
            Enter your email to unlock 20% off your first order. We'll also keep you updated on new compounds and research.
          </p>

          <input
            type="email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(""); }}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            placeholder="your@email.com"
            className="w-full font-mono text-sm px-4 py-3 mb-2 focus:outline-none"
            style={{
              backgroundColor: "#EBE2CF",
              border: "1px solid rgba(26,24,20,0.2)",
              color: "#1A1814",
            }}
          />

          {error && (
            <p className="font-mono text-xs mb-3" style={{ color: "#B8624A" }}>{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full font-mono text-xs uppercase py-3 mb-3 transition-colors"
            style={{
              letterSpacing: "0.12em",
              backgroundColor: loading ? "#607A5C" : "#1A1814",
              color: "#F5EFE4",
              borderLeft: "4px solid #B8624A",
            }}
          >
            {loading ? "Unlocking..." : "→ Unlock 20% off"}
          </button>

          <button
            onClick={onDismiss}
            className="w-full font-mono text-xs uppercase py-2 transition-opacity"
            style={{ letterSpacing: "0.12em", color: "#1A1814", opacity: 0.45 }}
          >
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
