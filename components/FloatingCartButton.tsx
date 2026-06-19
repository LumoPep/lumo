"use client";

import { useCartStore } from "@/lib/store";

export default function FloatingCartButton() {
  const { toggleCart, getItemCount } = useCartStore();
  const itemCount = getItemCount();

  return (
    <button
      onClick={toggleCart}
      className="fixed transition-transform hover:scale-105"
      style={{
        bottom: '24px',
        right: '24px',
        zIndex: 50,
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        background: '#B8624A',
        boxShadow: '0 8px 24px rgba(184,98,74,0.4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        border: 'none',
        cursor: 'pointer',
      }}
      aria-label="Open cart"
    >
      {/* Cart Icon */}
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="9" cy="21" r="1" />
        <circle cx="20" cy="21" r="1" />
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
      </svg>

      {/* Item Count Badge */}
      {itemCount > 0 && (
        <div
          className="absolute font-mono font-bold"
          style={{
            top: '-4px',
            right: '-4px',
            background: '#607A5C',
            color: 'white',
            borderRadius: '50%',
            width: '22px',
            height: '22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '10px',
            border: '2px solid #F5EFE4',
          }}
        >
          {itemCount}
        </div>
      )}
    </button>
  );
}
