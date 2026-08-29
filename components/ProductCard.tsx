"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, CATEGORY_COLORS } from "@/data/products";
import { useCartStore } from "@/lib/store";
import { showToast } from "@/components/Toast";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const [sizeMenuOpen, setSizeMenuOpen] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const lowestPrice = Math.min(...product.prices);
  const firstSize = product.sizes[0];
  const categoryColors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Metabolic Research'];
  const categoryAccent = categoryColors.accent || '#B8624A';

  // Get lot number (use first lot for products with multiple variants)
  const lotNumber = product.batch || (product.lotNumbers ? product.lotNumbers[0] : '');

  // Special handling for BAC Water - it has 'USP Grade' instead of percentage
  const isUSPGrade = product.purity === 'USP Grade';

  const handleQuickAdd = (sizeIndex: number = 0) => {
    const size = product.sizes[sizeIndex];
    const price = product.prices[sizeIndex];
    const sku = product.skus[sizeIndex];

    addItem({
      productId: product.id.toString(),
      productName: product.name,
      variant: size,
      price: price,
      sku: sku,
    });

    showToast(`Added ${product.name} (${size}) to cart`);
    setAdded(true);
    setSizeMenuOpen(false);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleQuickAddClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.sizes.length === 1) {
      handleQuickAdd(0);
    } else {
      setSizeMenuOpen(!sizeMenuOpen);
    }
  };

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <div
        style={{
          borderTop: `6px solid ${categoryColors.accent}`,
          borderRadius: '20px',
          overflow: 'hidden',
          cursor: 'pointer',
          height: '100%',
          boxShadow: hovered
            ? '0 8px 24px rgba(26,24,20,0.1)'
            : '0 2px 12px rgba(26,24,20,0.06)',
          transition: 'box-shadow 0.2s ease',
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div
          style={{
            background: 'transparent',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* TOP BLOCK - Transparent Background with Vial */}
          <div
            style={{
              position: 'relative',
              background: 'transparent',
              minHeight: '220px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
              padding: '20px 16px 8px 16px',
            }}
          >
            {/* Header Row - Product Name + Badge */}
            <div
              className="flex items-start justify-between gap-2"
              style={{
                position: 'absolute',
                top: '14px',
                left: '16px',
                right: '16px',
              }}
            >
              <div
                className="flex-1 min-w-0"
                style={{
                  fontFamily: 'Fraunces, Georgia, serif',
                  fontSize: '22px',
                  color: '#1A1814',
                  fontStyle: 'italic',
                  fontWeight: 500,
                }}
              >
                {product.name}
              </div>

              {product.badge && (
                <div
                  className="flex-shrink-0"
                  style={{
                    background: '#B8624A',
                    color: 'white',
                    fontFamily: 'JetBrains Mono, monospace',
                    fontSize: '9px',
                    letterSpacing: '2px',
                    textTransform: 'uppercase' as const,
                    padding: '4px 12px',
                    borderRadius: '999px',
                    boxShadow: '0 2px 8px rgba(184,98,74,0.4)',
                    fontWeight: 500,
                  }}
                >
                  {product.badge}
                </div>
              )}
            </div>

            <img
              src={product.images[0]}
              alt={product.name}
              style={{
                width: '98%',
                height: 'auto',
                maxHeight: '220px',
                objectFit: 'contain',
                filter: 'drop-shadow(-6px 12px 24px rgba(26,24,20,0.25))',
                display: 'block',
                margin: '0 auto',
                transform: hovered ? 'scale(1.08)' : 'scale(1)',
                transition: 'transform 0.3s ease',
                mixBlendMode: 'multiply',
              }}
            />
          </div>

          {/* BOTTOM BLOCK - Details */}
          <div
            className="flex-1 flex flex-col"
            style={{
              padding: '16px 18px 20px',
              background: 'transparent',
            }}
          >
            {/* Lot Line */}
            <div
              className="font-mono mb-2 text-[#1A1814]/80"
              style={{
                fontSize: "11px",
                letterSpacing: "0.05em",
              }}
            >
              {firstSize} · LOT {lotNumber} ·{" "}
              <span className="font-medium" style={{ color: '#C89A3C' }}>
                {isUSPGrade ? 'USP GRADE' : product.purity}
              </span>
            </div>

            {/* 7× Tested Badge */}
            <div className="mb-3">
              <span
                className="text-[10px] tracking-wide uppercase bg-[#607A5C]/10 text-[#3B5438] rounded-full px-2 py-0.5 inline-block"
                style={{
                  fontFamily: 'JetBrains Mono, monospace',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                }}
              >
                VERIFIED
              </span>
            </div>

            {/* Description - 2 lines max */}
            <p
              className="font-editorial mb-4 flex-1 text-[#1A1814]/95"
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {product.synopsis}
            </p>

            {/* Footer Row - Price and CTA */}
            <div
              className="flex items-end justify-between pt-2"
              style={{
                borderTop: `1px solid ${categoryColors.accent}40`,
              }}
            >
              <div className="flex flex-col">
                <div
                  className="font-display"
                  style={{
                    fontWeight: 300,
                    fontSize: "24px",
                    color: '#B8624A',
                  }}
                >
                  ${lowestPrice.toFixed(2)}
                </div>
                {product.sizes.length > 1 && (
                  <div
                    className="text-[10px] text-[#1A1814]/80"
                    style={{
                      marginTop: '2px',
                    }}
                  >
                    {product.sizes.join(' / ')}
                  </div>
                )}
              </div>
              <div
                className="font-mono text-xs uppercase tracking-mono hover:underline"
                style={{ color: '#C89A3C' }}
              >
                → VIEW LOT
              </div>
            </div>

            {/* Quick Add Button */}
            <button
              onClick={handleQuickAddClick}
              className="w-full mt-3 py-2 border rounded-lg text-[9px] font-medium tracking-widest uppercase transition-all duration-150"
              style={
                added
                  ? {
                      background: categoryAccent,
                      color: 'white',
                      borderColor: categoryAccent,
                    }
                  : {
                      borderColor: 'rgba(26,24,20,0.25)',
                      color: 'rgba(26,24,20,0.80)',
                      background: 'transparent',
                    }
              }
              onMouseEnter={(e) => {
                if (!added) {
                  e.currentTarget.style.borderColor = categoryAccent;
                  e.currentTarget.style.color = categoryAccent;
                }
              }}
              onMouseLeave={(e) => {
                if (!added) {
                  e.currentTarget.style.borderColor = 'rgba(26,24,20,0.25)';
                  e.currentTarget.style.color = 'rgba(26,24,20,0.80)';
                }
              }}
            >
              {added ? 'ADDED ✓' : 'QUICK ADD'}
            </button>

            {/* Size Selector - Multi-size products only */}
            {sizeMenuOpen && product.sizes.length > 1 && (
              <div className="mt-2 flex flex-wrap gap-2" onClick={(e) => e.preventDefault()}>
                {product.sizes.map((size, index) => (
                  <button
                    key={index}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickAdd(index);
                    }}
                    className="text-[9px] px-3 py-1.5 border border-[#1A1814]/15 rounded-md hover:border-[#B8624A] hover:text-[#B8624A] cursor-pointer transition-all"
                  >
                    {size} · ${product.prices[index].toFixed(2)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
