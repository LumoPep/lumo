"use client";

import { useState } from "react";

interface Props {
  onClose: () => void;
}

export default function EmailCapturePopup({ onClose }: Props) {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const handleClose = () => {
    localStorage.setItem("lumo_email_captured", "true");
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    await fetch("https://formspree.io/f/xqpzqavr", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, source: "popup_email_capture" }),
    });
    localStorage.setItem("lumo_email_captured", "true");
    setSubmitting(false);
    setDone(true);
    setTimeout(() => onClose(), 2000);
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
      onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}
    >
      <style>{`@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }`}</style>

      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          backgroundColor: "#1A1814",
          borderTop: "3px solid #B8624A",
          padding: "40px 36px",
          position: "relative",
        }}
      >
        {/* Close */}
        <button
          onClick={handleClose}
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

        {done ? (
          <p
            className="font-display"
            style={{
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "28px",
              color: "#F5EFE4",
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            You're on the list.
          </p>
        ) : (
          <>
            {/* Label */}
            <div
              className="font-mono uppercase"
              style={{ fontSize: "9px", letterSpacing: "3px", color: "#C89A3C", marginBottom: "14px" }}
            >
              STAY CURRENT
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
              New lots. Fresh data. First to know.
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
              Join researchers who get new lot releases, purity results, and compound updates before anyone else.
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  backgroundColor: "#EBE2CF",
                  border: "1px solid rgba(235,226,207,0.3)",
                  fontSize: "14px",
                  color: "#1A1814",
                  outline: "none",
                  boxSizing: "border-box",
                  borderRadius: 0,
                  marginBottom: "12px",
                  fontFamily: "Inter Tight, sans-serif",
                }}
              />
              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%",
                  padding: "14px 20px",
                  backgroundColor: submitting ? "rgba(184,98,74,0.6)" : "#B8624A",
                  border: "none",
                  cursor: submitting ? "not-allowed" : "pointer",
                  borderRadius: 0,
                }}
              >
                <span
                  className="font-mono uppercase"
                  style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#F5EFE4" }}
                >
                  {submitting ? "Sending…" : "→ NOTIFY ME"}
                </span>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
