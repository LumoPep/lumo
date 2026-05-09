"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";

export default function JournalPage() {
  const [selectedTag, setSelectedTag] = useState("ALL");

  const tags = ["ALL", "PEPTIDES", "DOSING SCIENCE", "COA EXPLAINERS", "LONGEVITY"];

  const featuredArticles = [
    {
      number: "No.001",
      title: "BPC-157: What the Research Actually Says",
      excerpt:
        "A comprehensive review of published studies on Body Protection Compound-157, separating established findings from speculative claims.",
      readTime: "8 MIN",
      date: "MARCH 2026",
      tag: "PEPTIDES",
    },
    {
      number: "No.002",
      title: "Understanding HPLC Purity Testing",
      excerpt:
        "How High-Performance Liquid Chromatography works, what purity percentages mean, and why 98%+ matters for research applications.",
      readTime: "6 MIN",
      date: "MARCH 2026",
      tag: "COA EXPLAINERS",
    },
    {
      number: "No.003",
      title: "Reconstitution: Getting It Right",
      excerpt:
        "Step-by-step protocols for proper peptide reconstitution, storage conditions, and stability considerations for research use.",
      readTime: "5 MIN",
      date: "FEBRUARY 2026",
      tag: "DOSING SCIENCE",
    },
  ];

  const articles = [
    {
      number: "No.004",
      title: "TB-500 vs. BPC-157: Different Mechanisms",
      excerpt: "Comparing the molecular pathways and research applications of two commonly studied healing peptides.",
      readTime: "7 MIN",
      date: "FEBRUARY 2026",
      tag: "PEPTIDES",
    },
    {
      number: "No.005",
      title: "Mass Spectrometry in Peptide Verification",
      excerpt: "How MS confirms molecular structure and why it's essential alongside HPLC testing.",
      readTime: "6 MIN",
      date: "JANUARY 2026",
      tag: "COA EXPLAINERS",
    },
    {
      number: "No.006",
      title: "GHRPs: Growth Hormone Release Peptides Explained",
      excerpt: "Understanding how peptides like Ipamorelin and CJC-1295 work in research contexts.",
      readTime: "9 MIN",
      date: "JANUARY 2026",
      tag: "PEPTIDES",
    },
    {
      number: "No.007",
      title: "NAD+ Precursors: NMN vs. NR",
      excerpt: "Research comparing Nicotinamide Mononucleotide and Nicotinamide Riboside for cellular studies.",
      readTime: "10 MIN",
      date: "DECEMBER 2025",
      tag: "LONGEVITY",
    },
    {
      number: "No.008",
      title: "Peptide Storage: Temperature & Stability",
      excerpt: "Research-backed guidelines for maintaining peptide integrity during storage and transport.",
      readTime: "5 MIN",
      date: "DECEMBER 2025",
      tag: "DOSING SCIENCE",
    },
    {
      number: "No.009",
      title: "What CoA Numbers Mean: A Practical Guide",
      excerpt: "Interpreting amino acid analysis results, endotoxin levels, and mass spec data on certificates.",
      readTime: "7 MIN",
      date: "NOVEMBER 2025",
      tag: "COA EXPLAINERS",
    },
  ];

  const filteredArticles = selectedTag === "ALL"
    ? articles
    : articles.filter(a => a.tag === selectedTag);

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
      {/* Compliance Disclaimer Bar - Sticky */}
      <div className="sticky top-16 z-30 bg-cream border-t border-clay border-opacity-30 py-3 px-6">
        <div className="container mx-auto max-w-7xl">
          <p className="font-mono text-ink text-center" style={{ fontSize: "10px", letterSpacing: "0.05em" }}>
            <span className="text-clay">●</span> EDITORIAL CONTENT — All journal articles describe in vitro research findings only. Nothing on this page constitutes medical advice or dosing guidance. For research use only.
          </p>
        </div>
      </div>

      {/* Hero - Clay Background */}
      <section className="bg-clay py-16 md:py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="font-mono text-xs uppercase tracking-mono text-cream opacity-80 mb-4"
          >
            05.1 — RESEARCH JOURNAL
          </motion.div>

          <motion.h1
            className="font-display text-5xl md:text-7xl text-cream mb-6 leading-tight"
            style={{ fontWeight: 300 }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Field notes.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="font-editorial text-xl text-cream max-w-2xl"
          >
            What's actually known. What's plausible. What's not.
          </motion.p>
        </div>
      </section>

      {/* Main Content */}
      <div className="py-16 px-6 bg-bone">
        <div className="container mx-auto max-w-7xl">
          {/* Featured Articles */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-16"
          >
            <motion.h2
              variants={itemVariants}
              className="font-mono text-xs uppercase tracking-mono text-ink opacity-60 mb-8"
            >
              FEATURED
            </motion.h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {featuredArticles.map((article, index) => (
                <motion.div key={article.number} variants={itemVariants}>
                  <Link href={`/journal/${article.number.toLowerCase().replace(".", "")}`}>
                    <motion.div
                      whileHover={{ y: -8, boxShadow: "0 12px 40px rgba(26,24,20,0.12)" }}
                      transition={{ duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }}
                      className="bg-cream p-8 h-full group"
                      style={{
                        borderRadius: "24px",
                        boxShadow: "0 4px 24px rgba(26,24,20,0.06)",
                        border: "1px solid transparent",
                      }}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="font-mono text-xs uppercase tracking-mono text-clay">
                          {article.number}
                        </div>
                        <div className="px-3 py-1 bg-clay text-cream font-mono text-xs"
                          style={{ borderRadius: "12px" }}>
                          READ · {article.readTime}
                        </div>
                      </div>

                      <h3
                        className="font-display text-2xl text-ink mb-4 leading-tight"
                        style={{ fontWeight: 300, fontStyle: "italic" }}
                      >
                        {article.title}
                      </h3>

                      <p className="font-editorial text-sm text-ink opacity-70 mb-6 leading-relaxed">
                        {article.excerpt}
                      </p>

                      <div className="flex items-center justify-between mt-auto pt-4 border-t hairline-border">
                        <div className="font-mono text-xs text-ink opacity-40">
                          BY LUMO RESEARCH · {article.date}
                        </div>
                        <div className="font-mono text-xs text-clay group-hover:underline">
                          →
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Tag Filter */}
          <div className="mb-8 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <motion.button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 font-mono text-xs uppercase tracking-mono transition-all ${
                  selectedTag === tag
                    ? "bg-ink text-bone"
                    : "hairline-border text-ink hover:border-clay"
                }`}
                style={{ borderRadius: "20px" }}
              >
                {tag}
              </motion.button>
            ))}
          </div>

          {/* All Articles Grid */}
          <motion.div
            key={selectedTag}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredArticles.map((article) => (
              <motion.div key={article.number} variants={itemVariants}>
                <Link href={`/journal/${article.number.toLowerCase().replace(".", "")}`}>
                  <motion.div
                    whileHover={{ y: -4, boxShadow: "0 8px 32px rgba(26,24,20,0.1)" }}
                    className="bg-white p-6 h-full hairline-border group hover:border-clay transition-colors"
                    style={{
                      borderRadius: "12px",
                      boxShadow: "0 2px 12px rgba(26,24,20,0.04)",
                    }}
                  >
                    <div className="font-mono text-xs uppercase tracking-mono text-clay mb-2">
                      {article.number}
                    </div>

                    <h3
                      className="font-display text-xl text-ink mb-3 leading-tight"
                      style={{ fontWeight: 300, fontStyle: "italic" }}
                    >
                      {article.title}
                    </h3>

                    <p className="font-editorial text-sm text-ink opacity-70 mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-ink opacity-40">{article.readTime}</span>
                      <span className="font-mono text-clay group-hover:underline">READ →</span>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Page Code */}
      <div className="fixed bottom-6 left-6 font-mono text-xs text-ink opacity-20">L-009</div>
    </div>
  );
}
