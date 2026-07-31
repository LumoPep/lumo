"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const sections = [
  {
    id: "overview",
    number: "01",
    title: "Shipping Overview",
    content: [
      "Lumo ships research peptides in secure packaging to ensure product integrity from our facility to your laboratory.",
      "All orders are processed within 1-2 business days of payment confirmation. Cryptocurrency payments are confirmed automatically via blockchain, typically within 10-60 minutes.",
    ],
  },
  {
    id: "domestic",
    number: "02",
    title: "Domestic Shipping (United States)",
    content: [
      "We currently ship only within the United States. All orders are shipped via USPS Priority Mail or FedEx with 2-5 business day delivery times.",
      "Shipping costs are calculated at checkout based on order weight and destination. Most orders qualify for flat-rate shipping of $12-15.",
      "Orders over $200 qualify for free expedited shipping.",
    ],
  },
  {
    id: "discreet",
    number: "03",
    title: "Discreet Packaging",
    content: [
      "All packages are shipped in plain, unmarked boxes with no external indication of contents.",
      "The return address shows only 'LumoPep LLC' with no reference to peptides or research chemicals. Contents are not visible from outside the package.",
      "We respect your privacy and understand the need for discrete delivery of research materials.",
    ],
  },
  {
    id: "tracking",
    number: "04",
    title: "Tracking & Delivery",
    content: [
      "You will receive a tracking number via email as soon as your order ships. Track your package through USPS or FedEx using this number.",
      "Most domestic deliveries arrive within 2-5 business days from ship date. Delays may occur during holidays or extreme weather.",
      "Signature may be required for delivery at the carrier's discretion. If you miss delivery, the package will be held at your local post office or FedEx location for pickup.",
    ],
  },
  {
    id: "po-boxes",
    number: "05",
    title: "PO Boxes & Address Requirements",
    content: [
      "We can ship to PO Boxes via USPS.",
      "We recommend shipping to a physical street address where someone can receive the package promptly.",
      "Ensure your shipping address is accurate and complete. We are not responsible for lost packages due to incorrect addresses provided at checkout.",
    ],
  },
  {
    id: "lost-damaged",
    number: "06",
    title: "Lost or Damaged Shipments",
    content: [
      "All shipments are fully insured. If your package is lost in transit, contact us after 14 business days with no delivery and we will reship at no cost.",
      "If your package arrives damaged: Contact us within 48 hours; Provide photos of the damage; We will reship immediately or issue a full refund.",
      "We take responsibility for proper shipping and handling of all products.",
    ],
  },
  {
    id: "restrictions",
    number: "07",
    title: "Shipping Restrictions",
    content: [
      "We do not currently ship internationally. Domestic US shipping only at this time.",
      "We cannot ship to certain states or jurisdictions where research peptide sales are restricted. Orders to restricted locations will be automatically cancelled and refunded.",
      "All recipients must be 21+ years of age. By ordering, you confirm you meet age requirements and are authorized to receive research chemicals at the delivery address.",
    ],
  },
];

export default function ShippingPage() {
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
      {/* Hero Section - Ochre Background */}
      <section ref={heroRef} className="bg-ochre py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-mono text-ink opacity-80 mb-6"
          >
            SHIPPING POLICY · L-012
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-ink mb-6"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "56px", lineHeight: 1.1 }}
          >
            Fast. Discreet. Lot-traceable.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 0.9 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-editorial text-lg text-ink max-w-2xl"
          >
            Secure packaging and expedited delivery for all research compounds.
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

                {/* Stability Note */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-bone p-6 mt-12"
                  style={{ borderRadius: "12px", borderLeft: "4px solid #B8624A" }}
                >
                  <p className="font-editorial text-ink italic" style={{ fontSize: "15px" }}>
                    <strong className="text-clay">SHIPPING GUARANTEE:</strong> Orders ship Monday through Friday with full tracking. If your package arrives damaged, we'll reship immediately at no cost.
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
            support@lumopeptides.com
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
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-012</div>
    </div>
  );
}
