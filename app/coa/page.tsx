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

          {/* Right Half - Bone Background with Vial */}
          <div className="bg-bone py-16 md:py-24 px-6 flex flex-col items-center justify-center relative">
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

            {/* Vial Image - Bottom Right */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              style={{
                position: 'absolute',
                bottom: '20px',
                right: '20px',
              }}
            >
              <Image
                src='/images/vial-transparent.png'
                alt='Research Vial'
                width={200}
                height={240}
                style={{ objectFit: 'contain', filter: 'drop-shadow(0 20px 40px rgba(26,24,20,0.2))' }}
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="bg-ink py-6 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-x-0 md:divide-x divide-cream divide-opacity-20">
            {[
              "10 COMPOUNDS",
              "100% BATCH TESTED",
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

      {/* COA Library */}
      <div className="py-12 px-6 bg-bone">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mb-8"
          >
            <p className="font-editorial text-xl text-ink opacity-60 max-w-2xl">
              Every batch verified by HPLC, mass spectrometry, and comprehensive chemical analysis.
              All testing performed by independent third-party laboratories.
            </p>
          </motion.div>

          {/* COA Cards */}
          <div className="space-y-6">
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
  const isEven = index % 2 === 0;
  const categoryColor = CATEGORY_COLORS[product.category] || "#B8624A";

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration: 0.6, delay: index * 0.05 }}
      className="group"
    >
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isEven ? "bg-white" : "bg-cream"
        } hover:border-l-clay`}
        style={{
          borderRadius: "12px",
          boxShadow: "0 4px 24px rgba(26,24,20,0.06)",
          borderTop: `4px solid ${categoryColor}`,
          borderLeft: "4px solid transparent",
        }}
      >
        <div className="p-8">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3
                className="font-display text-3xl text-ink mb-2"
                style={{ fontWeight: 300, fontStyle: "italic" }}
              >
                {product.name}
              </h3>
              <p className="font-editorial text-sm text-ink opacity-60">{product.category}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column - Data */}
            <div className="lg:col-span-7">
              {/* Data Rows */}
              <div className="space-y-3 mb-6">
                {[
                  { label: "LOT NUMBER", value: product.batch },
                  { label: "REPORT NO.", value: product.report },
                  { label: "CAS NUMBER", value: product.casNumber },
                  { label: "IDENTITY (MS)", value: "CONFIRMED" },
                ].map((row, i) => (
                  <div key={i} className="flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                      {row.label}
                    </span>
                    <div
                      className="flex-1 mx-3 border-b border-dotted"
                      style={{ borderColor: "rgba(26, 24, 20, 0.15)" }}
                    />
                    <span className="font-mono text-xs text-ink font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              {/* Testing Methods */}
              <div className="flex items-center space-x-4 font-mono text-xs text-ink opacity-40">
                <span>· HPLC</span>
                <span>· MS</span>
                <span>· AAA</span>
              </div>
            </div>

            {/* Right Column - Purity */}
            <div className="lg:col-span-5 flex flex-col items-center justify-center">
              {/* Large Purity Percentage */}
              <div
                className="font-display text-ochre text-center mb-3"
                style={{ fontWeight: 300, fontSize: "48px", lineHeight: 1 }}
              >
                {product.purity}
              </div>
              <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-4 text-center">
                {product.purity === 'USP Grade' ? 'USP GRADE · STERILE · BACTERIOSTATIC' : 'PURITY · HPLC · INDEPENDENT LAB'}
              </div>

              {/* Purity Bar */}
              {product.purity !== 'USP Grade' && (
                <div className="w-full bg-bone h-2 mb-6" style={{ borderRadius: "2px" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={isInView ? { width: product.purity } : { width: 0 }}
                    transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                    className="h-full bg-ochre"
                    style={{ borderRadius: "2px" }}
                  />
                </div>
              )}

              {/* VERIFIED Stamp - Large and Prominent */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -10 }}
                animate={
                  isInView
                    ? { opacity: 1, scale: 1, rotate: 0 }
                    : { opacity: 0, scale: 0, rotate: -10 }
                }
                transition={{ duration: 0.5, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                className="flex flex-col items-center"
              >
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "3px solid #B8624A",
                  }}
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="4" fill="#B8624A" />
                  </svg>
                </div>
                <div className="font-mono text-xs uppercase tracking-mono text-clay font-medium mt-2 text-center leading-tight">
                  3RD-PARTY<br />VERIFIED
                </div>
              </motion.div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-ink border-opacity-10">
            <Link
              href={`/products/${product.slug}`}
              className="px-4 py-2 hairline-border text-ink text-center font-mono text-xs uppercase tracking-mono hover:border-clay transition-colors active:scale-[0.97]"
              style={{ borderRadius: "6px" }}
            >
              VIEW LOT
            </Link>
            <button
              className="px-4 py-2 bg-clay text-cream font-mono text-xs uppercase tracking-mono hover:bg-opacity-90 transition-all active:scale-[0.97] flex items-center gap-2"
              style={{ borderRadius: "6px" }}
            >
              ↓ DOWNLOAD COA PDF
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
