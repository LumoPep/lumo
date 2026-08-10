"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase-browser";

export default function UpdatePasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError("");
    setConfirmError("");
    setFormError("");

    if (!password) { setPasswordError("Password is required"); return; }
    if (password.length < 8) { setPasswordError("Password must be at least 8 characters"); return; }
    if (confirmPassword !== password) { setConfirmError("Passwords do not match"); return; }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setFormError(error.message);
    } else {
      setSuccess(true);
      setTimeout(() => router.push("/account"), 2500);
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
            07.5 — UPDATE PASSWORD
          </motion.div>
          <motion.h1
            className="font-display"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#F5EFE4", letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {success ? "Password updated." : "Set a new password."}
          </motion.h1>
        </div>
      </section>

      {/* ── CONTENT ────────────────────────────────────────────── */}
      <div style={{ padding: "64px 24px" }}>
        <div className="container mx-auto" style={{ maxWidth: "480px" }}>

          {success ? (
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
                  ● PASSWORD UPDATED
                </div>
                <p className="font-editorial" style={{ fontSize: "15px", color: "#1A1814", lineHeight: 1.6 }}>
                  Your password has been updated. Redirecting you to your account…
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <p className="font-editorial" style={{ fontSize: "14px", color: "#1A1814", lineHeight: 1.6, marginBottom: "32px" }}>
                Choose a strong new password for your account.
              </p>

              <form onSubmit={handleSubmit} noValidate>

                {/* New password */}
                <div style={{ marginBottom: "16px" }}>
                  <label
                    className="block font-mono uppercase"
                    style={{ fontSize: "9px", letterSpacing: "2px", color: "#1A1814", marginBottom: "6px" }}
                  >
                    New password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                    placeholder="Min. 8 characters"
                    className="font-functional"
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      backgroundColor: "#EBE2CF",
                      border: passwordError ? "1px solid #C0392B" : "1px solid rgba(26,24,20,0.3)",
                      fontSize: "14px",
                      color: "#1A1814",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {passwordError && (
                    <p className="font-mono" style={{ fontSize: "10px", color: "#C0392B", marginTop: "5px" }}>{passwordError}</p>
                  )}
                </div>

                {/* Confirm password */}
                <div style={{ marginBottom: "24px" }}>
                  <label
                    className="block font-mono uppercase"
                    style={{ fontSize: "9px", letterSpacing: "2px", color: "#1A1814", marginBottom: "6px" }}
                  >
                    Confirm new password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => { setConfirmPassword(e.target.value); setConfirmError(""); }}
                    placeholder="••••••••"
                    className="font-functional"
                    style={{
                      width: "100%",
                      padding: "11px 14px",
                      backgroundColor: "#EBE2CF",
                      border: confirmError ? "1px solid #C0392B" : "1px solid rgba(26,24,20,0.3)",
                      fontSize: "14px",
                      color: "#1A1814",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  {confirmError && (
                    <p className="font-mono" style={{ fontSize: "10px", color: "#C0392B", marginTop: "5px" }}>{confirmError}</p>
                  )}
                </div>

                {formError && (
                  <div
                    style={{
                      backgroundColor: "rgba(192,57,43,0.08)",
                      border: "1px solid rgba(192,57,43,0.35)",
                      padding: "10px 14px",
                      marginBottom: "16px",
                    }}
                  >
                    <p className="font-mono" style={{ fontSize: "10px", color: "#C0392B" }}>{formError}</p>
                  </div>
                )}

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
                    {loading ? "Updating…" : "→ Update Password"}
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
