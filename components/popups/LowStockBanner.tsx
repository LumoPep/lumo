"use client";

const stockLevels: Record<string, number> = {
  "semaglutide": 24,
  "lumo-2-trz": 18,
  "lumo-3-rt": 31,
  "bpc-157": 22,
  "tb-500": 27,
  "bpc-tb-blend": 15,
  "kpv": 29,
  "cjc-1295-no-dac": 19,
  "cjc-ipamorelin": 23,
  "ipamorelin": 28,
  "tesamorelin": 26,
  "igf-1-lr3": 17,
  "sermorelin": 30,
  "ghk-cu": 25,
  "melanotan-2": 21,
  "nad-plus": 33,
  "mots-c": 28,
  "epithalon": 20,
  "selank": 24,
  "semax": 16,
  "pt-141": 22,
  "glow-blend": 29,
  "klow-blend": 27,
  "bac-water": 45,
};

interface Props {
  slug: string;
  lotNumber: string;
}

export default function LowStockBanner({ slug, lotNumber }: Props) {
  const stock = stockLevels[slug];
  if (stock === undefined || stock > 30) return null;

  return (
    <div
      style={{
        width: "100%",
        padding: "12px 20px",
        backgroundColor: "#B8624A",
        marginBottom: "10px",
        zIndex: 10,
      }}
    >
      <span
        className="font-mono uppercase"
        style={{ fontSize: "10px", letterSpacing: "2px", color: "#F5EFE4" }}
      >
        LOW STOCK — {stock} UNITS REMAINING · LOT {lotNumber}
      </span>
    </div>
  );
}
