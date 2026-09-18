"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { OrderCard, type Order } from "@/components/OrderCard";

const inputStyle: React.CSSProperties = {
  width: "100%",
  backgroundColor: "#EBE2CF",
  border: "1px solid #1A1814",
  padding: "11px 14px",
  fontSize: "14px",
  color: "#1A1814",
  fontFamily: "inherit",
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-mono, monospace)",
  fontSize: "10px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "#1A1814",
  marginBottom: "6px",
  opacity: 0.7,
};

export default function OrderLookupPage() {
  const [email, setEmail]     = useState("");
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder]     = useState<Order | null | undefined>(undefined); // undefined = not yet searched
  const [error, setError]     = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrder(undefined);

    try {
      const res = await fetch("/api/orders/lookup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), order_id: orderId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError("Something went wrong. Please try again.");
      } else if (!data.order) {
        setOrder(null); // found nothing
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setOrder(undefined);
    setError(null);
    setEmail("");
    setOrderId("");
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5EFE4" }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1A1814", padding: "48px 24px" }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "3px", color: "#B8624A", marginBottom: "12px" }}
          >
            08.1 — ORDER LOOKUP
          </motion.div>

          <motion.h1
            className="font-display"
            style={{
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(2rem, 4vw, 3rem)",
              color: "#F5EFE4",
              letterSpacing: "-0.02em",
            }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Track your order.
          </motion.h1>
        </div>
      </section>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <div style={{ padding: "64px 24px" }}>
        <div className="mx-auto" style={{ maxWidth: "512px" }}>

          {/* ── FORM (shown when no result yet) ── */}
          {order === undefined && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <p
                className="font-editorial"
                style={{ fontSize: "15px", color: "#1A1814", lineHeight: 1.6, marginBottom: "32px", opacity: 0.75 }}
              >
                Enter the email address you used at checkout and your order ID to view your order status.
              </p>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Email */}
                <div>
                  <label style={labelStyle}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="font-functional"
                    style={inputStyle}
                  />
                </div>

                {/* Order ID */}
                <div>
                  <label style={labelStyle}>Order ID</label>
                  <input
                    type="text"
                    required
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                    placeholder="LUMO-XXXXXXXXXX-XXXXXX"
                    className="font-functional"
                    style={{ ...inputStyle, textTransform: "uppercase" }}
                  />
                  <p
                    className="font-mono"
                    style={{ fontSize: "9px", color: "#1A1814", opacity: 0.4, marginTop: "6px", letterSpacing: "0.5px" }}
                  >
                    Find your order ID in your confirmation email.
                  </p>
                </div>

                {/* Error message */}
                {error && (
                  <p className="font-mono" style={{ fontSize: "11px", color: "#B8624A", letterSpacing: "0.5px" }}>
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="font-mono uppercase"
                  style={{
                    width: "100%",
                    padding: "13px",
                    backgroundColor: loading ? "rgba(184,98,74,0.5)" : "#B8624A",
                    color: "#F5EFE4",
                    fontSize: "11px",
                    letterSpacing: "2px",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  {loading ? "LOOKING UP…" : "→ LOOK UP ORDER"}
                </button>
              </form>

              {/* Auth link */}
              <div style={{ marginTop: "32px", paddingTop: "24px", borderTop: "1px solid rgba(26,24,20,0.1)" }}>
                <p className="font-mono" style={{ fontSize: "10px", color: "#1A1814", opacity: 0.5 }}>
                  Have an account?{" "}
                  <Link href="/account" style={{ color: "#B8624A" }}>
                    View full order history →
                  </Link>
                </p>
              </div>
            </motion.div>
          )}

          {/* ── NOT FOUND ── */}
          {order === null && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                style={{
                  backgroundColor: "#EBE2CF",
                  borderLeft: "3px solid #B8624A",
                  padding: "32px",
                  marginBottom: "24px",
                }}
              >
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: "9px", letterSpacing: "2px", color: "#B8624A", marginBottom: "10px" }}
                >
                  ORDER NOT FOUND
                </div>
                <p
                  className="font-editorial"
                  style={{ fontSize: "14px", color: "#1A1814", lineHeight: 1.6 }}
                >
                  No order found with that email and order ID. Please check your confirmation email and try again.
                </p>
              </div>

              <button
                onClick={handleReset}
                className="font-mono uppercase"
                style={{
                  fontSize: "10px",
                  letterSpacing: "1.5px",
                  color: "#B8624A",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                ← Look up another order
              </button>
            </motion.div>
          )}

          {/* ── ORDER FOUND ── */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div
                className="font-mono uppercase"
                style={{ fontSize: "9px", letterSpacing: "2px", color: "#607A5C", marginBottom: "16px" }}
              >
                ● ORDER FOUND
              </div>

              <OrderCard order={order} />

              <div style={{ marginTop: "8px" }}>
                <button
                  onClick={handleReset}
                  className="font-mono uppercase"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "1.5px",
                    color: "#B8624A",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                  }}
                >
                  ← Look up another order
                </button>
              </div>
            </motion.div>
          )}

        </div>
      </div>

      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-012</div>
    </div>
  );
}
