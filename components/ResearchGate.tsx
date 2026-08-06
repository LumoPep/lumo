"use client";

import { useState, useEffect } from "react";

const GATE_KEY = "lumo_age_research_verified";

export default function ResearchGate() {
  // Start hidden — revealed only client-side after localStorage check
  const [visible, setVisible] = useState(false);
  const [age, setAge] = useState(false);
  const [researcher, setResearcher] = useState(false);

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

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#1A1814",
        overflowY: "auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 24px",
      }}
    >
      {/* Top accent line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "3px",
          backgroundColor: "#B8624A",
        }}
      />

      {/* Page code */}
      <div
        style={{
          position: "absolute",
          bottom: "20px",
          left: "24px",
          fontFamily: "var(--font-jetbrains), monospace",
          fontSize: "10px",
          color: "#F5EFE4",
          opacity: 0.15,
          letterSpacing: "1px",
        }}
      >
        L-000
      </div>

      <div style={{ maxWidth: "500px", width: "100%" }}>

        {/* Brand mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "48px",
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
          <span
            style={{
              width: "1px",
              height: "16px",
              backgroundColor: "rgba(245,239,228,0.2)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "9px",
              letterSpacing: "3px",
              color: "#F5EFE4",
              opacity: 0.45,
              textTransform: "uppercase",
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
              display: "inline-block",
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
            marginBottom: "16px",
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
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "#F5EFE4",
            letterSpacing: "-0.025em",
            lineHeight: 1.1,
            marginBottom: "20px",
          }}
        >
          Before you enter.
        </h1>

        {/* Description */}
        <p
          style={{
            fontFamily: "var(--font-newsreader), serif",
            fontSize: "15px",
            color: "#F5EFE4",
            opacity: 0.65,
            lineHeight: 1.65,
            marginBottom: "36px",
          }}
        >
          Lumo compounds are research-grade chemicals sold exclusively for
          qualified in vitro research. They are not approved for human or
          veterinary use. Please confirm the following before continuing.
        </p>

        {/* Checkboxes */}
        <div
          style={{
            borderTop: "1px solid rgba(245,239,228,0.1)",
            paddingTop: "28px",
            marginBottom: "32px",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          {/* Age */}
          <label
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "14px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={age}
              onChange={(e) => setAge(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                marginTop: "2px",
                flexShrink: 0,
                accentColor: "#B8624A",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter-tight), sans-serif",
                fontSize: "14px",
                color: "#F5EFE4",
                opacity: age ? 1 : 0.7,
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
              gap: "14px",
              cursor: "pointer",
            }}
          >
            <input
              type="checkbox"
              checked={researcher}
              onChange={(e) => setResearcher(e.target.checked)}
              style={{
                width: "18px",
                height: "18px",
                marginTop: "2px",
                flexShrink: 0,
                accentColor: "#B8624A",
                cursor: "pointer",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-inter-tight), sans-serif",
                fontSize: "14px",
                color: "#F5EFE4",
                opacity: researcher ? 1 : 0.7,
                lineHeight: 1.5,
                transition: "opacity 0.15s",
              }}
            >
              I confirm I am a qualified researcher purchasing for in vitro /
              laboratory research only — not for human or veterinary use
            </span>
          </label>
        </div>

        {/* CTA button */}
        <button
          onClick={handleEnter}
          disabled={!canEnter}
          style={{
            width: "100%",
            padding: "16px 32px",
            backgroundColor: canEnter ? "#B8624A" : "transparent",
            border: `1px solid ${canEnter ? "#B8624A" : "rgba(245,239,228,0.2)"}`,
            color: canEnter ? "#F5EFE4" : "rgba(245,239,228,0.25)",
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "11px",
            letterSpacing: "3px",
            textTransform: "uppercase",
            cursor: canEnter ? "pointer" : "not-allowed",
            transition: "all 0.2s",
            display: "block",
            marginBottom: "20px",
          }}
        >
          {canEnter ? "→ Enter Lumo" : "Enter Lumo"}
        </button>

        {/* Exit link */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <a
            href="https://www.google.com"
            style={{
              fontFamily: "var(--font-jetbrains), monospace",
              fontSize: "10px",
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
        <p
          style={{
            fontFamily: "var(--font-jetbrains), monospace",
            fontSize: "9px",
            letterSpacing: "0.5px",
            color: "#F5EFE4",
            opacity: 0.25,
            lineHeight: 1.6,
            textAlign: "center",
            borderTop: "1px solid rgba(245,239,228,0.07)",
            paddingTop: "16px",
          }}
        >
          By proceeding you affirm the statements above are true. Products are
          not for human or veterinary use and have not been evaluated by the FDA.
        </p>

      </div>
    </div>
  );
}
