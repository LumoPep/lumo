"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";

const sections = [
  {
    id: "acceptance",
    number: "01",
    title: "Acceptance of Terms",
    content: [
      "By accessing or using Lumo's website, services, or purchasing any products, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.",
      "These terms constitute a legally binding agreement between you and Lumo. We reserve the right to modify these terms at any time. Your continued use of the site after changes constitutes acceptance of modified terms.",
    ],
  },
  {
    id: "eligibility",
    number: "02",
    title: "Eligibility & Research Use Only",
    content: [
      "All products sold by Lumo are intended strictly for in vitro research and laboratory use only. These products are NOT intended for human consumption, medical, veterinary, or household use.",
      "By purchasing from Lumo, you represent and warrant that: (1) You are at least 21 years of age; (2) You are a qualified researcher or affiliated with a qualified research institution; (3) You will use products solely for legitimate research purposes; (4) You will not use products for human or animal consumption; (5) You will comply with all applicable laws and regulations.",
      "We reserve the right to refuse service to anyone who does not meet these eligibility requirements or who we suspect may misuse our products.",
    ],
  },
  {
    id: "prohibited",
    number: "03",
    title: "Prohibited Uses",
    content: [
      "You expressly agree that you will NOT use any Lumo products for: Human consumption or administration of any kind; Veterinary or animal use; Medical diagnosis, treatment, cure, or prevention of disease; Household use; Cosmetic applications; Athletic or performance enhancement; Any unlawful purpose.",
      "Violation of these prohibited uses may result in immediate termination of your account, refusal of current and future orders, and potential legal action. Misuse of research chemicals is dangerous and illegal.",
    ],
  },
  {
    id: "payment",
    number: "04",
    title: "Payment Terms",
    content: [
      "We accept cryptocurrency payments including Bitcoin (BTC), Ethereum (ETH), USDT, USDC, and Litecoin (LTC). All payments are processed through our secure payment provider.",
      "Cryptocurrency payments are final and non-refundable once blockchain confirmation occurs. Prices are quoted in USD but paid in cryptocurrency at the current exchange rate at time of payment.",
      "You are responsible for any blockchain transaction fees. We are not responsible for payments sent to incorrect addresses or lost due to user error.",
    ],
  },
  {
    id: "disclaimer",
    number: "05",
    title: "Medical Disclaimer",
    content: [
      "Lumo does not provide medical advice. Nothing on this website constitutes medical advice, diagnosis, or treatment recommendations.",
      "We are not healthcare professionals. Our staff cannot and will not provide guidance on dosing, administration, therapeutic effects, or medical applications of any products.",
      "Consult with qualified healthcare professionals for any health-related questions. Do not use our products based on information found on this website or communications with our staff.",
    ],
  },
  {
    id: "liability",
    number: "06",
    title: "Limitation of Liability",
    content: [
      "Lumo products are sold 'as is' for research use only. We make no warranties regarding fitness for any particular purpose.",
      "To the maximum extent permitted by law, Lumo shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use or inability to use our products or services.",
      "Our total liability shall not exceed the amount you paid for the specific product giving rise to the claim.",
    ],
  },
  {
    id: "termination",
    number: "07",
    title: "Account Termination",
    content: [
      "We reserve the right to terminate or suspend your account and refuse service at any time, for any reason, including but not limited to: Violation of these Terms of Service; Suspected misuse of products; Fraudulent activity; Providing false information during registration or purchase.",
      "Upon termination, your right to use our services immediately ceases. We are not obligated to provide refunds for terminated accounts.",
    ],
  },
  {
    id: "governing",
    number: "08",
    title: "Governing Law",
    content: [
      "These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to conflict of law provisions.",
      "Any disputes arising from these Terms or use of our services shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association.",
    ],
  },
];

export default function TermsPage() {
  const heroRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const [activeSection, setActiveSection] = useState("acceptance");

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
      {/* Hero Section - Ink Background */}
      <section ref={heroRef} className="bg-ink py-24 md:py-32 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs uppercase tracking-mono text-clay mb-6"
          >
            TERMS OF SERVICE · L-009
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-display text-cream mb-6"
            style={{ fontWeight: 300, fontStyle: "italic", fontSize: "56px", lineHeight: 1.1 }}
          >
            The terms, plainly stated.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={heroInView ? { opacity: 0.9 } : { opacity: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="font-editorial text-lg text-cream max-w-2xl"
          >
            Legal agreements for research peptide purchases. Read carefully before ordering.
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

                {/* Important Warning */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-bone p-6 mt-12"
                  style={{ borderRadius: "12px", borderLeft: "4px solid #B8624A" }}
                >
                  <p className="font-editorial text-ink italic" style={{ fontSize: "15px" }}>
                    <strong className="text-clay">RESEARCH USE ONLY:</strong> All compounds sold by
                    Lumo are intended strictly for in vitro research and laboratory use only. These
                    products are NOT intended for human consumption, medical, veterinary, or household
                    use. Misuse of research chemicals is dangerous and illegal.
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
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-009</div>
    </div>
  );
}
