"use client";

import { useState, useMemo, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { PRODUCTS, CATEGORIES, CATEGORY_COLORS } from "@/data/products";
import ProductCard from "@/components/ProductCard";

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [searchFocused, setSearchFocused] = useState(false);
  const [prevCount, setPrevCount] = useState(0);
  const [displayCount, setDisplayCount] = useState(0);

  // Handle URL category parameter on page load
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      // Decode URL-encoded category names
      const decodedCategory = decodeURIComponent(categoryParam.replace(/\+/g, ' '));
      if (CATEGORIES.includes(decodedCategory)) {
        setSelectedCategory(decodedCategory);
      }
    }
  }, [searchParams]);

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...PRODUCTS];

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.category.toLowerCase().includes(query) ||
          p.casNumber.toLowerCase().includes(query)
      );
    }

    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price-low":
          return (
            Math.min(...a.prices) -
            Math.min(...b.prices)
          );
        case "price-high":
          return (
            Math.min(...b.prices) -
            Math.min(...a.prices)
          );
        case "purity":
          // Parse purity percentages for comparison (handle 'USP Grade' case)
          const getPurity = (p: string) => p === 'USP Grade' ? 0 : parseFloat(p.replace('%', ''));
          return getPurity(b.purity) - getPurity(a.purity);
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, selectedCategory, sortBy]);

  // Animate count changes
  useEffect(() => {
    const newCount = filteredAndSortedProducts.length;
    if (newCount !== prevCount) {
      let start = displayCount;
      const diff = newCount - start;
      const duration = 300;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setDisplayCount(Math.round(start + diff * eased));

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setPrevCount(newCount);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [filteredAndSortedProducts.length, prevCount, displayCount]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.4 },
    },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section - Ink Background */}
      <section className="bg-ink py-16 md:py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs uppercase tracking-mono text-clay mb-4"
          >
            02.1 — COMPOUND CATALOG
          </motion.div>

          {/* Animated headline */}
          <motion.h1
            className="font-display text-5xl md:text-7xl text-cream mb-6 leading-tight"
            style={{ fontWeight: 300 }}
          >
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="inline-block mr-3"
            >
              A peptide is a sentence
            </motion.span>
            <motion.span
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block text-clay italic"
            >
              written in amino acids.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-editorial text-xl text-cream max-w-2xl"
          >
            Every compound 7× independently tested — purity, identity, content, consistency, endotoxins, heavy metals, and sterility.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12 px-6 bg-bone">
        <div className="container mx-auto max-w-7xl">
          {/* Search Bar - Expands on focus */}
          <motion.div
            animate={{ width: searchFocused ? "100%" : "100%" }}
            className="mb-8 max-w-2xl mx-auto"
          >
            <div className="relative">
              <motion.input
                type="text"
                placeholder="Search by name, category, or CAS number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                whileFocus={{ scale: 1.01 }}
                className="w-full px-6 py-4 bg-cream hairline-border text-ink placeholder-ink placeholder-opacity-40 focus:outline-none focus:border-clay font-functional text-sm transition-all"
                style={{ borderRadius: "8px" }}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-ink opacity-55">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                  <circle cx="9" cy="9" r="6" strokeWidth="2" />
                  <path d="M14 14L18 18" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            </div>
          </motion.div>

          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '32px', justifyContent: 'center' }}>
            {['All', 'Metabolic Research', 'Tissue Repair Research', 'Secretagogue Research', 'Dermal Research', 'Cellular Research', 'Neuro Research', 'Blends', 'Ancillary'].map((cat) => {
              const categoryColors = cat === 'All'
                ? { accent: '#1A1814', label: '#1A1814', tint: '#1A1814' }
                : CATEGORY_COLORS[cat] || CATEGORY_COLORS['Metabolic Research'];
              const isSelected = selectedCategory === cat;

              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`category-pill ${isSelected ? 'selected' : ''}`}
                  data-category={cat}
                  style={{
                    '--category-color': categoryColors.accent,
                    borderRadius: '999px',
                    border: `1.5px solid ${isSelected ? categoryColors.accent : 'rgba(26,24,20,0.15)'}`,
                    background: isSelected ? categoryColors.accent : 'white',
                    color: isSelected ? 'white' : '#1A1814',
                    padding: '6px 18px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    fontFamily: 'inherit',
                    fontWeight: isSelected ? 500 : 400,
                  } as React.CSSProperties}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Count and Sort */}
          <div className="flex items-center justify-between mb-8">
            <motion.div
              key={displayCount}
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              className="font-mono text-sm uppercase tracking-mono text-ink"
            >
              Showing <span className="text-clay font-medium">{displayCount}</span> compound
              {displayCount !== 1 ? "s" : ""}
            </motion.div>

            <div className="flex items-center space-x-3">
              <label className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
                Sort by:
              </label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 pr-10 bg-cream text-ink font-mono text-xs uppercase tracking-mono focus:outline-none focus:border-clay cursor-pointer appearance-none"
                  style={{
                    borderRadius: "4px",
                    border: "1px solid rgba(26,24,20,0.12)"
                  }}
                >
                  <option value="name">Name (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="purity">Purity (Highest First)</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-clay">
                  ▼
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid with Stagger Animation */}
          <AnimatePresence mode="wait">
            {filteredAndSortedProducts.length > 0 ? (
              <motion.div
                key={`${selectedCategory}-${sortBy}-${searchQuery}`}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
              >
                {filteredAndSortedProducts.map((product) => (
                  <motion.div key={product.id} variants={itemVariants} className="h-full">
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center py-16 bg-cream hairline-border"
                style={{ borderRadius: "12px" }}
              >
                <p className="font-editorial text-ink opacity-60 mb-4">
                  No compounds found matching your criteria
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="font-mono text-xs uppercase tracking-mono text-clay hover:underline"
                >
                  → Clear filters
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">
        L-002
      </div>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      <style jsx global>{`
        .category-pill:not(.selected):hover {
          background: color-mix(in srgb, var(--category-color) 25%, white) !important;
          border-color: var(--category-color) !important;
        }
      `}</style>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-bone" />}>
      <ProductsPageContent />
    </Suspense>
  );
}
