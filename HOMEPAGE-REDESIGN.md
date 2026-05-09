# Lumo Homepage Redesign — Dynamic & Visually Rich

## 🎨 Complete Transformation

The homepage has been redesigned to be **dynamic, section-separated, and visually rich** — inspired by Hims.com's bold approach while staying true to the Lumo brand.

---

## 🌈 Section Color Blocking (Aggressive)

Each section now has its own distinct background color for maximum visual impact:

| Section | Background Color | Hex Code | Visual Impact |
|---------|-----------------|----------|---------------|
| **Hero** | Ink | #1A1814 | Dark, commanding, serious |
| **Trust Bar** | Clay | #B8624A | Full-bleed warm terracotta |
| **Product Carousel** | Bone | #F5EFE4 | Light, clean, open |
| **How It Works** | Cream | #EBE2CF | Warm off-white, welcoming |
| **COA Proof** | Ink | #1A1814 | Dark again, authoritative |
| **Categories** | Sage | #6D7A5C | Muted green, considered |
| **CTA Banner** | Clay | #B8624A | Warm, energetic close |
| **Footer** | Ink | #1A1814 | Consistent grounding |

**Result:** Bold color transitions create visual rhythm and section separation

---

## 🎠 Product Carousel (Manual Scrolling)

### Features
- **Horizontal scroll** with CSS scroll-snap
- **Manual navigation** with prev/next arrow buttons (← →)
- **3 cards on desktop**, 1.2 on mobile (peek effect)
- **Smooth scrolling** without JavaScript libraries
- **Sharp square arrows** in Ink, hover to Clay

### Card Design
```
┌──────────────────────────┐  border-radius: 24px
│  [Top: Color Block]      │  box-shadow: 0 4px 24px rgba()
│  Clay/Ochre/Sage/Ink     │
│                          │
│  Compound Name (Fraunces │  White text on color
│  italic, 4xl)            │
│                          │
│  ● VERIFIED (Ochre)      │  Top-right badge
├──────────────────────────┤
│  [Bottom: Cream bg]      │
│                          │
│  LOT 24·11·B · 99.4%     │  JetBrains Mono
│  $42.99    → VIEW LOT    │  Fraunces / Clay link
└──────────────────────────┘
```

### Category Colors in Carousel
- **Healing & Recovery:** Clay #B8624A
- **Growth Hormone:** Ochre #C89A3C
- **Longevity:** Sage #6D7A5C
- **Melanocortin/Nootropic:** Ink #1A1814

---

## 🔄 Rounded Cards Throughout

**BEFORE:** All sharp rectangular cards (border-radius: 0)

**AFTER:** Rounded corners for warmth and approachability
- **24px** — Large feature cards (hero product, carousel cards)
- **20px** — Medium cards (How It Works steps, category blocks)
- **16px** — Product cards (where applicable)
- **12px** — Small badges (VERIFIED, 3RD-PARTY TESTED)
- **8px** — Buttons (slightly rounded, NOT pills)
- **0px (sharp)** — Navigation, footer, section dividers, carousel arrows

---

## 📐 Section-by-Section Breakdown

### 1. Hero Section (Ink Background)
**Layout:** Two-column grid

**Left Side:**
- Eyebrow label: "LOT 24·11·B · NOW SHIPPING" in Clay mono
- Massive headline: 96px (desktop), Cream color
  - "serious" in Clay italic for emphasis
- Subhead: Newsreader, muted Cream
- Two CTAs side by side:
  - Primary: Clay background, Cream text, 8px radius
  - Secondary: Transparent, Cream border, 8px radius

**Right Side:**
- Large rounded card (24px radius)
- Clay background with shadow
- Featured product display
- Floating "● 3RD-PARTY TESTED" badge (Ochre, 20px radius)

### 2. Trust Bar (Clay Background)
**Full-bleed terracotta section**

**5 Trust Items:**
1. HPLC TESTED — Flask icon
2. COA INCLUDED — Certificate icon
3. COLD SHIPPED — Snowflake icon
4. LOT TRACEABLE — Clock icon
5. CRYPTO ACCEPTED — Lock icon

**Style:**
- All Cream/white text
- Custom SVG icons (no emoji)
- Dividing hairlines between items
- Stagger fade-in animation (100ms delays)

### 3. Product Carousel (Bone Background)
**Heading:** "Our research compounds." (Fraunces)
**Subhead:** "Tested for purity, identity, and endotoxin."

