"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Product, CATEGORY_COLORS } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const lowestPrice = Math.min(...product.prices);
  const firstSize = product.sizes[0];
  const categoryColor = CATEGORY_COLORS[product.category] || "#B8624A";

  // Special handling for BAC Water - it has 'USP Grade' instead of percentage
  const isUSPGrade = product.purity === 'USP Grade';

  return (
    <Link href={`/products/${product.slug}`} className="block h-full">
      <div
        style={{
          borderTop: `4px solid ${categoryColor}`,
          borderRadius: '20px',
          overflow: 'hidden',
          cursor: 'pointer',
          height: '100%',
        }}
      >
        <motion.div
          whileHover={{ y: -8, boxShadow: "0 24px 48px rgba(26,24,20,0.14)" }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          style={{
            background: 'white',
            borderRadius: '0 0 20px 20px',
            boxShadow: '0 4px 24px rgba(26,24,20,0.08)',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* TOP BLOCK - Bone Background with Vial */}
          <div
            style={{
              position: 'relative',
              background: '#F5EFE4',
              minHeight: '320px',
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
                  top: '10px',
                  right: '10px',
                  background: categoryColor,
                  color: 'white',
                  fontFamily: 'JetBrains Mono, monospace',
                  fontSize: '9px',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '2px',
                }}
              >
                {product.badge}
              </div>
            )}

            <img
              src='/images/vial-transparent.png'
              alt={product.name}
              style={{
                width: '75%',
                height: 'auto',
                maxHeight: '220px',
                objectFit: 'contain',
                filter: 'drop-shadow(-6px 12px 24px rgba(26,24,20,0.25))',
                display: 'block',
                margin: '0 auto',
              }}
            />
          </div>

          {/* BOTTOM BLOCK - Details */}
          <div className="bg-white flex-1 flex flex-col" style={{ padding: '16px' }}>
            {/* Lot Line */}
            <div className="font-mono text-ink opacity-60 mb-2"
              style={{ fontSize: "11px", letterSpacing: "0.05em" }}>
              {firstSize} · LYOPHILIZED · LOT {product.batch} ·{" "}
              <span className="text-ochre font-medium">
                {isUSPGrade ? 'USP GRADE' : product.purity}
              </span>
            </div>

            {/* Description - 2 lines max */}
            <p
              className="font-editorial text-ink opacity-70 mb-4 flex-1"
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
            <div className="flex items-end justify-between pt-2 border-t border-ink border-opacity-10">
              <div className="font-display text-ink" style={{ fontWeight: 300, fontSize: "24px" }}>
                ${lowestPrice.toFixed(2)}
              </div>
              <div className="font-mono text-xs uppercase tracking-mono text-clay hover:underline">
                → VIEW LOT
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </Link>
  );
}
