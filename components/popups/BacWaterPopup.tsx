"use client";

import { useCartStore } from "@/lib/store";
import { PRODUCTS } from "@/data/products";

interface Props {
  onClose: () => void;
}

export default function BacWaterPopup({ onClose }: Props) {
  const { addItem } = useCartStore();

  const bacWater = PRODUCTS.find((p) => p.slug === "bac-water");

  const handleAdd = () => {
    if (!bacWater) return;
    addItem({
      productId: bacWater.id.toString(),
      productName: bacWater.name,
      variant: bacWater.sizes[0],
      price: bacWater.prices[0],
      sku: bacWater.skus[0],
    });
    sessionStorage.setItem("lumo_bac_shown", "true");
    onClose();
  };

  const handleClose = () => {
    sessionStorage.setItem("lumo_bac_shown", "true");
    onClose();
  };

  if (!bacWater) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "24px",
        right: "24px",
        zIndex: 50,
        animation: "bacSlideIn 0.2s ease",
        maxWidth: "360px",
        width: "calc(100vw - 48px)",
      }}
    >
      <style>{`@keyframes bacSlideIn { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }`}</style>

      <div
        style={{
          backgroundColor: "#1A1814",
          borderTop: "3px solid #B8624A",
          padding: "24px 24px 20px",
          position: "relative",
          boxShadow: "0 8px 32px rgba(26,24,20,0.5)",
        }}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "none",
            border: "none",
            color: "#B8624A",
            fontSize: "16px",
            cursor: "pointer",
            lineHeight: 1,
            padding: "4px 6px",
            fontFamily: "inherit",
          }}
          aria-label="Close"
        >
          ×
        </button>

        {/* Ochre label */}
        <div
          className="font-mono uppercase"
          style={{ fontSize: "9px", letterSpacing: "3px", color: "#C89A3C", marginBottom: "10px" }}
        >
          LABORATORY SOLVENT
        </div>

        {/* Heading */}
        <h3
          className="font-display"
          style={{
            fontWeight: 300,
            fontStyle: "italic",
            fontSize: "1.3rem",
            color: "#F5EFE4",
            lineHeight: 1.2,
            marginBottom: "12px",
          }}
        >
          Add LP-BW Laboratory Solvent.
        </h3>

        {/* Body */}
        <p
          className="font-editorial"
          style={{
            fontSize: "13px",
            color: "#EBE2CF",
            opacity: 0.75,
            lineHeight: 1.6,
            marginBottom: "16px",
          }}
        >
          LP-BW Laboratory Solvent is a 0.9% benzyl alcohol aqueous solution supplied for analytical and laboratory use only.
        </p>

        {/* Product row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            backgroundColor: "rgba(235,226,207,0.06)",
            border: "1px solid rgba(235,226,207,0.12)",
            padding: "10px 12px",
            marginBottom: "14px",
          }}
        >
          {bacWater.images[0] && (
            <img
              src={bacWater.images[0]}
              alt={bacWater.name}
              style={{
                width: 44,
                height: 56,
                objectFit: "contain",
                flexShrink: 0,
                filter: "drop-shadow(0 2px 6px rgba(26,24,20,0.4))",
              }}
            />
          )}
          <div style={{ flex: 1 }}>
            <div
              className="font-display"
              style={{ fontWeight: 300, fontStyle: "italic", fontSize: "0.95rem", color: "#F5EFE4" }}
            >
              {bacWater.name}
            </div>
            <div
              className="font-mono"
              style={{ fontSize: "10px", color: "#C89A3C", marginTop: "2px" }}
            >
              {bacWater.sizes[0]} · USP Grade
            </div>
          </div>
          <div
            className="font-display"
            style={{ fontWeight: 300, fontSize: "1.1rem", color: "#F5EFE4", flexShrink: 0 }}
          >
            ${bacWater.prices[0]}
          </div>
        </div>

        {/* Add to cart CTA */}
        <button
          onClick={handleAdd}
          style={{
            width: "100%",
            padding: "12px 20px",
            backgroundColor: "#B8624A",
            border: "none",
            cursor: "pointer",
            textAlign: "center",
          }}
        >
          <span
            className="font-mono uppercase"
            style={{ fontSize: "10px", letterSpacing: "2.5px", color: "#F5EFE4" }}
          >
            → ADD TO CART
          </span>
        </button>
      </div>
    </div>
  );
}
