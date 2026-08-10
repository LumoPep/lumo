"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formError, setFormError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const clearErrors = () => {
    setEmailError("");
    setPasswordError("");
    setFormError("");
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();

    if (!email) { setEmailError("Email is required"); return; }
    if (!password) { setPasswordError("Password is required"); return; }

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      if (error.message.toLowerCase().includes("email")) {
        setEmailError(error.message);
      } else if (error.message.toLowerCase().includes("password") || error.message.toLowerCase().includes("invalid")) {
        setPasswordError("Invalid email or password");
      } else {
        setFormError(error.message);
      }
    } else {
      router.push("/account");
      router.refresh();
    }
  };

  const handleGoogleSignIn = async () => {
    clearErrors();
    setGoogleLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setFormError(error.message);
      setGoogleLoading(false);
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
            07.2 — ACCOUNT ACCESS
          </motion.div>
          <motion.h1
            className="font-display"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "clamp(2rem, 4vw, 3rem)", color: "#F5EFE4", letterSpacing: "-0.02em" }}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Sign in to your account.
          </motion.h1>
        </div>
      </section>

      {/* ── TWO COLUMN ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5" style={{ minHeight: "calc(100vh - 200px)" }}>

        {/* ── LEFT: BRAND PANEL ────────────────────────────────── */}
        <div
          className="lg:col-span-2 hidden lg:flex flex-col justify-between"
          style={{ backgroundColor: "#1A1814", padding: "56px 48px" }}
        >
          {/* Wordmark */}
          <div>
            <div
              className="font-display"
              style={{ fontWeight: 300, fontSize: "2.4rem", color: "#EBE2CF", letterSpacing: "-0.03em", lineHeight: 1, marginBottom: "6px" }}
            >
              Lumo
            </div>
            <div
              className="font-mono uppercase"
              style={{ fontSize: "9px", letterSpacing: "3px", color: "#B8624A" }}
            >
              Research Peptides
            </div>
          </div>

          {/* Statement */}
          <div>
            <div style={{ height: "1px", backgroundColor: "rgba(235,226,207,0.15)", marginBottom: "36px" }} />
            <h2
              className="font-display"
              style={{ fontWeight: 300, fontStyle: "italic", fontSize: "clamp(1.4rem, 2vw, 1.9rem)", color: "#F5EFE4", letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "32px" }}
            >
              Research-grade.<br />Lab-verified.<br />Lot-traceable.
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: "14px", marginBottom: "40px" }}>
              {[
                "HPLC-confirmed purity on every lot",
                "Third-party CoA published with each batch",
                "Synthesized to specification",
              ].map((item) => (
                <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "10px" }}>
                  <span style={{ color: "#607A5C", fontSize: "6px", marginTop: "5px", flexShrink: 0 }}>●</span>
                  <span
                    className="font-mono uppercase"
                    style={{ fontSize: "9px", letterSpacing: "1.5px", color: "#EBE2CF", opacity: 0.7, lineHeight: 1.5 }}
                  >
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: "1px", backgroundColor: "rgba(235,226,207,0.1)", marginBottom: "24px" }} />

            <div style={{ display: "flex", gap: "32px" }}>
              {[
                { num: "7×", label: "Tests per lot" },
                { num: "99%", label: "Purity avg." },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    className="font-display"
                    style={{ fontWeight: 300, fontSize: "1.6rem", color: "#C89A3C", letterSpacing: "-0.02em" }}
                  >
                    {stat.num}
                  </div>
                  <div
                    className="font-mono uppercase"
                    style={{ fontSize: "8px", letterSpacing: "1.5px", color: "#EBE2CF", opacity: 0.5 }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer note */}
          <div
            className="font-mono"
            style={{ fontSize: "9px", letterSpacing: "0.5px", color: "#EBE2CF", opacity: 0.3 }}
          >
            For legitimate research use only
          </div>
        </div>

        {/* ── RIGHT: FORM PANEL ───────────────────────────────── */}
        <motion.div
          className="lg:col-span-3 flex items-start justify-center"
          style={{ backgroundColor: "#F5EFE4", padding: "56px 48px" }}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
        >
          <div style={{ width: "100%", maxWidth: "440px" }}>

            {/* Form heading */}
            <div style={{ marginBottom: "32px" }}>
              <div
                className="font-mono uppercase"
                style={{ fontSize: "9px", letterSpacing: "3px", color: "#B8624A", marginBottom: "10px" }}
              >
                ● SIGN IN
              </div>
              <h2
                className="font-display"
                style={{ fontWeight: 300, fontStyle: "italic", fontSize: "1.8rem", color: "#1A1814", letterSpacing: "-0.02em" }}
              >
                Welcome back.
              </h2>
            </div>

            {/* Google sign in */}
            <button
              onClick={handleGoogleSignIn}
              disabled={googleLoading}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                padding: "13px 20px",
                backgroundColor: "#1A1814",
                border: "none",
                cursor: googleLoading ? "not-allowed" : "pointer",
                opacity: googleLoading ? 0.6 : 1,
                marginBottom: "20px",
              }}
            >
              {/* Google G icon */}
              <svg width="16" height="16" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" fill="#F5EFE4" />
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#F5EFE4" opacity="0.85" />
                <path d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#F5EFE4" opacity="0.7" />
                <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#F5EFE4" opacity="0.9" />
              </svg>
              <span
                className="font-mono uppercase"
                style={{ fontSize: "10px", letterSpacing: "2px", color: "#F5EFE4" }}
              >
                {googleLoading ? "Redirecting…" : "Continue with Google"}
              </span>
            </button>

            {/* Ochre divider */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#C89A3C", opacity: 0.35 }} />
              <span
                className="font-mono uppercase"
                style={{ fontSize: "9px", letterSpacing: "2px", color: "#C89A3C" }}
              >
                or
              </span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "#C89A3C", opacity: 0.35 }} />
            </div>

            {/* Email / password form */}
            <form onSubmit={handleEmailSignIn} noValidate>

              {/* Email */}
              <div style={{ marginBottom: "16px" }}>
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

              {/* Password */}
              <div style={{ marginBottom: "10px" }}>
                <label
                  className="block font-mono uppercase"
                  style={{ fontSize: "9px", letterSpacing: "2px", color: "#1A1814", marginBottom: "6px" }}
                >
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setPasswordError(""); }}
                  placeholder="••••••••"
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
                  <p className="font-mono" style={{ fontSize: "10px", color: "#C0392B", marginTop: "5px" }}>
                    {passwordError}
                  </p>
                )}
              </div>

              {/* Forgot password */}
              <div style={{ marginBottom: "24px", textAlign: "right" }}>
                <Link
                  href="/reset-password"
                  className="font-mono"
                  style={{ fontSize: "10px", color: "#B8624A", letterSpacing: "0.5px" }}
                >
                  Forgot password?
                </Link>
              </div>

              {/* Form-level error */}
              {formError && (
                <div
                  style={{
                    backgroundColor: "rgba(192,57,43,0.08)",
                    border: "1px solid rgba(192,57,43,0.35)",
                    padding: "10px 14px",
                    marginBottom: "16px",
                  }}
                >
                  <p className="font-mono" style={{ fontSize: "10px", color: "#C0392B" }}>
                    {formError}
                  </p>
                </div>
              )}

              {/* Sign In button */}
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  backgroundColor: loading ? "rgba(184,98,74,0.6)" : "#B8624A",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#F5EFE4" }}
                >
                  {loading ? "Signing in…" : "→ Sign In"}
                </span>
              </button>
            </form>

            {/* Signup link */}
            <div style={{ marginTop: "28px", paddingTop: "24px", borderTop: "1px solid rgba(26,24,20,0.1)" }}>
              <p className="font-editorial" style={{ fontSize: "13px", color: "#1A1814" }}>
                Don&apos;t have an account?{" "}
                <Link
                  href="/signup"
                  style={{ color: "#B8624A", textDecoration: "underline", textDecorationColor: "rgba(184,98,74,0.4)" }}
                >
                  Create one
                </Link>
              </p>
            </div>

          </div>
        </motion.div>
      </div>
    </div>
  );
}
