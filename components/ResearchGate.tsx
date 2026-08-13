"use client";

import { useState, useEffect } from "react";

const GATE_KEY = "lumo_age_research_verified";

// Six vials: different images, speeds, delays, opacities, and horizontal positions
// Negative delays seed them at different heights on first render
const FALLING_VIALS = [
  { src: "/images/products/bpc-157-v2.png",        left: "5%",  width: 168, anim: "vialFall1", dur: "9s",  delay: "0s",   opacity: 0.88 },
  { src: "/images/products/semaglutide-5mg-v2.png", left: "26%", width: 198, anim: "vialFall2", dur: "12s", delay: "-5s",  opacity: 0.72 },
  { src: "/images/products/tb-500-v2.png",          left: "50%", width: 159, anim: "vialFall3", dur: "8s",  delay: "-2s",  opacity: 0.92 },
  { src: "/images/products/ipamorelin-v2.png",      left: "70%", width: 180, anim: "vialFall4", dur: "11s", delay: "-7s",  opacity: 0.68 },
  { src: "/images/products/lumo-2-trz-10mg-v2.png", left: "15%", width: 147, anim: "vialFall5", dur: "14s", delay: "-10s", opacity: 0.78 },
  { src: "/images/products/epithalon-v2.png",       left: "40%", width: 138, anim: "vialFall3", dur: "10s", delay: "-1s",  opacity: 0.62 },
];

const TESTS = [
  "HPLC Purity",
  "UV/MS Identity",
  "Potency Verified",
  "Lot Traceable",
  "COA Published",
];

