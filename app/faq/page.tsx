"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Link from "next/link";

interface FAQ {
  question: string;
  answer: string;
}

interface FAQCategory {
  id: string;
  title: string;
  color: string;
  faqs: FAQ[];
}

// Accent colors per category — avoids any bg-cream/text-cream contrast collapse
const categoryAccent: Record<string, string> = {
  "research-use":    "#B8624A",
  "quality-testing": "#C89A3C",
  "ordering":        "#B8624A",
  "shipping":        "#607A5C",
  "storage":         "#C89A3C",
  "products":        "#607A5C",
};

const faqCategories: FAQCategory[] = [
  {
    id: "research-use",
    title: "Research Use",
    color: "bg-clay",
    faqs: [
      {
        question: "Are these products legal to purchase?",
        answer:
          "Research peptides are legal to purchase for qualified researchers and institutions conducting legitimate scientific research. These products are NOT approved for human consumption or veterinary use. Buyers must be 21+ years old and agree that products will be used solely for in vitro research purposes in compliance with all applicable laws and regulations.",
      },
      {
        question: "Can I use these peptides for personal health purposes?",
        answer:
          "No. These products are manufactured and sold EXCLUSIVELY for in vitro research and laboratory use. They are not intended, approved, or safe for human consumption, self-administration, clinical use, or any therapeutic applications. Using research chemicals for personal health purposes is dangerous, illegal, and strictly prohibited.",
      },
      {
        question: "What qualifies someone to purchase research peptides?",
        answer:
          "Purchasers must be affiliated with a qualified research institution, university, laboratory, or company conducting legitimate scientific research. We may request documentation of research credentials, institutional affiliation, or intended use. All buyers must be 21+ years old and agree to use products only for in vitro research purposes.",
      },
      {
        question: "What happens if I misuse products or violate the research-only policy?",
        answer:
          "Misuse of research chemicals is a serious matter with potential legal, health, and safety consequences. We reserve the right to refuse service to anyone suspected of purchasing for non-research purposes. Violations may be reported to appropriate authorities. We take our responsibility to the research community seriously and expect buyers to do the same.",
      },
    ],
  },
  {
    id: "quality-testing",
    title: "Quality & Testing",
    color: "bg-ochre",
    faqs: [
      {
        question: "What purity level can I expect from your peptides?",
        answer:
          "All Lumo peptides are manufactured to exceed 98% purity as verified by HPLC analysis. Most products achieve 98.5-99.5% purity. Each batch includes a Certificate of Analysis from an independent third-party laboratory confirming exact purity levels, along with mass spectrometry and amino acid analysis data.",
      },
      {
        question: "What is included in the Certificate of Analysis?",
        answer:
          "Every CoA includes: HPLC chromatogram showing purity percentage, mass spectrometry data confirming molecular weight and structure, amino acid analysis validating sequence composition, batch and report numbers for traceability, storage recommendations, and the independent lab's certification. CoAs are available for download on each product page.",
      },
      {
        question: "How are your peptides manufactured?",
        answer:
          "Our peptides are synthesized using solid-phase peptide synthesis (SPPS) in ISO-certified facilities. After synthesis, each batch undergoes multiple purification cycles using preparative HPLC, lyophilization, and sterile packaging under inert gas. All manufacturing follows Good Manufacturing Practices (GMP) for research-grade compounds.",
      },
      {
        question: "Do you provide additional analytical testing?",
        answer:
          "Each product includes a standard CoA with HPLC, MS, and AAA data. If your research requires additional testing (NMR, endotoxin testing, sterility testing, etc.), please contact us to discuss custom testing options. Additional fees may apply for supplementary analytical work.",
      },
      {
        question: "How do I interpret the data on my Certificate of Analysis?",
        answer:
          "Our technical team can help you understand your CoA data. Key elements include: HPLC purity percentage (area under curve), mass spec molecular weight confirmation (should match theoretical MW ±1 Da), and amino acid ratios (should match expected sequence composition). Contact us if you need assistance interpreting any analytical data.",
      },
    ],
  },
  {
    id: "ordering",
    title: "Ordering",
    color: "bg-ink",
    faqs: [
      {
        question: "What payment methods do you accept?",
        answer:
          "We accept cryptocurrency payments including Bitcoin (BTC), Ethereum (ETH), USDT (TRC-20), USDC (ERC-20), and Litecoin (LTC). Crypto payments provide secure, private transactions processed through NOWPayments. Payment instructions are provided during checkout, and orders are processed immediately upon blockchain confirmation.",
      },
      {
        question: "How long does order processing take?",
        answer:
          "Orders are typically processed within 1-2 business days after payment confirmation. Cryptocurrency payments are confirmed automatically through the blockchain, usually within 10-60 minutes depending on network congestion. You'll receive tracking information via email once your order ships.",
      },
      {
        question: "Do you offer bulk or institutional pricing?",
        answer:
          "Yes, we offer volume discounts for bulk orders and can provide institutional accounts with NET payment terms for qualified organizations. Please contact support@lumopep.com with your institution details and research requirements for a custom quote.",
      },
      {
        question: "What is your return or refund policy?",
        answer:
          "Due to the nature of research chemicals, we cannot accept returns of opened products. If you receive a damaged shipment or product that does not meet CoA specifications, please contact us within 48 hours of delivery with photos. We will replace the product or issue a full refund. Our quality guarantee ensures every product meets stated purity standards.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping",
    color: "bg-sage",
    faqs: [
      {
        question: "How are products shipped?",
        answer:
          "All peptides are shipped in secure packaging. Packages are discreetly labeled with no indication of contents. We use expedited shipping services (2-5 business days) to ensure prompt delivery.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we ship to select countries where research peptide importation is legal and properly regulated. International orders may require additional documentation confirming research institution affiliation and intended use. Please contact us before ordering to confirm we can ship to your location.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive an email with tracking information. You can monitor your shipment's progress through the carrier's website. If you have questions about your order status, contact support@lumopep.com with your order number.",
      },
      {
        question: "What if my package is delayed or damaged?",
        answer:
          "If your tracking shows unexpected delays or if you receive a damaged package, contact us immediately at support@lumopep.com. We'll work with the carrier to resolve shipping issues and will reship your order if necessary. All shipments are fully insured.",
      },
    ],
  },
  {
    id: "storage",
    title: "Storage",
    color: "bg-cream",
    faqs: [
      {
        question: "What is the shelf life of your products?",
        answer:
          "When stored properly in lyophilized (powder) form at -20°C to -80°C, most peptides remain stable for 2-3 years. Once reconstituted, peptides should be used within 28 days when stored at 2-8°C, or can be aliquoted and frozen at -20°C for extended storage. Specific storage guidelines are provided with each product and on the CoA.",
      },
      {
        question: "How should I reconstitute lyophilized peptides?",
        answer:
          "Use sterile bacteriostatic water or sterile water for injection. Calculate the desired concentration based on your research protocol. Add the solvent slowly down the side of the vial, then gently swirl (do not shake vigorously) until fully dissolved. Some peptides may require brief refrigeration to fully dissolve. Specific reconstitution guidelines are provided with each product.",
      },
      {
        question: "What storage conditions are required?",
        answer:
          "Lyophilized peptides should be stored at -20°C to -80°C in the original sealed vial, protected from light and moisture. Reconstituted peptides should be stored at 2-8°C for short-term use (up to 28 days) or frozen at -20°C in aliquots for long-term storage. Avoid repeated freeze-thaw cycles. Detailed storage requirements are included on each product's CoA.",
      },
    ],
  },
  {
    id: "products",
    title: "Products",
    color: "bg-clay",
    faqs: [
      {
        question: "Can you help me select the right peptide for my research?",
        answer:
          "Yes. Our technical support team can provide guidance on peptide selection based on your research objectives. We can discuss properties, applications, and relevant published research. However, we cannot provide medical advice or recommendations for non-research uses. Contact support@lumopep.com with details about your research project.",
      },
      {
        question: "Can I request a custom peptide synthesis?",
        answer:
          "We specialize in our catalog products but can discuss custom synthesis projects for qualified research institutions. Custom synthesis requires detailed specifications, intended research use documentation, and typically has minimum order quantities. Contact support@lumopep.com to discuss custom projects.",
      },
      {
        question: "Are your products FDA approved?",
        answer:
          "No. Our research peptides are NOT FDA-approved drugs and are not intended for human or veterinary use. They are manufactured as research chemicals for laboratory and analytical applications only. FDA approval is not required for research-grade chemical compounds sold exclusively for scientific investigation.",
      },
      {
        question: "What regulations govern research peptide sales?",
        answer:
          "Research peptides fall under chemical substance regulations rather than pharmaceutical regulations. Sellers must accurately label products, provide analytical documentation (CoA), and ensure sales are made only for legitimate research purposes. Buyers must comply with institutional biosafety protocols, DEA regulations (if applicable), and local laws governing laboratory chemicals.",
      },
    ],
  },
];

export default function FAQPage() {
  const [activeCategory, setActiveCategory] = useState("research-use");
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });

  const currentCategory =
    faqCategories.find((cat) => cat.id === activeCategory) || faqCategories[0];
  const accent = categoryAccent[activeCategory] || "#B8624A";

  return (
    <div style={{ minHeight: "100vh" }}>

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section ref={heroRef} style={{ backgroundColor: "#B8624A", padding: "96px 24px 80px" }}>
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "3px", color: "#EBE2CF", opacity: 0.7, marginBottom: "20px" }}
          >
            05.1 — FAQ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="font-display"
            style={{
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(2.4rem, 5vw, 4rem)",
              color: "#EBE2CF",
              letterSpacing: "-0.025em",
              lineHeight: 1.1,
              marginBottom: "20px",
            }}
          >
            Questions, answered plainly.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 0.8 } : {}}
            transition={{ duration: 0.55, delay: 0.3 }}
            className="font-editorial"
            style={{ fontSize: "1.05rem", color: "#EBE2CF", maxWidth: "480px" }}
          >
            Clear answers about our compounds, quality standards, and research protocols.
          </motion.p>
        </div>
      </section>

      {/* ── MAIN CONTENT ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#F5EFE4", padding: "64px 24px 96px" }}>
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* ── SIDEBAR ──────────────────────────────────── */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">

                <div
                  className="font-mono uppercase"
                  style={{ fontSize: "9px", letterSpacing: "3px", color: "#1A1814", opacity: 0.4, marginBottom: "12px" }}
                >
                  CATEGORIES
                </div>

                <nav style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
                  {faqCategories.map((category, index) => {
                    const isActive = activeCategory === category.id;
                    const catAccent = categoryAccent[category.id] || "#B8624A";
                    return (
                      <motion.button
                        key={category.id}
                        initial={{ opacity: 0, x: -12 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.07 }}
                        onClick={() => {
                          setActiveCategory(category.id);
                          setOpenIndex(0);
                        }}
                        className="w-full text-left"
                        style={{
                          padding: "11px 14px",
                          backgroundColor: isActive ? "#1A1814" : "transparent",
                          border: "1px solid",
                          borderColor: isActive ? "#1A1814" : "rgba(26,24,20,0.12)",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          transition: "all 0.15s",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "6px",
                            color: isActive ? catAccent : "transparent",
                            flexShrink: 0,
                          }}
                        >
                          ●
                        </span>
                        <span
                          className="font-mono uppercase flex-1 text-left"
                          style={{
                            fontSize: "10px",
                            letterSpacing: "1.5px",
                            color: isActive ? "#EBE2CF" : "#1A1814",
                            opacity: isActive ? 1 : 0.6,
                          }}
                        >
                          {category.title}
                        </span>
                        <span
                          className="font-mono"
                          style={{
                            fontSize: "9px",
                            color: isActive ? "rgba(235,226,207,0.4)" : "rgba(26,24,20,0.3)",
                          }}
                        >
                          {category.faqs.length}
                        </span>
                      </motion.button>
                    );
                  })}
                </nav>

                {/* Contact note */}
                <div
                  style={{
                    borderTop: "1px solid rgba(26,24,20,0.1)",
                    marginTop: "28px",
                    paddingTop: "22px",
                  }}
                >
                  <p
                    className="font-editorial"
                    style={{ fontSize: "12px", color: "#1A1814", opacity: 0.5, marginBottom: "6px", lineHeight: 1.5 }}
                  >
                    Can't find what you need?
                  </p>
                  <a
                    href="mailto:support@lumopep.com"
                    className="font-mono uppercase"
                    style={{ fontSize: "9px", letterSpacing: "1.5px", color: "#B8624A" }}
                  >
                    → Contact support
                  </a>
                </div>
              </div>
            </div>

            {/* ── ACCORDION PANEL ──────────────────────────── */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -14 }}
                  transition={{ duration: 0.22 }}
                >
                  {/* Category header — always Ink bg, accent left border */}
                  <div
                    style={{
                      backgroundColor: "#1A1814",
                      borderLeft: `4px solid ${accent}`,
                      padding: "28px 32px",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      className="font-mono uppercase"
                      style={{
                        fontSize: "9px",
                        letterSpacing: "3px",
                        color: accent,
                        marginBottom: "10px",
                      }}
                    >
                      ● {currentCategory.faqs.length}{" "}
                      {currentCategory.faqs.length === 1 ? "QUESTION" : "QUESTIONS"}
                    </div>
                    <h2
                      className="font-display"
                      style={{
                        fontWeight: 300,
                        fontStyle: "italic",
                        fontSize: "clamp(1.8rem, 3vw, 2.75rem)",
                        color: "#EBE2CF",
                        letterSpacing: "-0.02em",
                        lineHeight: 1.1,
                      }}
                    >
                      {currentCategory.title}
                    </h2>
                  </div>

                  {/* Accordion items */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                    {currentCategory.faqs.map((faq, index) => {
                      const isOpen = openIndex === index;
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04 }}
                          style={{
                            backgroundColor: isOpen ? "#F5EFE4" : "#EBE2CF",
                            borderTop: "1px solid rgba(26,24,20,0.1)",
                            borderRight: "1px solid rgba(26,24,20,0.1)",
                            borderBottom: "1px solid rgba(26,24,20,0.1)",
                            borderLeft: isOpen
                              ? `3px solid ${accent}`
                              : "1px solid rgba(26,24,20,0.1)",
                            overflow: "hidden",
                          }}
                        >
                          <button
                            onClick={() => setOpenIndex(isOpen ? null : index)}
                            className="w-full text-left"
                            style={{
                              padding: "20px 24px",
                              display: "flex",
                              alignItems: "flex-start",
                              gap: "16px",
                            }}
                          >
                            {/* Question number */}
                            <span
                              className="font-mono flex-shrink-0"
                              style={{
                                fontSize: "9px",
                                letterSpacing: "1px",
                                color: isOpen ? accent : "rgba(26,24,20,0.3)",
                                marginTop: "3px",
                                minWidth: "22px",
                              }}
                            >
                              {String(index + 1).padStart(2, "0")}
                            </span>

                            {/* Question text */}
                            <span
                              className="font-editorial flex-1"
                              style={{
                                fontSize: "15px",
                                color: "#1A1814",
                                lineHeight: 1.35,
                                fontWeight: isOpen ? 400 : 300,
                              }}
                            >
                              {faq.question}
                            </span>

                            {/* Expand icon */}
                            <motion.span
                              animate={{ rotate: isOpen ? 45 : 0 }}
                              transition={{ duration: 0.2 }}
                              style={{
                                fontSize: "22px",
                                color: isOpen ? accent : "rgba(26,24,20,0.35)",
                                flexShrink: 0,
                                lineHeight: 1,
                                fontWeight: 300,
                                marginTop: "-1px",
                              }}
                            >
                              +
                            </motion.span>
                          </button>

                          <AnimatePresence>
                            {isOpen && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.28 }}
                                style={{ overflow: "hidden" }}
                              >
                                <div
                                  style={{
                                    padding: "0 24px 24px",
                                    paddingLeft: "62px",
                                  }}
                                >
                                  <div
                                    style={{
                                      borderTop: "1px solid rgba(26,24,20,0.1)",
                                      paddingTop: "16px",
                                    }}
                                  >
                                    <p
                                      className="font-editorial leading-relaxed"
                                      style={{
                                        fontSize: "14px",
                                        color: "#1A1814",
                                        opacity: 0.72,
                                        lineHeight: 1.65,
                                      }}
                                    >
                                      {faq.answer}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST FOOTER ─────────────────────────────────────── */}
      <section style={{ backgroundColor: "#1A1814", padding: "80px 24px" }}>
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            style={{ color: "#B8624A", fontSize: "1.6rem", marginBottom: "24px" }}
          >
            ●
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="font-display"
            style={{
              fontWeight: 300,
              fontStyle: "italic",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              color: "#EBE2CF",
              letterSpacing: "-0.02em",
              marginBottom: "18px",
            }}
          >
            Still have questions?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.75 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.15 }}
            className="font-editorial"
            style={{
              fontSize: "1.05rem",
              color: "#EBE2CF",
              maxWidth: "480px",
              margin: "0 auto 36px",
              lineHeight: 1.6,
            }}
          >
            Our technical support team is here to help with your research requirements.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.3 }}
          >
            <a
              href="mailto:support@lumopep.com"
              className="inline-block font-mono uppercase transition-all"
              style={{
                padding: "14px 36px",
                backgroundColor: "#EBE2CF",
                color: "#1A1814",
                fontSize: "10px",
                letterSpacing: "3px",
              }}
            >
              CONTACT SUPPORT
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.4 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.5 }}
            className="font-mono"
            style={{
              fontSize: "10px",
              letterSpacing: "1px",
              color: "#EBE2CF",
              marginTop: "28px",
            }}
          >
            Response time: 24–48 hours · support@lumopep.com
          </motion.p>
        </div>
      </section>

      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-006</div>
    </div>
  );
}
