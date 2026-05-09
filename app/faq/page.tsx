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
          "Yes, we offer volume discounts for bulk orders and can provide institutional accounts with NET payment terms for qualified organizations. Please contact support@lumopeptides.com with your institution details and research requirements for a custom quote.",
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
          "All peptides are shipped in insulated packaging with gel ice packs to maintain temperature stability during transit. Packages are discreetly labeled with no indication of contents. We use expedited shipping services (2-5 business days) to minimize transit time and ensure product integrity.",
      },
      {
        question: "Do you ship internationally?",
        answer:
          "Currently, we ship to select countries where research peptide importation is legal and properly regulated. International orders may require additional documentation confirming research institution affiliation and intended use. Please contact us before ordering to confirm we can ship to your location.",
      },
      {
        question: "How can I track my order?",
        answer:
          "Once your order ships, you'll receive an email with tracking information. You can monitor your shipment's progress through the carrier's website. If you have questions about your order status, contact support@lumopeptides.com with your order number.",
      },
      {
        question: "What if my package is delayed or damaged?",
        answer:
          "If your tracking shows unexpected delays or if you receive a damaged package, contact us immediately at support@lumopeptides.com. We'll work with the carrier to resolve shipping issues and will reship your order if necessary. All shipments are fully insured.",
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
          "Yes. Our technical support team can provide guidance on peptide selection based on your research objectives. We can discuss properties, applications, and relevant published research. However, we cannot provide medical advice or recommendations for non-research uses. Contact support@lumopeptides.com with details about your research project.",
      },
      {
        question: "Can I request a custom peptide synthesis?",
        answer:
          "We specialize in our catalog products but can discuss custom synthesis projects for qualified research institutions. Custom synthesis requires detailed specifications, intended research use documentation, and typically has minimum order quantities. Contact support@lumopeptides.com to discuss custom projects.",
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

  return (
    <div className="min-h-screen">
      {/* HERO SECTION - Clay Background */}
      <section ref={heroRef} className="bg-clay py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-mono text-cream opacity-80 mb-6"
          >
            05.1 — FAQ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-5xl md:text-6xl text-cream mb-8 leading-tight"
            style={{ fontWeight: 300, fontStyle: "italic" }}
          >
            Questions, answered plainly.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 0.9 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-editorial text-lg text-cream max-w-2xl mx-auto"
          >
            Clear answers about our compounds, quality standards, and research protocols.
          </motion.p>
        </div>
      </section>

      {/* TWO-COLUMN LAYOUT */}
      <section className="bg-bone py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* LEFT SIDEBAR - Sticky Category Navigation */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24">
                <h2 className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-6">
                  CATEGORIES
                </h2>
                <nav className="space-y-2">
                  {faqCategories.map((category, index) => (
                    <motion.button
                      key={category.id}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => {
                        setActiveCategory(category.id);
                        setOpenIndex(0);
                      }}
                      className={`w-full text-left px-4 py-3 font-mono text-xs uppercase tracking-mono transition-all ${
                        activeCategory === category.id
                          ? "bg-ink text-cream"
                          : "text-ink opacity-60 hover:opacity-100 hover:bg-white"
                      }`}
                      style={{ borderRadius: "8px" }}
                    >
                      {activeCategory === category.id && (
                        <span className="text-ochre mr-2">●</span>
                      )}
                      {category.title}
                    </motion.button>
                  ))}
                </nav>
              </div>
            </div>

            {/* RIGHT MAIN - Accordion Questions */}
            <div className="lg:col-span-9">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Category Header with Color */}
                  <div
                    className={`${currentCategory.color} p-8 mb-8`}
                    style={{ borderRadius: "16px" }}
                  >
                    <h2
                      className="font-display text-4xl md:text-5xl text-cream mb-3 leading-tight"
                      style={{ fontWeight: 300, fontStyle: "italic" }}
                    >
                      {currentCategory.title}
                    </h2>
                    <p className="font-mono text-xs uppercase tracking-mono text-cream opacity-80">
                      {currentCategory.faqs.length} questions
                    </p>
                  </div>

                  {/* Accordion Questions */}
                  <div className="space-y-4">
                    {currentCategory.faqs.map((faq, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="bg-white hairline-border overflow-hidden hover:border-clay transition-all"
                        style={{ borderRadius: "12px" }}
                      >
                        <button
                          onClick={() => setOpenIndex(openIndex === index ? null : index)}
                          className="w-full flex items-start justify-between p-6 text-left group"
                        >
                          <span className="font-mono text-xs uppercase tracking-mono text-ink font-medium pr-6 flex-1">
                            {faq.question}
                          </span>
                          <motion.span
                            animate={{ rotate: openIndex === index ? 45 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="text-clay text-2xl flex-shrink-0 group-hover:text-ochre transition-colors"
                          >
                            +
                          </motion.span>
                        </button>

                        <AnimatePresence>
                          {openIndex === index && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3 }}
                              className="overflow-hidden"
                            >
                              <div className="px-6 pb-6">
                                <div className="border-t hairline-border pt-4">
                                  <p className="font-editorial text-sm text-ink opacity-80 leading-relaxed">
                                    {faq.answer}
                                  </p>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </section>

      {/* TRUST FOOTER - Ink Background */}
      <section className="bg-ink py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-clay text-4xl mb-6"
          >
            ●
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl text-cream mb-6 leading-tight"
            style={{ fontWeight: 300, fontStyle: "italic" }}
          >
            Still have questions?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-editorial text-lg text-cream mb-8 max-w-2xl mx-auto"
          >
            Our technical support team is here to help with your research requirements.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <a
              href="mailto:support@lumopeptides.com"
              className="inline-block px-8 py-4 bg-cream text-ink font-mono text-xs uppercase tracking-mono hover:bg-ochre hover:text-cream transition-colors"
              style={{ borderRadius: "8px" }}
            >
              CONTACT SUPPORT
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="font-mono text-xs text-cream opacity-60 mt-8"
          >
            Response time: 24-48 hours · support@lumopeptides.com
          </motion.p>
        </div>
      </section>

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-006</div>
    </div>
  );
}