export default function ResearchGate() {
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
    <>
      {/* Self-contained keyframe definitions — gate only */}
      <style>{`
        @keyframes vialFall1 {
          0%   { transform: translateY(-160px) rotate(7deg);  opacity: 0; }
          8%   { opacity: 0.88; }
          86%  { opacity: 0.88; }
          100% { transform: translateY(105vh)  rotate(10deg); opacity: 0; }
        }
        @keyframes vialFall2 {
          0%   { transform: translateY(-160px) rotate(-11deg); opacity: 0; }
          8%   { opacity: 0.72; }
          86%  { opacity: 0.72; }
          100% { transform: translateY(105vh)  rotate(-8deg);  opacity: 0; }
        }
        @keyframes vialFall3 {
          0%   { transform: translateY(-160px) rotate(4deg);  opacity: 0; }
          8%   { opacity: 0.92; }
          86%  { opacity: 0.92; }
          100% { transform: translateY(105vh)  rotate(7deg);  opacity: 0; }
        }
        @keyframes vialFall4 {
          0%   { transform: translateY(-160px) rotate(-6deg); opacity: 0; }
          8%   { opacity: 0.68; }
          86%  { opacity: 0.68; }
          100% { transform: translateY(105vh)  rotate(-9deg); opacity: 0; }
        }
        @keyframes vialFall5 {
          0%   { transform: translateY(-160px) rotate(13deg); opacity: 0; }
          8%   { opacity: 0.78; }
          86%  { opacity: 0.78; }
          100% { transform: translateY(105vh)  rotate(11deg); opacity: 0; }
        }
      `}</style>

      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          display: "flex",
        }}
      >
        {/* Clay top accent — spans full width across both panels */}
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

        {/* ── LEFT PANEL (Bone, desktop only) ─────────────── */}
        <div
          className="hidden lg:flex"
          style={{
            width: "45%",
            position: "relative",
            backgroundColor: "#F5EFE4",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {/* Falling vials — looping infinitely */}
          {FALLING_VIALS.map((vial, i) => (
            <img
              key={i}
              src={vial.src}
              alt=""
              aria-hidden="true"
              style={{
                position: "absolute",
                left: vial.left,
                top: 0,
                width: vial.width,
                objectFit: "contain",
                zIndex: 1,
                animation: `${vial.anim} ${vial.dur} linear ${vial.delay} infinite`,
                filter: "drop-shadow(0 14px 24px rgba(26,24,20,0.14))",
              }}
            />
          ))}

          {/* Cream radial gradient — subtle depth in center of panel */}
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              height: "60%",
              background:
                "radial-gradient(ellipse at center, rgba(235,226,207,0.45) 0%, transparent 70%)",
              zIndex: 1,
              pointerEvents: "none",
            }}
          />

          {/* Gradient overlay — solid Bone at the bottom so text is fully legible */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: "65%",
              background:
                "linear-gradient(to top, #F5EFE4 55%, rgba(245,239,228,0.92) 72%, transparent 100%)",
              zIndex: 2,
              pointerEvents: "none",
            }}
          />

          {/* Text content — pinned to bottom of panel */}
          <div
            style={{
              position: "relative",
              zIndex: 3,
              height: "100%",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              padding: "36px 40px",
            }}
          >
            {/* Lumo Ink logo */}
            <img
              src="/logos/lumo_logo_ink.png"
              alt="Lumo"
              style={{
                width: 134,
                objectFit: "contain",
                marginBottom: "28px",
              }}
            />

            {/* Brand statement */}
            <p
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(1.55rem, 2.1vw, 2.1rem)",
                color: "#1A1814",
                letterSpacing: "-0.025em",
                lineHeight: 1.18,
                marginBottom: "28px",
              }}
            >
              Research-grade peptides.
              <br />
              Independently verified.
            </p>

            {/* 7× Testing section */}
            <div style={{ marginBottom: "24px" }}>
              {/* Ochre accent line */}
              <div
                style={{
                  height: "1px",
                  backgroundColor: "#C89A3C",
                  marginBottom: "14px",
                  width: "48px",
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "12px",
                }}
              >
                <span
                  style={{
                    fontFamily: "var(--font-fraunces), serif",
                    fontWeight: 300,
                    fontSize: "1.05rem",
                    color: "#B8624A",
                    letterSpacing: "-0.02em",
                  }}
                >
                  ✓
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-jetbrains), monospace",
                    fontSize: "9px",
                    letterSpacing: "2.5px",
                    textTransform: "uppercase",
                    color: "#1A1814",
                  }}
                >
                  Third-Party Verified
                </span>
              </div>

              {/* 2-column test grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "5px 20px",
                }}
              >
                {TESTS.map((test) => (
                  <div
                    key={test}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "7px",
                    }}
                  >
                    <span
                      style={{
                        width: "3px",
                        height: "3px",
                        borderRadius: "50%",
                        backgroundColor: "#607A5C",
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-jetbrains), monospace",
                        fontSize: "9px",
                        letterSpacing: "0.5px",
                        textTransform: "uppercase",
                        color: "#1A1814",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {test}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div
              style={{
                height: "1px",
                backgroundColor: "rgba(26,24,20,0.12)",
                marginBottom: "20px",
              }}
            />

            {/* Stat blocks */}
            <div
              style={{
                display: "flex",
                gap: "28px",
                marginBottom: "18px",
              }}
            >
              {[
                { value: "✓", label: "Verified", color: "#B8624A" },
                { value: "24", label: "Compounds",           color: "#C89A3C" },
                { value: "US", label: "Lab Verified",        color: "#B8624A" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div
                    style={{
                      fontFamily: "var(--font-fraunces), serif",
                      fontWeight: 300,
                      fontSize: "1.45rem",
                      color: stat.color,
                      letterSpacing: "-0.02em",
                      lineHeight: 1,
                      marginBottom: "4px",
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
                    }}
                  >
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── RIGHT PANEL (Ink) ────────────────────────────── */}
        <div
          className="w-full lg:w-[55%]"
          style={{
            backgroundColor: "#1A1814",
            overflowY: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 32px",
          }}
        >
          <div style={{ maxWidth: "460px", width: "100%" }}>

            {/* Cream logo */}
            <img
              src="/logos/lumo_logo_cream.png"
              alt="Lumo"
              style={{
                width: 165,
                objectFit: "contain",
                marginBottom: "44px",
              }}
            />

            {/* Section label */}
            <div
              style={{
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "10px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: "#B8624A",
                marginBottom: "16px",
              }}
            >
              00.1 — RESEARCH VERIFICATION
            </div>

            {/* Ochre rule above heading */}
            <div
              style={{
                height: "1px",
                backgroundColor: "#C89A3C",
                marginBottom: "20px",
              }}
            />

            {/* Heading */}
            <h1
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontWeight: 300,
                fontStyle: "italic",
                fontSize: "clamp(2.2rem, 4vw, 3.2rem)",
                color: "#F5EFE4",
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
                marginBottom: "20px",
              }}
            >
              Before you enter.
            </h1>

            {/* Description */}
            <p
              style={{
                fontFamily: "var(--font-newsreader), serif",
                fontSize: "17px",
                color: "#F5EFE4",
                lineHeight: 1.65,
                marginBottom: "32px",
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
                backgroundColor: "rgba(245,239,228,0.14)",
                marginBottom: "30px",
              }}
            />

            {/* Checkboxes */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "24px",
                marginBottom: "36px",
              }}
            >
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
                    width: "19px",
                    height: "19px",
                    marginTop: "3px",
                    flexShrink: 0,
                    accentColor: "#B8624A",
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-inter-tight), sans-serif",
                    fontSize: "16px",
                    color: "#F5EFE4",
                    lineHeight: 1.5,
                  }}
                >
                  I am at least 21 years of age
                </span>
              </label>

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
                    width: "19px",
                    height: "19px",
                    marginTop: "3px",
                    flexShrink: 0,
                    accentColor: "#B8624A",
                    cursor: "pointer",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-inter-tight), sans-serif",
                    fontSize: "16px",
                    color: "#F5EFE4",
                    lineHeight: 1.5,
                  }}
                >
                  I confirm I am a qualified researcher purchasing for in vitro
                  / laboratory research only — not for human or veterinary use
                </span>
              </label>
            </div>

            {/* Enter Lumo CTA */}
            <button
              onClick={handleEnter}
              disabled={!canEnter}
              style={{
                width: "100%",
                padding: "18px 28px",
                backgroundColor: canEnter ? "#B8624A" : "transparent",
                border: `1px solid ${canEnter ? "#B8624A" : "rgba(245,239,228,0.14)"}`,
                color: canEnter ? "#F5EFE4" : "rgba(245,239,228,0.18)",
                fontFamily: "var(--font-jetbrains), monospace",
                fontSize: "11px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                cursor: canEnter ? "pointer" : "not-allowed",
                transition: "background-color 0.2s, border-color 0.2s, color 0.2s",
                textAlign: "center",
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
                  opacity: 0.32,
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
                paddingTop: "18px",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-jetbrains), monospace",
                  fontSize: "10px",
                  letterSpacing: "0.5px",
                  color: "#F5EFE4",
                  opacity: 0.55,
                  lineHeight: 1.7,
                  textAlign: "center",
                }}
              >
                By proceeding you affirm the statements above are true. Products
                are not for human or veterinary use and have not been evaluated
                by the FDA.
              </p>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
