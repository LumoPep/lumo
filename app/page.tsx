"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { PRODUCTS, getFeaturedProducts, CATEGORY_COLORS } from "@/data/products";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const featuredProducts = getFeaturedProducts();
  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [heroProductIndex, setHeroProductIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
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
    "Healing & Recovery": "#B8624A",
    "Growth Hormone": "#C89A3C",
    "Longevity": "#6D7A5C",
    "Melanocortin": "#1A1814",
    "Nootropic": "#B8624A",
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
      {/* HERO SECTION - Background Image with Overlay */}
      <section className="py-24 md:py-32 px-6 relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1800&q=80"
            alt="Laboratory background"
            fill
            className="object-cover"
            priority
          />
          {/* Dark gradient overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: "linear-gradient(to right, rgba(26,24,20,0.92) 50%, rgba(26,24,20,0.75) 100%)",
            }}
          />
        </div>
        <div className="container mx-auto max-w-7xl relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Side - Staggered Word Animation */}
            <div>
              {/* Eyebrow - slides up + fades in */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0 }}
                className="font-mono text-xs uppercase tracking-mono text-clay mb-6"
              >
                LOT 24·11·B · NOW SHIPPING
              </motion.div>

              {/* Headline - words animate in one by one */}
              <motion.h1
                className="font-display text-6xl md:text-8xl text-cream mb-8 leading-[0.95]"
                style={{ fontWeight: 300, letterSpacing: "-0.035em", y: heroY }}
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
                  className="text-clay italic inline-block"
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
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="font-editorial text-xl text-cream mb-4 leading-relaxed max-w-lg italic"
                style={{ fontSize: "22px" }}
              >
                Light, made measurable.
              </motion.p>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.7 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="font-editorial text-base text-cream mb-10 leading-relaxed max-w-lg opacity-80"
              >
                Synthesized to spec. Verified by an independent lab. Cold-shipped,
                lot-traceable, footnoted.
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
                  className="px-8 py-4 bg-clay text-cream font-mono text-xs uppercase tracking-mono hover:bg-opacity-90 transition-all active:scale-[0.97]"
                  style={{ borderRadius: "8px" }}
                >
                  → SEE CURRENT LOTS
                </Link>
                <Link
                  href="/coa"
                  className="px-8 py-4 border-2 border-cream text-cream font-mono text-xs uppercase tracking-mono hover:bg-cream hover:text-ink transition-all active:scale-[0.97]"
                  style={{ borderRadius: "8px" }}
                >
                  READ A COA
                </Link>
              </motion.div>
            </div>

            {/* Right Side - Rotating Product Card */}
            <motion.div
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              <div
                className="relative overflow-hidden"
                style={{
                  borderRadius: "24px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                  minHeight: "460px",
                }}
              >
                {/* Rotating Content with AnimatePresence */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroProductIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    style={{ display: 'flex', minHeight: '460px' }}
                  >
                    {/* Left Side - 48% Bone Background with Vial */}
                    <div
                      style={{
                        flex: '0 0 48%',
                        background: '#F5EFE4',
                        minHeight: '460px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '20px',
                      }}
                    >
                      <img
                        src='/images/vial-transparent.png'
                        alt={currentProduct.name}
                        style={{
                          width: '80%',
                          height: 'auto',
                          maxHeight: '380px',
                          objectFit: 'contain',
                          filter: 'drop-shadow(-8px 16px 32px rgba(26,24,20,0.25))',
                          display: 'block',
                          margin: '0 auto',
                        }}
                      />
                    </div>

                    {/* Right Side - 52% Category Color with Details */}
                    <div
                      style={{
                        flex: '0 0 52%',
                        background: CATEGORY_COLORS[currentProduct.category] || '#B8624A',
                        padding: '32px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        position: 'relative',
                      }}
                    >
                      {/* Badge - Top Right */}
                      <div style={{ position: 'absolute', top: '16px', right: '16px' }}>
                        <div
                          className="flex items-center space-x-1"
                          style={{
                            color: '#F5EFE4',
                            opacity: 0.85,
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '9px',
                            letterSpacing: '1.5px',
                          }}
                        >
                          <span>●</span>
                          <span>3RD-PARTY TESTED</span>
                        </div>
                      </div>

                      {/* Top Label */}
                      <div
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '10px',
                          color: '#F5EFE4',
                          opacity: 0.7,
                          letterSpacing: '2px',
                          marginBottom: '12px',
                          textTransform: 'uppercase',
                        }}
                      >
                        ● NEWEST LOT · VERIFIED
                      </div>

                      {/* Compound Name */}
                      <h3
                        style={{
                          fontFamily: 'Fraunces, Georgia, serif',
                          fontSize: '42px',
                          color: '#F5EFE4',
                          fontWeight: 300,
                          fontStyle: 'italic',
                          marginBottom: '16px',
                          lineHeight: 1.1,
                        }}
                      >
                        {currentProduct.name}
                      </h3>

                      {/* Lot + Purity Line */}
                      <div
                        style={{
                          fontFamily: 'JetBrains Mono, monospace',
                          fontSize: '11px',
                          color: '#F5EFE4',
                          opacity: 0.65,
                          marginBottom: '20px',
                          letterSpacing: '0.5px',
                        }}
                      >
                        LOT {currentProduct.batch} · {currentProduct.sizes[0]} · {currentProduct.purity}
                      </div>

                      {/* Price and Button */}
                      <div className="flex items-end justify-between">
                        <div
                          style={{
                            fontFamily: 'Fraunces, Georgia, serif',
                            fontSize: '36px',
                            color: '#F5EFE4',
                            fontWeight: 300,
                          }}
                        >
                          ${lowestPrice.toFixed(2)}
                        </div>
                        <Link
                          href={`/products/${currentProduct.slug}`}
                          style={{
                            background: '#F5EFE4',
                            color: CATEGORY_COLORS[currentProduct.category] || '#B8624A',
                            fontFamily: 'JetBrains Mono, monospace',
                            fontSize: '11px',
                            letterSpacing: '1px',
                            textTransform: 'uppercase',
                            padding: '10px 20px',
                            borderRadius: '6px',
                            transition: 'all 150ms',
                            textDecoration: 'none',
                            display: 'inline-block',
                          }}
                          className="hover:opacity-90 active:scale-[0.97]"
                        >
                          → VIEW
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Dot Indicators - Outside the card */}
              </div>

              {/* Dot Indicators - Below the card */}
              <div className="flex justify-center gap-2 mt-6">
                {PRODUCTS.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setHeroProductIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === heroProductIndex
                        ? "bg-clay w-3 h-3"
                        : "bg-cream bg-opacity-30"
                    }`}
                  />
                ))}
              </div>
            </motion.div>
          </div>
        </div>

      </section>

      {/* TICKER STRIP - Auto-scrolling compound purity ticker */}
      <div className="bg-ink py-4 overflow-hidden ticker-container">
        <div className="ticker-content">
          <div className="ticker-text">
            BPC-157 · 99.14% <span className="text-clay">··</span> TB-500 · 98.73% <span className="text-clay">··</span> IPAMORELIN · 99.12% <span className="text-clay">··</span> CJC-1295 · 98.81% <span className="text-clay">··</span> PT-141 · 99.05% <span className="text-clay">··</span> EPITHALON · 99.31% <span className="text-clay">··</span> SELANK · 98.55% <span className="text-clay">··</span> GHK-CU · 99.08% <span className="text-clay">··</span> HEXARELIN · 98.92% <span className="text-clay">··</span>
          </div>
          <div className="ticker-text" aria-hidden="true">
            BPC-157 · 99.14% <span className="text-clay">··</span> TB-500 · 98.73% <span className="text-clay">··</span> IPAMORELIN · 99.12% <span className="text-clay">··</span> CJC-1295 · 98.81% <span className="text-clay">··</span> PT-141 · 99.05% <span className="text-clay">··</span> EPITHALON · 99.31% <span className="text-clay">··</span> SELANK · 98.55% <span className="text-clay">··</span> GHK-CU · 99.08% <span className="text-clay">··</span> HEXARELIN · 98.92% <span className="text-clay">··</span>
          </div>
        </div>
      </div>

      {/* TRUST BAR - Full Clay Background with Counter Animations */}
      <section ref={trustRef} className="bg-clay py-12 px-6">
        <motion.div
          className="container mx-auto max-w-7xl"
          variants={containerVariants}
          initial="hidden"
          animate={trustInView ? "visible" : "hidden"}
        >
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-0 md:divide-x divide-cream divide-opacity-20">
            {[
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" className="mb-3">
                    <circle cx="20" cy="20" r="18" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M20 8 L20 20 L28 20" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                ),
                label: "HPLC TESTED",
                desc: "98%+ purity verified",
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" className="mb-3">
                    <rect x="8" y="12" width="24" height="18" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M12 12 L12 8 L28 8 L28 12" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                ),
                label: "COA INCLUDED",
                desc: "Full documentation",
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" className="mb-3">
                    <path d="M20 8 L24 16 L32 16 L26 22 L28 30 L20 25 L12 30 L14 22 L8 16 L16 16 Z" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                ),
                label: "COLD SHIPPED",
                desc: "Temperature controlled",
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" className="mb-3">
                    <circle cx="20" cy="20" r="12" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M20 14 L20 20 L26 20" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                label: "LOT TRACEABLE",
                desc: "Batch verified",
              },
              {
                icon: (
                  <svg width="40" height="40" viewBox="0 0 40 40" className="mb-3">
                    <rect x="10" y="12" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" fill="none" />
                    <path d="M15 12 L15 8 L25 8 L25 12" stroke="currentColor" strokeWidth="2" />
                  </svg>
                ),
                label: "CRYPTO ACCEPTED",
                desc: "Secure payment",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center md:px-6"
              >
                <div className="text-cream opacity-90">{item.icon}</div>
                <div className="font-mono text-xs uppercase tracking-mono text-cream font-medium mb-1">
                  {item.label}
                </div>
                <div className="font-editorial text-sm text-cream opacity-70">
                  {item.desc}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PRODUCT CAROUSEL - Bone Background with Drag & Enhanced Interactions */}
      <section ref={carouselSectionRef} className="bg-bone py-24 px-6">
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
            <p className="font-editorial text-xl text-ink opacity-60">
              Tested for purity, identity, and endotoxin.
            </p>
          </motion.div>

          <div className="relative">
            {/* Carousel with drag */}
            <motion.div
              ref={carouselRef}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory pb-4 cursor-grab active:cursor-grabbing"
              onScroll={updateScrollButtons}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.1}
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
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
            </motion.div>

            {/* Navigation Arrows with animation */}
            <AnimatePresence>
              {canScrollLeft && (
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onClick={() => scroll("left")}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-12 h-12 bg-ink text-cream hover:bg-clay transition-all hidden md:flex items-center justify-center"
                  style={{ borderRadius: "0" }}
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
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-12 h-12 bg-ink text-cream hover:bg-clay transition-all hidden md:flex items-center justify-center"
                  style={{ borderRadius: "0" }}
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
              src='/images/vial-transparent.png'
              alt='Research Grade Packaging'
              style={{
                width: '65%',
                maxWidth: '280px',
                height: 'auto',
                filter: 'drop-shadow(-8px 16px 32px rgba(26,24,20,0.18))',
                display: 'block',
                margin: '0 auto'
              }}
            />
            <p className="font-mono text-xs uppercase tracking-mono text-ink opacity-40 mt-8">
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
                  <span className="font-editorial text-cream" style={{ opacity: 0.8 }}>
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
            <p className="font-editorial text-xl text-ink opacity-60">
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
                title: "Cold Shipped",
                description:
                  "Temperature-controlled packaging. Tracking provided. CoA included in every shipment.",
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

      {/* COA PROOF SECTION - Ink Background with Parallax Rotation */}
      <section ref={coaRef} className="bg-ink py-24 px-6">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left - COA Card with rotation effect */}
            <motion.div
              initial={{ opacity: 0, rotate: -2 }}
              animate={coaInView ? { opacity: 1, rotate: 0 } : { opacity: 0, rotate: -2 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <div
                className="bg-cream p-8"
                style={{
                  borderRadius: "20px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                <div className="flex items-start justify-between mb-8 pb-6 border-b hairline-border">
                  <div className="relative">
                    <span className="font-display text-xl text-ink" style={{ fontWeight: 300 }}>
                      Lumo
                    </span>
                    <div
                      className="absolute bg-clay rounded-full pulsing-dot"
                      style={{
                        width: "6px",
                        height: "6px",
                        top: "-1px",
                        right: "-3px",
                      }}
                    />
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
                      <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
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

            {/* Right - Content */}
            <motion.div
              variants={itemVariants}
              initial="hidden"
              animate={coaInView ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
            >
              <h2
                className="font-display text-5xl text-cream mb-8 leading-tight"
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
                    <span className="font-editorial text-lg text-cream opacity-90">
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
        </div>
      </section>

      {/* CATEGORIES - Bone Background with Enhanced Hover */}
      <section ref={categoriesRef} className="py-24 px-6" style={{ background: '#F5EFE4' }}>
        <div className="container mx-auto max-w-7xl">
          <motion.div
            variants={headingVariants}
            initial="hidden"
            animate={categoriesInView ? "visible" : "hidden"}
            className="text-center mb-16"
          >
            <h2 className="font-display text-5xl mb-4" style={{ fontWeight: 300, color: '#1A1814' }}>
              Browse by research area.
            </h2>
            <p className="font-editorial text-xl" style={{ color: 'rgba(26,24,20,0.6)' }}>
              Compounds organized by application.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                name: "Healing & Recovery",
                color: "#B8624A",
                hoverColor: "#C8826A",
                count: PRODUCTS.filter((p) => p.category === "Healing & Recovery").length,
                slug: "Healing+%26+Recovery",
              },
              {
                name: "Growth Hormone",
                color: "#C89A3C",
                hoverColor: "#D8AA4C",
                count: PRODUCTS.filter((p) => p.category === "Growth Hormone").length,
                slug: "Growth+Hormone",
              },
              {
                name: "Longevity",
                color: "#6D7A5C",
                hoverColor: "#7D8A6C",
                count: PRODUCTS.filter((p) => p.category === "Longevity").length,
                slug: "Longevity",
              },
              {
                name: "Nootropic",
                color: "#1A1814",
                hoverColor: "#2A2824",
                count: PRODUCTS.filter((p) => p.category === "Nootropic").length,
                slug: "Nootropic",
              },
            ].map((category, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate={categoriesInView ? "visible" : "hidden"}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={`/products?category=${category.slug}`}>
                  <motion.div
                    whileHover={{
                      y: -8,
                      backgroundColor: category.hoverColor,
                      boxShadow: "0 12px 40px rgba(26,24,20,0.16)",
                      transition: { duration: 0.25, ease: [0.34, 1.56, 0.64, 1] }
                    }}
                    className="p-8 h-48 flex flex-col justify-between group"
                    style={{
                      backgroundColor: category.color,
                      borderRadius: "20px",
                      boxShadow: "0 4px 24px rgba(26,24,20,0.08)",
                    }}
                  >
                    <div>
                      <h3
                        className="font-display text-3xl text-cream mb-2"
                        style={{ fontWeight: 300, fontStyle: "italic" }}
                      >
                        {category.name}
                      </h3>
                      <div className="font-mono text-xs uppercase tracking-mono text-cream opacity-70">
                        {category.count} COMPOUNDS
                      </div>
                    </div>
                    <div className="font-mono text-xs uppercase tracking-mono text-cream flex items-center">
                      <motion.span
                        className="inline-block mr-2"
                        initial={{ x: 0 }}
                        whileHover={{ x: 4 }}
                        transition={{ duration: 0.2 }}
                      >
                        →
                      </motion.span>
                      BROWSE
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER - Ink Background */}
      <section ref={ctaRef} className="bg-ink py-24 px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          className="container mx-auto max-w-4xl text-center"
        >
          <motion.h2
            variants={headingVariants}
            className="font-display text-5xl md:text-6xl text-cream mb-6 leading-tight"
            style={{ fontWeight: 300 }}
          >
            Ready to start your research?
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="font-editorial text-xl text-cream opacity-90 mb-10"
          >
            See current lots or contact us for custom inquiries.
          </motion.p>
          <motion.div
            variants={itemVariants}
            className="flex items-center justify-center gap-4 flex-wrap"
          >
            <Link
              href="/products"
              className="px-8 py-4 bg-cream text-ink font-mono text-xs uppercase tracking-mono hover:bg-bone hover:text-ink transition-colors active:scale-[0.97]"
              style={{ borderRadius: "8px" }}
            >
              → SEE CURRENT LOTS
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border-2 border-cream bg-transparent text-cream font-mono text-xs uppercase tracking-mono hover:bg-cream hover:text-ink transition-all active:scale-[0.97]"
              style={{ borderRadius: "8px" }}
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
