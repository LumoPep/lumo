"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase-browser";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError("");

    if (!email) { setEmailError("Email is required"); return; }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?next=/update-password`,
    });
    setLoading(false);

    if (error) {
      setEmailError(error.message);
    } else {
      setSubmitted(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5EFE4" }}>

      {/* ── HEADER BANNER ──────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1A1814", padding: "48px 24px" }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "3px", color: "#B8624A", marginBottom: "12px" }}
          >
            07.4 — PASSWORD RESET
          </motion.div>
          <motion.h1
            className="font-display"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#F5EFE4", letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {submitted ? "Check your inbox." : "Reset your password."}
          </motion.h1>
        </div>
      </section>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <div style={{ padding: "64px 24px" }}>
        <div className="container mx-auto" style={{ maxWidth: "480px" }}>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <div
                style={{
                  backgroundColor: "#EBE2CF",
                  borderLeft: "2px solid #607A5C",
                  padding: "32px",
                  marginBottom: "28px",
                }}
              >
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: "9px", letterSpacing: "3px", color: "#607A5C", marginBottom: "12px" }}
                >
                  ● RESET LINK SENT
                </div>
                <p className="font-editorial" style={{ fontSize: "15px", color: "#1A1814", lineHeight: 1.6, marginBottom: "12px" }}>
                  Check your email for a reset link. Click it to set a new password.
                </p>
                <p className="font-mono" style={{ fontSize: "10px", color: "#1A1814", opacity: 0.6, lineHeight: 1.5 }}>
                  The link expires after 1 hour. Check your spam folder if you don&apos;t see it.
                </p>
              </div>
              <Link
                href="/login"
                className="font-mono uppercase"
                style={{ fontSize: "10px", letterSpacing: "2px", color: "#B8624A" }}
              >
                → Back to sign in
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-editorial" style={{ fontSize: "14px", color: "#1A1814", lineHeight: 1.6, marginBottom: "32px" }}>
                Enter the email address on your account and we&apos;ll send you a reset link.
              </p>

              <form onSubmit={handleSubmit} noValidate>
                <div style={{ marginBottom: "24px" }}>
                  <label
                    className="block font-mono uppercase"
                    style={{ fontSize: "9px", letterSpacing: "2px", color: "#1A1814", marginBottom: "6px" }}
                  >
                    Email address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setEmailError(""); }}
                    placeholder="your@email.com"
                    className="font-functional"
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      backgroundColor: "#EBE2CF",
                      border: emailError ? "1px solid #C0392B" : "1px solid rgba(26,24,20,0.3)",
                      fontSize: "14px",
                      color: "#1A1814",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {emailError && (
                    <p className="font-mono" style={{ fontSize: "10px", color: "#C0392B", marginTop: "5px" }}>
                      {emailError}
                    </p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: "100%",
                    padding: "14px 20px",
                    backgroundColor: loading ? "rgba(184,98,74,0.6)" : "#B8624A",
                    border: "none",
                    cursor: loading ? "not-allowed" : "pointer",
                    marginBottom: "20px",
                  }}
                >
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#F5EFE4" }}
                  >
                    {loading ? "Sending…" : "→ Send Reset Link"}
                  </span>
                </button>

                <Link
                  href="/login"
                  className="font-mono"
                  style={{ fontSize: "10px", color: "#1A1814", opacity: 0.6, letterSpacing: "0.5px" }}
                >
                  ← Back to sign in
                </Link>
              </form>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
