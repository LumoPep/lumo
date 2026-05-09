"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState("ORDERS");

  const tabs = ["ORDERS", "COAS", "PROFILE", "WHOLESALE"];

  const orders = [
    {
      id: "ORD-2024-048",
      date: "March 15, 2026",
      compounds: ["BPC-157 (5mg)", "TB-500 (5mg)"],
      lots: ["PPL-2024-001", "PPL-2024-008"],
      total: "$84.98",
      status: "SHIPPED",
      tracking: "1Z999AA10123456784",
    },
    {
      id: "ORD-2024-047",
      date: "March 8, 2026",
      compounds: ["Ipamorelin (5mg)"],
      lots: ["PPL-2024-003"],
      total: "$42.99",
      status: "DELIVERED",
      tracking: "1Z999AA10123456783",
    },
    {
      id: "ORD-2024-046",
      date: "February 28, 2026",
      compounds: ["CJC-1295 (5mg)", "BPC-157 (5mg)"],
      lots: ["PPL-2024-004", "PPL-2024-001"],
      total: "$89.98",
      status: "DELIVERED",
      tracking: "1Z999AA10123456782",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen bg-bone">
      {/* Header */}
      <section className="bg-ink py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs uppercase tracking-mono text-clay mb-3"
          >
            07.1 — ACCOUNT DASHBOARD
          </motion.div>

          <motion.h1
            className="font-display text-4xl md:text-5xl text-cream"
            style={{ fontWeight: 300 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Your research orders.
          </motion.h1>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Sidebar Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-3"
            >
              <div
                className="bg-cream p-6 sticky top-24"
                style={{
                  borderRadius: "12px",
                  border: "1px solid rgba(26,24,20,0.12)",
                }}
              >
                <nav className="space-y-2">
                  {tabs.map((tab) => (
                    <motion.button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      whileHover={{ x: 4 }}
                      className={`w-full text-left px-4 py-3 font-mono text-xs uppercase tracking-mono transition-all ${
                        activeTab === tab
                          ? "bg-clay text-cream"
                          : "text-ink hover:bg-bone"
                      }`}
                      style={{ borderRadius: "6px" }}
                    >
                      {activeTab === tab && <span className="mr-2">●</span>}
                      {tab}
                    </motion.button>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t hairline-border">
                  <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-40 mb-2">
                    ACCOUNT
                  </div>
                  <div className="font-editorial text-sm text-ink mb-1">
                    research@example.com
                  </div>
                  <button className="font-mono text-xs text-clay hover:underline">
                    Sign Out →
                  </button>
                </div>
              </div>
            </motion.div>

            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {activeTab === "ORDERS" && (
                <motion.div
                  key="orders"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div variants={itemVariants} className="mb-6">
                    <h2
                      className="font-display text-3xl text-ink mb-2"
                      style={{ fontWeight: 300 }}
                    >
                      Order History
                    </h2>
                    <p className="font-editorial text-ink opacity-60">
                      Track your research peptide orders and download certificates.
                    </p>
                  </motion.div>

                  <div className="space-y-4">
                    {orders.map((order, index) => (
                      <motion.div
                        key={order.id}
                        variants={itemVariants}
                        whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(26,24,20,0.08)" }}
                        className="bg-white p-6"
                        style={{
                          borderRadius: "12px",
                          border: "1px solid rgba(26,24,20,0.12)",
                        }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          {/* Order Info */}
                          <div className="md:col-span-7">
                            <div className="flex items-start justify-between mb-4">
                              <div>
                                <div className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-1">
                                  {order.id}
                                </div>
                                <div className="font-mono text-xs text-ink opacity-40">
                                  {order.date}
                                </div>
                              </div>
                              <div>
                                <span
                                  className={`px-3 py-1 font-mono text-xs uppercase tracking-mono ${
                                    order.status === "SHIPPED"
                                      ? "bg-clay text-cream"
                                      : "bg-ochre text-cream"
                                  }`}
                                  style={{ borderRadius: "12px" }}
                                >
                                  {order.status}
                                </span>
                              </div>
                            </div>

                            <div className="space-y-2 mb-4">
                              {order.compounds.map((compound, i) => (
                                <div
                                  key={i}
                                  className="flex items-start justify-between"
                                >
                                  <div className="font-editorial text-sm text-ink">
                                    {compound}
                                  </div>
                                  <div className="font-mono text-xs text-ink opacity-40">
                                    LOT {order.lots[i]}
                                  </div>
                                </div>
                              ))}
                            </div>

                            <div className="flex items-center space-x-4 text-xs">
                              <div className="font-mono text-ink opacity-40">
                                TRACKING: {order.tracking}
                              </div>
                            </div>
                          </div>

                          {/* Actions */}
                          <div className="md:col-span-5 flex flex-col justify-between">
                            <div className="text-right mb-4">
                              <div className="font-mono text-xs text-ink opacity-40 mb-1">
                                TOTAL
                              </div>
                              <div
                                className="font-display text-2xl text-ink"
                                style={{ fontWeight: 300 }}
                              >
                                {order.total}
                              </div>
                            </div>

                            <div className="flex flex-col space-y-2">
                              {order.lots.map((lot, i) => (
                                <button
                                  key={i}
                                  className="px-4 py-2 hairline-border text-ink font-mono text-xs uppercase tracking-mono hover:border-clay transition-colors text-left"
                                  style={{ borderRadius: "6px" }}
                                >
                                  Download CoA · LOT {lot}
                                </button>
                              ))}
                              <button
                                className="px-4 py-2 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors"
                                style={{ borderRadius: "6px" }}
                              >
                                Track Shipment →
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === "COAS" && (
                <motion.div
                  key="coas"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-6">
                    <h2
                      className="font-display text-3xl text-ink mb-2"
                      style={{ fontWeight: 300 }}
                    >
                      Your Certificates
                    </h2>
                    <p className="font-editorial text-ink opacity-60">
                      All CoAs from your purchased lots, available for download.
                    </p>
                  </div>

                  <div
                    className="bg-white p-12 text-center"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid rgba(26,24,20,0.12)",
                    }}
                  >
                    <div className="font-mono text-xs uppercase tracking-mono text-ink opacity-40 mb-4">
                      CERTIFICATES AVAILABLE
                    </div>
                    <div
                      className="font-display text-5xl text-clay mb-4"
                      style={{ fontWeight: 300 }}
                    >
                      6
                    </div>
                    <p className="font-editorial text-ink opacity-60 mb-6">
                      CoAs from your order history
                    </p>
                    <Link
                      href="/coa"
                      className="inline-block px-6 py-3 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors"
                      style={{ borderRadius: "6px" }}
                    >
                      View All CoAs →
                    </Link>
                  </div>
                </motion.div>
              )}

              {activeTab === "PROFILE" && (
                <motion.div
                  key="profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-6">
                    <h2
                      className="font-display text-3xl text-ink mb-2"
                      style={{ fontWeight: 300 }}
                    >
                      Account Settings
                    </h2>
                    <p className="font-editorial text-ink opacity-60">
                      Manage your account details and preferences.
                    </p>
                  </div>

                  <div
                    className="bg-white p-8"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid rgba(26,24,20,0.12)",
                    }}
                  >
                    <div className="space-y-6">
                      <div>
                        <label className="font-mono text-xs uppercase tracking-mono text-ink mb-2 block">
                          Email Address
                        </label>
                        <input
                          type="email"
                          defaultValue="research@example.com"
                          className="w-full px-4 py-3 bg-bone hairline-border text-ink focus:outline-none focus:border-clay font-functional text-sm"
                          style={{ borderRadius: "6px" }}
                        />
                      </div>

                      <div>
                        <label className="font-mono text-xs uppercase tracking-mono text-ink mb-2 block">
                          Institution Name
                        </label>
                        <input
                          type="text"
                          defaultValue="Research Institute"
                          className="w-full px-4 py-3 bg-bone hairline-border text-ink focus:outline-none focus:border-clay font-functional text-sm"
                          style={{ borderRadius: "6px" }}
                        />
                      </div>

                      <button
                        className="px-6 py-3 bg-ink text-bone font-mono text-xs uppercase tracking-mono hover:bg-clay transition-colors"
                        style={{ borderRadius: "6px" }}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "WHOLESALE" && (
                <motion.div
                  key="wholesale"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="mb-6">
                    <h2
                      className="font-display text-3xl text-ink mb-2"
                      style={{ fontWeight: 300 }}
                    >
                      Wholesale Access
                    </h2>
                    <p className="font-editorial text-ink opacity-60">
                      Volume pricing and white-label CoAs for qualified accounts.
                    </p>
                  </div>

                  <div
                    className="bg-cream p-8"
                    style={{
                      borderRadius: "12px",
                      border: "1px solid rgba(26,24,20,0.12)",
                    }}
                  >
                    <div className="text-center">
                      <svg width="60" height="60" viewBox="0 0 60 60" className="mx-auto mb-4">
                        <circle cx="30" cy="30" r="28" stroke="#B8624A" strokeWidth="2" fill="none" />
                        <circle cx="30" cy="30" r="8" fill="#B8624A" />
                      </svg>

                      <h3
                        className="font-display text-2xl text-ink mb-3"
                        style={{ fontWeight: 300 }}
                      >
                        Not a wholesale member yet?
                      </h3>
                      <p className="font-editorial text-ink opacity-70 mb-6 max-w-md mx-auto">
                        Apply for volume pricing, Net-30 terms, and dedicated account management.
                      </p>
                      <Link
                        href="/wholesale"
                        className="inline-block px-8 py-4 bg-clay text-cream font-mono text-xs uppercase tracking-mono hover:bg-opacity-90 transition-all"
                        style={{ borderRadius: "8px" }}
                      >
                        Apply for Wholesale →
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-011</div>
    </div>
  );
}
