"use client";

import { Product } from "@/data/products";

interface CoAViewerProps {
  product: Product;
}

export default function CoAViewer({ product }: CoAViewerProps) {
  const dataRows = [
    { label: "COMPOUND", value: product.name },
    { label: "CAS", value: product.casNumber },
    { label: "MOLECULAR WEIGHT", value: product.mw },
    { label: "PURITY (HPLC)", value: product.purity },
    { label: "IDENTITY (MS)", value: "CONFIRMED" },
    { label: "APPEARANCE", value: product.appearance },
    { label: "TESTED BY", value: "Independent Laboratory" },
  ];

  return (
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
          LOT {product.batch}
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
            {product.report}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-6">
        <div className="font-mono text-xs text-ink opacity-60">
          Verify · lumo.bio/coa/{product.batch.toLowerCase().replace(/\-/g, '')}
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
  );
}