**Carousel:**
- Scrollable container with all 10 products
- Prev/next buttons (sharp Ink squares)
- Disabled state when can't scroll
- Updates on scroll and resize
- Smooth scroll behavior

**Each Card:**
- Top half: Solid category color
- Compound name in white Fraunces italic
- VERIFIED badge (Ochre)
- Bottom half: Cream with lot details
- Hover lift effect (translateY -4px)

### 4. How It Works (Cream Background)
**Heading:** "How it works."
**Subhead:** "Three steps to verified research compounds."

**3 Step Cards (20px radius):**
1. **01** — Browse Catalog
2. **02** — Place Order
3. **03** — Cold Shipped

**Card Design:**
- Bone background
- Large Clay step number (80px Fraunces)
- Title in Fraunces
- Description in Newsreader
- Box shadow on hover
- Dotted connecting line between cards (CSS only)

### 5. COA Proof (Ink Background)
**Two-column layout**

**Left:** Rendered COA card (20px radius, Cream bg)
- Lumo logo with Clay dot
- Lot number top-right
- Dotted leader lines between labels/values
- Data rows: COMPOUND, PURITY (HPLC), IDENTITY (MS), TESTED BY
- VERIFIED seal in Ochre (bottom-right)

**Right:** Content
- Headline: "Every lot. Its own paper trail." (Cream)
- 3 bullet points with Clay dot markers
- "→ Read a COA" link in Clay

### 6. Categories (Sage Background)
**Heading:** "Browse by research area."
**Subhead:** "Compounds organized by application."

**4 Category Cards (20px radius):**
1. **Healing & Recovery** — Clay background
2. **Growth Hormone** — Ochre background
3. **Longevity** — Sage darker background
4. **Nootropics** — Ink background

**Card Style:**
- 200px tall (h-48)
- Compound count in mono
- "→ BROWSE" link at bottom
- Hover lift effect
- Box shadow

### 7. CTA Banner (Clay Background)
**Centered content**

- Large headline: "Ready to start your research?" (Fraunces 60px)
- Subhead: "See current lots or contact us for custom inquiries."
- Two CTAs:
  - "→ SEE CURRENT LOTS" (Cream bg)
  - "CONTACT US" (Cream border)

---

## ✨ Animations & Interactions

### Subtle Animations
```css
Hover Lift:
  transform: translateY(0) → translateY(-4px)
  transition: 200ms ease
  box-shadow increase

Fade In:
  opacity: 0 → 1
  translateY: 20px → 0
  duration: 600ms ease-out

Stagger Delays:
  Elements animate with 100-200ms delays
```

### What's Animated
- ✅ All cards hover lift
- ✅ Section fade-in on load
- ✅ Trust bar items stagger
- ✅ Carousel smooth scroll
- ✅ Arrow button opacity on hover
- ✅ Category cards hover lift
- ✅ CTA button hover transitions

### What's NOT Animated
- ❌ No parallax scrolling
- ❌ No auto-playing carousels
- ❌ No jarring transitions
- ❌ No scroll hijacking
- ❌ No infinite scrolls

**Philosophy:** Animations enhance, never distract

---

## 📏 Spacing & Layout

### Section Padding
- **Desktop:** 96px top/bottom (py-24)
- **Mobile:** 64px top/bottom (responsive)
- **Max width:** 1200px (max-w-7xl)

### Internal Spacing
- **Card gaps:** 24px (gap-6)
- **Internal padding:** Increased by ~20% across all elements
- **More breathing room** between text blocks
- **Generous whitespace** around CTAs

### Typography Scale
- **Hero headline:** 96px (6xl/8xl responsive)
- **Section headlines:** 60px (5xl)
- **Step numbers:** 80px (7xl)
- **Featured product name:** 60px (5xl)
- **Carousel card names:** 36px (4xl)

---

## 🎯 Brand Compliance

### Colors Used Aggressively
- ✅ **Ink #1A1814** — Hero, CoA, Footer, Category card
- ✅ **Bone #F5EFE4** — Carousel section, step cards
- ✅ **Cream #EBE2CF** — How It Works, carousel card bottoms, CoA card
- ✅ **Clay #B8624A** — Trust bar, CTA banner, category card, primary buttons
- ✅ **Ochre #C89A3C** — Verified badges, GH category
- ✅ **Sage #6D7A5C** — Categories section, Longevity category

### Typography
- ✅ **Fraunces** — All headlines, step numbers, compound names
- ✅ **Newsreader** — All body copy, descriptions
- ✅ **JetBrains Mono** — All labels, lot numbers, badges

