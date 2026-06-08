'use client'
import { useState } from 'react'

interface BundleTier {
  qty: number
  discountPct: number
  badge?: {
    text: string
    bgColor: string
  }
}

const TIERS: BundleTier[] = [
  { qty: 1, discountPct: 0 },
  {
    qty: 3,
    discountPct: 5,
    badge: { text: 'MOST POPULAR', bgColor: '#B8624A' }
  },
  { qty: 6, discountPct: 12 },
  {
    qty: 10,
    discountPct: 20,
    badge: { text: 'BEST VALUE', bgColor: '#607A5C' }
  },
]

interface BundleSelectorProps {
  basePrice: number
  productSlug: string
  onSelect: (qty: number, bundleQty: number, finalPrice: number) => void
}

export default function BundleSelector({ basePrice, productSlug, onSelect }: BundleSelectorProps) {
  const [selectedTier, setSelectedTier] = useState(0)
  const [quantity, setQuantity] = useState(1)

  function handleTierSelect(index: number) {
    setSelectedTier(index)
    const tier = TIERS[index]
    const unitPrice = basePrice * (1 - tier.discountPct / 100)
    const total = unitPrice * tier.qty * quantity
    onSelect(quantity, tier.qty, parseFloat(total.toFixed(2)))
  }

  function handleQuantityChange(newQty: number) {
    if (newQty < 1) return
    setQuantity(newQty)
    const tier = TIERS[selectedTier]
    const unitPrice = basePrice * (1 - tier.discountPct / 100)
    const total = unitPrice * tier.qty * newQty
    onSelect(newQty, tier.qty, parseFloat(total.toFixed(2)))
  }

  return (
    <div className="mb-4">
      {/* Quantity Stepper */}
      <div className="mb-3">
        <label className="text-[9px] font-medium tracking-widest uppercase text-[#1A1814]/40 mb-2 block">
          QUANTITY
        </label>
        <div className="flex items-center border border-[#1A1814]/15 rounded-lg overflow-hidden w-fit">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="w-8 h-8 flex items-center justify-center bg-[#EBE2CF] text-[#1A1814] text-lg font-light hover:bg-[#E0D5C0] transition-colors"
          >
            −
          </button>
          <div className="w-9 text-center text-sm font-medium text-[#1A1814] bg-[#F5EFE4]">
            {quantity}
          </div>
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-8 h-8 flex items-center justify-center bg-[#EBE2CF] text-[#1A1814] text-lg font-light hover:bg-[#E0D5C0] transition-colors"
          >
            +
          </button>
        </div>
      </div>

      {/* Bundle Pills - Compact */}
      <div className="grid grid-cols-4 gap-2">
        {TIERS.map((tier, i) => {
          const isSelected = selectedTier === i
          return (
            <button
              key={i}
              onClick={() => handleTierSelect(i)}
              className={[
                'relative flex flex-col items-center justify-center py-3 px-2 rounded-lg border cursor-pointer transition-all duration-150 min-h-[80px]',
                isSelected
                  ? 'bg-[#F5EFE4] border-2 border-[#B8624A]'
                  : 'bg-[#EBE2CF] border-[#1A1814]/10',
              ].join(' ')}
            >
              {/* Badge */}
              {tier.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 text-[7px] font-medium tracking-widest uppercase px-2 py-1 rounded-full whitespace-nowrap z-10 text-white"
                  style={{ backgroundColor: tier.badge.bgColor }}
                >
                  {tier.badge.text}
                </div>
              )}

              {/* Number */}
              <div className="text-2xl font-serif text-[#1A1814] leading-none">
                {tier.qty}
              </div>

              {/* Vial Label */}
              <div className="text-[8px] font-medium tracking-widest uppercase text-[#1A1814]/50 mt-1">
                {tier.qty === 1 ? 'VIAL' : 'VIALS'}
              </div>

              {/* Discount */}
              {tier.discountPct > 0 && (
                <div className="text-[9px] font-medium text-[#B8624A] mt-1">
                  {tier.discountPct}% OFF
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
