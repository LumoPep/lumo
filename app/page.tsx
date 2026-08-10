"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PRODUCTS, getFeaturedProducts, CATEGORY_COLORS } from "@/data/products";
import ProductCard from "@/components/ProductCard";
import LumoLogo from "@/components/LumoLogo";

// Add hover effect for test chips
const testChipStyles = `
  .test-chip {
    transition: all 0.2s ease;
    cursor: default;
  }
  .test-chip:hover {
    transform: scale(1.04);
    box-shadow: 0 0 0 2px #607A5C;
  }
`;

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [heroProductIndex, setHeroProductIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const heroRef = useRef(null);

  // Parallax scroll for hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, -30]);

  // Auto-rotate hero product card
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setHeroProductIndex((prev) => (prev + 1) % PRODUCTS.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const updateScrollButtons = () => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);

      // Update active index
      const cardWidth = carouselRef.current.querySelector('[data-carousel-item]')?.clientWidth || 0;
      const gap = 24;
      const newIndex = Math.round(scrollLeft / (cardWidth + gap));
      setActiveCarouselIndex(newIndex);
    }
  };

  useEffect(() => {
    updateScrollButtons();
    window.addEventListener("resize", updateScrollButtons);
    return () => window.removeEventListener("resize", updateScrollButtons);
  }, []);

  const scroll = (direction: "left" | "right") => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      carouselRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(updateScrollButtons, 300);
    }
  };

  const categoryColors = {
    "Tissue Repair Research": "#B8624A",
    "Secretagogue Research": "#C89A3C",
    "Cellular Research": "#6D7A5C",
    "Melanocortin": "#1A1814",
    "Neuro Research": "#B8624A",
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  const headingVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.25, 0.1, 0.25, 1] as const },
    },
  };

  // Counter animation hook
  const useCountUp = (end: number, duration: number = 1500, inView: boolean) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!inView) return;

      let startTime: number;
      let animationFrame: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);

        // Ease-out function
        const easeOut = 1 - Math.pow(1 - progress, 3);
        setCount(Math.floor(easeOut * end));

        if (progress < 1) {
          animationFrame = requestAnimationFrame(animate);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }, [end, duration, inView]);

    return count;
  };

  // Section refs for scroll triggers
  const trustRef = useRef(null);
  const carouselSectionRef = useRef(null);
  const howItWorksRef = useRef(null);
  const coaRef = useRef(null);
  const categoriesRef = useRef(null);
  const ctaRef = useRef(null);

  const trustInView = useInView(trustRef, { once: true, margin: "-100px" });
  const carouselInView = useInView(carouselSectionRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const coaInView = useInView(coaRef, { once: true, margin: "-100px" });
  const categoriesInView = useInView(categoriesRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const currentProduct = PRODUCTS[heroProductIndex];
  const lowestPrice = Math.min(...currentProduct.prices);

  return (
    <div className="overflow-x-hidden">
      <style dangerouslySetInnerHTML={{ __html: testChipStyles }} />
      {/* HERO SECTION - Clean Light Hero with 2 Floating Vials */}
      <section style={{ position: 'relative', overflow: 'hidden', minHeight: '520px', background: '#F5EFE4', paddingTop: '0', paddingBottom: '80px', paddingLeft: '24px', paddingRight: '24px' }}>
        <div className="container mx-auto max-w-7xl relative">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '48px', alignItems: 'flex-start' }}>
            {/* Left Side - Staggered Word Animation */}
            <div style={{ width: '50%', paddingTop: '40px', minWidth: '400px', flex: '1 1 400px' }}>
              {/* Eyebrow - slides up + fades in */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className="font-mono text-xs uppercase tracking-mono"
                style={{ color: '#1A1814', marginTop: 0, marginBottom: '12px' }}
              >
                LOT 24·11·B · NOW SHIPPING
              </motion.div>

              {/* Headline - words animate in one by one */}
              <motion.h1
                className="font-display text-6xl md:text-8xl mb-8 leading-[0.95]"
                style={{ fontWeight: 300, letterSpacing: "-0.035em", color: '#1A1814', y: heroY }}
              >
                {["Precision", "peptides", "for"].map((word, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + i * 0.1 }}
                    className="inline-block mr-[0.25em]"
                  >
                    {word}
                  </motion.span>
                ))}{" "}
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                  className="italic inline-block"
                  style={{ color: '#B8624A' }}
                >
                  serious
                </motion.span>{" "}
                <motion.span
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                  className="inline-block"
                >
                  research.
                </motion.span>
              </motion.h1>

              {/* Subheading slogan */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="font-editorial text-xl mb-4 leading-relaxed max-w-lg italic"
                style={{ fontSize: "22px", color: 'rgba(26,24,20,0.75)' }}
              >
                Light, made measurable.
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="font-editorial text-base mb-10 leading-relaxed max-w-lg"
                style={{ color: 'rgba(26,24,20,0.75)' }}
              >
                7× independently tested. Every batch verified by third-party accredited labs.
              </motion.p>

              {/* CTA buttons - slide up together */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex items-center gap-4 flex-wrap"
              >
                <Link
                  href="/products"
                  className="px-8 py-4 font-mono text-xs uppercase tracking-mono transition-all active:scale-[0.97]"
                  style={{ borderRadius: "8px", background: '#B8624A', color: 'white' }}
                >
                  → SEE CURRENT LOTS
                </Link>
                <Link
                  href="/coa"
                  className="px-8 py-4 border-2 font-mono text-xs uppercase tracking-mono transition-all active:scale-[0.97]"
                  style={{ borderRadius: "8px", borderColor: '#1A1814', color: '#1A1814', background: 'transparent' }}
                >
                  READ A COA
                </Link>
              </motion.div>
            </div>

            {/* Right Side - 3 Floating Vials */}
            <div className="hidden md:block" style={{ width: '50%', position: 'relative', height: '560px', minWidth: '400px', flex: '1 1 400px', paddingTop: '20px', background: 'transparent' }}>
              {/* Large front vial - 504px, absolute positioned */}
              <img
                src='/images/products/ghk-cu-v2.png'
                alt='GHK-Cu research vial'
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '140px',
                  width: '504px',
                  height: 'auto',
                  animation: 'float2 4s ease-in-out infinite',
                  filter: 'drop-shadow(-8px 20px 32px rgba(26,24,20,0.2))',
                  zIndex: 2,
                  background: 'transparent',
                  mixBlendMode: 'multiply',
                }}
              />
              {/* Vial shadow for large front vial */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  right: '250px',
                  width: '240px',
                  height: '24px',
                  background: 'radial-gradient(ellipse, rgba(26,24,20,0.15) 0%, rgba(26,24,20,0.05) 50%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(12px)',
                  zIndex: 1,
                }}
              />

              {/* Third vial - 454px, to the right of front vial */}
              <img
                src='/images/products/bpc-157-v2.png'
                alt='BPC-157 research vial'
                style={{
                  position: 'absolute',
                  bottom: '40px',
                  right: '-45px',
                  width: '454px',
                  height: 'auto',
                  animation: 'float3 4.7s ease-in-out infinite',
                  filter: 'drop-shadow(-7px 18px 28px rgba(26,24,20,0.18))',
                  opacity: 0.85,
                  zIndex: 1,
                  background: 'transparent',
                  mixBlendMode: 'multiply',
                }}
              />
              {/* Vial shadow for third vial */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '28px',
                  right: '65px',
                  width: '212px',
                  height: '23px',
                  background: 'radial-gradient(ellipse, rgba(26,24,20,0.13) 0%, rgba(26,24,20,0.04) 50%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(11px)',
                  zIndex: 0,
                }}
              />

              {/* Smaller back vial - 360px, absolute positioned */}
              <img
                src='/images/products/cjc-ipamorelin-v2.png'
                alt='CJC+Ipamorelin research vial'
                style={{
                  position: 'absolute',
                  bottom: '70px',
                  right: '370px',
                  width: '360px',
                  height: 'auto',
                  animation: 'float1 5s ease-in-out infinite',
                  filter: 'drop-shadow(-6px 16px 24px rgba(26,24,20,0.15))',
                  opacity: 0.7,
                  zIndex: 1,
                  background: 'transparent',
                  mixBlendMode: 'multiply',
                }}
              />
              {/* Vial shadow for smaller back vial */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '58px',
                  right: '450px',
                  width: '168px',
                  height: '22px',
                  background: 'radial-gradient(ellipse, rgba(26,24,20,0.12) 0%, rgba(26,24,20,0.04) 50%, transparent 70%)',
                  borderRadius: '50%',
                  filter: 'blur(10px)',
                  zIndex: 0,
                }}
              />
            </div>
          </div>
        </div>

      </section>

      {/* TICKER STRIP - Auto-scrolling compound purity ticker */}
      <div className="bg-ink py-4 overflow-hidden ticker-container">
        <div className="ticker-content">
          <div className="ticker-text">
            <span className="text-ochre">· 7× INDEPENDENTLY TESTED ·</span>
            {PRODUCTS.filter(p => p.category !== 'Ancillary').map((product, index) => (
              <span key={index}>
                {' '}<span className="text-clay">··</span> {product.name.toUpperCase()} · <span className="text-ochre">{product.purity}</span>{' '}
                {(index + 1) % 6 === 0 && <span className="text-ochre">·· 7× INDEPENDENTLY TESTED ··</span>}
              </span>
            ))}
            <span className="text-clay">··</span>
          </div>
          <div className="ticker-text" aria-hidden="true">
            <span className="text-ochre">· 7× INDEPENDENTLY TESTED ·</span>
            {PRODUCTS.filter(p => p.category !== 'Ancillary').map((product, index) => (
              <span key={index}>
                {' '}<span className="text-clay">··</span> {product.name.toUpperCase()} · <span className="text-ochre">{product.purity}</span>{' '}
                {(index + 1) % 6 === 0 && <span className="text-ochre">·· 7× INDEPENDENTLY TESTED ··</span>}
              </span>
            ))}
            <span className="text-clay">··</span>
          </div>
        </div>
      </div>

      {/* UNIFIED SECTION: 7× Testing + Product Carousel - Clay Left Border */}
      <div style={{ borderLeft: '4px solid #B8624A', background: '#F5EFE4' }}>
        {/* 7× TESTING FRAMEWORK */}
        <section ref={trustRef} className="pt-16 pb-0 px-8">
          <motion.div
            className="container mx-auto max-w-7xl"
            variants={containerVariants}
            initial="hidden"
            animate={trustInView ? "visible" : "hidden"}
          >
            {/* Header - Left aligned */}
            <motion.div variants={itemVariants} className="mb-10">
              <h2 className="text-[10px] font-medium tracking-widest uppercase text-[#B8624A] mb-3">
                7× INDEPENDENTLY TESTED
              </h2>
              <p className="text-2xl font-serif italic text-[#1A1814]">
                Every batch. Every lot. No exceptions.
              </p>
            </motion.div>

            {/* 7 Test Tiles - Horizontal Row with Hover Effect */}
            <motion.div variants={itemVariants} className="flex flex-wrap gap-3 max-w-5xl">
              <div className="test-chip bg-[#F5EFE4] border border-[#1A1814]/10 rounded-lg px-4 py-3 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 2v7.31"/><path d="M14 9.3V1.99"/><path d="M8.5 2h7"/><path d="M14 9.3a6.5 6.5 0 1 1-4 0"/><rect width="5" height="5.5" x="9.5" y="16.5" rx="1"/></svg>
                <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814] mt-2">
                  HPLC PURITY
                </div>
                <div className="text-[11px] text-\[#1A1814\]/65 mt-0.5">
                  Independent lab
                </div>
              </div>

              <div className="test-chip bg-[#F5EFE4] border border-[#1A1814]/10 rounded-lg px-4 py-3 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 15c6.667-6 13.333 0 20-6"/><path d="M9 22c1.798-1.998 2.518-3.995 2.807-5.993"/><path d="M15 2c-1.798 1.998-2.518 3.995-2.807 5.993"/><path d="m17 6-2.5-2.5"/><path d="m14 8-1.5-1.5"/><path d="m7 18 2.5 2.5"/><path d="m3.5 14.5.5.5"/><path d="m20 9 .5.5"/><path d="m6.5 12.5 1 1"/><path d="m16.5 10.5 1 1"/><path d="m10 16 1.5 1.5"/></svg>
                <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814] mt-2">
                  IDENTITY
                </div>
                <div className="text-[11px] text-\[#1A1814\]/65 mt-0.5">
                  Sequence confirmed
                </div>
              </div>

              <div className="test-chip bg-[#F5EFE4] border border-[#1A1814]/10 rounded-lg px-4 py-3 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6l4 2"/><circle cx="12" cy="12" r="10"/></svg>
                <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814] mt-2">
                  NET CONTENT
                </div>
                <div className="text-[11px] text-\[#1A1814\]/65 mt-0.5">
                  Exact mg verified
                </div>
              </div>

              <div className="test-chip bg-[#F5EFE4] border border-[#1A1814]/10 rounded-lg px-4 py-3 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V10c0-1.1.9-2 2-2h2"/><path d="M11 4h10v10"/><path d="M15 10l5-5"/></svg>
                <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814] mt-2">
                  BATCH CONSISTENCY
                </div>
                <div className="text-[11px] text-\[#1A1814\]/65 mt-0.5">
                  Lot-to-lot stability
                </div>
              </div>

              <div className="test-chip bg-[#F5EFE4] border border-[#1A1814]/10 rounded-lg px-4 py-3 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h3"/><path d="M18 12h3"/><path d="M7.8 7.8 5.6 5.6"/><path d="M18.4 18.4l-2.2-2.2"/><path d="M7.8 16.2l-2.2 2.2"/><path d="M18.4 5.6l-2.2 2.2"/><circle cx="12" cy="12" r="7"/><path d="M12 9v6"/><path d="M9 12h6"/><path d="M12 3v1"/><path d="M12 20v1"/></svg>
                <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814] mt-2">
                  ENDOTOXINS
                </div>
                <div className="text-[11px] text-\[#1A1814\]/65 mt-0.5">
                  LAL tested
                </div>
              </div>

              <div className="test-chip bg-[#F5EFE4] border border-[#1A1814]/10 rounded-lg px-4 py-3 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 16a4 4 0 0 0 8 0M7 8v8M15 8v8M12 12h.01M5 5h14"/></svg>
                <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814] mt-2">
                  HEAVY METALS
                </div>
                <div className="text-[11px] text-\[#1A1814\]/65 mt-0.5">
                  ICP-MS screened
                </div>
              </div>

              <div className="test-chip bg-[#F5EFE4] border border-[#1A1814]/10 rounded-lg px-4 py-3 flex flex-col">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#607A5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/></svg>
                <div className="text-[10px] font-medium tracking-widest uppercase text-[#1A1814] mt-2">
                  STERILITY
                </div>
                <div className="text-[11px] text-\[#1A1814\]/65 mt-0.5">
                  Contamination-free
                </div>
              </div>
            </motion.div>
          </motion.div>
        </section>

        {/* PRODUCT CAROUSEL - Now merged into unified section */}
        <section ref={carouselSectionRef} className="pt-8 pb-12 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={headingVariants}
            initial="hidden"
            animate={carouselInView ? "visible" : "hidden"}
            className="mb-12"
          >
            <h2 className="font-display text-5xl text-ink mb-4" style={{ fontWeight: 300 }}>
              Our research compounds.
            </h2>
            <p className="font-editorial text-xl text-ink opacity-70">
              Every compound 7× independently tested — purity, identity, content, consistency, endotoxins, heavy metals, and sterility.
            </p>
          </motion.div>

          <div className="relative">
            {/* Carousel with drag */}
            <div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4"
              onScroll={updateScrollButtons}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onTouchStart={(e) => setTouchStartX(e.touches[0].clientX)}
              onTouchEnd={(e) => {
                const delta = e.changedTouches[0].clientX - touchStartX;
                if (Math.abs(delta) > 50) scroll(delta < 0 ? "right" : "left");
              }}
            >
              {PRODUCTS.map((product, index) => (
                <motion.div
                  key={product.id}
                  data-carousel-item
                  initial={{ opacity: 0, y: 40 }}
                  animate={carouselInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
                  transition={{ duration: 0.6, delay: index * 0.08 }}
                  className="flex-shrink-0 snap-start"
                  style={{ minWidth: '300px', flex: '0 0 300px' }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>

            {/* Navigation Arrows with animation */}
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => scroll("left")}
                  className="absolute left-0 -translate-x-4 w-12 h-12 text-cream hover:bg-clay transition-all hidden md:flex items-center justify-center"
                  style={{
                    borderRadius: "0",
                    backgroundColor: '#607A5C',
                    top: '35%',
                    transform: 'translateY(-50%) translateX(-16px)',
                  }}
                >
                  ←
                </motion.button>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {canScrollRight && (
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  onClick={() => scroll("right")}
                  className="absolute right-0 translate-x-4 w-12 h-12 text-cream hover:bg-clay transition-all hidden md:flex items-center justify-center"
                  style={{
                    borderRadius: "0",
                    backgroundColor: '#607A5C',
                    top: '35%',
                    transform: 'translateY(-50%) translateX(16px)',
                  }}
                >
                  →
                </motion.button>
              )}
            </AnimatePresence>

            {/* Dot indicators */}
            <div className="flex justify-center gap-2 mt-8">
              {PRODUCTS.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    if (carouselRef.current) {
                      const cardWidth = carouselRef.current.querySelector('[data-carousel-item]')?.clientWidth || 0;
                      const gap = 24;
                      carouselRef.current.scrollTo({
                        left: index * (cardWidth + gap),
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === activeCarouselIndex ? "bg-clay w-8" : "bg-ink opacity-20"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
      </div>

      {/* CATEGORIES - Browse by Research Area */}
      <section ref={categoriesRef} className="px-6" style={{ background: '#F5EFE4', paddingTop: '16px', paddingBottom: '80px' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={headingVariants}
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            className="text-center mb-3.5"
          >
            <h2 className="font-display text-4xl mb-3" style={{ fontWeight: 300, color: '#1A1814' }}>
              Browse by research area.
            </h2>
            <p className="font-editorial text-lg" style={{ color: 'rgba(26,24,20,0.7)' }}>
              Compounds organized by application.
            </p>
          </motion.div>

          {/* Vial lineup image */}
          <motion.div
            variants={itemVariants}
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            className="flex justify-center mb-3.5"
          >
            <img
              src="/images/vial-lineup-6-transparent.png"
              alt="Lumo peptide vials"
              style={{
                maxWidth: '680px',
                width: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          </motion.div>

          {/* Uniform 8-Card Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Secretagogue Research', slug: 'secretagogue-research' },
              { name: 'Tissue Repair Research', slug: 'tissue-repair-research' },
              { name: 'Metabolic Research', slug: 'metabolic-research' },
              { name: 'Dermal Research', slug: 'dermal-research' },
              { name: 'Cellular Research', slug: 'cellular-research' },
              { name: 'Neuro Research', slug: 'neuro-research' },
              { name: 'Blends', slug: 'blends' },
              { name: 'Ancillary', slug: 'ancillary' },
            ].map((category, index) => {
              const count = PRODUCTS.filter(p => p.category === category.name).length;
              const categoryColors = CATEGORY_COLORS[category.name] || CATEGORY_COLORS['Metabolic Research'];
              return (
                <motion.div
                  key={category.name}
                  variants={itemVariants}
                  initial="hidden"
                  animate={categoriesInView ? "visible" : "hidden"}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/products?category=${encodeURIComponent(category.name)}`}>
                    <motion.div
                      whileHover={{
                        scale: 1.01,
                        transition: { duration: 0.2 }
                      }}
                      style={{
                        backgroundColor: '#EBE2CF',
                        borderRadius: '10px',
                        borderLeft: `3px solid ${categoryColors.accent}`,
                        padding: '20px',
                        height: '140px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                      }}
                    >
                      <div>
                        <div
                          className="font-mono uppercase tracking-mono mb-2"
                          style={{
                            fontSize: '10px',
                            letterSpacing: '1.5px',
                            color: 'rgba(26,24,20,0.55)'
                          }}
                        >
                          {count} {count === 1 ? 'COMPOUND' : 'COMPOUNDS'}
                        </div>
                        <h3
                          className="font-display"
                          style={{
                            fontSize: '20px',
                            fontStyle: 'italic',
                            fontWeight: 500,
                            color: '#1A1814',
                            lineHeight: '1.2'
                          }}
                        >
                          {category.name}
                        </h3>
                      </div>
                      <div
                        className="font-mono uppercase"
                        style={{
                          fontSize: '10px',
                          letterSpacing: '1.2px',
                          color: categoryColors.accent,
                          fontWeight: 500
                        }}
                      >
                        → EXPLORE
                      </div>
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* PACKAGING SECTION - Split with Vial */}
      <section className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Half - Bone Background with Vial */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-bone py-24 px-12 flex flex-col items-center justify-center"
          >
            <img
              src='/images/products/lumo-3-rt-10mg-v2.png'
              alt='Lumo-3 RT research vial'
              style={{
                width: 'auto',
                height: '480px',
                filter: 'drop-shadow(-8px 16px 32px rgba(26,24,20,0.18))',
                display: 'block',
                margin: '0 auto',
                mixBlendMode: 'multiply',
              }}
            />
            <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-55 mt-8">
              RESEARCH GRADE PACKAGING
            </p>
          </motion.div>

          {/* Right Half - Ink Background with Details */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-ink py-24 px-12 flex flex-col justify-center"
          >
            <p className="font-mono text-xs uppercase tracking-mono text-clay mb-6" style={{ letterSpacing: '3px' }}>
              PACKAGING & DOCUMENTATION
            </p>
            <h2 className="font-display text-5xl text-cream mb-6 leading-tight" style={{ fontWeight: 300 }}>
              Every vial. Labeled to the lot.
            </h2>
            <p className="font-editorial text-lg text-cream mb-8 leading-relaxed" style={{ opacity: 0.7 }}>
              Each compound ships in a sealed borosilicate glass vial with tamper-evident cap. The label carries compound name, concentration, lot number, purity, storage instructions, and research use disclaimer. The Certificate of Analysis travels with every order.
            </p>

            {/* Bullet Points */}
            <ul className="space-y-4 mb-8">
              {[
                'Compound name + concentration',
                'Lot number + purity percentage',
                'Storage instructions + RUO disclaimer',
              ].map((item, i) => (
                <li key={i} className="flex items-start space-x-3">
                  <span className="text-clay mt-1">●</span>
                  <span className="font-editorial text-base font-medium" style={{ color: '#C4B8A8' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <Link
              href="/coa"
              className="text-clay font-mono text-xs uppercase tracking-mono hover:underline inline-flex items-center gap-2"
            >
              → View Certificates of Analysis
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FEATURE BLOCKS SECTION */}
      <section style={{ background: '#F5EFE4', padding: '80px 40px', position: 'relative', overflow: 'visible' }}>
        {/* Left floating vial */}
        <img
          src="/images/products/selank-v2.png"
          alt=""
          className="hidden lg:block"
          style={{
            position: 'absolute',
            left: '-40px',
            top: '50%',
            width: '270px',
            height: 'auto',
            zIndex: 0,
            opacity: 0.9,
            filter: 'drop-shadow(-6px 12px 24px rgba(26,24,20,0.15))',
            animation: 'floatLeft 4.5s ease-in-out infinite',
            mixBlendMode: 'multiply',
          }}
        />

        {/* Right floating vial */}
        <img
          src="/images/products/tb-500-v2.png"
          alt=""
          className="hidden lg:block"
          style={{
            position: 'absolute',
            right: '-40px',
            top: '50%',
            width: '270px',
            height: 'auto',
            zIndex: 0,
            opacity: 0.9,
            filter: 'drop-shadow(6px 12px 24px rgba(26,24,20,0.15))',
            animation: 'floatRight 5s ease-in-out infinite',
            mixBlendMode: 'multiply',
          }}
        />

        <h2
          style={{
            fontFamily: 'Fraunces, serif',
            fontSize: '36px',
            fontWeight: 300,
            color: '#1A1814',
            textAlign: 'center',
            marginBottom: '56px',
            fontStyle: 'normal',
            letterSpacing: '-0.02em',
            position: 'relative',
            zIndex: 1,
          }}
        >
          Why researchers choose Lumo.
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '48px 56px',
            maxWidth: '1000px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 1,
          }}
        >
          {[
            {
              title: 'Third-party verified, every batch',
              body: 'Every lot is tested by an independent laboratory for identity, purity, and endotoxin before shipping.',
              cta: '→ VIEW CERTIFICATES',
              href: '/coa',
              icon: `<svg width="48" height="48" viewBox="0 0 56 56" fill="none" stroke="rgba(26,24,20,0.15)" strokeWidth="1.5"><path d="M20 8v20l-8 16h32l-8-16V8"/><line x1="16" y1="8" x2="40" y2="8"/></svg>`,
            },
            {
              title: 'Research-grade pricing',
              body: 'High-purity peptides without procurement overhead. Transparent per-lot pricing, no subscription required.',
              cta: '→ BROWSE COMPOUNDS',
              href: '/products',
              icon: `<svg width="48" height="48" viewBox="0 0 56 56" fill="none" stroke="rgba(26,24,20,0.15)" strokeWidth="1.5"><polygon points="28,6 50,28 28,50 6,28"/></svg>`,
            },
            {
              title: 'Fast shipping, lot-traceable',
              body: 'Every order ships with secure packaging and full tracking. Your lot number is traceable from synthesis to delivery.',
              cta: '→ OUR PROCESS',
              href: '/about',
              icon: `<svg width="48" height="48" viewBox="0 0 56 56" fill="none" stroke="rgba(26,24,20,0.15)" strokeWidth="1.5"><line x1="28" y1="4" x2="28" y2="52"/><line x1="4" y1="28" x2="52" y2="28"/><line x1="10" y1="10" x2="46" y2="46"/><line x1="46" y1="10" x2="10" y2="46"/></svg>`,
            },
            {
              title: 'Research library included',
              body: 'Every compound page links to peer-reviewed literature. We cite our sources and show our work.',
              cta: '→ READ THE JOURNAL',
              href: '/journal',
              icon: `<svg width="48" height="48" viewBox="0 0 56 56" fill="none" stroke="rgba(26,24,20,0.15)" strokeWidth="1.5"><rect x="8" y="6" width="32" height="44" rx="2"/><line x1="16" y1="18" x2="32" y2="18"/><line x1="16" y1="26" x2="32" y2="26"/><line x1="16" y1="34" x2="28" y2="34"/></svg>`,
            },
          ].map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              style={{
                position: 'relative',
                paddingTop: '8px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '0',
                  left: '0',
                  opacity: 0.12
                }}
                dangerouslySetInnerHTML={{ __html: card.icon }}
              />
              <h3
                className="font-display"
                style={{
                  fontSize: '22px',
                  fontWeight: 300,
                  color: '#1A1814',
                  marginBottom: '12px',
                  fontStyle: 'italic',
                }}
              >
                {card.title}
              </h3>
              <p
                className="font-editorial"
                style={{
                  fontSize: '15px',
                  color: 'rgba(26,24,20,0.75)',
                  lineHeight: 1.7,
                  marginBottom: '16px',
                }}
              >
                {card.body}
              </p>
              <a
                href={card.href}
                className="font-mono hover:underline"
                style={{
                  fontSize: '11px',
                  letterSpacing: '1.2px',
                  color: '#C89A3C',
                  textDecoration: 'none',
                  textTransform: 'uppercase',
                }}
              >
                {card.cta}
              </a>
            </motion.div>
          ))}
        </div>
      </section>

      {/* BRAND SLOGAN SECTION - Trust isn't a tagline */}
      <section className="bg-clay py-16 px-6">
        <div className="container mx-auto max-w-4xl text-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="font-display text-4xl md:text-5xl text-cream mb-6 leading-tight"
            style={{ fontWeight: 300, fontStyle: "italic" }}
          >
            Trust isn't a tagline. It's a paper trail.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 0.9 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="font-editorial text-base text-cream"
          >
            Every vial ships with a third-party certificate of analysis. Every lot is traceable. Every claim is footnoted.
          </motion.p>
        </div>
      </section>

      {/* HOW IT WORKS - Cream Background */}
      <section ref={howItWorksRef} className="bg-cream py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={headingVariants}
            initial="hidden"
            animate={howItWorksInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <h2 className="font-display text-5xl text-ink mb-4" style={{ fontWeight: 300 }}>
              How it works.
            </h2>
            <p className="font-editorial text-xl text-ink opacity-70">
              Three steps to verified research compounds.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting Line */}
            <div className="hidden md:block absolute top-16 left-[16.666%] right-[16.666%] h-0.5 border-t-2 border-dotted border-ink opacity-20" />

            {[
              {
                number: "01",
                title: "Browse Catalog",
                description:
                  "See current lots with full CoA documentation. All compounds HPLC tested to 98%+ purity.",
              },
              {
                number: "02",
                title: "Place Order",
                description:
                  "Secure crypto checkout. Confirm research use. Receive order confirmation within minutes.",
              },
              {
                number: "03",
                title: "Fast Delivery",
                description:
                  "Secure packaging with tracking. CoA included in every shipment. Room temperature stable.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate={howItWorksInView ? "visible" : "hidden"}
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  y: -8,
                  boxShadow: "0 12px 40px rgba(26,24,20,0.12)",
                  transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }
                }}
              >
                <div
                  className="bg-bone p-8 relative z-10 h-full"
                  style={{
                    borderRadius: "20px",
                    boxShadow: "0 4px 24px rgba(26,24,20,0.06)",
                  }}
                >
                  <div
                    className="font-display text-7xl text-clay mb-6 leading-none"
                    style={{ fontWeight: 300 }}
                  >
                    {step.number}
                  </div>
                  <h3 className="font-display text-2xl text-ink mb-4" style={{ fontWeight: 300 }}>
                    {step.title}
                  </h3>
                  <p className="font-editorial text-ink opacity-70 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* COA PROOF SECTION - Split Background */}
      <section ref={coaRef} className="relative overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          {/* Left Half - Bone Background with COA Card */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-bone py-24 px-12 flex items-center justify-center"
          >
            <motion.div
              initial={{ opacity: 0, rotate: -2 }}
              animate={coaInView ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -2 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-full max-w-md"
            >
              <div
                className="p-8"
                style={{
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(26,24,20,0.12)",
                  background: '#EBE2CF',
                }}
              >
                <div className="flex items-start justify-between mb-8 pb-6 border-b hairline-border">
                  <div style={{ transform: 'scale(0.7)', transformOrigin: 'left center' }}>
                    <LumoLogo size="nav" />
                  </div>
                  <div className="font-mono text-xs uppercase tracking-mono text-ink">
                    LOT PPL-2024-001
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {[
                    { label: "COMPOUND", value: "BPC-157" },
                    { label: "PURITY (HPLC)", value: "99.14%" },
                    { label: "IDENTITY (MS)", value: "CONFIRMED" },
                    { label: "TESTED BY", value: "Independent Lab" },
                  ].map((row, index) => (
                    <div key={index} className="flex items-baseline justify-between">
                      <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-70">
                        {row.label}
                      </span>
                      <div
                        className="flex-1 mx-3 border-b border-dotted"
                        style={{ borderColor: "rgba(26, 24, 20, 0.15)" }}
                      />
                      <span className="font-mono text-xs text-ink font-medium">
                        {row.value}
                      </span>
                    </div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -10 }}
                  animate={coaInView ? { opacity: 1, scale: 1, rotate: 0 } : { opacity: 0, scale: 0, rotate: -10 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                  className="flex items-center justify-end"
                >
                  <div className="flex items-center space-x-2">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="#C89A3C" strokeWidth="1.5" />
                      <circle cx="10" cy="10" r="3" fill="#C89A3C" />
                    </svg>
                    <span className="font-mono text-xs uppercase tracking-mono text-ochre font-medium">
                      VERIFIED
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Half - Ink Background with Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-ink py-24 px-12 flex flex-col justify-center"
          >
            <h2
              className="font-display text-5xl mb-8 leading-tight text-cream"
              style={{ fontWeight: 300 }}
            >
              Every lot. Its own paper trail.
            </h2>
            <ul className="space-y-4 mb-8">
              {[
                "Third-party HPLC and mass spec verification",
                "Batch-specific purity and identity confirmation",
                "Full amino acid analysis included",
              ].map((point, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <span className="text-clay text-2xl mt-1">●</span>
                  <span className="font-editorial text-xl font-medium" style={{ color: '#C4B8A8' }}>
                    {point}
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/coa"
              className="font-mono text-sm uppercase tracking-mono text-clay hover:underline inline-flex items-center"
            >
              → READ A COA
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA BANNER - Light Background */}
      <section ref={ctaRef} className="py-24 px-6" style={{ background: '#F5EFE4' }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          className="container mx-auto max-w-4xl text-center"
        >
          <motion.h2
            variants={headingVariants}
            className="font-display text-5xl md:text-6xl mb-6 leading-tight"
            style={{ fontWeight: 300, color: '#1A1814' }}
          >
            Ready to start your research?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="font-editorial text-xl mb-10"
            style={{ color: 'rgba(26,24,20,0.75)' }}
          >
            See current lots or contact us for custom inquiries.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="/products"
              className="px-8 py-4 text-white font-mono text-xs uppercase tracking-mono hover:opacity-90 transition-opacity active:scale-[0.97]"
              style={{ borderRadius: "8px", backgroundColor: '#B8624A' }}
            >
              → SEE CURRENT LOTS
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 bg-transparent font-mono text-xs uppercase tracking-mono hover:bg-ink hover:text-cream transition-all active:scale-[0.97]"
              style={{ borderRadius: "8px", borderColor: '#1A1814', color: '#1A1814' }}
            >
              CONTACT US
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Global Styles */}
      <style jsx>{`
        @keyframes rotateBadge {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes pulseDot {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.15);
          }
        }

        .rotating-badge {
          animation: rotateBadge 20s linear infinite;
        }

        .pulsing-dot {
          animation: pulseDot 2s ease-in-out infinite;
        }

        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }

        .hairline-border {
          border-color: rgba(26, 24, 20, 0.12);
        }

        .snap-x {
          scroll-snap-type: x mandatory;
        }

        .snap-start {
          scroll-snap-align: start;
        }
      `}</style>
    </div>
  );
}
