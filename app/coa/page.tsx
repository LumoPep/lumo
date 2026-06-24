"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView } from "framer-motion";
import { PRODUCTS, CATEGORY_COLORS } from "@/data/products";

export default function CoAPage() {
  return (
    <div className="min-h-screen">
      {/* Split Hero Section */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Half - Clay Background */}
          <div className="bg-clay py-16 md:py-24 px-6 flex items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="font-display text-5xl md:text-7xl text-cream leading-tight text-center"
              style={{ fontWeight: 300, fontStyle: "italic" }}
            >
              Every lot.
            </motion.h1>
          </div>

          {/* Right Half - Bone Background */}
          <div className="bg-bone py-16 md:py-24 px-6 flex flex-col items-center justify-center">
            <motion.h1
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="font-display text-5xl md:text-7xl text-ink leading-tight text-center mb-4"
              style={{ fontWeight: 300 }}
            >
              Its own paper trail.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="font-mono text-xs uppercase tracking-widest text-clay"
              style={{ letterSpacing: "4px" }}
            >
              SHOW THE WORK.
            </motion.p>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-ink py-6 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x-0 md:divide-x divide-cream divide-opacity-20">
            {[
              `${PRODUCTS.filter(p => p.category !== 'Ancillary').length} COMPOUNDS`,
              "7× INDEPENDENTLY TESTED",
              "HPLC + MASS SPEC",
              "INDEPENDENT LAB",
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="text-center md:px-4"
              >
                <div className="font-mono text-xs uppercase tracking-mono text-cream">
                  {stat}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7-Point Testing Section */}
      <section className="bg-bone py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-4xl md:text-5xl text-ink mb-4" style={{ fontWeight: 300 }}>
              Every Lumo batch is independently verified across 7 tests.
            </h2>
            <p className="font-editorial text-lg text-ink opacity-60 max-w-3xl mx-auto">
              Purity, identity, net content, sterility, batch consistency, endotoxins, and heavy metals.
            </p>
          </motion.div>

          {/* 7 Test Cards + Accent Tile (4+4 Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              {
                title: "Purity (HPLC)",
                description: "High-performance liquid chromatography verifies compound purity to 98%+ specification.",
                color: "#B8624A",
              },
              {
                title: "Identity",
                description: "Mass spectrometry confirms molecular weight and correct peptide identity.",
                color: "#4A8A88",
              },
              {
                title: "Net Content",
                description: "Mass accuracy testing verifies precise peptide content per vial.",
                color: "#C89A3C",
              },
              {
                title: "Batch Consistency",
                description: "Conformity vials ensure uniform quality across the entire production lot.",
                color: "#607A5C",
              },
              {
                title: "Endotoxins",
                description: "LAL testing detects bacterial endotoxins to ensure research safety.",
                color: "#A89020",
              },
              {
                title: "Heavy Metals",
                description: "ICP-MS screening detects trace heavy metal contamination across all batches.",
                color: "#8A7860",
              },
              {
                title: "Sterility",
                description: "Contamination-free verification ensures sample integrity for research applications.",
                color: "#3A7888",
              },
            ].map((test, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 + index * 0.1 }}
                style={{
                  backgroundColor: '#EBE2CF',
                  borderRadius: '12px',
                  borderTop: `4px solid ${test.color}`,
                  padding: '16px',
                  position: 'relative',
                }}
              >
                <h3
                  className="font-display text-ink mb-2"
                  style={{ fontSize: '16px', fontWeight: 300, fontStyle: 'italic' }}
                >
                  {test.title}
                </h3>
                <p
                  className="font-editorial text-ink"
                  style={{ fontSize: '13px', opacity: 0.7, lineHeight: 1.5 }}
                >
                  {test.description}
                </p>
              </motion.div>
            ))}

            {/* 8th Slot - Accent Tile */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 + 7 * 0.1 }}
              style={{
                backgroundColor: '#607A5C',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <div
                className="font-display"
                style={{
                  fontSize: '56px',
                  fontWeight: 300,
                  color: '#F5EFE4',
                  lineHeight: 1,
                  marginBottom: '8px',
                }}
              >
                7×
              </div>
              <div
                className="font-mono uppercase tracking-widest"
                style={{
                  fontSize: '11px',
                  color: '#F5EFE4',
                  opacity: 0.5,
                  letterSpacing: '0.15em',
                }}
              >
                TESTED
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* COA Library */}
      <div className="py-12 px-6 bg-bone">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.5 }}
            className="mb-8"
          >
            <h2 className="font-display text-3xl text-ink mb-3" style={{ fontWeight: 300 }}>
              Certificate Library
            </h2>
            <p className="font-editorial text-lg text-ink opacity-60 max-w-2xl">
              View and download the full certificate of analysis for every batch.
              All testing performed by independent third-party laboratories.
            </p>
          </motion.div>

          {/* COA Cards */}
          <div className="space-y-4">
            {PRODUCTS.map((product, index) => (
              <CoACard key={product.id} product={product} index={index} />
            ))}
          </div>

          {/* Testing Methodology Section - Ink Background */}
          <div className="mt-16 bg-ink py-20 px-10 -mx-6" style={{ borderRadius: "0" }}>
            <div className="container mx-auto max-w-7xl">
              {/* Section Eyebrow */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-center mb-12"
              >
                <h3
                  className="font-mono uppercase text-clay"
                  style={{ fontSize: "10px", letterSpacing: "3px" }}
                >
                  TESTING METHODOLOGY
                </h3>
              </motion.div>

              {/* Three Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                {/* Column 1: HPLC */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.0 }}
                  className="text-center px-8 py-6"
                  style={{
                    borderRight: "1px solid rgba(245,239,228,0.08)",
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    className="mx-auto mb-4"
                  >
                    <circle cx="20" cy="20" r="18" stroke="#B8624A" strokeWidth="2" fill="none" />
                    <line x1="20" y1="2" x2="20" y2="38" stroke="#B8624A" strokeWidth="2" />
                    <line x1="2" y1="20" x2="38" y2="20" stroke="#B8624A" strokeWidth="2" />
                  </svg>
                  <h4
                    className="font-mono uppercase text-cream mb-2"
                    style={{ fontSize: "11px", letterSpacing: "2px" }}
                  >
                    HPLC ANALYSIS
                  </h4>
                  <p
                    className="font-editorial text-cream"
                    style={{ fontSize: "14px", opacity: 0.65, lineHeight: 1.6 }}
                  >
                    High-performance liquid chromatography separates and quantifies each compound
                    against reference standards.
                  </p>
                </motion.div>

                {/* Column 2: Mass Spec */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.1 }}
                  className="text-center px-8 py-6"
                  style={{
                    borderRight: "1px solid rgba(245,239,228,0.08)",
                  }}
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    className="mx-auto mb-4"
                  >
                    <circle cx="20" cy="20" r="18" stroke="#B8624A" strokeWidth="2" fill="none" />
                    <line x1="10" y1="20" x2="30" y2="20" stroke="#B8624A" strokeWidth="2" />
                    <line x1="20" y1="10" x2="20" y2="30" stroke="#B8624A" strokeWidth="2" />
                  </svg>
                  <h4
                    className="font-mono uppercase text-cream mb-2"
                    style={{ fontSize: "11px", letterSpacing: "2px" }}
                  >
                    MASS SPECTROMETRY
                  </h4>
                  <p
                    className="font-editorial text-cream"
                    style={{ fontSize: "14px", opacity: 0.65, lineHeight: 1.6 }}
                  >
                    Molecular identity confirmed by exact mass measurement. Every lot. No
                    exceptions.
                  </p>
                </motion.div>

                {/* Column 3: Amino Acid */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="text-center px-8 py-6"
                >
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 40 40"
                    className="mx-auto mb-4"
                  >
                    <circle cx="20" cy="20" r="18" stroke="#B8624A" strokeWidth="2" fill="none" />
                    <circle cx="20" cy="20" r="10" stroke="#B8624A" strokeWidth="2" fill="none" />
                  </svg>
                  <h4
                    className="font-mono uppercase text-cream mb-2"
                    style={{ fontSize: "11px", letterSpacing: "2px" }}
                  >
                    AMINO ACID ANALYSIS
                  </h4>
                  <p
                    className="font-editorial text-cream"
                    style={{ fontSize: "14px", opacity: 0.65, lineHeight: 1.6 }}
                  >
                    Sequence verification confirms correct peptide structure from synthesis to
                    shipment.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-004</div>
    </div>
  );
}

function CoACard({ product, index }: { product: any; index: number }) {
  const cardRef = useRef(null);
  const isInView = useInView(cardRef, { once: true, margin: "-100px" });
  const categoryColors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Metabolic Research'];

  // Get lot number (use first lot for products with multiple variants)
  const lotNumber = product.batch || (product.lotNumbers ? product.lotNumbers[0] : '');

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ duration: 0.5, delay: index * 0.03 }}
      className="group"
    >
      <div
        className="overflow-hidden transition-all duration-300"
        style={{
          backgroundColor: '#EBE2CF',
          borderRadius: '10px',
          boxShadow: '0 2px 12px rgba(26,24,20,0.04)',
          borderTop: `3px solid ${categoryColors.accent}`,
        }}
      >
        <div className="p-6 flex flex-row items-center gap-6">
          {/* Left Column - Product Image */}
          <div className="flex-shrink-0 border-r border-[#EBE2CF] pr-6" style={{ width: '240px' }}>
            <Link href={`/products/${product.slug}`} className="block">
              <div className="flex items-center justify-center">
                <Image
                  src="/images/vial-transparent.png"
                  alt={product.name}
                  width={200}
                  height={260}
                  className="hover:scale-105 transition-transform duration-300"
                  style={{ objectFit: 'contain' }}
                />
              </div>
            </Link>
          </div>

          {/* Right Column - All existing content */}
          <div className="flex-1">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Header & Data */}
              <div className="lg:col-span-8">
                {/* Header */}
                <div className="mb-4">
                  <h3
                    className="font-display text-2xl text-ink mb-1"
                    style={{ fontWeight: 300, fontStyle: "italic" }}
                  >
                    {product.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-mono" style={{ color: '#607A5C' }}>
                    {product.category}
                  </p>
                </div>

                {/* Data Rows */}
                <div className="space-y-2">
                  {[
                    { label: "LOT", value: lotNumber },
                    { label: "REPORT", value: product.report },
                    { label: "CAS", value: product.casNumber },
                    { label: "IDENTITY", value: "CONFIRMED" },
                  ].map((row, i) => (
                    <div key={i} className="flex items-baseline justify-between">
                      <span className="font-mono uppercase tracking-mono text-ink opacity-50" style={{ fontSize: '10px' }}>
                        {row.label}
                      </span>
                      <div
                        className="flex-1 mx-2 border-b border-dotted"
                        style={{ borderColor: "rgba(26, 24, 20, 0.15)" }}
                      />
                      <span className="font-mono text-xs text-ink font-medium">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column - Purity */}
              <div className="lg:col-span-4 flex flex-col items-center justify-center">
                {/* Large Purity Percentage */}
                <div
                  className="text-center mb-2"
                  style={{ fontWeight: 300, fontSize: "40px", lineHeight: 1, color: '#C89A3C' }}
                >
                  {product.purity}
                </div>
                <div className="font-mono uppercase tracking-mono text-ink opacity-50 mb-3 text-center" style={{ fontSize: '9px', letterSpacing: '1.5px' }}>
                  {product.purity === 'USP Grade' ? 'USP GRADE' : 'PURITY · HPLC'}
                </div>

                {/* Purity Bar */}
                {product.purity !== 'USP Grade' && (
                  <div className="w-full bg-bone h-1.5 mb-4" style={{ borderRadius: "2px" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={isInView ? { width: product.purity } : { width: 0 }}
                      transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
                      className="h-full"
                      style={{ borderRadius: "2px", backgroundColor: '#C89A3C' }}
                    />
                  </div>
                )}

                {/* VERIFIED Badge - Compact */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                  className="flex items-center gap-2"
                >
                  <div
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      border: "2px solid #B8624A",
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#B8624A' }} />
                  </div>
                  <span className="font-mono uppercase tracking-mono text-clay font-medium" style={{ fontSize: '9px', letterSpacing: '1.2px' }}>
                    VERIFIED
                  </span>
                </motion.div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 mt-5 pt-5 border-t border-ink border-opacity-10">
              <Link
                href={`/products/${product.slug}`}
                className="px-3 py-1.5 hairline-border text-ink text-center font-mono uppercase tracking-mono hover:border-clay transition-colors active:scale-[0.97]"
                style={{ borderRadius: "6px", fontSize: '10px' }}
              >
                VIEW LOT
              </Link>
              <button
                className="px-3 py-1.5 bg-clay text-cream font-mono uppercase tracking-mono hover:bg-opacity-90 transition-all active:scale-[0.97] flex items-center gap-1.5"
                style={{ borderRadius: "6px", fontSize: '10px' }}
              >
                ↓ DOWNLOAD PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
