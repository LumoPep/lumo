"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";

const TESTS = [
  {
    name: "HPLC Purity",
    description: "Independent purity verification",
    accent: "#B8624A",
    tint: "#FAF0EB",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <path d="M3 19L8 12L12 15L17 8L21 11" />
        <line x1="3" y1="19" x2="21" y2="19" />
      </svg>
    ),
  },
  {
    name: "Identity / LCMS",
    description: "Sequence and molecular confirmation",
    accent: "#607A5C",
    tint: "#EEF3ED",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <path d="M6 3c0 4 6 5 6 9" />
        <path d="M18 21c0 -4 -6 -5 -6 -9" />
        <path d="M6 21c0 -4 6 -5 6 -9" />
        <path d="M18 3c0 4 -6 5 -6 9" />
        <line x1="6" y1="10" x2="18" y2="10" />
        <line x1="6" y1="14" x2="18" y2="14" />
      </svg>
    ),
  },
  {
    name: "Net Content",
    description: "Exact mg verified gravimetrically",
    accent: "#C89A3C",
    tint: "#FBF5E8",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <line x1="12" y1="4" x2="12" y2="20" />
        <line x1="8" y1="20" x2="16" y2="20" />
        <path d="M5 8L12 6L19 8" />
        <path d="M2 15C2 16.7 3.3 18 5 18C6.7 18 8 16.7 8 15L5 8L2 15Z" />
        <path d="M16 15C16 16.7 17.3 18 19 18C20.7 18 22 16.7 22 15L19 8L16 15Z" />
      </svg>
    ),
  },
  {
    name: "Batch Consistency",
    description: "Lot-to-lot stability testing",
    accent: "#B8624A",
    tint: "#FAF0EB",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <rect x="3" y="3" width="10" height="10" rx="1" />
        <rect x="11" y="11" width="10" height="10" rx="1" />
        <path d="M11 7h2" />
        <path d="M7 11v2" />
      </svg>
    ),
  },
  {
    name: "Endotoxins / LAL",
    description: "Bacterial endotoxin screening",
    accent: "#607A5C",
    tint: "#EEF3ED",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <circle cx="12" cy="12" r="5" />
        <line x1="12" y1="7" x2="12" y2="4" />
        <line x1="12" y1="17" x2="12" y2="20" />
        <line x1="7" y1="12" x2="4" y2="12" />
        <line x1="17" y1="12" x2="20" y2="12" />
        <line x1="3" y1="3" x2="21" y2="21" />
      </svg>
    ),
  },
  {
    name: "Heavy Metals / ICP-MS",
    description: "Multi-element trace analysis",
    accent: "#C89A3C",
    tint: "#FBF5E8",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <circle cx="12" cy="12" r="1.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(60 12 12)" />
        <ellipse cx="12" cy="12" rx="9" ry="3.5" transform="rotate(120 12 12)" />
      </svg>
    ),
  },
  {
    name: "Sterility",
    description: "Contamination-free verification",
    accent: "#B8624A",
    tint: "#FAF0EB",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width={28} height={28}>
        <path d="M12 3L4 7V12C4 16.4 7.4 20.5 12 21.5C16.6 20.5 20 16.4 20 12V7L12 3Z" />
        <path d="M9 12L11 14L15 10" />
      </svg>
    ),
  },
];

function TestingSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  const topRow = TESTS.slice(0, 4);
  const bottomRow = TESTS.slice(4);

  return (
    <section ref={ref} className="bg-bone py-16 px-6">
      <div className="container mx-auto max-w-7xl">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
          className="font-mono text-xs uppercase tracking-mono text-clay mb-4"
        >
          OUR STANDARD
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="font-display text-4xl md:text-5xl text-ink mb-4 leading-tight"
          style={{ fontWeight: 300 }}
        >
          Every batch. 7× tested.
        </motion.h2>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-editorial mb-12 max-w-xl"
          style={{ color: "#4a4540", fontSize: "14px" }}
        >
          Every compound independently verified across seven analytical dimensions before it ships. No exceptions.
        </motion.p>

        {/* Top row — 4 cards */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4"
        >
          {topRow.map((test, i) => (
            <div
              key={test.name}
              onMouseEnter={() => setHovered(i)}
              onMouseLeave={() => setHovered(null)}
              style={{
                backgroundColor: hovered === i ? test.tint : "#EBE2CF",
                border: `0.5px solid ${hovered === i ? test.accent : "#C8BFAE"}`,
                borderRadius: "10px",
                padding: "16px",
                transition: "all 0.25s ease",
                cursor: "default",
              }}
            >
              <div style={{ color: test.accent, marginBottom: "10px" }}>
                {test.icon}
              </div>
              <div
                className="font-mono uppercase"
                style={{
                  fontSize: "12px",
                  letterSpacing: "0.08em",
                  color: hovered === i ? test.accent : "#1A1814",
                  marginBottom: "6px",
                  transition: "color 0.25s ease",
                }}
              >
                {test.name}
              </div>
              <div style={{ fontSize: "13px", color: "#4a4540", fontFamily: "var(--font-editorial, serif)", lineHeight: 1.5 }}>
                {test.description}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Bottom row — 3 cards centred */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: 0.22 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12"
          style={{ maxWidth: "75%", margin: "0 auto 48px" }}
        >
          {bottomRow.map((test, i) => {
            const idx = i + 4;
            return (
              <div
                key={test.name}
                onMouseEnter={() => setHovered(idx)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  backgroundColor: hovered === idx ? test.tint : "#EBE2CF",
                  border: `0.5px solid ${hovered === idx ? test.accent : "#C8BFAE"}`,
                  borderRadius: "10px",
                  padding: "16px",
                  transition: "all 0.25s ease",
                  cursor: "default",
                }}
              >
                <div style={{ color: test.accent, marginBottom: "10px" }}>
                  {test.icon}
                </div>
                <div
                  className="font-mono uppercase"
                  style={{
                    fontSize: "10px",
                    letterSpacing: "0.08em",
                    color: hovered === idx ? test.accent : "#1A1814",
                    marginBottom: "6px",
                    transition: "color 0.25s ease",
                  }}
                >
                  {test.name}
                </div>
                <div style={{ fontSize: "13px", color: "#4a4540", fontFamily: "var(--font-editorial, serif)", lineHeight: 1.5 }}>
                  {test.description}
                </div>
              </div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-center"
        >
          <a
            href="/coa"
            className="font-mono uppercase hover:underline"
            style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#B8624A" }}
          >
            → VIEW CERTIFICATES OF ANALYSIS
          </a>
        </motion.div>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const missionRef = useRef(null);
  const whoWeServeRef = useRef(null);
  const valuesRef = useRef(null);
  const processRef = useRef(null);
  const rigorRef = useRef(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const whoWeServeInView = useInView(whoWeServeRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });
  const rigorInView = useInView(rigorRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Clay Background with Vials Bleeding Out */}
      <section className="relative py-16 md:py-20 px-6 overflow-visible" style={{ position: 'relative' }}>
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1576086213369-97a306d36557?w=1600&q=80"
            alt="Laboratory background"
            fill
            className="object-cover"
          />
          {/* Clay overlay */}
          <div className="absolute inset-0 bg-clay" style={{ opacity: 0.95 }} />
        </div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-mono text-cream opacity-80 mb-6"
          >
            04.1 — ABOUT LUMO
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-5xl md:text-6xl text-cream mb-4 leading-tight"
            style={{ fontWeight: 300, fontStyle: "italic" }}
          >
            A brand built the same way the molecules are.
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-display text-4xl md:text-5xl text-ochre mb-8 leading-tight"
            style={{ fontWeight: 300, fontStyle: "italic" }}
          >
            Carefully. In sequence.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-editorial text-xl text-cream max-w-2xl mx-auto"
          >
            We built the supply chain we wanted to use ourselves.
          </motion.p>
        </div>
      </section>

      {/* MISSION SECTION - Bone Background */}
      <section ref={missionRef} className="bg-bone py-16 px-6">
        <div className="container mx-auto max-w-3xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={missionInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.6 }}
            className="text-clay text-4xl mb-6"
          >
            ●
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={missionInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl text-ink mb-8 leading-tight"
            style={{ fontWeight: 300, fontStyle: "italic" }}
          >
            Show the work.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={missionInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-editorial text-lg text-ink leading-relaxed max-w-2xl mx-auto"
          >
            Every vial ships with a third-party certificate of analysis. Every lot is traceable. Every claim is footnoted. The brand is the receipt.
          </motion.p>
        </div>
      </section>

      {/* WHO WE SERVE SECTION - Bone Background */}
      <section ref={whoWeServeRef} className="bg-bone py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={whoWeServeInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="font-mono text-xs uppercase tracking-mono text-clay mb-3">
              01.2 — WHO WE SERVE
            </div>
            <h2 className="font-display text-4xl text-ink" style={{ fontWeight: 300 }}>
              Three audiences. One standard.
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={whoWeServeInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {/* Card 1 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-bone p-8"
              style={{
                borderRadius: "20px",
                border: `0.5px solid ${hoveredCard === 0 ? '#B8624A' : '#D4C9B8'}`,
                boxShadow: hoveredCard === 0 ? '0 12px 40px rgba(26,24,20,0.16)' : 'none',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <div className="font-mono text-xs uppercase tracking-mono text-clay mb-4">
                AUDIENCE 01
              </div>
              <h3
                className="font-display text-3xl mb-4 leading-tight"
                style={{ fontWeight: 300, fontStyle: "italic", color: hoveredCard === 0 ? '#B8624A' : '#1A1814', transition: 'color 0.25s ease' }}
              >
                The independent researcher.
              </h3>
              <p className="font-editorial text-sm text-ink opacity-80 leading-relaxed">
                Academic and private researchers sourcing compounds for in vitro and preclinical study.
              </p>
            </motion.div>

            {/* Card 2 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-bone p-8"
              style={{
                borderRadius: "20px",
                border: `0.5px solid ${hoveredCard === 1 ? '#B8624A' : '#D4C9B8'}`,
                boxShadow: hoveredCard === 1 ? '0 12px 40px rgba(26,24,20,0.16)' : 'none',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <div className="font-mono text-xs uppercase tracking-mono text-clay mb-4">
                AUDIENCE 02
              </div>
              <h3
                className="font-display text-3xl mb-4 leading-tight"
                style={{ fontWeight: 300, fontStyle: "italic", color: hoveredCard === 1 ? '#B8624A' : '#1A1814', transition: 'color 0.25s ease' }}
              >
                The compounding professional.
              </h3>
              <p className="font-editorial text-sm text-ink opacity-80 leading-relaxed">
                Licensed professionals requiring documented, traceable research-grade peptides.
              </p>
            </motion.div>

            {/* Card 3 */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8 }}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
              className="bg-bone p-8"
              style={{
                borderRadius: "20px",
                border: `0.5px solid ${hoveredCard === 2 ? '#B8624A' : '#D4C9B8'}`,
                boxShadow: hoveredCard === 2 ? '0 12px 40px rgba(26,24,20,0.16)' : 'none',
                transition: 'border-color 0.25s ease, box-shadow 0.25s ease',
              }}
            >
              <div className="font-mono text-xs uppercase tracking-mono text-clay mb-4">
                AUDIENCE 03
              </div>
              <h3
                className="font-display text-3xl mb-4 leading-tight"
                style={{ fontWeight: 300, fontStyle: "italic", color: hoveredCard === 2 ? '#B8624A' : '#1A1814', transition: 'color 0.25s ease' }}
              >
                The institutional buyer.
              </h3>
              <p className="font-editorial text-sm text-ink opacity-80 leading-relaxed">
                Research institutions and labs needing a verified supplier with full documentation.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* VALUES SECTION - Split Layout: Bone (left vial) + Ink (right list) */}
      <section ref={valuesRef} className="py-0" style={{ position: 'relative', overflow: 'visible' }}>
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Column - Bone with Large Vial */}
          <div className="bg-bone flex items-center justify-center py-16 px-6" style={{ position: 'relative' }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="font-mono text-xs uppercase tracking-mono text-clay mb-3">
                01.3 — CORE VALUES
              </div>
              <h2 className="font-display text-4xl text-ink mb-12" style={{ fontWeight: 300 }}>
                What we stand for.
              </h2>

              {/* Large centrepiece vial */}
              <img
                src="/images/vial-transparent.png"
                alt=""
                style={{
                  width: 'auto',
                  height: '384px',
                  filter: 'drop-shadow(-8px 16px 32px rgba(26,24,20,0.18))',
                  display: 'block',
                  margin: '0 auto',
                  mixBlendMode: 'multiply',
                }}
              />
            </motion.div>
          </div>

          {/* Right Column - Ink with Numbered List */}
          <div className="bg-ink flex items-center py-16 px-6 lg:px-12">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={valuesInView ? "visible" : "hidden"}
              className="space-y-8 w-full max-w-xl"
            >
              {[
                {
                  number: "01",
                  title: "7× Independent Testing",
                  description: "Every batch tested by third-party laboratories for purity, identity, content, consistency, endotoxins, heavy metals, and sterility.",
                },
                {
                  number: "02",
                  title: "Research-Grade Purity",
                  description: "98%+ purity standards. HPLC and mass spectrometry for every lot.",
                },
                {
                  number: "03",
                  title: "Full Documentation",
                  description: "Complete Certificate of Analysis with every order. Traceable batch numbers.",
                },
                {
                  number: "04",
                  title: "Secure Payments",
                  description: "Card, bank transfer, and cryptocurrency accepted. Privacy-focused payments.",
                },
                {
                  number: "05",
                  title: "Legal Compliance",
                  description: "Research use only. Proper disclaimers. 21+ age verification.",
                },
              ].map((value, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="border-l-2 border-clay pl-6"
                >
                  <div className="flex items-baseline gap-4 mb-2">
                    <span
                      className="font-display text-4xl text-clay"
                      style={{ fontWeight: 300 }}
                    >
                      {value.number}
                    </span>
                    <h3
                      className="font-display text-xl text-cream"
                      style={{ fontWeight: 300 }}
                    >
                      {value.title}
                    </h3>
                  </div>
                  <p className="font-editorial text-base font-medium leading-relaxed" style={{ color: '#C4B8A8' }}>
                    {value.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 7× INDEPENDENT TESTING SECTION */}
      <TestingSection />

      {/* PROCESS SECTION - Ink Background */}
      <section ref={processRef} className="bg-ink py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={processInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="font-mono text-xs uppercase tracking-mono text-clay mb-3">
              OUR PROCESS
            </div>
            <h2
              className="font-display text-4xl md:text-5xl text-cream"
              style={{ fontWeight: 300 }}
            >
              From synthesis to your lab.
            </h2>
          </motion.div>

          <div className="relative">
            {/* Connecting dotted line */}
            <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 border-t-2 border-dotted border-clay opacity-40" />

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate={processInView ? "visible" : "hidden"}
              className="grid grid-cols-1 md:grid-cols-4 gap-8"
              style={{ position: 'relative', zIndex: 1 }}
            >
              {[
                {
                  number: "01",
                  title: "Synthesis",
                  description: "Solid-phase peptide synthesis in ISO-certified facilities.",
                },
                {
                  number: "02",
                  title: "7× Testing",
                  description: "Independent lab verification: purity, identity, content, consistency, endotoxins, heavy metals, sterility.",
                },
                {
                  number: "03",
                  title: "Review & Approval",
                  description: "CoA review, batch approval, lot number assignment.",
                },
                {
                  number: "04",
                  title: "Ship & Document",
                  description: "2-day shipping with cold-chain packaging. CoA included in shipment.",
                },
              ].map((step, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  className="text-center relative z-10"
                >
                  <div
                    className="w-20 h-20 rounded-full border-2 border-clay bg-ink mx-auto mb-4 flex items-center justify-center"
                  >
                    <span
                      className="font-display text-2xl text-clay"
                      style={{ fontWeight: 300 }}
                    >
                      {step.number}
                    </span>
                  </div>
                  <h3
                    className="font-display text-xl text-cream mb-3"
                    style={{ fontWeight: 300 }}
                  >
                    {step.title}
                  </h3>
                  <p className="font-editorial text-base font-medium leading-relaxed" style={{ color: '#C4B8A8' }}>
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

      </section>

      {/* RUO STATEMENT SECTION - Full-width Bone, two-column: text left, vial right */}
      <section ref={rigorRef} className="bg-bone py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text + Pills */}
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={rigorInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6 }}
                className="font-display text-4xl md:text-5xl text-ink mb-12 leading-tight"
                style={{ fontWeight: 300, fontStyle: "italic" }}
              >
                The quiet case for rigor.
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={rigorInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="border-l-4 border-clay pl-6 mb-12"
              >
                <p className="font-editorial text-base text-ink opacity-80 leading-relaxed mb-4">
                  All compounds sold by Lumo are intended strictly for in vitro research and laboratory use only. These products are NOT intended for human consumption, medical, veterinary, or household use.
                </p>
                <p className="font-editorial text-base text-ink opacity-80 leading-relaxed mb-4">
                  By purchasing from Lumo, you acknowledge that you are a qualified researcher or institution and will use these products solely for research purposes in compliance with all applicable laws and regulations.
                </p>
                <p className="font-editorial text-base text-ink opacity-80 leading-relaxed">
                  All buyers must be 21 years of age or older. We maintain strict age verification and research-use-only policies to ensure legal compliance and scientific integrity.
                </p>
              </motion.div>

              {/* Trust Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={rigorInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-3"
              >
                {["7× INDEPENDENTLY TESTED", "LOT TRACEABLE"].map((badge, index) => (
                  <div
                    key={index}
                    className="px-4 py-2 font-mono text-xs uppercase tracking-mono"
                    style={{
                      borderRadius: "20px",
                      backgroundColor: "#EBE2CF",
                      color: "#B8624A",
                      border: "0.5px solid #D4C9B8",
                    }}
                  >
                    {badge}
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right Column - Large Vial on Bone */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              animate={rigorInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex items-center justify-center"
            >
              <img
                src="/images/vial-transparent.png"
                alt="Research vial"
                style={{
                  width: 'auto',
                  height: '384px',
                  filter: 'drop-shadow(-8px 16px 32px rgba(26,24,20,0.18))',
                  display: 'block',
                  margin: '0 auto',
                  mixBlendMode: 'multiply',
                }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-005</div>
    </div>
  );
}
