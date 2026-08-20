"use client";

import { useState, useRef, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getProductBySlug, PRODUCTS, CATEGORY_COLORS } from "@/data/products";
import { useCartStore } from "@/lib/store";
import { showToast } from "@/components/Toast";
import ProductCard from "@/components/ProductCard";
import CoAViewer from "@/components/CoAViewer";
import BundleSelector from "@/components/BundleSelector";
import ResearchSection from "@/components/ResearchSection";
import TrustStamps from "@/components/ui/TrustStamps";
import { notFound } from "next/navigation";
import { motion, useInView } from "framer-motion";

export default function ProductPage() {
  const params = useParams();
  const product = getProductBySlug(params.slug as string);

  if (!product) {
    return notFound();
  }

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [bundleQty, setBundleQty] = useState(1);
  const [cartPrice, setCartPrice] = useState(product.prices[0]);
  const [activeTab, setActiveTab] = useState("technical");

  const { addItem, openCart } = useCartStore();

  // Reset cart state when variant changes
  useEffect(() => {
    setQuantity(1);
    setBundleQty(1);
    setCartPrice(product.prices[selectedVariant]);
  }, [selectedVariant, product.prices]);

  const labResultsRef = useRef(null);
  const researchRef = useRef(null);
  const relatedRef = useRef(null);

  const labResultsInView = useInView(labResultsRef, { once: true, margin: "-100px" });
  const researchInView = useInView(researchRef, { once: true, margin: "-100px" });
  const relatedInView = useInView(relatedRef, { once: true, margin: "-100px" });

  const categoryColors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Metabolic Research'];

  // Get lot number for current variant
  const lotNumber = product.batch || (product.lotNumbers ? product.lotNumbers[selectedVariant] : '');

  const handleAddToCart = () => {
    const size = product.sizes[selectedVariant];
    const basePrice = product.prices[selectedVariant];
    const sku = product.skus[selectedVariant];

    // Total items = quantity × bundle qty
    const totalItems = quantity * bundleQty;

    // Add items to cart
    for (let i = 0; i < totalItems; i++) {
      addItem({
        productId: product.id.toString(),
        productName: product.name,
        variant: size,
        price: basePrice,
        sku: sku,
      });
    }

    showToast(`Added ${totalItems}x ${product.name} (${size}) to cart`);
    openCart();
  };

  // Get related products (same category, exclude current)
  const relatedProducts = PRODUCTS
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  const tabs = [
    { id: "technical", label: "Technical Specs" },
    { id: "coa", label: "CoA" },
    { id: "testing", label: "Testing" },
    { id: "storage", label: "Storage" },
    { id: "research", label: "Research" },
  ];

  return (
    <div className="min-h-screen">
      {/* Main Product Section - Bone Background */}
      <section className="bg-bone py-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Image + Trust Stamps — order 1 mobile, col 1-7 row 1 desktop */}
            <div className="order-1 lg:col-span-7 lg:row-start-1">
              {/* Image + Trust Stamps Grid */}
              <div className="lg:grid lg:grid-cols-[80px_1fr] gap-4">
                {/* Trust Stamps */}
                <div className="hidden lg:flex items-center justify-center">
                  <TrustStamps accentColor={categoryColors.accent} />
                </div>

                {/* Product Image */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="p-2 lg:p-8"
                  style={{
                    position: 'relative',
                    background: 'transparent',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    key={product.images[selectedVariant] || product.images[0]}
                    src={product.images[selectedVariant] || product.images[0]}
                    alt={product.name}
                    className="w-full object-contain max-h-[320px] lg:max-h-none hover:scale-110"
                    style={{
                      filter: 'drop-shadow(-8px 16px 32px rgba(26,24,20,0.18))',
                      mixBlendMode: 'multiply',
                      transition: 'transform 0.5s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.1)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; }}
                  />
                </motion.div>
              </div>
            </div>

            {/* Tabs — order 3 mobile, col 1-7 row 2 desktop */}
            <div className="order-3 lg:col-span-7 lg:row-start-2">
              {/* Tabbed Section */}
              <div className="bg-cream" style={{ borderRadius: "16px", padding: "32px" }}>
                {/* Tab Navigation */}
                <div className="flex space-x-1 border-b hairline-border mb-8 overflow-x-auto whitespace-nowrap scrollbar-hide">
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative px-6 py-3 font-mono text-xs uppercase tracking-mono transition-colors ${
                        activeTab === tab.id ? "text-ink" : "text-ink opacity-60 hover:opacity-85"
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
                    >
                      <h3 style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,24,20,0.65)', marginBottom: '12px' }}>
                        CHEMICAL PROPERTIES
                      </h3>
                      <div className="grid grid-cols-2 gap-3 mb-4">
                        <div style={{ background: '#EBE2CF', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,24,20,0.65)', display: 'block', marginBottom: '6px' }}>
                            CAS NUMBER
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'monospace', color: '#1A1814' }}>
                            {product.casNumber}
                          </span>
                        </div>

                        <div style={{ background: '#EBE2CF', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,24,20,0.65)', display: 'block', marginBottom: '6px' }}>
                            MOLECULAR WEIGHT
                          </span>
                          <span style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'monospace', color: '#1A1814' }}>
                            {product.mw}
                          </span>
                        </div>

                        <div className="col-span-2" style={{ background: '#EBE2CF', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,24,20,0.65)', display: 'block', marginBottom: '6px' }}>
                            MOLECULAR FORMULA
                          </span>
                          <span style={{ fontSize: '13px', fontWeight: 500, fontFamily: 'monospace', color: '#1A1814' }}>
                            {product.formula}
                          </span>
                        </div>
                      </div>

                      <h3 style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,24,20,0.65)', marginBottom: '12px', marginTop: '16px' }}>
                        PHYSICAL PROPERTIES
                      </h3>
                      <div className="space-y-3">
                        <div style={{ background: '#EBE2CF', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,24,20,0.65)', display: 'block', marginBottom: '6px' }}>
                            APPEARANCE
                          </span>
                          <span style={{ fontFamily: 'inherit', fontStyle: 'normal', fontSize: '14px', color: '#1A1814' }}>
                            {product.appearance}
                          </span>
                        </div>

                        {product.sequence && product.sequence !== 'N/A' && (
                          <div style={{ background: '#EBE2CF', borderRadius: '8px', padding: '12px 14px', marginBottom: '8px' }}>
                            <span style={{ fontSize: '10px', fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,24,20,0.65)', display: 'block', marginBottom: '6px' }}>
                              SEQUENCE
                            </span>
                            <span style={{ fontSize: '13px', fontFamily: 'monospace', lineHeight: 1.6, color: '#1A1814', wordBreak: 'break-all', whiteSpace: 'normal' }}>
                              {product.sequence}
                            </span>
                          </div>
                        )}
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
                      <CoAViewer product={product} selectedVariant={selectedVariant} />
                    </motion.div>
                  )}

                  {activeTab === "testing" && (
                    <motion.div
                      key="testing"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-6"
                    >
                      <h3 className="text-[10px] font-medium tracking-widest uppercase text-\[#1A1814\]/65 mb-4">
                        INDEPENDENT VERIFICATION — THIRD-PARTY LAB
                      </h3>

                      {/* 7× Testing Grid - 4+4 Layout */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {/* Test 1 - HPLC Purity */}
                        <div className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl mb-2"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><rect width="5" height="5.5" x="9.5" y="16.5" rx="1"/></svg>
                          <div className="text-[11px] font-medium tracking-widest uppercase text-[#1A1814]">
                            HPLC PURITY
                          </div>
                          <div className="text-[12px] text-\[#1A1814\]/65 mt-1">
                            Independent lab
                          </div>
                        </div>

                        {/* Test 2 - Identity */}
                        <div className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl mb-2"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1.5-1.5"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m6.5 12.5 1 1"/><path d="m16.5 10.5 1 1"/><path d="m10 16 1.5 1.5"/></svg>
                          <div className="text-[11px] font-medium tracking-widest uppercase text-[#1A1814]">
                            IDENTITY
                          </div>
                          <div className="text-[12px] text-\[#1A1814\]/65 mt-1">
                            Sequence confirmed
                          </div>
                        </div>

                        {/* Test 3 - Potency */}
                        <div className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-lg p-4">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-2xl mb-2"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                          <div className="text-[11px] font-medium tracking-widest uppercase text-[#1A1814]">
                            POTENCY
                          </div>
                          <div className="text-[12px] text-\[#1A1814\]/65 mt-1">
                            Strength confirmed
                          </div>
                        </div>

                        {/* Accent Tile - VERIFIED */}
                        <div className="bg-[#607A5C] rounded-lg p-4 flex flex-col items-center justify-center text-center">
                          <div className="text-3xl font-medium text-white leading-none">
                            ✓
                          </div>
                          <div className="text-[11px] text-[#d4e8d0] tracking-widest uppercase mt-1">
                            VERIFIED
                          </div>
                        </div>
                      </div>
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

            {/* Right Column — order 2 mobile, col 8-12 rows 1-2 desktop */}
            <div className="order-2 lg:col-span-5 lg:col-start-8 lg:row-start-1 lg:row-span-2">
              {/* Category Badge */}
              <div className="mb-3">
                <Link href={`/products?category=${encodeURIComponent(product.category)}`}>
                  <span
                    className="inline-block px-3 py-1 font-mono text-xs uppercase tracking-mono hover:opacity-80 transition-opacity cursor-pointer"
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
                </Link>
              </div>

              {/* Product Name */}
              <h1
                className="font-display text-ink mb-2"
                style={{ fontWeight: 300, fontStyle: "italic", fontSize: "42px", lineHeight: 1.1 }}
              >
                {product.name}
              </h1>

              {/* Description */}
              <p className="font-editorial text-ink opacity-80 mb-5" style={{ fontSize: "15px", lineHeight: 1.5 }}>
                {product.synopsis}
              </p>

              {/* Size Selector */}
              <div className="mb-4">
                <label className="font-mono uppercase tracking-mono text-ink opacity-70 block mb-2" style={{ fontSize: "10px", letterSpacing: "1.5px" }}>
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

              {/* Bundle Selector + Add to Cart */}
              <div className="mb-4">
                <BundleSelector
                  key={selectedVariant}
                  basePrice={product.prices[selectedVariant]}
                  productSlug={product.slug}
                  onSelect={(qty, bundle, price) => {
                    setQuantity(qty);
                    setBundleQty(bundle);
                    setCartPrice(price);
                  }}
                />

                {/* Add to Cart Button */}
                <motion.button
                  whileHover={{ scale: 1.01, opacity: 0.9 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleAddToCart}
                  className="w-full py-5 rounded-lg text-sm font-semibold tracking-widest uppercase text-white transition-colors shadow-lg"
                  style={{
                    backgroundColor: categoryColors.accent || '#B8624A',
                  }}
                >
                  ADD TO CART · ${cartPrice.toFixed(2)}
                </motion.button>

                {/* Shipping Info Strip */}
                <div className="border-t border-[#EBE2CF] pt-3 mt-3 flex items-center justify-between text-[11px] text-[#1A1814]/65">
                  <div className="flex items-center gap-1.5">
                    <i className="ti ti-truck" style={{ fontSize: '14px' }}></i>
                    <span>Free shipping on orders over $150</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <i className="ti ti-clock" style={{ fontSize: '14px' }}></i>
                    <span>2-day delivery</span>
                  </div>
                </div>
              </div>

              {/* Lot + Report Grid */}
              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-cream hairline-border p-3" style={{ borderRadius: "12px" }}>
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-70 block mb-1" style={{ fontSize: "10px" }}>
                    LOT NUMBER
                  </span>
                  <span className="font-mono text-sm text-ink font-medium">{lotNumber}</span>
                </div>
                <div className="bg-cream hairline-border p-3" style={{ borderRadius: "12px" }}>
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-70 block mb-1" style={{ fontSize: "10px" }}>
                    REPORT NO.
                  </span>
                  <span className="font-mono text-sm text-ink font-medium">{product.report}</span>
                </div>
              </div>

              {/* Purity Display */}
              <div className="bg-cream hairline-border p-5 mb-5" style={{ borderRadius: "12px" }}>
                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-70">
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

              {/* Independent Verification Strip */}
              <div className="mb-5">
                <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#1A1814', marginBottom: '10px' }}>
                  Third-Party Verified
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { icon: 'ti-flask', label: 'HPLC Purity', sub: 'Independent lab' },
                    { icon: 'ti-dna', label: 'Identity', sub: 'Sequence confirmed' },
                    { icon: 'ti-activity', label: 'Potency', sub: 'Strength confirmed' },
                  ].map((chip, i) => (
                    <div key={i} style={{ background: '#F5EFE4', border: '0.5px solid rgba(26,24,20,0.12)', borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <i className={`ti ${chip.icon}`} style={{ fontSize: '14px', color: '#607A5C' }} aria-hidden="true" />
                      <span style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1A1814', lineHeight: 1.3 }}>{chip.label}</span>
                      <span style={{ fontSize: '10px', color: '#4a3f35', lineHeight: 1.3 }}>{chip.sub}</span>
                    </div>
                  ))}
                  {/* Accent Tile */}
                  <div style={{ background: '#607A5C', borderRadius: '8px', padding: '10px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ fontSize: '22px', fontWeight: 500, color: '#F5EFE4', lineHeight: 1 }}>
                      ✓
                    </div>
                    <div style={{ fontSize: '9px', fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#F5EFE4', lineHeight: 1.3, marginTop: '4px' }}>
                      VERIFIED
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* RUO Disclaimer - Full Width Below Grid */}
          <div className="bg-clay p-4 mt-6" style={{ borderRadius: "12px" }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-bone text-base">⚠</span>
              <h4
                className="font-mono uppercase text-bone font-medium"
                style={{ fontSize: "10px", letterSpacing: "1.5px" }}
              >
                RESEARCH USE ONLY
              </h4>
            </div>
            <p className="font-editorial italic" style={{ fontSize: "12px", lineHeight: 1.5, color: 'rgba(245,239,228,0.90)' }}>
              This compound is sold strictly for in vitro research and laboratory use. Not for
              human or animal consumption. Not a drug, food, or supplement. By purchasing you
              confirm you are a qualified researcher and will use this compound in compliance
              with all applicable laws. Must be 21 or older.
            </p>
          </div>

          {/* Research Section */}
          <ResearchSection slug={product.slug} />
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
                LOT {lotNumber} · CURRENT
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
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-70 block mb-1">
                    TESTING LAB
                  </span>
                  <span className="font-editorial text-sm text-ink">Independent Analytics LLC</span>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-70 block mb-1">
                    TEST DATE
                  </span>
                  <span className="font-editorial text-sm text-ink">January 2025</span>
                </div>
                <div>
                  <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-70 block mb-1">
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
        <section ref={relatedRef} className="bg-bone py-16 px-6 hidden md:block">
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
