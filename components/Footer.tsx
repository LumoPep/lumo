"use client";

import Link from "next/link";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import LumoLogo from "@/components/LumoLogo";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const footerRef = useRef(null);
  const isInView = useInView(footerRef, { once: true, margin: "-100px" });

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setEmail("");
      setSubscribed(false);
    }, 3000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <>
      {/* Newsletter Section - Clay Background */}
      <section className="bg-clay py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl text-cream mb-4"
            style={{ fontWeight: 300 }}
          >
            Stay current.
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-editorial text-lg text-cream mb-8"
          >
            New lot releases, research updates, and product announcements.
          </motion.p>

          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your-email@research.edu"
              required
              disabled={subscribed}
              className="flex-1 px-4 py-3 bg-cream text-ink placeholder-ink placeholder-opacity-40 focus:outline-none font-functional text-sm"
              style={{ borderRadius: "6px" }}
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={subscribed}
              className={`px-6 py-3 font-mono text-xs uppercase tracking-mono transition-all ${
                subscribed
                  ? "bg-ochre text-cream cursor-not-allowed"
                  : "bg-ink text-cream hover:bg-bone hover:text-ink"
              }`}
              style={{ borderRadius: "6px" }}
            >
              {subscribed ? "✓ SUBSCRIBED" : "SUBSCRIBE"}
            </motion.button>
          </motion.form>

          <p className="font-mono text-xs text-cream opacity-60 mt-4">
            Unsubscribe anytime. Research use communications only.
          </p>
        </div>
      </section>

      {/* Footer - Ink Background */}
      <footer ref={footerRef} className="bg-ink">
        {/* Disclaimer Box */}
        <div className="border-t border-b py-8" style={{ borderColor: "rgba(245,239,228,0.08)" }}>
          <div className="container mx-auto px-6">
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-start space-x-3 mb-4">
                <span className="text-clay font-mono text-lg">●</span>
                <h3 className="font-mono text-xs uppercase tracking-mono text-cream font-medium opacity-80">
                  IMPORTANT RESEARCH USE DISCLAIMER
                </h3>
              </div>
              <p
                className="font-editorial text-sm text-cream leading-relaxed ml-7"
                style={{ opacity: 0.8 }}
              >
                All compounds sold by Lumo are intended strictly for{" "}
                <span className="font-medium">in vitro research and laboratory use only</span>.
                These products are NOT intended for human consumption, medical, veterinary, or
                household use. By purchasing from Lumo, you acknowledge that you are a qualified
                researcher or institution and will use these products solely for research purposes
                in compliance with all applicable laws and regulations. All buyers must be 21 years
                of age or older.
              </p>
            </motion.div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-6 py-12">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12"
          >
            {/* Left Column - Logo & Tagline (30%) */}
            <div className="lg:col-span-4">
              <motion.div variants={itemVariants}>
                <div className="mb-4">
                  <LumoLogo size='footer' />
                </div>
                <div
                  className="font-mono uppercase text-cream mb-2"
                  style={{ fontSize: "10px", letterSpacing: "3px", opacity: 0.5 }}
                >
                  RESEARCH PEPTIDES
                </div>
                <div
                  className="font-mono text-cream mb-4"
                  style={{ fontSize: "10px", opacity: 0.35 }}
                >
                  lumo.bio · {new Date().getFullYear()}
                </div>
                <p
                  className="font-editorial text-cream max-w-[200px]"
                  style={{ fontSize: "14px", opacity: 0.75, lineHeight: 1.6 }}
                >
                  Precision peptides for serious research.
                </p>
              </motion.div>
            </div>

            {/* Right Column - 4 Link Columns (70%) */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {/* Company */}
                <motion.div variants={itemVariants}>
                  <h4
                    className="font-mono uppercase text-cream font-medium mb-4"
                    style={{ fontSize: "10px", letterSpacing: "3px", opacity: 0.7 }}
                  >
                    COMPANY
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/about"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        About
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/contact"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        Contact
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/journal"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        Research
                      </Link>
                    </li>

                  </ul>
                </motion.div>

                {/* Compounds */}
                <motion.div variants={itemVariants}>
                  <h4
                    className="font-mono uppercase text-cream font-medium mb-4"
                    style={{ fontSize: "10px", letterSpacing: "3px", opacity: 0.7 }}
                  >
                    COMPOUNDS
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/products/lp-tz"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        LP-Tz
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/lp-rt"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        LP-Rt
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/bpc-157"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        BPC-157
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/tb-500"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        TB-500
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/bpc-tb-blend"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        BPC+TB Blend
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/products/ghk-cu"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        GHK-Cu
                      </Link>
                    </li>
                  </ul>
                </motion.div>

                {/* Resources */}
                <motion.div variants={itemVariants}>
                  <h4
                    className="font-mono uppercase text-cream font-medium mb-4"
                    style={{ fontSize: "10px", letterSpacing: "3px", opacity: 0.7 }}
                  >
                    RESOURCES
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/coa"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        Certificates (CoA)
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/faq"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        FAQ
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/account"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        Account
                      </Link>
                    </li>
                    <li>
                      <a
                        href="mailto:support@lumopep.com"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        Email Support
                      </a>
                    </li>
                  </ul>
                </motion.div>

                {/* Legal */}
                <motion.div variants={itemVariants}>
                  <h4
                    className="font-mono uppercase text-cream font-medium mb-4"
                    style={{ fontSize: "10px", letterSpacing: "3px", opacity: 0.7 }}
                  >
                    LEGAL
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        href="/terms"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        Terms of Service
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/privacy"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        Privacy Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/refunds"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        Refund Policy
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/shipping"
                        className="font-editorial text-cream transition-opacity"
                        style={{ fontSize: "14px", opacity: 0.85 }}
                        onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                        onMouseLeave={(e) => (e.currentTarget.style.opacity = "0.85")}
                      >
                        Shipping Policy
                      </Link>
                    </li>
                  </ul>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Bottom Bar */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="border-t pt-6"
            style={{ borderColor: "rgba(245,239,228,0.08)" }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div
                className="font-mono text-cream text-center md:text-left"
                style={{ fontSize: "10px", opacity: 0.65 }}
              >
                © {new Date().getFullYear()} LumoPep LLC
              </div>
              <div
                className="font-mono text-cream text-center md:text-right"
                style={{ fontSize: "10px", opacity: 0.65 }}
              >
                All products for research use only.
              </div>
            </div>
            <p
              className="font-editorial text-cream mt-6 text-center md:text-left italic"
              style={{ fontSize: "14px", opacity: 0.7 }}
            >
              A brand built the same way the molecules are.{" "}
              <span className="text-clay">Carefully. In sequence.</span>
            </p>
            <p
              className="font-mono text-cream mt-4 text-center"
              style={{ fontSize: "9px", opacity: 0.6, letterSpacing: "0.5px" }}
            >
              ⚠ All compounds sold for in vitro research and laboratory use only. Not for human
              or veterinary use. Not a drug or supplement. Must be 21+.
            </p>
          </motion.div>
        </div>
      </footer>
    </>
  );
}
