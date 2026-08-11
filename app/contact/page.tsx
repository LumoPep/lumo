"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    const response = await fetch("https://formspree.io/f/xqpzqavr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      }),
    });
    if (response.ok) {
      setSubmitted(true);
    } else {
      setError("Something went wrong. Please email support@lumopep.com directly.");
    }
    setSubmitting(false);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", backgroundColor: "#F5EFE4" }}>
        <section style={{ backgroundColor: "#1A1814", padding: "28px 24px" }}>
          <div className="container mx-auto max-w-7xl">
            <div
              className="font-mono uppercase"
              style={{ fontSize: "10px", letterSpacing: "3px", color: "#B8624A", marginBottom: "12px" }}
            >
              06.1 — CONTACT
            </div>
            <h1
              className="font-display"
              style={{
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#F5EFE4",
                letterSpacing: "-0.02em",
              }}
            >
              Message received.
            </h1>
          </div>
        </section>
        <div style={{ padding: "64px 24px", maxWidth: "560px", margin: "0 auto" }}>
          <p
            className="font-editorial"
            style={{ fontSize: "18px", color: "#1A1814", lineHeight: 1.6, marginBottom: "32px" }}
          >
            We'll be in touch within one business day.
          </p>
          <Link
            href="/compounds"
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "2px", color: "#B8624A" }}
          >
            → Back to compounds
          </Link>
        </div>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    backgroundColor: "#EBE2CF",
    border: "1px solid #1A1814",
    fontSize: "14px",
    color: "#1A1814",
    outline: "none",
    boxSizing: "border-box",
    borderRadius: 0,
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: "10px",
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: "#1A1814",
    marginBottom: "6px",
    fontFamily: "JetBrains Mono, monospace",
    fontWeight: 500,
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F5EFE4" }}>

      {/* ── SPLIT HERO ───────────────────────────────────────────── */}
      <section>
        <div className="grid grid-cols-1 lg:grid-cols-2">

          {/* Left — Ink */}
          <div
            className="flex flex-col justify-center"
            style={{ backgroundColor: "#1A1814", padding: "72px 48px" }}
          >
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-mono uppercase"
              style={{ fontSize: "10px", letterSpacing: "3px", color: "#B8624A", marginBottom: "16px" }}
            >
              06.1 — CONTACT
            </motion.div>
            <motion.h1
              className="font-display"
              style={{
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(2.4rem, 4vw, 3.6rem)",
                color: "#F5EFE4",
                letterSpacing: "-0.02em",
                lineHeight: 1.1,
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              Get in touch.
            </motion.h1>
          </div>

          {/* Right — Bone */}
          <div
            className="flex flex-col justify-center gap-8"
            style={{ backgroundColor: "#EBE2CF", padding: "72px 48px" }}
          >
            <motion.p
              className="font-editorial"
              style={{
                fontSize: "clamp(1rem, 1.5vw, 1.15rem)",
                color: "#1A1814",
                opacity: 0.75,
                lineHeight: 1.65,
                maxWidth: "380px",
              }}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              Questions about a compound, lot, or order — we respond within one business day.
            </motion.p>

            <motion.div
              className="flex flex-col gap-4"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              {/* Email card */}
              <div style={{ backgroundColor: "#F5EFE4", borderLeft: "3px solid #B8624A", padding: "16px 20px" }}>
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: "9px", letterSpacing: "2px", color: "#B8624A", marginBottom: "6px" }}
                >
                  EMAIL
                </div>
                <a
                  href="mailto:support@lumopep.com"
                  className="font-editorial"
                  style={{ fontSize: "15px", color: "#1A1814" }}
                >
                  support@lumopep.com
                </a>
              </div>

              {/* Response Time card */}
              <div style={{ backgroundColor: "#F5EFE4", borderLeft: "3px solid #C89A3C", padding: "16px 20px" }}>
                <div
                  className="font-mono uppercase"
                  style={{ fontSize: "9px", letterSpacing: "2px", color: "#C89A3C", marginBottom: "6px" }}
                >
                  RESPONSE TIME
                </div>
                <p className="font-editorial" style={{ fontSize: "15px", color: "#1A1814" }}>
                  Within one business day
                </p>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ── FORM SECTION ─────────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5EFE4", padding: "64px 24px" }}>
        <div style={{ maxWidth: "672px", margin: "0 auto" }}>
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >

            {/* Full Name */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Full Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Your name"
                style={inputStyle}
              />
            </div>

            {/* Email Address */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="your@email.com"
                style={inputStyle}
              />
            </div>

            {/* Subject */}
            <div style={{ marginBottom: "20px" }}>
              <label style={labelStyle}>Subject</label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                style={{ ...inputStyle, cursor: "pointer" }}
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Order Question">Order Question</option>
                <option value="Testing & COA">Testing &amp; COA</option>
                <option value="Compound Research">Compound Research</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Message */}
            <div style={{ marginBottom: "28px" }}>
              <label style={labelStyle}>Message</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                placeholder="How can we help?"
                style={{ ...inputStyle, minHeight: "140px", resize: "vertical" }}
              />
            </div>

            {/* Error */}
            {error && (
              <p
                className="font-mono"
                style={{ fontSize: "11px", color: "#C0392B", marginBottom: "16px" }}
              >
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              style={{
                width: "100%",
                padding: "16px 20px",
                backgroundColor: submitting ? "rgba(184,98,74,0.6)" : "#B8624A",
                border: "none",
                cursor: submitting ? "not-allowed" : "pointer",
                borderRadius: 0,
              }}
            >
              <span
                className="font-mono uppercase"
                style={{ fontSize: "11px", letterSpacing: "2.5px", color: "#F5EFE4" }}
              >
                {submitting ? "Sending…" : "→ SEND MESSAGE"}
              </span>
            </button>

          </motion.form>
        </div>
      </section>

    </div>
  );
}
