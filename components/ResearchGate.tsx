"use client";

import { useState, useEffect } from "react";

const GATE_KEY = "lumo_age_research_verified";

// Four vials to scatter across the left panel
const VIALS = [
  {
    src: "/images/products/semaglutide-5mg-v2.png",
    style: { top: "4%", right: "6%", width: 170, rotate: "rotate(9deg)" },
  },
  {
    src: "/images/products/bpc-157-v2.png",
    style: { top: "20%", left: "2%", width: 150, rotate: "rotate(-14deg)" },
  },
  {
    src: "/images/products/tb-500-v2.png",
    style: { top: "42%", right: "14%", width: 140, rotate: "rotate(-7deg)" },
  },
  {
    src: "/images/products/lumo-2-trz-10mg-v2.png",
    style: { top: "8%", left: "32%", width: 125, rotate: "rotate(5deg)" },
  },
];

export default function ResearchGate() {
  const [visible, setVisible] = useState(false);
  const [age, setAge] = useState(false);
  const [researcher, setResearcher] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(GATE_KEY)) {
      setVisible(true);
      document.body.style.overflow = "hidden";
    }
  }, []);

  const canEnter = age && researcher;

  const handleEnter = () => {
    localStorage.setItem(GATE_KEY, "1");
    document.body.style.overflow = "";
    setVisible(false);
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    localStorage.setItem(GATE_KEY, "1");
    try {
      const { getSupabase } = await import("@/lib/supabase");
      const supabase = getSupabase();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
    } catch {
      // Supabase not configured — just close the gate
      document.body.style.overflow = "";
      setVisible(false);
    }
  };

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
      }}
    >
      {/* ── 3px CLAY TOP ACCENT ─────────────────────────────── */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: "#B8624A",
          zIndex: 10,
        }}
      />

      {/* ── LEFT PANEL ──────────────────────────────────────── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "45%",
          position: "relative",
          backgroundColor: "#F5EFE4",
          flexDirection: "column",
          justifyContent: "flex-end",
          overflow: "hidden",
        }}
      >
        {/* Scattered vial images */}
        {VIALS.map((vial, i) => (
          <img
            key={i}
            src={vial.src}
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              width: vial.style.width,
              top: vial.style.top,
              right: ("right" in vial.style) ? vial.style.right : undefined,
              left: ("left" in vial.style) ? vial.style.left : undefined,
              objectFit: "contain",
              transform: vial.style.rotate,
              filter: "drop-shadow(0 16px 32px rgba(26,24,20,0.12))",
              zIndex: 1,
            }}
          />
        ))}

        {/* Gradient overlay — fades to Bone at bottom for text legibility */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, #F5EFE4 0%, rgba(245,239,228,0.85) 30%, rgba(245,239,228,0.25) 65%, rgba(245,239,228,0.05) 100%)",
            zIndex: 2,
          }}
        />

        {/* Bottom brand content */}
        <div
          style={{
            position: "relative",
            zIndex: 3,
            padding: "36px 40px",
          }}
        >
          {/* Brand statement */}
          <p
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(1.3rem, 2vw, 1.7rem)",
              color: "#1A1814",
              letterSpacing: "-0.025em",
              lineHeight: 1.2,
              marginBottom: "28px",
              maxWidth: "340px",
            }}
          >
            Research-grade peptides.
            <br />
            Independently verified.
          </p>

          {/* Hairline divider */}
          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(26,24,20,0.12)",
              marginBottom: "20px",
            }}
          />

          {/* Trust stats */}
          <div
            style={{
              display: "flex",
              gap: "24px",
              marginBottom: "20px",
            }}
          >
            {[
              { value: "7×", label: "Independent Testing" },
              { value: "24", label: "Compounds" },
              { value: "US-Lab", label: "Third-Party Verified" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    fontWeight: 300,
                    fontSize: "1.1rem",
                    color: "#B8624A",
                    letterSpacing: "-0.02em",
                    lineHeight: 1,
                    marginBottom: "3px",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "8px",
                    letterSpacing: "1.5px",
                    textTransform: "uppercase",
                    color: "#1A1814",
                    opacity: 0.5,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Lot traceability example */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              backgroundColor: "rgba(26,24,20,0.06)",
              padding: "6px 10px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "8px",
                letterSpacing: "2px",
                textTransform: "uppercase",
                color: "#1A1814",
                opacity: 0.4,
              }}
            >
              LOT TRACE
            </span>
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "1.5px",
                color: "#1A1814",
                opacity: 0.65,
              }}
            >
              LMO-0626-BPC-005
            </span>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ─────────────────────────────────────── */}
      <div
        className="w-full lg:w-[55%]"
        style={{
          backgroundColor: "#1A1814",
          overflowY: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
        }}
      >
        <div style={{ maxWidth: "420px", width: "100%" }}>

          {/* Wordmark */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "40px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 300,
                fontSize: "1.4rem",
                color: "#F5EFE4",
                letterSpacing: "-0.02em",
              }}
            >
              Lumo
            </span>
            <div
              style={{
                width: "1px",
                height: "14px",
                backgroundColor: "rgba(245,239,228,0.2)",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#F5EFE4",
                opacity: 0.4,
              }}
            >
              Research Peptides
            </span>
            {/* Pulsing Clay dot */}
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                backgroundColor: "#B8624A",
                flexShrink: 0,
                animation: "pulseDot 2s ease-in-out infinite",
              }}
            />
          </div>

          {/* Section label */}
          <div
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "9px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              color: "#B8624A",
              marginBottom: "14px",
            }}
          >
            00.1 — RESEARCH VERIFICATION
          </div>

          {/* Heading */}
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(1.9rem, 4vw, 2.6rem)",
              color: "#F5EFE4",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "16px",
            }}
          >
            Before you enter.
          </h1>

          {/* Description */}
          <p
            style={{
              fontFamily: "var(--font-newsreader), serif",
              fontSize: "14px",
              color: "#F5EFE4",
              opacity: 0.9,
              lineHeight: 1.65,
              marginBottom: "28px",
            }}
          >
            Lumo compounds are research-grade chemicals sold exclusively for
            qualified in vitro research. Please confirm the following before
            continuing.
          </p>

          {/* Hairline divider */}
          <div
            style={{
              height: "1px",
              backgroundColor: "rgba(245,239,228,0.12)",
              marginBottom: "24px",
            }}
          />

          {/* Checkboxes */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              marginBottom: "28px",
            }}
          >
            {/* Age */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "13px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={age}
                onChange={(e) => setAge(e.target.checked)}
                style={{
                  width: "17px",
                  height: "17px",
                  marginTop: "2px",
                  flexShrink: 0,
                  accentColor: "#B8624A",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-inter-tight), sans-serif",
                  fontSize: "13px",
                  color: "#F5EFE4",
                  opacity: age ? 1 : 0.8,
                  lineHeight: 1.5,
                  transition: "opacity 0.15s",
                }}
              >
                I am at least 21 years of age
              </span>
            </label>

            {/* Researcher */}
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "13px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={researcher}
                onChange={(e) => setResearcher(e.target.checked)}
                style={{
                  width: "17px",
                  height: "17px",
                  marginTop: "2px",
                  flexShrink: 0,
                  accentColor: "#B8624A",
                  cursor: "pointer",
                }}
              />
              <span
                style={{
                  fontFamily: "var(--font-inter-tight), sans-serif",
                  fontSize: "13px",
                  color: "#F5EFE4",
                  opacity: researcher ? 1 : 0.8,
                  lineHeight: 1.5,
                  transition: "opacity 0.15s",
                }}
              >
                I confirm I am a qualified researcher purchasing for in vitro /
                laboratory research only — not for human or veterinary use
              </span>
            </label>
          </div>

          {/* Enter Lumo CTA */}
          <button
            onClick={handleEnter}
            disabled={!canEnter}
            style={{
              width: "100%",
              padding: "15px 24px",
              backgroundColor: canEnter ? "#B8624A" : "transparent",
              border: `1px solid ${canEnter ? "#B8624A" : "rgba(245,239,228,0.15)"}`,
              color: canEnter ? "#F5EFE4" : "rgba(245,239,228,0.2)",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              letterSpacing: "3px",
              textTransform: "uppercase",
              cursor: canEnter ? "pointer" : "not-allowed",
              transition: "all 0.2s",
              display: "block",
              marginBottom: "10px",
              textAlign: "center",
            }}
          >
            {canEnter ? "→ Enter Lumo" : "Enter Lumo"}
          </button>

          {/* Continue with Google */}
          <button
            onClick={handleGoogle}
            disabled={googleLoading}
            style={{
              width: "100%",
              padding: "14px 24px",
              backgroundColor: "#F5EFE4",
              border: "1px solid #F5EFE4",
              color: "#1A1814",
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: googleLoading ? "wait" : "pointer",
              opacity: googleLoading ? 0.6 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "10px",
              transition: "opacity 0.15s",
              marginBottom: "20px",
            }}
          >
            {/* Google G icon */}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              style={{ flexShrink: 0 }}
            >
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {googleLoading ? "Redirecting..." : "Continue with Google"}
          </button>

          {/* Exit link */}
          <div
            style={{
              textAlign: "center",
              marginBottom: "20px",
            }}
          >
            <a
              href="https://www.google.com"
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "#F5EFE4",
                opacity: 0.35,
                textDecoration: "none",
              }}
            >
              Not a researcher? Exit
            </a>
          </div>

          {/* Legal disclaimer */}
          <div
            style={{
              borderTop: "1px solid rgba(245,239,228,0.08)",
              paddingTop: "16px",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "9px",
                letterSpacing: "0.5px",
                color: "#F5EFE4",
                opacity: 0.55,
                lineHeight: 1.7,
                textAlign: "center",
              }}
            >
              By proceeding you affirm the statements above are true. Products
              are not for human or veterinary use and have not been evaluated by
              the FDA.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
