"use client";

import { useState, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { getProductBySlug, PRODUCTS, CATEGORY_COLORS } from "@/data/products";
import { useCartStore } from "@/lib/store";
import { showToast } from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import CoAViewer from "@/components/CoAViewer";
import { notFound } from "next/navigation";
import { motion, useInView } from "framer-motion";

export default function ProductPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug as string);

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("technical");

  const { addItem, openCart } = useCartStore();

  const labResultsRef = useRef(null);
  const researchRef = useRef(null);
  const relatedRef = useRef(null);

  const labResultsInView = useInView(labResultsRef, { once: true, margin: "-100px" });
  const researchInView = useInView(researchRef, { once: true, margin: "-100px" });
  const relatedInView = useInView(relatedRef, { once: true, margin: "-100px" });

  if (!product) {
    return notFound();
  }

  const categoryColors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Metabolic Research'];

  const handleAddToCart = () => {
    const size = product.sizes[selectedVariant];
    const price = product.prices[selectedVariant];
    const sku = product.skus[selectedVariant];
    addItem({
      productId: product.id.toString(),
      productName: product.name,
      variant: size,
      price: price,
      sku: sku,
    });
    showToast(`Added ${product.name} (${size}) to cart`);
    openCart();
  };

  // Get related products (same category, exclude current)
  const relatedProducts = PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const tabs = [
    { id: "technical", label: "Technical Specs" },
    { id: "coa", label: "CoA" },
    { id: "storage", label: "Storage" },
    { id: "research", label: "Research" },
  ];

  return (
    <div className="min-h-screen">
      {/* Main Product Section - Bone Background */}
      <section className="bg-bone py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column - 55% */}
            <div className="lg:col-span-7">
              {/* Product Image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  position: 'relative',
                  background: 'transparent',
                  borderRadius: '16px',
                  padding: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '320px',
                  marginBottom: '24px',
                }}
              >
                <Image
                  src='/images/vial-transparent.png'
                  alt={product.name}
                  width={364}
                  height={429}
                  style={{
                    objectFit: 'contain',
                    filter: 'drop-shadow(-8px 16px 32px rgba(26,24,20,0.18))',
                    transform: 'none',
                    mixBlendMode: 'multiply',
                  }}
                  priority
                />
              </motion.div>

              {/* Tabbed Section */}
              <div className="bg-cream" style={{ borderRadius: "16px", padding: "32px" }}>
                {/* Tab Navigation */}
                <div className="flex space-x-1 border-b hairline-border mb-8">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-6 py-3 font-mono text-xs uppercase tracking-mono transition-colors ${
                        activeTab === tab.id ? "text-ink" : "text-ink opacity-40 hover:opacity-70"
                      }`}
                    >
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                  {activeTab === "technical" && (
                    <motion.div
                      key="technical"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-4">
                          CHEMICAL PROPERTIES
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                              CAS Number:
                            </span>
                            <span className="font-mono text-sm text-ink ml-2">{product.casNumber}</span>
                          </div>
                          <div>
                            <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                              Molecular Weight:
                            </span>
                            <span className="font-mono text-sm text-ink ml-2">
                              {product.mw}
                            </span>
                          </div>
                          <div className="md:col-span-2">
                            <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                              Molecular Formula:
                            </span>
                            <span className="font-mono text-sm text-ink ml-2">{product.formula}</span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-4">
                          PHYSICAL PROPERTIES
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                              Appearance:
                            </span>
                            <span className="font-editorial text-sm text-ink ml-2">
                              {product.appearance}
                            </span>
                          </div>
                          {product.sequence && product.sequence !== 'N/A' && (
                            <div>
                              <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                                Sequence:
                              </span>
                              <span className="font-mono text-sm text-ink ml-2">
                                {product.sequence}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "coa" && (
                    <motion.div
                      key="coa"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <CoAViewer product={product} />
                    </motion.div>
                  )}

                  {activeTab === "storage" && (
                    <motion.div
                      key="storage"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-4">
                          STORAGE CONDITIONS
                        </h3>
                        <p className="font-editorial text-sm text-ink leading-relaxed">
                          {product.storage}
                        </p>
                      </div>

                      <div className="bg-bone hairline-border p-6" style={{ borderRadius: "12px" }}>
                        <h4 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-3">
                          HANDLING GUIDELINES
                        </h4>
                        <ul className="space-y-2 font-editorial text-sm text-ink opacity-80">
                          <li>· Handle with appropriate laboratory safety equipment</li>
                          <li>· Minimize exposure to air, light, and moisture during use</li>
                          <li>· Use immediately after reconstitution or store as directed</li>
                          <li>· Dispose of according to institutional waste protocols</li>
                        </ul>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "research" && (
                    <motion.div
                      key="research"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <div className="bg-bone hairline-border p-6" style={{ borderRadius: "12px" }}>
                        <h4 className="font-mono text-xs uppercase tracking-mono text-ink font-medium mb-3">
                          RESEARCH APPLICATIONS
                        </h4>
                        <ul className="space-y-2">
                          {product.researchPoints.map((app, index) => (
                            <li
                              key={index}
                              className="flex items-start space-x-3 font-editorial text-sm text-ink opacity-80"
                            >
                              <span className="text-clay mt-1">●</span>
                              <span>{app}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - 45% Sticky */}
            <div className="lg:col-span-5">
              <div className="lg:sticky lg:top-20">
                {/* Category Badge + Product Badge */}
                <div className="mb-3 flex items-center gap-2 flex-wrap">
                  <span
                    className="inline-block px-3 py-1 font-mono text-xs uppercase tracking-mono"
                    style={{
                      borderRadius: "12px",
                      backgroundColor: categoryColors.accent,
                      color: 'white',
                      fontWeight: 500,
                      letterSpacing: '1px',
                    }}
                  >
                    {product.category}
                  </span>
                  {product.badge && (
                    <span
                      className="inline-block px-3 py-1 bg-clay text-cream font-mono text-xs uppercase tracking-mono"
                      style={{ borderRadius: "12px" }}
                    >
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Name */}
                <h1
                  className="font-display text-ink mb-2"
                  style={{ fontWeight: 300, fontStyle: "italic", fontSize: "42px", lineHeight: 1.1 }}
                >
                  {product.name}
                </h1>

                {/* Description */}
                <p className="font-editorial text-ink opacity-70 mb-5" style={{ fontSize: "15px", lineHeight: 1.5 }}>
                  {product.synopsis}
                </p>

                {/* Purity Display */}
                <div className="bg-cream hairline-border p-5 mb-5" style={{ borderRadius: "12px" }}>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                      HPLC PURITY
                    </span>
                    <span
                      className="font-display text-ochre"
                      style={{ fontWeight: 300, fontSize: "36px", lineHeight: 1 }}
                    >
                      {product.purity}
                    </span>
                  </div>
                  <div className="bg-bone h-2" style={{ borderRadius: "4px" }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${product.purity}` }}
                      transition={{ duration: 1.2, delay: 0.3 }}
                      className="h-full bg-ochre"
                      style={{ borderRadius: "4px" }}
                    />
                  </div>
                </div>

                {/* Lot + Report Grid */}
                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="bg-cream hairline-border p-3" style={{ borderRadius: "12px" }}>
                    <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 block mb-1" style={{ fontSize: "10px" }}>
                      LOT NUMBER
                    </span>
                    <span className="font-mono text-sm text-ink font-medium">{product.batch}</span>
                  </div>
                  <div className="bg-cream hairline-border p-3" style={{ borderRadius: "12px" }}>
                    <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 block mb-1" style={{ fontSize: "10px" }}>
                      REPORT NO.
                    </span>
                    <span className="font-mono text-sm text-ink font-medium">{product.report}</span>
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mb-4">
                  <label className="font-mono uppercase tracking-mono text-ink opacity-60 block mb-2" style={{ fontSize: "10px", letterSpacing: "1.5px" }}>
                    SELECT SIZE
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {product.sizes.map((size, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedVariant(index)}
                        className={`p-3 transition-all ${
                          selectedVariant === index
                            ? "border-0"
                            : "bg-cream text-ink hairline-border hover:border-clay"
                        }`}
                        style={{
                          borderRadius: "10px",
                          transition: "all 150ms",
                          backgroundColor: selectedVariant === index ? categoryColors.accent : undefined,
                          color: selectedVariant === index ? 'white' : undefined,
                        }}
                      >
                        <div className="font-mono text-sm font-medium">{size}</div>
                        <div className="font-mono text-xs opacity-70">${product.prices[index].toFixed(2)}</div>
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* RUO Disclaimer - Prominent */}
                <div className="bg-clay p-4 mb-4" style={{ borderRadius: "12px" }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-white text-base">⚠</span>
                    <h4
                      className="font-mono uppercase text-white font-medium"
                      style={{ fontSize: "10px", letterSpacing: "1.5px" }}
                    >
                      RESEARCH USE ONLY
                    </h4>
                  </div>
                  <p className="font-editorial text-cream italic" style={{ fontSize: "12px", lineHeight: 1.5 }}>
                    This compound is sold strictly for in vitro research and laboratory use. Not for
                    human or animal consumption. Not a drug, food, or supplement. By purchasing you
                    confirm you are a qualified researcher and will use this compound in compliance
                    with all applicable laws. Must be 21 or older.
                  </p>
                </div>

                {/* Quantity + Add to Cart */}
                <div className="mb-4">
                  <label className="font-mono uppercase tracking-mono text-ink opacity-60 block mb-2" style={{ fontSize: "10px", letterSpacing: "1.5px" }}>
                    QUANTITY
                  </label>
                  <div className="flex items-center bg-cream p-1 mb-3" style={{ borderRadius: "8px" }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 font-mono text-ink hover:text-clay transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="flex-1 text-center bg-transparent text-ink font-mono font-medium focus:outline-none"
                    />
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 font-mono text-ink hover:text-clay transition-colors"
                    >
                      +
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <motion.button
                    whileHover={{ scale: 1.01, opacity: 0.9 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddToCart}
                    className="w-full font-mono text-xs uppercase tracking-mono"
                    style={{
                      borderRadius: "8px",
                      height: "50px",
                      transition: "all 150ms",
                      backgroundColor: categoryColors.accent,
                      color: 'white',
                    }}
                  >
                    ADD TO CART · ${(product.prices[selectedVariant] * quantity).toFixed(2)}
                  </motion.button>
                </div>

                {/* 7× Tested Grid - 2 rows × 4 columns */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Row 1 - Tests 1-4 */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-3 flex flex-col gap-1"
                  >
                    <div className="text-[#607A5C] text-lg mb-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><rect width="5" height="5.5" x="9.5" y="16.5" rx="1"/></svg>
                    </div>
                    <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814]">
                      HPLC PURITY
                    </div>
                    <div className="text-[11px] text-[#1A1814]/60">
                      Independent lab
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-3 flex flex-col gap-1"
                  >
                    <div className="text-[#607A5C] text-lg mb-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1.5-1.5"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m6.5 12.5 1 1"/><path d="m16.5 10.5 1 1"/><path d="m10 16 1.5 1.5"/></svg>
                    </div>
                    <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814]">
                      IDENTITY
                    </div>
                    <div className="text-[11px] text-[#1A1814]/60">
                      Sequence confirmed
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-3 flex flex-col gap-1"
                  >
                    <div className="text-[#607A5C] text-lg mb-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
                    </div>
                    <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814]">
                      NET CONTENT
                    </div>
                    <div className="text-[11px] text-[#1A1814]/60">
                      Exact mg verified
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-3 flex flex-col gap-1"
                  >
                    <div className="text-[#607A5C] text-lg mb-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.1.9-2 2-2h2"/><path d="M11 4h10v10"/><path d="M15 10l5-5"/></svg>
                    </div>
                    <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814]">
                      BATCH CONSISTENCY
                    </div>
                    <div className="text-[11px] text-[#1A1814]/60">
                      Lot-to-lot stability
                    </div>
                  </motion.div>

                  {/* Row 2 - Tests 5-7 + Accent tile */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-3 flex flex-col gap-1"
                  >
                    <div className="text-[#607A5C] text-lg mb-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3"/><path d="M18 12h3"/><path d="M7.8 7.8 5.6 5.6"/><path d="M18.4 18.4l-2.2-2.2"/><path d="M7.8 16.2l-2.2 2.2"/><path d="M18.4 5.6l-2.2 2.2"/><circle cx="12" cy="12" r="7"/><path d="M12 9v6"/><path d="M9 12h6"/><path d="M12 3v1"/><path d="M12 20v1"/></svg>
                    </div>
                    <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814]">
                      ENDOTOXINS
                    </div>
                    <div className="text-[11px] text-[#1A1814]/60">
                      LAL tested
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-3 flex flex-col gap-1"
                  >
                    <div className="text-[#607A5C] text-lg mb-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16a4 4 0 0 0 8 0M7 8v8M15 8v8M12 12h.01M5 5h14"/></svg>
                    </div>
                    <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814]">
                      HEAVY METALS
                    </div>
                    <div className="text-[11px] text-[#1A1814]/60">
                      ICP-MS screened
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-3 flex flex-col gap-1"
                  >
                    <div className="text-[#607A5C] text-lg mb-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                    </div>
                    <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814]">
                      STERILITY
                    </div>
                    <div className="text-[11px] text-[#1A1814]/60">
                      Contamination-free
                    </div>
                  </motion.div>

                  {/* Accent Tile */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="bg-[#607A5C] rounded-lg p-3 flex flex-col items-center justify-center text-center col-span-1"
                  >
                    <div className="text-xl font-medium text-white leading-none">
                      7×
                    </div>
                    <div className="text-[10px] text-[#d4e8d0] tracking-widest uppercase mt-1">
                      TESTED
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lab Results Section - Bone Background */}
      <section ref={labResultsRef} className="bg-bone py-16 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={labResultsInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="flex items-center gap-4 mb-4">
              <h2 className="font-mono text-xs uppercase tracking-mono text-clay font-medium">
                LAB RESULTS
              </h2>
              <span
                className="px-3 py-1 bg-ochre text-cream font-mono text-xs"
                style={{ borderRadius: "12px" }}
              >
                LOT {product.batch} · CURRENT
              </span>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Certificate of Analysis Card */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={labResultsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-cream p-8"
              style={{ borderRadius: "16px" }}
            >
              <h3
                className="font-display text-ink mb-6"
                style={{ fontWeight: 300, fontSize: "28px" }}
              >
                Certificate of Analysis
              </h3>

              <div className="space-y-3 mb-6">
                {[
                  { label: "PURITY", value: product.purity },
                  { label: "CAS", value: product.casNumber },
                  { label: "MW", value: product.mw },
                  { label: "APPEARANCE", value: product.appearance },
                ].map((row, i) => (
                  <div key={i} className="flex items-baseline justify-between">
                    <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                      {row.label}
                    </span>
                    <div
                      className="flex-1 mx-3 border-b border-dotted"
                      style={{ borderColor: "rgba(26, 24, 20, 0.15)" }}
                    />
                    <span className="font-mono text-xs text-ink font-medium">{row.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-center mb-6">
                <div
                  className="relative flex items-center justify-center"
                  style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    border: "3px solid #C89A3C",
                  }}
                >
                  <span className="font-mono text-xs uppercase text-ochre font-medium">VERIFIED</span>
                </div>
              </div>

              <button
                className="w-full py-3 bg-clay text-cream font-mono text-xs uppercase tracking-mono hover:bg-opacity-90 transition-all"
                style={{ borderRadius: "8px" }}
              >
                ↓ DOWNLOAD PDF
              </button>
            </motion.div>

            {/* Third-Party Report Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={labResultsInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-cream p-8"
              style={{ borderRadius: "16px" }}
            >
              <h3
                className="font-display text-ink mb-6"
                style={{ fontWeight: 300, fontSize: "28px" }}
              >
                Third-Party Report
              </h3>

              <div className="space-y-4 mb-6">
                <div>
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 block mb-1">
                    TESTING LAB
                  </span>
                  <span className="font-editorial text-sm text-ink">Independent Analytics LLC</span>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 block mb-1">
                    TEST DATE
                  </span>
                  <span className="font-editorial text-sm text-ink">January 2025</span>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 block mb-1">
                    METHODS USED
                  </span>
                  <div className="flex gap-2 mt-2">
                    {["HPLC", "MS", "AAA"].map((method) => (
                      <span
                        key={method}
                        className="px-3 py-1 bg-bone text-ink font-mono text-xs"
                        style={{ borderRadius: "6px" }}
                      >
                        {method}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <button
                className="w-full py-3 bg-clay text-cream font-mono text-xs uppercase tracking-mono hover:bg-opacity-90 transition-all"
                style={{ borderRadius: "8px" }}
              >
                ↓ VIEW REPORT
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Research Applications Section - Ink Background */}
      <section ref={researchRef} className="bg-ink py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={researchInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6 }}
          >
            <div className="font-mono text-xs uppercase tracking-mono text-cream opacity-60 mb-4">
              RESEARCH APPLICATIONS
            </div>
            <h2
              className="font-display text-cream mb-8"
              style={{ fontWeight: 300, fontStyle: "italic", fontSize: "42px" }}
            >
              What the literature covers.
            </h2>

            <ul className="space-y-4 mb-12">
              {product.researchPoints.map((app, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={researchInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                  className="flex items-start space-x-3"
                >
                  <span className="text-clay mt-1">●</span>
                  <span className="font-editorial text-cream opacity-90">{app}</span>
                </motion.li>
              ))}
            </ul>

            {/* RUO Disclaimer */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={researchInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="bg-bone p-6"
              style={{ borderRadius: "12px", borderLeft: "4px solid #B8624A" }}
            >
              <p className="font-editorial text-ink italic" style={{ fontSize: "15px" }}>
                All compounds sold by Lumo are intended strictly for in vitro research and laboratory
                use only. These products are NOT intended for human consumption, medical, veterinary, or
                household use. By purchasing from Lumo, you acknowledge that you are a qualified
                researcher or institution and will use these products solely for research purposes in
                compliance with all applicable laws and regulations.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Related Compounds Section - Bone Background */}
      {relatedProducts.length > 0 && (
        <section ref={relatedRef} className="bg-bone py-16 px-6">
          <div className="container mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={relatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="font-mono text-xs uppercase tracking-mono text-clay mb-3">
                YOU MAY ALSO RESEARCH
              </div>
              <h2
                className="font-display text-ink"
                style={{ fontWeight: 300, fontSize: "36px" }}
              >
                Related Compounds
              </h2>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.map((relatedProduct, index) => (
                <motion.div
                  key={relatedProduct.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={relatedInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                  transition={{ delay: 0.2 + index * 0.1, duration: 0.5 }}
                >
                  <ProductCard product={relatedProduct} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-003</div>
    </div>
  );
}
