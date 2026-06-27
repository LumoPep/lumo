"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState, useMemo } from "react";
import { RESEARCH_LIBRARY, LibraryStudy } from "@/data/research-library";
import { CATEGORY_COLORS } from "@/data/products";

export default function ResearchLibraryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  // All unique categories from the research library
  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    RESEARCH_LIBRARY.forEach(study => {
      study.categories.forEach(cat => cats.add(cat));
    });
    return ["All", ...Array.from(cats).sort()];
  }, []);

  // Filter studies based on search and category
  const filteredStudies = useMemo(() => {
    let filtered = RESEARCH_LIBRARY;

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(study =>
        study.categories.includes(selectedCategory)
      );
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(study =>
        study.title.toLowerCase().includes(query) ||
        study.authors.toLowerCase().includes(query) ||
        study.summary.toLowerCase().includes(query) ||
        study.journal.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
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
      {/* Hero Section */}
      <section className="bg-clay py-16 md:py-20 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.h1
            className="font-display text-5xl md:text-7xl text-cream mb-4 leading-tight"
            style={{ fontWeight: 300 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Research Library
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.85 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-editorial text-xl text-cream max-w-3xl"
          >
            Peer-reviewed studies referenced across Lumo's compound catalogue.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-12 px-6" style={{ position: 'relative', overflow: 'visible' }}>
        <div className="container mx-auto max-w-7xl" style={{ position: 'relative', zIndex: 1 }}>
          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6"
          >
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by compound, keyword, or author..."
              className="w-full px-6 py-4 bg-cream border border-[#EBE2CF] rounded-xl text-ink placeholder-ink placeholder:opacity-40 focus:outline-none focus:border-clay transition-colors font-editorial"
              style={{ fontSize: "15px" }}
            />
          </motion.div>

          {/* Category Filter Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex flex-wrap gap-2"
          >
            {allCategories.map((category) => {
              const isSelected = selectedCategory === category;
              const categoryColor = category === "All"
                ? "#B8624A"
                : (CATEGORY_COLORS[category]?.accent || "#B8624A");

              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className="px-4 py-2 font-mono text-xs uppercase tracking-mono transition-all"
                  style={{
                    borderRadius: "20px",
                    backgroundColor: isSelected ? categoryColor : "transparent",
                    color: isSelected ? "#F5EFE4" : "#1A1814",
                    border: `1px solid ${isSelected ? categoryColor : "rgba(26,24,20,0.15)"}`,
                  }}
                >
                  {category}
                </button>
              );
            })}
          </motion.div>

          {/* Study Count */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 font-mono text-xs uppercase tracking-mono text-ink opacity-55"
          >
            Showing {filteredStudies.length} {filteredStudies.length === 1 ? "study" : "studies"}
          </motion.div>

          {/* Study Grid */}
          {filteredStudies.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 gap-4"
            >
              {filteredStudies.map((study, index) => (
                <motion.div key={study.url} variants={itemVariants}>
                  <div
                    className="bg-[#F5EFE4] border border-[#EBE2CF] rounded-xl p-5 h-full flex flex-col"
                  >
                    {/* Top Row - Journal and Year */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[#B8624A]">
                        {study.journal}
                      </div>
                      <div className="font-mono text-[10px] uppercase tracking-widest text-[#607A5C]">
                        {study.year}
                      </div>
                    </div>

                    {/* Title */}
                    <a
                      href={study.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium text-[#1A1814] hover:text-[#B8624A] transition-colors mb-2 leading-snug"
                    >
                      {study.title}
                    </a>

                    {/* Authors */}
                    <div className="text-[11px] text-[#1A1814] opacity-60 mb-2">
                      {study.authors}
                    </div>

                    {/* Summary */}
                    <p
                      className="text-[12px] text-[#1A1814] leading-relaxed flex-1"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: "vertical",
                        overflow: "hidden",
                      }}
                    >
                      {study.summary}
                    </p>

                    {/* Divider */}
                    <div className="border-t border-[#EBE2CF] mt-3 pt-3 flex items-center justify-between">
                      {/* Left - PMID Badge */}
                      <div>
                        {study.pmid && (
                          <a
                            href={study.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] bg-[#607A5C]/10 text-[#3B5438] px-2 py-0.5 rounded-full font-medium inline-block"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          >
                            PMID {study.pmid}
                          </a>
                        )}
                      </div>

                      {/* Right - Product Tags */}
                      <div className="flex flex-wrap gap-1 justify-end">
                        {study.products.slice(0, 3).map((product) => {
                          const categoryColor = CATEGORY_COLORS[product.category]?.accent || '#B8624A';
                          return (
                            <Link
                              key={product.slug}
                              href={`/products/${product.slug}`}
                              className="text-[9px] hover:opacity-90 px-2 py-0.5 rounded-full transition-opacity"
                              style={{
                                fontFamily: 'JetBrains Mono, monospace',
                                backgroundColor: `${categoryColor}20`,
                                color: categoryColor,
                              }}
                            >
                              {product.name}
                            </Link>
                          );
                        })}
                        {study.products.length > 3 && (
                          <span
                            className="text-[9px] bg-[#1A1814]/5 text-[#1A1814] opacity-70 px-2 py-0.5 rounded-full"
                            style={{ fontFamily: 'JetBrains Mono, monospace' }}
                          >
                            +{study.products.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <p className="font-editorial text-lg text-ink opacity-55">
                No studies found matching your search.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
