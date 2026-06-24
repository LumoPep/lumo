"use client";

import { useState } from "react";
import { Product, CATEGORY_COLORS } from "@/data/products";
import COAModal from "./COAModal";

interface CoAViewerProps {
  product: Product;
  selectedVariant: number;
}

export default function CoAViewer({ product, selectedVariant }: CoAViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Derive active COA based on selected variant
  const activeCoa = product.coas?.find(c => c.active && c.size === product.sizes[selectedVariant]) ?? product.coas?.[0];

  const categoryColors = CATEGORY_COLORS[product.category] || CATEGORY_COLORS['Metabolic Research'];

  const dataRows = [
    { label: "COMPOUND", value: product.name },
    { label: "CAS", value: product.casNumber },
    { label: "MOLECULAR WEIGHT", value: product.mw },
    { label: "PURITY (HPLC)", value: product.purity },
    { label: "IDENTITY (MS)", value: "CONFIRMED" },
    { label: "APPEARANCE", value: product.appearance },
    { label: "TESTED BY", value: activeCoa?.lab || "Independent Laboratory" },
  ];

  if (!activeCoa) {
    return <div className="bg-bone hairline-border p-8 text-center text-ink">No COA available for this variant.</div>;
  }

  return (
    <>
      <div className="bg-bone hairline-border p-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8 pb-6 border-b hairline-border">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <span className="font-display text-xl text-ink" style={{ fontWeight: 300 }}>
                Lumo
              </span>
              <div
                className="absolute bg-clay rounded-full"
                style={{
                  width: "6px",
                  height: "6px",
                  top: "-1px",
                  right: "-3px",
                }}
              />
            </div>
          </div>
          <div className="font-mono text-xs uppercase tracking-mono text-ink">
            LOT {activeCoa.lot}
          </div>
        </div>

        {/* Data Rows */}
        <div className="space-y-4 mb-8">
          {dataRows.map((row, index) => (
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

        {/* Report Number */}
        <div className="mb-8 pb-6 border-b hairline-border">
          <div className="flex items-baseline justify-between">
            <span className="font-mono text-xs uppercase tracking-mono text-ink opacity-60">
              REPORT NUMBER
            </span>
            <div
              className="flex-1 mx-3 border-b border-dotted"
              style={{ borderColor: "rgba(26, 24, 20, 0.15)" }}
            />
            <span className="font-mono text-xs text-ink font-medium">
              {activeCoa.reportNumber}
            </span>
          </div>
        </div>

        {/* View COA Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-3 bg-bone hairline-border font-mono text-xs uppercase tracking-mono text-ink hover:border-ink transition-colors"
            style={{
              borderRadius: "8px",
              borderColor: categoryColors.accent,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = categoryColors.accent;
              e.currentTarget.style.backgroundColor = categoryColors.accent;
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(26, 24, 20, 0.15)';
              e.currentTarget.style.backgroundColor = '#EBE2CF';
              e.currentTarget.style.color = '#1A1814';
            }}
          >
            View COA
          </button>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-6">
          <div className="font-mono text-xs text-ink opacity-60">
            Verify · lumo.bio/coa/{activeCoa.lot.toLowerCase().replace(/\-/g, '')}
          </div>
          <div className="flex items-center space-x-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="9" stroke="#C89A3C" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="3" fill="#C89A3C" />
            </svg>
            <span className="font-mono text-xs uppercase tracking-mono text-ochre font-medium">
              VERIFIED
            </span>
          </div>
        </div>
      </div>

      {/* Modal */}
      <COAModal coa={activeCoa} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
}
