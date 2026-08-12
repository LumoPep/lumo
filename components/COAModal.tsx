"use client";

import { useEffect } from "react";
import { COA } from "@/data/products";

interface COAModalProps {
  coa: COA;
  isOpen: boolean;
  onClose: () => void;
}

export default function COAModal({ coa, isOpen, onClose }: COAModalProps) {
  // Trap scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-ink bg-opacity-75 z-50"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-bone w-full max-w-[800px] h-[90vh] flex flex-col"
          style={{ borderRadius: "12px" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b hairline-border">
            <h2 className="font-display text-2xl text-ink" style={{ fontWeight: 300 }}>
              Certificate of Analysis
            </h2>
            <button
              onClick={onClose}
              className="text-ink hover:text-clay transition-colors text-3xl leading-none"
              style={{ padding: "0", lineHeight: "1" }}
            >
              ×
            </button>
          </div>

          {/* Body - PDF Viewer */}
          <div className="flex-1 overflow-hidden">
            <iframe
              src={coa.pdfUrl}
              width="100%"
              height="100%"
              style={{ border: "none" }}
              title="Certificate of Analysis PDF"
            />
          </div>

          {/* Footer */}
          <div className="p-6 border-t hairline-border flex items-center justify-between">
            <a
              href={coa.pdfUrl}
              download
              className="font-mono text-xs uppercase tracking-mono text-ink hover:text-clay transition-colors"
            >
              ↓ Download
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
