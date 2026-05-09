"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";

const sections = [
  {
    id: "collection",
    number: "01",
    title: "Information We Collect",
    content: [
      "Lumo collects minimal personal information necessary to process research peptide orders and provide customer support.",
      "Information collected includes: Email address for order confirmation and communication; Shipping address for product delivery; Payment information (processed securely through third-party cryptocurrency payment processors—we do not store payment details); Order history and product preferences; Communications with our support team.",
      "We do not collect unnecessary personal data. We do not use tracking cookies beyond essential functionality cookies required for the website to operate.",
    ],
  },
  {
    id: "usage",
    number: "02",
    title: "How We Use Your Information",
    content: [
      "Your information is used exclusively for: Processing and fulfilling your orders; Sending order confirmations and shipping notifications; Responding to customer service inquiries; Improving our products and services; Complying with legal obligations.",
      "We do not use your information for marketing purposes unless you explicitly opt in to receive research updates and product announcements via our newsletter subscription.",
    ],
  },
  {
    id: "sharing",
    number: "03",
    title: "Information Sharing & Third Parties",
    content: [
      "Lumo does not sell, rent, or share your personal information with third parties for marketing purposes.",
      "We may share limited information with: Shipping carriers (name and address only) to deliver your orders; Payment processors to complete cryptocurrency transactions; Legal authorities if required by law or to protect our rights.",
      "All third-party service providers are bound by confidentiality agreements and are prohibited from using your information for purposes other than providing services to Lumo.",
    ],
  },
  {
    id: "crypto",
    number: "04",
    title: "Cryptocurrency Payment Privacy",
    content: [
      "We accept cryptocurrency payments specifically to provide enhanced privacy for our customers.",
      "Cryptocurrency transactions are processed through secure third-party payment providers. We do not have access to your wallet addresses or private keys.",
      "Blockchain transactions are public by nature. While we cannot control blockchain transparency, we do not link your identity to blockchain transaction data in our systems beyond what is necessary for order fulfillment.",
    ],
  },
  {
    id: "security",
    number: "05",
    title: "Data Security",
    content: [
      "We implement industry-standard security measures to protect your personal information, including: Encrypted data transmission (SSL/TLS); Secure server infrastructure; Limited employee access to customer data; Regular security audits and updates.",
      "While we take reasonable precautions, no method of electronic storage or transmission is 100% secure. We cannot guarantee absolute security of your information.",
    ],
  },
  {
    id: "retention",
    number: "06",
    title: "Data Retention",
    content: [
      "We retain your personal information only as long as necessary to fulfill the purposes outlined in this policy or as required by law.",
      "Order information is retained for 7 years to comply with business record-keeping requirements. Account information is retained while your account is active or as needed to provide services.",
      "You may request deletion of your personal information by contacting support@lumopeptides.com. Note that we may need to retain certain information to comply with legal obligations.",
    ],
  },
  {
    id: "rights",
    number: "07",
    title: "Your Privacy Rights",
    content: [
      "You have the right to: Access the personal information we hold about you; Request correction of inaccurate information; Request deletion of your personal information (subject to legal retention requirements); Opt out of marketing communications; Object to processing of your personal information.",
      "To exercise these rights, contact us at support@lumopeptides.com with your request.",
    ],
  },
  {
    id: "changes",
    number: "08",
    title: "Changes to This Policy",
    content: [
      "We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements.",
      "Material changes will be communicated via email to registered users. Your continued use of our services after changes constitutes acceptance of the updated policy.",
    ],
  },
];

export default function PrivacyPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const [activeSection, setActiveSection] = useState("collection");

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
      {/* Hero Section - Clay Background */}
      <section ref={heroRef} className="bg-clay py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-mono text-cream opacity-80 mb-6"
          >
            PRIVACY POLICY · L-010
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-cream mb-6"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "56px", lineHeight: 1.1 }}
          >
            Your data. Your business.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 0.9 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-editorial text-lg text-cream max-w-2xl"
          >
            We collect minimal data, store it securely, and never sell your information.
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

                {/* Privacy Commitment */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-bone p-6 mt-12"
                  style={{ borderRadius: "12px", borderLeft: "4px solid #B8624A" }}
                >
                  <p className="font-editorial text-ink italic" style={{ fontSize: "15px" }}>
                    <strong className="text-clay">OUR COMMITMENT:</strong> Lumo respects your privacy.
                    We collect only what is necessary to fulfill your orders and provide support. We do
                    not sell your data. We do not share your information with marketers. We use
                    cryptocurrency payments to provide enhanced transaction privacy.
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
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-010</div>
    </div>
  );
}
