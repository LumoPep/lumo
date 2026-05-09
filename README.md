# Lumo Peptides - E-Commerce Website

A production-ready Next.js 14 e-commerce platform for research peptides with cryptocurrency payment integration.

## Features

- **Modern Tech Stack**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Zustand
- **Product Catalog**: 10 research peptides with full specifications and CoA documentation
- **Shopping Experience**: Advanced filtering, sorting, product search, and cart management
- **Secure Payments**: Cryptocurrency payments via NOWPayments (BTC, ETH, USDT, USDC, LTC)
- **Compliance**: Heavy "For Research Use Only" disclaimers throughout
- **Responsive Design**: Mobile-first, dark luxury aesthetic with scientific styling

## Pages

- **/** - Homepage with hero, featured products, trust badges, full catalog, crypto bar
- **/products** - Complete catalog with search, category filters, and sorting
- **/products/[slug]** - Individual product pages with tabs, size selector, add to cart
- **/coa** - Certificate of Analysis library with purity visualization
- **/about** - Mission, values, 4-step process, RUO statement
- **/faq** - 6 categories of FAQs with accordion interface
- **/contact** - Contact form with subject selector and RUO confirmations
- **/checkout** - Crypto payment checkout with NOWPayments integration

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your credentials:

```env
NOWPAYMENTS_API_KEY=your_api_key_here
NOWPAYMENTS_IPN_SECRET=your_ipn_secret_here
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Getting NOWPayments Credentials:**

1. Sign up at [https://account.nowpayments.io/](https://account.nowpayments.io/)
2. Get your API key from the API Keys section
3. Set up an IPN (Instant Payment Notification) secret in Settings
4. Configure the IPN callback URL to: `https://yourdomain.com/api/payment-webhook`

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
lumo-peptides/
├── app/                      # Next.js App Router pages
│   ├── about/               # About page
│   ├── checkout/            # Checkout page
│   ├── coa/                 # Certificate of Analysis library
│   ├── contact/             # Contact form
│   ├── faq/                 # FAQ page
│   ├── products/            # Products catalog & detail pages
│   ├── api/                 # API routes
│   │   ├── create-payment/  # Payment creation endpoint
│   │   └── payment-webhook/ # Payment notification handler
│   ├── layout.tsx           # Root layout with nav/footer
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # Reusable React components
│   ├── CartDrawer.tsx       # Shopping cart slide-out
│   ├── CoAViewer.tsx        # Certificate of Analysis viewer
│   ├── Footer.tsx           # Site footer
│   ├── NavBar.tsx           # Navigation bar
│   ├── ProductCard.tsx      # Product grid card
│   ├── ResearchDisclaimerBox.tsx  # RUO warning component
│   └── Toast.tsx            # Notification toast
├── data/                    # Application data
│   └── products.ts          # Product catalog (single source of truth)
├── lib/                     # Utility libraries
│   ├── nowpayments.ts       # NOWPayments API wrapper
│   └── store.ts             # Zustand cart state management
├── .env.example             # Environment variable template
├── next.config.js           # Next.js configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

## Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Zustand**: Lightweight state management (cart persistence)
- **NOWPayments**: Cryptocurrency payment processing
- **Lucide React**: Icon library

## Design System

### Colors
- Background: `#05080f` (deep navy)
- Accent: `#00d4ff` (cyan)
- Borders: `cyan/10`, `cyan/20`, `cyan/30`

### Fonts
- **Playfair Display**: Headings and display text
- **DM Sans**: Body text and UI
- **DM Mono**: Labels, technical specs, monospace

### Aesthetic
Dark, scientific, luxury feel inspired by premium research chemical suppliers. Heavy use of gradients, glass-morphism effects, and high contrast cyan accents against deep navy backgrounds.

## Product Data

All 10 products are defined in `data/products.ts` with:
- Chemical specifications (CAS, formula, molecular weight)
- Purity data (98%+ verified by HPLC)
- Batch and report numbers
- Multiple size variants with pricing
- Research applications and storage requirements
- Technical specifications and safety information

## Cart Management

The shopping cart uses Zustand with localStorage persistence:
- Add/remove items
- Update quantities
- Calculate totals
- Persist across sessions
- Slide-out drawer interface

## Payment Flow

1. Customer adds products to cart
2. Proceeds to checkout
3. Fills in contact info and research confirmations
4. Selects cryptocurrency (BTC, ETH, USDT, USDC, LTC)
5. Creates payment via NOWPayments API
6. Redirected to payment page with wallet address
7. Blockchain confirms transaction
8. Webhook notifies site of payment status
9. Order fulfilled and confirmation sent

## Compliance & Legal

Every page includes "For Research Use Only" disclaimers:
- Top banner on all pages
- Product pages with disclaimer boxes
- Checkout with required confirmations
- Contact form with RUO checkboxes
- Footer with comprehensive disclaimer
- About page with detailed RUO policy

## Customization

### Adding Products

Edit `data/products.ts` and add new product objects following the existing schema.

### Styling

Modify `tailwind.config.ts` to change colors, fonts, or other design tokens.

### Payment Providers

To use a different payment provider, replace the NOWPayments integration in:
- `lib/nowpayments.ts`
- `app/api/create-payment/route.ts`
- `app/api/payment-webhook/route.ts`

## Support

For questions or issues:
- Email: support@lumopeptides.com
- Review the FAQ page at `/faq`
- Check NOWPayments documentation: [https://documenter.getpostman.com/view/7907941/S1a32n38](https://documenter.getpostman.com/view/7907941/S1a32n38)

## License

Proprietary - All Rights Reserved

---

**⚠ Important**: This platform is designed for legitimate research chemical sales. All products are intended for laboratory and research use only, NOT for human consumption or veterinary applications.
