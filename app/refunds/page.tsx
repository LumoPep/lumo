"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const sections = [
  {
    id: "overview",
    number: "01",
    title: "Refund Policy Overview",
    content: [
      "Due to the nature of research chemicals and peptides, Lumo maintains a strict no-refund policy on all opened or used products. This is an industry-standard practice for research chemical suppliers.",
      "Research peptides are sensitive biological compounds that require specific storage and handling conditions. Once a product leaves our facility, we cannot verify its integrity or storage conditions, making returns and refunds unsafe and impractical.",
    ],
  },
  {
    id: "no-refunds",
    number: "02",
    title: "No Refunds on Research Compounds",
    content: [
      "All sales of research peptides and compounds are final. We cannot accept returns or issue refunds for: Products that have been opened or unsealed; Products that have been used or reconstituted; Products that have left our facility, unless damaged in transit; Change of mind purchases; Products stored improperly after delivery.",
      "By completing a purchase, you acknowledge and accept this no-refund policy for research chemical compounds.",
    ],
  },
  {
    id: "damaged",
    number: "03",
    title: "Damaged or Lost Shipments",
    content: [
      "If your shipment arrives damaged, compromised, or shows signs of temperature exposure during transit, we will replace the product or issue a full refund.",
      "You must contact us within 48 hours of delivery with: Photos of the damaged packaging; Photos of the product condition; Your order number; Description of the damage.",
      "We will review your claim and, if approved, reship the product at no additional cost or issue a full refund to your original payment method.",
    ],
  },
  {
    id: "quality",
    number: "04",
    title: "Quality Guarantee",
    content: [
      "Every product ships with a Certificate of Analysis (CoA) from an independent third-party laboratory confirming purity and specifications.",
      "If a product does not meet the specifications stated on its CoA: Contact us within 7 days of delivery; Provide your order number and lot number; Describe the discrepancy.",
      "We will investigate the claim and, if confirmed, replace the product or issue a full refund. This is our quality guarantee.",
    ],
  },
  {
    id: "lost-transit",
    number: "05",
    title: "Lost in Transit",
    content: [
      "If your package is lost during shipping and tracking shows no delivery after 14 business days from ship date, we will reship your order at no cost.",
      "To request a reship for lost packages: Verify tracking shows no delivery; Contact us with your order number; Allow us to file a claim with the shipping carrier.",
      "Once the carrier confirms the package is lost, we will reship your order immediately.",
    ],
  },
  {
    id: "wrong-product",
    number: "06",
    title: "Wrong Product Shipped",
    content: [
      "If we ship the incorrect product by error, we will correct the mistake at no cost to you.",
      "Contact us immediately if you receive the wrong product. Do not open or use the incorrect product. We will arrange for return of the incorrect item and ship the correct product.",
      "We cover all return shipping costs for our errors.",
    ],
  },
  {
    id: "cryptocurrency",
    number: "07",
    title: "Cryptocurrency Payment Refunds",
    content: [
      "Cryptocurrency payments are final once blockchain confirmation occurs. We cannot reverse crypto transactions.",
      "If a refund is approved (damaged shipment, quality issue, etc.), we will issue the refund in the same cryptocurrency you used for payment, at the current market rate at time of refund.",
      "You are responsible for providing a valid wallet address for refund. We are not responsible for refunds sent to incorrect addresses.",
    ],
  },
  {
    id: "contact",
    number: "08",
    title: "How to Request a Refund",
    content: [
      "For all refund requests or shipping issues, contact support@lumopep.com with: Your order number; Description of the issue; Photos (if applicable); Your preferred resolution.",
      "We typically respond within 24-48 hours. Most approved refund/reship requests are processed within 1-2 business days.",
    ],
  },
];

export default function RefundsPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const [activeSection, setActiveSection] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-100px 0px -66% 0px" }
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section - Sage Background */}
      <section ref={heroRef} className="bg-sage py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-mono text-cream opacity-80 mb-6"
          >
            REFUND POLICY · L-011
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-cream mb-6"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "56px", lineHeight: 1.1 }}
          >
            Our commitment, in writing.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 0.9 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-editorial text-lg text-cream max-w-2xl"
          >
            Quality guarantee for damaged shipments and products that don't meet specifications.
          </motion.p>
        </div>
      </section>

      {/* Two Column Layout */}
      <section className="bg-bone py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Sidebar - Sticky Navigation */}
            <div className="lg:col-span-3">
              <div className="lg:sticky lg:top-24 bg-cream p-6" style={{ borderRadius: "12px" }}>
                <h2 className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-4">
                  SECTIONS
                </h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => scrollToSection(section.id)}
                      className={`w-full text-left font-mono text-xs transition-colors ${
                        activeSection === section.id
                          ? "text-clay"
                          : "text-ink opacity-60 hover:opacity-100"
                      }`}
                    >
                      {section.number} — {section.title}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Right Main Content */}
            <div className="lg:col-span-9">
              <div className="max-w-3xl space-y-16">
                {sections.map((section, index) => (
                  <motion.section
                    key={section.id}
                    id={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="scroll-mt-24"
                  >
                    <div className="font-mono text-xs uppercase tracking-mono text-clay mb-3">
                      {section.number} —
                    </div>
                    <h2
                      className="font-display text-ink mb-6"
                      style={{ fontWeight: 300, fontSize: "28px" }}
                    >
                      {section.title}
                    </h2>

                    <div className="space-y-4">
                      {section.content.map((paragraph, pIndex) => (
                        <p
                          key={pIndex}
                          className="font-editorial text-ink"
                          style={{ fontSize: "16px", lineHeight: 1.75 }}
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>

                    {index !== sections.length - 1 && (
                      <div className="mt-8 border-b hairline-border" />
                    )}
                  </motion.section>
                ))}

                {/* Quality Guarantee */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-bone p-6 mt-12"
                  style={{ borderRadius: "12px", borderLeft: "4px solid #B8624A" }}
                >
                  <p className="font-editorial text-ink italic" style={{ fontSize: "15px" }}>
                    <strong className="text-clay">OUR GUARANTEE:</strong> Every product ships with a
                    third-party Certificate of Analysis. If your product arrives damaged, lost in
                    transit, or does not meet stated specifications, we will replace it or issue a full
                    refund. Our quality standards are non-negotiable.
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Contact Section - Ink Background */}
      <section className="bg-ink py-20 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-cream mb-4"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "36px" }}
          >
            Questions about this policy?
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-mono text-clay mb-6"
            style={{ fontSize: "14px" }}
          >
            support@lumopep.com
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.6 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-mono text-cream text-xs mb-8"
          >
            Last updated: January 2025
          </motion.p>

          <motion.button
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="font-mono text-xs uppercase tracking-mono text-clay hover:text-ochre transition-colors"
          >
            → BACK TO TOP
          </motion.button>
        </div>
      </section>

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-011</div>
    </div>
  );
}
