"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function WholesalePage() {
  const [formData, setFormData] = useState({
    name: "",
    clinic: "",
    email: "",
    phone: "",
    volume: "",
    message: "",
    termsAccepted: false,
  });

  const tiers = [
    {
      name: "STARTER",
      volume: "Up to $2,000/month",
      price: "Standard pricing",
      features: [
        "All current lots available",
        "Full CoA documentation",
        "Priority support",
        "Monthly invoicing",
      ],
      recommended: false,
    },
    {
      name: "CLINIC",
      volume: "Up to $10,000/month",
      price: "5% volume discount",
      features: [
        "Everything in Starter",
        "Dedicated account manager",
        "White-label CoA option",
        "Net-30 payment terms",
        "Custom lot requests",
      ],
      recommended: true,
    },
    {
      name: "WHOLESALE",
      volume: "Volume pricing",
      price: "Custom pricing",
      features: [
        "Everything in Clinic",
        "Bulk lot reservations",
        "Custom purity requirements",
        "Quarterly business reviews",
        "Direct lab contact",
      ],
      recommended: false,
    },
  ];

  const steps = [
    {
      number: "01",
      title: "Submit Application",
      description: "Complete the form below with your clinic details and estimated monthly volume.",
    },
    {
      number: "02",
      title: "Review & Approval",
      description: "Our team reviews your application within 48 hours. We verify credentials and research needs.",
    },
    {
      number: "03",
      title: "Account Setup",
      description: "Receive your dedicated account portal, payment terms, and account manager contact.",
    },
    {
      number: "04",
      title: "Start Ordering",
      description: "Place orders through your wholesale portal with volume pricing automatically applied.",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
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
      {/* Hero - Sage Background */}
      <section className="bg-sage py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs uppercase tracking-mono text-cream opacity-80 mb-4"
          >
            06.1 — WHOLESALE ACCOUNTS
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl text-cream mb-6 leading-tight max-w-4xl"
            style={{ fontWeight: 300 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            For clinics that need paperwork they can defend.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-editorial text-xl text-cream max-w-2xl"
          >
            Volume pricing, white-label CoAs, and Net-30 terms for qualified research institutions
            and medical practices.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-16 px-6 bg-bone">
        <div className="container mx-auto max-w-7xl">
          {/* Tier Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="font-display text-4xl text-ink mb-12 text-center"
              style={{ fontWeight: 300 }}
            >
              Choose your tier.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tiers.map((tier, index) => (
                <motion.div
                  key={tier.name}
                  variants={itemVariants}
                  whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(26,24,20,0.12)" }}
                  transition={{ duration: 0.25 }}
                  className={`p-8 ${
                    tier.recommended ? "bg-clay" : "bg-cream"
                  }`}
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0 4px 24px rgba(26,24,20,0.06)",
                    border: tier.recommended ? "2px solid #B8624A" : "1px solid rgba(26,24,20,0.12)",
                  }}
                >
                  {tier.recommended && (
                    <div className="mb-4">
                      <span className="px-3 py-1 bg-ochre text-cream font-mono text-xs uppercase tracking-mono"
                        style={{ borderRadius: "12px" }}>
                        RECOMMENDED
                      </span>
                    </div>
                  )}

                  <div className="mb-2">
                    <h3
                      className={`font-mono text-xs uppercase tracking-mono mb-2 ${
                        tier.recommended ? "text-cream opacity-80" : "text-ink opacity-60"
                      }`}
                    >
                      {tier.name}
                    </h3>
                    <div
                      className={`font-display text-3xl mb-2 ${
                        tier.recommended ? "text-cream" : "text-ink"
                      }`}
                      style={{ fontWeight: 300 }}
                    >
                      {tier.volume}
                    </div>
                    <div
                      className={`font-editorial text-sm ${
                        tier.recommended ? "text-cream opacity-80" : "text-ink opacity-60"
                      }`}
                    >
                      {tier.price}
                    </div>
                  </div>

                  <div className="my-6 h-px bg-current opacity-10" />

                  <ul className="space-y-3">
                    {tier.features.map((feature, i) => (
                      <li
                        key={i}
                        className={`flex items-start space-x-2 font-editorial text-sm ${
                          tier.recommended ? "text-cream" : "text-ink"
                        }`}
                      >
                        <span className={tier.recommended ? "text-cream" : "text-clay"}>●</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* How It Works */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="mb-20"
          >
            <motion.h2
              variants={itemVariants}
              className="font-display text-4xl text-ink mb-12 text-center"
              style={{ fontWeight: 300 }}
            >
              How it works.
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((step, index) => (
                <motion.div key={step.number} variants={itemVariants}>
                  <div
                    className="bg-white p-6 h-full"
                    style={{
                      borderRadius: "16px",
                      border: "1px solid rgba(26,24,20,0.12)",
                    }}
                  >
                    <div
                      className="font-display text-5xl text-clay mb-4"
                      style={{ fontWeight: 300 }}
                    >
                      {step.number}
                    </div>
                    <h3
                      className="font-display text-xl text-ink mb-3"
                      style={{ fontWeight: 300 }}
                    >
                      {step.title}
                    </h3>
                    <p className="font-editorial text-sm text-ink opacity-70 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trust Elements */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-cream p-8 mb-16 text-center"
            style={{ borderRadius: "12px" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-8 font-mono text-xs uppercase tracking-mono text-ink">
              <div className="flex items-center space-x-2">
                <span className="text-clay">●</span>
                <span>Net-30 Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-clay">●</span>
                <span>White-Label CoA</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-clay">●</span>
                <span>Dedicated Account Manager</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-clay">●</span>
                <span>Volume Discounts</span>
              </div>
            </div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="mb-8 text-center">
              <h2
                className="font-display text-4xl text-ink mb-4"
                style={{ fontWeight: 300 }}
              >
                Apply for wholesale access.
              </h2>
              <p className="font-editorial text-ink opacity-60">
                Complete the form below and we'll respond within 48 hours.
              </p>
            </div>

            <div
              className="bg-white p-8"
              style={{
                borderRadius: "16px",
                border: "1px solid rgba(26,24,20,0.12)",
              }}
            >
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-mono text-ink mb-2 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-bone hairline-border text-ink focus:outline-none focus:border-clay font-functional text-sm"
                      style={{ borderRadius: "6px" }}
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-mono text-ink mb-2 block">
                      Clinic/Institution Name *
                    </label>
                    <input
                      type="text"
                      value={formData.clinic}
                      onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                      className="w-full px-4 py-3 bg-bone hairline-border text-ink focus:outline-none focus:border-clay font-functional text-sm"
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-xs uppercase tracking-mono text-ink mb-2 block">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-3 bg-bone hairline-border text-ink focus:outline-none focus:border-clay font-functional text-sm"
                      style={{ borderRadius: "6px" }}
                    />
                  </div>

                  <div>
                    <label className="font-mono text-xs uppercase tracking-mono text-ink mb-2 block">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 bg-bone hairline-border text-ink focus:outline-none focus:border-clay font-functional text-sm"
                      style={{ borderRadius: "6px" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-mono text-ink mb-2 block">
                    Estimated Monthly Volume *
                  </label>
                  <select
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full px-4 py-3 bg-bone hairline-border text-ink focus:outline-none focus:border-clay font-functional text-sm"
                    style={{ borderRadius: "6px" }}
                  >
                    <option value="">Select range...</option>
                    <option value="starter">Up to $2,000/month (Starter)</option>
                    <option value="clinic">$2,000 - $10,000/month (Clinic)</option>
                    <option value="wholesale">$10,000+/month (Wholesale)</option>
                  </select>
                </div>

                <div>
                  <label className="font-mono text-xs uppercase tracking-mono text-ink mb-2 block">
                    Tell us about your research needs
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-bone hairline-border text-ink focus:outline-none focus:border-clay font-functional text-sm resize-none"
                    style={{ borderRadius: "6px" }}
                  />
                </div>

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.termsAccepted}
                    onChange={(e) =>
                      setFormData({ ...formData, termsAccepted: e.target.checked })
                    }
                    className="mt-1"
                  />
                  <label htmlFor="terms" className="font-editorial text-sm text-ink opacity-70">
                    I confirm that all peptides will be used for research purposes only in accordance
                    with applicable regulations. I understand that these compounds are not for human
                    consumption.
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full px-8 py-4 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors"
                  style={{ borderRadius: "8px" }}
                >
                  Submit Application →
                </motion.button>
              </form>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-010</div>
    </div>
  );
}
