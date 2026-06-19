"use client";

import { useState } from "react";
import Link from "next/link";
import { Product, CATEGORY_COLORS } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const lowestPrice = Math.min(...product.prices);
  const firstSize = product.sizes[0];
  const categoryColors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Metabolic Research'];

  // Special handling for BAC Water - it has 'USP Grade' instead of percentage
  const isUSPGrade = product.purity === 'USP Grade';

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
              minHeight: '300px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'visible',
              padding: '20px 16px 8px 16px',
            }}
          >
            {/* Product Name - Top Left */}
            <div
              style={{
                position: 'absolute',
                top: '14px',
                left: '16px',
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: '22px',
                color: '#1A1814',
                fontStyle: 'italic',
                fontWeight: 300,
              }}
            >
              {product.name}
            </div>

            {product.badge && (
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  right: '12px',
                  background: product.badge === 'Wolverine Stack' ? '#1A1814' : '#B8624A',
                  color: 'white',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  letterSpacing: '2px',
                  textTransform: 'uppercase' as const,
                  padding: '4px 12px',
                  borderRadius: '999px',
                  boxShadow: product.badge === 'Wolverine Stack'
                    ? '0 2px 8px rgba(26,24,20,0.4)'
                    : '0 2px 8px rgba(184,98,74,0.4)',
                  fontWeight: 500,
                }}
              >
                {product.badge}
              </div>
            )}

            <img
              src='/images/vial-transparent.png'
              alt={product.name}
              style={{
                width: '98%',
                height: 'auto',
                maxHeight: '385px',
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

          {/* BOTTOM BLOCK - Details with category color tint */}
          <div
            className="flex-1 flex flex-col"
            style={{
              padding: '16px 18px 20px',
              background: `${categoryColors.tint}66`,
            }}
          >
            {/* Lot Line */}
            <div
              className="font-mono mb-2"
              style={{
                fontSize: "11px",
                letterSpacing: "0.05em",
                color: 'rgba(26,24,20,0.5)',
              }}
            >
              {firstSize} · LYOPHILIZED · LOT {product.batch} ·{" "}
              <span className="text-ochre font-medium">
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
                7× Tested
              </span>
            </div>

            {/* Description - 2 lines max */}
            <p
              className="font-editorial mb-4 flex-1"
              style={{
                fontSize: "14px",
                lineHeight: "1.5",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                color: 'rgba(26,24,20,0.65)',
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
              <div
                className="font-display"
                style={{
                  fontWeight: 300,
                  fontSize: "24px",
                  color: '#1A1814',
                }}
              >
                ${lowestPrice.toFixed(2)}
              </div>
              <div
                className="font-mono text-xs uppercase tracking-mono hover:underline"
                style={{ color: '#C89A3C' }}
              >
                → VIEW LOT
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
