"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("ORDERS");

  const tabs = ["ORDERS", "COAS", "PROFILE"];

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5EFE4" }}>

      {/* ── HEADER ─────────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5EFE4", padding: "48px 24px" }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "3px", color: "#B8624A", marginBottom: "12px" }}
          >
            07.1 — ACCOUNT DASHBOARD
          </motion.div>

          <motion.h1
            className="font-display"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1A1814", letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Your research orders.
          </motion.h1>
        </div>
      </section>

      {/* ── MAIN ───────────────────────────────────────────────── */}
      <div style={{ padding: "48px 24px" }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

            {/* ── SIDEBAR ──────────────────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
              className="lg:col-span-3"
            >
              <div className="sticky top-24 bg-cream p-6" style={{ borderRadius: "12px" }}>
                <div className="font-mono text-xs uppercase tracking-mono text-ink mb-4">
                  NAVIGATE
                </div>

                <nav className="space-y-2">
                  {tabs.map((tab) => {
                    const isActive = activeTab === tab;
                    return (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`w-full text-left font-mono text-xs transition-colors ${
                          isActive ? "text-clay" : "text-ink opacity-60 hover:opacity-100"
                        }`}
                      >
                        {tab}
                      </button>
                    );
                  })}
                </nav>

                {/* Info note */}
                <div
                  style={{
                    borderTop: "1px solid rgba(26,24,20,0.1)",
                    marginTop: "24px",
                    paddingTop: "20px",
                  }}
                >
                  <p
                    className="font-editorial"
                    style={{ fontSize: "12px", color: "#1A1814", lineHeight: 1.5 }}
                  >
                    Questions about your order?
                  </p>
                  <a
                    href="mailto:support@lumopep.com"
                    className="font-mono uppercase"
                    style={{ fontSize: "9px", letterSpacing: "1.5px", color: "#B8624A" }}
                  >
                    → support@lumopep.com
                  </a>
                </div>
              </div>
            </motion.div>

            {/* ── CONTENT AREA ─────────────────────────────────── */}
            <div className="lg:col-span-9">

              {/* ORDERS TAB */}
              {activeTab === "ORDERS" && (
                <motion.div
                  key="orders"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: "24px" }}>
                    <h2
                      className="font-display"
                      style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1.8rem", color: "#1A1814", letterSpacing: "-0.02em", marginBottom: "6px" }}
                    >
                      Order history
                    </h2>
                    <p
                      className="font-editorial"
                      style={{ fontSize: "14px", color: "#1A1814" }}
                    >
                      Orders placed through your account will appear here.
                    </p>
                  </div>

                  {/* Empty state */}
                  <div
                    style={{
                      backgroundColor: "#EBE2CF",
                      borderLeft: "2px solid #B8624A",
                      padding: "56px 40px",
                      textAlign: "center",
                    }}
                  >
                    {/* Aperture mark */}
                    <svg
                      width="40"
                      height="40"
                      viewBox="0 0 40 40"
                      style={{ margin: "0 auto 20px" }}
                    >
                      <circle cx="20" cy="20" r="18" stroke="#B8624A" strokeWidth="1" fill="none" />
                      <line x1="20" y1="2" x2="20" y2="38" stroke="#B8624A" strokeWidth="1" />
                      <line x1="2" y1="20" x2="38" y2="20" stroke="#B8624A" strokeWidth="1" />
                      <circle cx="20" cy="20" r="5" fill="#B8624A" />
                    </svg>

                    <div
                      className="font-mono uppercase"
                      style={{ fontSize: "9px", letterSpacing: "3px", color: "#B8624A", marginBottom: "12px" }}
                    >
                      NO ORDERS ON FILE
                    </div>

                    <p
                      className="font-editorial"
                      style={{
                        fontSize: "14px",
                        color: "#1A1814",
                        maxWidth: "360px",
                        margin: "0 auto 28px",
                        lineHeight: 1.6,
                      }}
                    >
                      Orders are confirmed by email after blockchain payment verification. Check your inbox for confirmation details.
                    </p>

                    <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                      <Link
                        href="/products"
                        className="font-mono uppercase"
                        style={{
                          padding: "11px 24px",
                          backgroundColor: "#B8624A",
                          color: "#F5EFE4",
                          fontSize: "10px",
                          letterSpacing: "2px",
                          display: "inline-block",
                        }}
                      >
                        → Browse compounds
                      </Link>
                      <a
                        href="mailto:support@lumopep.com"
                        className="font-mono uppercase"
                        style={{
                          padding: "11px 24px",
                          backgroundColor: "transparent",
                          color: "#1A1814",
                          fontSize: "10px",
                          letterSpacing: "2px",
                          border: "1px solid #B8624A",
                          display: "inline-block",
                        }}
                      >
                        Order support
                      </a>
                    </div>
                  </div>

                  {/* Reassurance strip */}
                  <div
                    style={{
                      marginTop: "12px",
                      backgroundColor: "#EBE2CF",
                      border: "1px solid rgba(26,24,20,0.08)",
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "#B8624A", fontSize: "7px" }}>●</span>
                    <p
                      className="font-mono"
                      style={{ fontSize: "10px", letterSpacing: "0.5px", color: "#1A1814" }}
                    >
                      Order confirmations and CoA downloads are delivered by email after each shipment.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* COAS TAB */}
              {activeTab === "COAS" && (
                <motion.div
                  key="coas"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: "24px" }}>
                    <h2
                      className="font-display"
                      style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1.8rem", color: "#1A1814", letterSpacing: "-0.02em", marginBottom: "6px" }}
                    >
                      Certificates of analysis
                    </h2>
                    <p
                      className="font-editorial"
                      style={{ fontSize: "14px", color: "#1A1814" }}
                    >
                      Third-party CoAs for every compound we carry. Lot-traceable to the synthesis run.
                    </p>
                  </div>

                  {/* CoA library link panel */}
                  <div
                    style={{
                      backgroundColor: "#EBE2CF",
                      border: "1px solid rgba(26,24,20,0.12)",
                      borderLeft: "4px solid #C89A3C",
                      padding: "32px",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      className="font-mono uppercase"
                      style={{ fontSize: "9px", letterSpacing: "3px", color: "#C89A3C", marginBottom: "10px" }}
                    >
                      ● VERIFIED · THIRD-PARTY TESTED
                    </div>
                    <h3
                      className="font-display"
                      style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1.4rem", color: "#1A1814", letterSpacing: "-0.02em", marginBottom: "12px" }}
                    >
                      Public CoA library
                    </h3>
                    <p
                      className="font-editorial"
                      style={{ fontSize: "13px", color: "#1A1814", maxWidth: "480px", lineHeight: 1.6, marginBottom: "24px" }}
                    >
                      Every active lot has a published Certificate of Analysis showing HPLC purity, mass spec confirmation, and lot traceability. No account required.
                    </p>
                    <Link
                      href="/coa"
                      className="font-mono uppercase"
                      style={{
                        padding: "12px 28px",
                        backgroundColor: "#B8624A",
                        color: "#F5EFE4",
                        fontSize: "10px",
                        letterSpacing: "2px",
                        display: "inline-block",
                      }}
                    >
                      → View CoA library
                    </Link>
                  </div>

                  {/* Note about order-specific CoAs */}
                  <div
                    style={{
                      backgroundColor: "#EBE2CF",
                      border: "1px solid rgba(26,24,20,0.08)",
                      padding: "14px 20px",
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "10px",
                    }}
                  >
                    <span style={{ color: "#B8624A", fontSize: "7px", marginTop: "3px", flexShrink: 0 }}>●</span>
                    <p
                      className="font-mono"
                      style={{ fontSize: "10px", letterSpacing: "0.5px", color: "#1A1814", lineHeight: 1.5 }}
                    >
                      Order-specific CoA links are included in your email confirmation. Each lot PDF is also accessible directly from the CoA library above.
                    </p>
                  </div>
                </motion.div>
              )}

              {/* PROFILE TAB */}
              {activeTab === "PROFILE" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div style={{ marginBottom: "24px" }}>
                    <h2
                      className="font-display"
                      style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1.8rem", color: "#1A1814", letterSpacing: "-0.02em", marginBottom: "6px" }}
                    >
                      Account settings
                    </h2>
                    <p
                      className="font-editorial"
                      style={{ fontSize: "14px", color: "#1A1814" }}
                    >
                      Researcher profile and preferences.
                    </p>
                  </div>

                  {/* Coming soon */}
                  <div
                    style={{
                      backgroundColor: "#EBE2CF",
                      border: "1px solid rgba(26,24,20,0.12)",
                      padding: "56px 40px",
                      textAlign: "center",
                    }}
                  >
                    {/* Solar mark */}
                    <svg
                      width="36"
                      height="36"
                      viewBox="0 0 36 36"
                      style={{ margin: "0 auto 20px" }}
                    >
                      <circle cx="18" cy="18" r="16" stroke="#B8624A" strokeWidth="1" fill="none" />
                      <circle cx="18" cy="18" r="7" stroke="#B8624A" strokeWidth="1" fill="none" />
                      <circle cx="18" cy="18" r="2.5" fill="#B8624A" />
                    </svg>

                    <div
                      className="font-mono uppercase"
                      style={{ fontSize: "9px", letterSpacing: "3px", color: "#B8624A", marginBottom: "12px" }}
                    >
                      COMING SOON
                    </div>

                    <p
                      className="font-editorial"
                      style={{
                        fontSize: "14px",
                        color: "#1A1814",
                        maxWidth: "340px",
                        margin: "0 auto 28px",
                        lineHeight: 1.6,
                      }}
                    >
                      Account management is in development. To update your details or institution information, contact us directly.
                    </p>

                    <a
                      href="mailto:support@lumopep.com"
                      className="font-mono uppercase"
                      style={{
                        padding: "11px 24px",
                        backgroundColor: "#B8624A",
                        color: "#F5EFE4",
                        fontSize: "10px",
                        letterSpacing: "2px",
                        display: "inline-block",
                      }}
                    >
                      → Contact support
                    </a>
                  </div>
                </motion.div>
              )}

            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-011</div>
    </div>
  );
}
