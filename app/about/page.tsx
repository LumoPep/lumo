"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function AboutPage() {
  const missionRef = useRef(null);
  const whoWeServeRef = useRef(null);
  const valuesRef = useRef(null);
  const processRef = useRef(null);

  const missionInView = useInView(missionRef, { once: true, margin: "-100px" });
  const whoWeServeInView = useInView(whoWeServeRef, { once: true, margin: "-100px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });

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
      {/* HERO SECTION - Clay Background with Image Overlay */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
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

      {/* MISSION SECTION - Ink Background */}
      <section ref={missionRef} className="bg-ink py-24 px-6">
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
            className="font-display text-4xl md:text-5xl text-cream mb-8 leading-tight"
            style={{ fontWeight: 300, fontStyle: "italic" }}
          >
            Show the work.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={missionInView ? { opacity: 0.9 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-editorial text-lg text-cream leading-relaxed max-w-2xl mx-auto"
          >
            Every vial ships with a third-party certificate of analysis. Every lot is traceable. Every claim is footnoted. The brand is the receipt.
          </motion.p>
        </div>
      </section>

      {/* WHO WE SERVE SECTION - Bone Background */}
      <section ref={whoWeServeRef} className="bg-bone py-24 px-6">
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
            {/* Card 1 - Clay */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(26,24,20,0.16)" }}
              className="bg-clay p-8"
              style={{ borderRadius: "20px" }}
            >
              <div className="font-mono text-xs uppercase tracking-mono text-cream opacity-70 mb-4">
                AUDIENCE 01
              </div>
              <h3
                className="font-display text-3xl text-cream mb-4 leading-tight"
                style={{ fontWeight: 300, fontStyle: "italic" }}
              >
                The self-directed optimizer.
              </h3>
              <p className="font-editorial text-sm text-cream opacity-90 leading-relaxed">
                Men 25-45, fitness, recovery, longevity. They read studies. They run their own bloodwork.
              </p>
            </motion.div>

            {/* Card 2 - Bone */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(26,24,20,0.16)" }}
              className="bg-white p-8 hairline-border"
              style={{ borderRadius: "20px" }}
            >
              <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-4">
                AUDIENCE 02
              </div>
              <h3
                className="font-display text-3xl text-ink mb-4 leading-tight"
                style={{ fontWeight: 300, fontStyle: "italic" }}
              >
                The priced-out patient.
              </h3>
              <p className="font-editorial text-sm text-ink opacity-80 leading-relaxed">
                Weight-loss seekers, longevity-curious newcomers, women from cosmetic peptide research.
              </p>
            </motion.div>

            {/* Card 3 - Sage */}
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(26,24,20,0.16)" }}
              className="bg-sage p-8"
              style={{ borderRadius: "20px" }}
            >
              <div className="font-mono text-xs uppercase tracking-mono text-cream opacity-70 mb-4">
                AUDIENCE 03
              </div>
              <h3
                className="font-display text-3xl text-cream mb-4 leading-tight"
                style={{ fontWeight: 300, fontStyle: "italic" }}
              >
                The small clinic wholesaler.
              </h3>
              <p className="font-editorial text-sm text-cream opacity-90 leading-relaxed">
                Med spas and wellness clinics needing a supplier with paperwork they can defend.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* VALUES SECTION - Cream Background */}
      <section ref={valuesRef} className="bg-cream py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="font-mono text-xs uppercase tracking-mono text-clay mb-3">
              01.3 — CORE VALUES
            </div>
            <h2 className="font-display text-4xl text-ink" style={{ fontWeight: 300 }}>
              What we stand for.
            </h2>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {[
              {
                number: "01",
                title: "Independent Verification",
                description: "Every batch tested by third-party laboratories. No in-house testing conflicts.",
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
                description: "Cryptocurrency accepted. Privacy-focused. No sensitive data stored.",
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
                whileHover={{ y: -4, boxShadow: "0 8px 24px rgba(26,24,20,0.08)" }}
                className="bg-white p-6"
                style={{ borderRadius: "16px", boxShadow: "0 4px 16px rgba(26,24,20,0.04)" }}
              >
                <div
                  className="font-display text-7xl text-clay mb-4 leading-none"
                  style={{ fontWeight: 300 }}
                >
                  {value.number}
                </div>
                <h3
                  className="font-display text-xl text-ink mb-3"
                  style={{ fontWeight: 300 }}
                >
                  {value.title}
                </h3>
                <p className="font-editorial text-sm text-ink opacity-70 leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* PROCESS SECTION - Ink Background */}
      <section ref={processRef} className="bg-ink py-24 px-6">
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
            >
              {[
                {
                  number: "01",
                  title: "Synthesis",
                  description: "Solid-phase peptide synthesis in ISO-certified facilities.",
                },
                {
                  number: "02",
                  title: "Third-Party Testing",
                  description: "Independent lab verification: HPLC, MS, amino acid analysis.",
                },
                {
                  number: "03",
                  title: "Review & Approval",
                  description: "CoA review, batch approval, lot number assignment.",
                },
                {
                  number: "04",
                  title: "Ship & Document",
                  description: "Cold-chain packaging, tracking, CoA included in shipment.",
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
                  <p className="font-editorial text-sm text-cream opacity-70 leading-relaxed">
                    {step.description}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* RUO STATEMENT SECTION - Bone Background */}
      <section className="bg-bone py-24 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl text-ink mb-12 text-center leading-tight"
            style={{ fontWeight: 300, fontStyle: "italic" }}
          >
            The quiet case for rigor.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="border-l-4 border-clay pl-6 mb-12"
          >
            <p className="font-editorial text-lg text-ink opacity-80 leading-relaxed mb-4">
              All compounds sold by Lumo are intended strictly for in vitro research and laboratory use only. These products are NOT intended for human consumption, medical, veterinary, or household use.
            </p>
            <p className="font-editorial text-lg text-ink opacity-80 leading-relaxed mb-4">
              By purchasing from Lumo, you acknowledge that you are a qualified researcher or institution and will use these products solely for research purposes in compliance with all applicable laws and regulations.
            </p>
            <p className="font-editorial text-lg text-ink opacity-80 leading-relaxed">
              All buyers must be 21 years of age or older. We maintain strict age verification and research-use-only policies to ensure legal compliance and scientific integrity.
            </p>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3"
          >
            {["THIRD-PARTY TESTED", "LOT TRACEABLE", "COLD-CHAIN VERIFIED"].map(
              (badge, index) => (
                <div
                  key={index}
                  className="px-4 py-2 bg-clay text-cream font-mono text-xs uppercase tracking-mono"
                  style={{ borderRadius: "20px" }}
                >
                  {badge}
                </div>
              )
            )}
          </motion.div>
        </div>
      </section>

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-005</div>
    </div>
  );
}
