"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCartStore } from "@/lib/store";
import LumoLogo from "@/components/LumoLogo";

export default function NavBar() {
  const { getItemCount, toggleCart } = useCartStore();
  const itemCount = getItemCount();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navTop, setNavTop] = useState(36); // Default banner height

  useEffect(() => {
    const handleScroll = () => {
      const bannerHeight = 36; // Fixed banner height
      const scrollY = window.scrollY;

      setScrolled(scrollY > 80);

      // Adjust nav top position based on scroll
      if (scrollY >= bannerHeight) {
        setNavTop(0); // Nav sits at top after banner scrolled away
      } else {
        setNavTop(bannerHeight - scrollY); // Nav follows banner
      }
    };

    // Initial call
    handleScroll();

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "/products", label: "COMPOUNDS" },
    { href: "/coa", label: "COAS" },
    { href: "/about", label: "ABOUT" },
    { href: "/journal", label: "RESEARCH" },
    { href: "/wholesale", label: "WHOLESALE" },
    { href: "/faq", label: "FAQ" },
    { href: "/account", label: "ACCOUNT" },
  ];

  const isActive = (href: string) => pathname === href || pathname?.startsWith(href + "/");

  return (
    <>
      <nav
        className={`fixed left-0 right-0 z-50 bg-bone border-b hairline-border transition-all duration-300 ${
          scrolled ? "shadow-md" : ""
        }`}
        style={{
          top: `${navTop}px`,
          boxShadow: scrolled ? "0 1px 0 rgba(26,24,20,0.08)" : "none",
        }}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <LumoLogo size='nav' />
                <span style={{ width: '1px', height: '18px', backgroundColor: '#1A1814', opacity: 0.25 }} />
                <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase', color: '#1A1814', opacity: 0.6 }}>Research Peptides</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex items-center space-x-8 relative">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`font-mono text-xs uppercase tracking-mono transition-colors relative pb-1 ${
                    isActive(link.href) ? "text-clay" : "text-ink hover:text-clay"
                  }`}
                >
                  {link.label}
                  {isActive(link.href) && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-clay"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Side - Cart + Mobile Menu */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={toggleCart}
                className="px-4 py-2 border hairline-border font-mono text-xs uppercase tracking-mono text-ink hover:border-clay transition-colors flex items-center space-x-2"
              >
                <span className="text-clay">●</span>
                <span>CART</span>
                {itemCount > 0 && (
                  <>
                    <span>·</span>
                    <span className="font-medium">{itemCount}</span>
                  </>
                )}
              </motion.button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 text-ink hover:text-clay transition-colors"
                aria-label="Toggle menu"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  {mobileMenuOpen ? (
                    <>
                      <path d="M6 6L18 18M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
                    </>
                  ) : (
                    <>
                      <path d="M3 12H21M3 6H21M3 18H21" strokeWidth="2" strokeLinecap="round" />
                    </>
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-ink z-40 md:hidden"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-ink z-50 md:hidden overflow-y-auto"
            >
              <div className="p-6">
                {/* Close button */}
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute top-6 right-6 text-cream hover:text-clay transition-colors"
                >
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M6 6L18 18M6 18L18 6" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </button>

                {/* Logo */}
                <div className="mb-12">
                  <span style={{
                    position: 'relative',
                    display: 'inline-block',
                    color: '#EBE2CF'
                  }}>
                    <span style={{
                      fontFamily: 'Fraunces, Georgia, serif',
                      fontSize: '32px',
                      fontWeight: 300,
                      lineHeight: 1,
                      letterSpacing: '-0.02em',
                      fontVariationSettings: '"WONK" 1, "opsz" 144',
                      WebkitFontSmoothing: 'antialiased',
                      display: 'inline-block',
                    }}>
                      Lumo
                    </span>
                    <span style={{
                      position: 'absolute',
                      top: '2px',
                      right: '-6px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: '#B8624A',
                      display: 'block',
                    }} />
                  </span>
                </div>

                {/* Mobile Nav Links */}
                <nav className="space-y-6">
                  {navLinks.map((link, index) => (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={`block font-mono text-sm uppercase tracking-mono transition-colors ${
                          isActive(link.href) ? "text-clay" : "text-cream hover:text-clay"
                        }`}
                      >
                        {isActive(link.href) && <span className="text-clay mr-2">●</span>}
                        {link.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>

                {/* Mobile Contact */}
                <div className="mt-12 pt-12 border-t border-cream border-opacity-20">
                  <Link
                    href="/contact"
                    onClick={() => setMobileMenuOpen(false)}
                    className="font-mono text-sm uppercase tracking-mono text-clay hover:underline"
                  >
                    → CONTACT US
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