### Design System
- ✅ Rounded cards (24px, 20px, 12px, 8px)
- ✅ Box shadows for depth
- ✅ Hairline borders where needed
- ✅ SVG brand marks (● ◉)
- ✅ Sharp arrows for carousel
- ✅ Consistent hover states

---

## 📊 Technical Implementation

### Client-Side Rendering
- Homepage is now `"use client"` for carousel interactivity
- `useRef` for carousel container
- `useState` for scroll button states
- `useEffect` for scroll listeners
- Manual scroll functions (left/right)

### Carousel Logic
```typescript
const scroll = (direction: "left" | "right") => {
  const scrollAmount = container.clientWidth * 0.8;
  container.scrollBy({
    left: direction === "left" ? -scrollAmount : scrollAmount,
    behavior: "smooth",
  });
};
```

### CSS Features Used
- `scroll-snap-type: x mandatory`
- `scroll-snap-align: start`
- `scroll-behavior: smooth`
- `overflow-x: auto` with hidden scrollbar
- CSS animations (keyframes)
- Flexbox for layouts
- Grid for sections

### No External Libraries
- ❌ No Swiper.js
- ❌ No Framer Motion
- ❌ No React Spring
- ✅ Pure CSS + minimal React state

---

## 🚀 Performance

### Build Results
```
Homepage size: 11.3 kB (up from 179 B)
Reason: Client-side interactivity for carousel
First Load JS: 105 kB
Status: ✓ Compiled successfully
```

### Optimizations
- CSS scroll-snap (hardware accelerated)
- Minimal JavaScript
- No external animation libraries
- Static product data
- Efficient state management

---

## 📱 Responsive Behavior

### Mobile Adaptations
- **Hero headline:** 96px → 72px
- **Carousel:** 3 cards → 1.2 cards (peek)
- **How It Works:** 3 columns → 1 column stack
- **COA section:** 2 columns → 1 column stack
- **Categories:** 4 columns → 2 columns → 1 column
- **Arrow buttons:** Hidden on mobile, swipe instead

### Touch Support
- Horizontal swipe on carousel
- Native scroll behavior
- No hover states on touch devices

---

## ✅ What Changed

### BEFORE (Static Homepage)
- All sections Bone/Cream
- Sharp rectangular cards everywhere
- Static product grid
- Minimal visual hierarchy
- Subtle, understated design

### AFTER (Dynamic Homepage)
- **8 distinct section backgrounds** (color blocking)
- **Rounded cards** throughout (24px, 20px, 12px, 8px)
- **Manual scrolling carousel** with 10 products
- **Bold visual hierarchy** with large type
- **Dynamic, energetic design** while staying considered

---

## 🎨 Design Inspiration

**Hims.com Influence:**
- Bold section color blocking
- Manual product carousel
- Large hero with featured product
- Trust bar with icons
- Category blocks with colored backgrounds
- Strong visual hierarchy

**Lumo Brand Identity:**
- Kept all brand colors exact
- Maintained typography system
- Preserved editorial voice
- Used brand SVG marks
- Sharp carousel arrows (not rounded)

**Result:** Best of both worlds — dynamic layout with Lumo's refined aesthetic

---

## 📝 Files Modified

1. **app/page.tsx** — Complete homepage rebuild (11.3 kB)
2. **app/globals.css** — Added carousel scroll utilities, animations

**Lines Changed:** ~600+ lines (full rewrite)

---

## 🎯 Next Steps

The homepage is now dynamic and visually rich. Consider:

1. **Add IntersectionObserver** for scroll-triggered animations
2. **Optimize images** if product photos are added
3. **A/B test** CTA button colors/copy
4. **Track carousel** engagement with analytics
5. **Add loading states** for future dynamic content

---

## ✨ Summary

**The Lumo homepage is now:**
- ✅ Dynamic and visually engaging
- ✅ Section-separated with aggressive color blocking
- ✅ Features a manual product carousel (10 compounds)
- ✅ Uses rounded cards throughout (24px, 20px, 12px, 8px)
- ✅ Includes subtle but effective animations
- ✅ Maintains 100% brand compliance
- ✅ Optimized for performance
- ✅ Fully responsive

**It feels alive while staying considered, exact, and serious — true to the Lumo brand.**

---

**Build Status:** ✅ **SUCCESS**
**Homepage Size:** 11.3 kB
**Animations:** ✅ Smooth & subtle
**Brand Compliance:** ✅ 100%
