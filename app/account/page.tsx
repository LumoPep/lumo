"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";
import { OrderCard, type Order } from "@/components/OrderCard";

export default function AccountPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("ORDERS");
  const [sessionChecked, setSessionChecked] = useState(false);
  const [orders, setOrders] = useState<Order[] | null>(null);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // ── Profile: password ──────────────────────────────────────
  const [pwNew, setPwNew]         = useState("");
  const [pwConfirm, setPwConfirm] = useState("");
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState(false);
  const [pwError, setPwError]     = useState<string | null>(null);

  // ── Profile: email ─────────────────────────────────────────
  const [newEmail, setNewEmail]       = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);
  const [emailError, setEmailError]   = useState<string | null>(null);

  // ── Profile: display name ──────────────────────────────────
  const [firstName, setFirstName]     = useState("");
  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState(false);
  const [nameError, setNameError]     = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login");
      } else {
        setSessionChecked(true);
        // Seed display name from user metadata
        supabase.auth.getUser().then(({ data: { user } }) => {
          if (user?.user_metadata?.first_name) {
            setFirstName(user.user_metadata.first_name as string);
          }
        });
        // Fetch orders
        setOrdersLoading(true);
        fetch("/api/orders/my-orders")
          .then((r) => r.json())
          .then((data) => setOrders(data.orders ?? []))
          .catch(() => setOrders([]))
          .finally(() => setOrdersLoading(false));
      }
    });
  }, [router]);

  async function handlePasswordUpdate(e: React.FormEvent) {
    e.preventDefault();
    setPwError(null);
    setPwSuccess(false);
    if (pwNew.length < 8) { setPwError("Password must be at least 8 characters."); return; }
    if (pwNew !== pwConfirm) { setPwError("Passwords do not match."); return; }
    setPwLoading(true);
    const { error } = await createClient().auth.updateUser({ password: pwNew });
    setPwLoading(false);
    if (error) { setPwError(error.message); }
    else { setPwSuccess(true); setPwNew(""); setPwConfirm(""); }
  }

  async function handleEmailUpdate(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setEmailSuccess(false);
    setEmailLoading(true);
    const { error } = await createClient().auth.updateUser({ email: newEmail.trim() });
    setEmailLoading(false);
    if (error) { setEmailError(error.message); }
    else { setEmailSuccess(true); setNewEmail(""); }
  }

  async function handleNameUpdate(e: React.FormEvent) {
    e.preventDefault();
    setNameError(null);
    setNameSuccess(false);
    setNameLoading(true);
    const { error } = await createClient().auth.updateUser({ data: { first_name: firstName.trim() } });
    setNameLoading(false);
    if (error) { setNameError(error.message); }
    else { setNameSuccess(true); }
  }

  if (!sessionChecked) {
    return <div style={{ minHeight: "100vh", backgroundColor: "#F5EFE4" }} />;
  }

  const tabs = ["ORDERS", "COAS", "PROFILE"];

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
            07.1 — ACCOUNT DASHBOARD
          </motion.div>

          <motion.h1
            className="font-display"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#F5EFE4", letterSpacing: "-0.02em" }}
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

                  {/* Loading */}
                  {ordersLoading && (
                    <div style={{ padding: "48px", textAlign: "center" }}>
                      <span
                        className="font-mono"
                        style={{ fontSize: "10px", letterSpacing: "2px", color: "#1A1814", opacity: 0.35 }}
                      >
                        LOADING ORDERS…
                      </span>
                    </div>
                  )}

                  {/* Order cards */}
                  {!ordersLoading && orders && orders.length > 0 && (
                    <div>
                      {orders.map((order) => (
                        <OrderCard key={order.order_id} order={order} />
                      ))}
                    </div>
                  )}

                  {/* Empty state */}
                  {!ordersLoading && orders !== null && orders.length === 0 && (
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
                        className="font-mono"
                        style={{ fontSize: "10px", letterSpacing: "2px", color: "#1A1814", opacity: 0.5, marginBottom: "20px", textTransform: "uppercase" }}
                      >
                        No orders on file yet.
                      </div>

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

                      {/* Guest lookup link */}
                      <div style={{ marginTop: "24px" }}>
                        <Link
                          href="/order-lookup"
                          className="font-mono"
                          style={{ fontSize: "10px", color: "#B8624A", letterSpacing: "1px" }}
                        >
                          Looking for an order? Look it up here →
                        </Link>
                      </div>
                    </div>
                  )}

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

                  {/* ── SECTION 1: PASSWORD ───────────────────────── */}
                  <div
                    style={{
                      backgroundColor: "#EBE2CF",
                      borderLeft: "3px solid #B8624A",
                      padding: "24px 28px",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ borderLeft: "2px solid #C89A3C", paddingLeft: "10px", marginBottom: "20px" }}>
                      <span
                        className="font-mono"
                        style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#1A1814", textTransform: "uppercase" }}
                      >
                        PASSWORD
                      </span>
                    </div>

                    <form onSubmit={handlePasswordUpdate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div>
                        <label
                          className="font-mono"
                          style={{ display: "block", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#1A1814", opacity: 0.65, marginBottom: "6px" }}
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={pwNew}
                          onChange={(e) => setPwNew(e.target.value)}
                          className="font-functional w-full"
                          style={{ backgroundColor: "#EBE2CF", border: "1px solid #1A1814", padding: "10px 12px", fontSize: "14px", color: "#1A1814", outline: "none" }}
                        />
                      </div>
                      <div>
                        <label
                          className="font-mono"
                          style={{ display: "block", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#1A1814", opacity: 0.65, marginBottom: "6px" }}
                        >
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          required
                          value={pwConfirm}
                          onChange={(e) => setPwConfirm(e.target.value)}
                          className="font-functional w-full"
                          style={{ backgroundColor: "#EBE2CF", border: "1px solid #1A1814", padding: "10px 12px", fontSize: "14px", color: "#1A1814", outline: "none" }}
                        />
                      </div>

                      {pwSuccess && (
                        <p className="font-mono" style={{ fontSize: "11px", color: "#607A5C", letterSpacing: "0.5px" }}>
                          Password updated.
                        </p>
                      )}
                      {pwError && (
                        <p className="font-mono" style={{ fontSize: "11px", color: "#B8624A", letterSpacing: "0.5px" }}>
                          {pwError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={pwLoading}
                        className="font-mono uppercase w-full"
                        style={{
                          padding: "11px",
                          backgroundColor: pwLoading ? "rgba(184,98,74,0.5)" : "#B8624A",
                          color: "#F5EFE4",
                          fontSize: "10px",
                          letterSpacing: "2px",
                          border: "none",
                          cursor: pwLoading ? "not-allowed" : "pointer",
                          marginTop: "4px",
                        }}
                      >
                        {pwLoading ? "UPDATING…" : "→ UPDATE PASSWORD"}
                      </button>
                    </form>
                  </div>

                  {/* ── SECTION 2: EMAIL ───────────────────────────── */}
                  <div
                    style={{
                      backgroundColor: "#EBE2CF",
                      borderLeft: "3px solid #B8624A",
                      padding: "24px 28px",
                      marginBottom: "16px",
                    }}
                  >
                    <div style={{ borderLeft: "2px solid #C89A3C", paddingLeft: "10px", marginBottom: "20px" }}>
                      <span
                        className="font-mono"
                        style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#1A1814", textTransform: "uppercase" }}
                      >
                        EMAIL ADDRESS
                      </span>
                    </div>

                    <form onSubmit={handleEmailUpdate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div>
                        <label
                          className="font-mono"
                          style={{ display: "block", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#1A1814", opacity: 0.65, marginBottom: "6px" }}
                        >
                          New Email Address
                        </label>
                        <input
                          type="email"
                          required
                          value={newEmail}
                          onChange={(e) => setNewEmail(e.target.value)}
                          className="font-functional w-full"
                          style={{ backgroundColor: "#EBE2CF", border: "1px solid #1A1814", padding: "10px 12px", fontSize: "14px", color: "#1A1814", outline: "none" }}
                        />
                      </div>

                      {emailSuccess && (
                        <p className="font-mono" style={{ fontSize: "11px", color: "#607A5C", letterSpacing: "0.5px" }}>
                          Check your inbox to confirm your new email address.
                        </p>
                      )}
                      {emailError && (
                        <p className="font-mono" style={{ fontSize: "11px", color: "#B8624A", letterSpacing: "0.5px" }}>
                          {emailError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={emailLoading}
                        className="font-mono uppercase w-full"
                        style={{
                          padding: "11px",
                          backgroundColor: emailLoading ? "rgba(184,98,74,0.5)" : "#B8624A",
                          color: "#F5EFE4",
                          fontSize: "10px",
                          letterSpacing: "2px",
                          border: "none",
                          cursor: emailLoading ? "not-allowed" : "pointer",
                          marginTop: "4px",
                        }}
                      >
                        {emailLoading ? "UPDATING…" : "→ UPDATE EMAIL"}
                      </button>
                    </form>
                  </div>

                  {/* ── SECTION 3: DISPLAY NAME ────────────────────── */}
                  <div
                    style={{
                      backgroundColor: "#EBE2CF",
                      borderLeft: "3px solid #B8624A",
                      padding: "24px 28px",
                    }}
                  >
                    <div style={{ borderLeft: "2px solid #C89A3C", paddingLeft: "10px", marginBottom: "20px" }}>
                      <span
                        className="font-mono"
                        style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#1A1814", textTransform: "uppercase" }}
                      >
                        DISPLAY NAME
                      </span>
                    </div>

                    <form onSubmit={handleNameUpdate} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                      <div>
                        <label
                          className="font-mono"
                          style={{ display: "block", fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#1A1814", opacity: 0.65, marginBottom: "6px" }}
                        >
                          First Name
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="e.g. Jordan"
                          className="font-functional w-full"
                          style={{ backgroundColor: "#EBE2CF", border: "1px solid #1A1814", padding: "10px 12px", fontSize: "14px", color: "#1A1814", outline: "none" }}
                        />
                        <p
                          className="font-mono"
                          style={{ fontSize: "9px", color: "#1A1814", opacity: 0.4, marginTop: "5px", letterSpacing: "0.5px" }}
                        >
                          Used for personalised order confirmation emails.
                        </p>
                      </div>

                      {nameSuccess && (
                        <p className="font-mono" style={{ fontSize: "11px", color: "#607A5C", letterSpacing: "0.5px" }}>
                          Name updated.
                        </p>
                      )}
                      {nameError && (
                        <p className="font-mono" style={{ fontSize: "11px", color: "#B8624A", letterSpacing: "0.5px" }}>
                          {nameError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={nameLoading}
                        className="font-mono uppercase w-full"
                        style={{
                          padding: "11px",
                          backgroundColor: nameLoading ? "rgba(184,98,74,0.5)" : "#B8624A",
                          color: "#F5EFE4",
                          fontSize: "10px",
                          letterSpacing: "2px",
                          border: "none",
                          cursor: nameLoading ? "not-allowed" : "pointer",
                          marginTop: "4px",
                        }}
                      >
                        {nameLoading ? "SAVING…" : "→ UPDATE NAME"}
                      </button>
                    </form>
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
