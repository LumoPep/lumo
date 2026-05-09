# Lumo Peptides - Quick Start Guide

Get your research peptide e-commerce site running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- A text editor or IDE
- Terminal/command line access

## Setup Steps

### 1. Install Dependencies (Already Done)

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### 2. Configure Environment Variables

The `.env.local` file is already created with placeholders. For development/testing, you can leave the placeholder values. For production, you'll need real NOWPayments credentials:

1. Sign up at [https://account.nowpayments.io/](https://account.nowpayments.io/)
2. Get your API key from the dashboard
3. Generate an IPN secret in Settings
4. Update `.env.local` with your real credentials

### 3. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## What You'll See

### Homepage (/)
- Hero section with product showcase
- Featured products (BPC-157, TB-500, Ipamorelin)
- Trust badges (HPLC Tested, CoA Included, etc.)
- Full product catalog table
- Crypto payment acceptance bar
- Call-to-action sections

### Product Pages
- **Full Catalog** (`/products`) - Search, filter by category, sort options
- **Product Detail** (`/products/bpc-157`) - Individual product pages with:
  - Size selector (5mg, 10mg, 20mg variants)
  - Quantity selector
  - Add to cart functionality
  - 4 tabs: Technical Specs, CoA, Storage, Research Info
  - Related products
  - Trust badges

### Other Pages
- **Certificates** (`/coa`) - All 10 products with animated purity bars
- **About** (`/about`) - Mission, values, 4-step process, RUO policy
- **FAQ** (`/faq`) - 6 categories of questions with accordion interface
- **Contact** (`/contact`) - Contact form with RUO confirmations
- **Checkout** (`/checkout`) - Crypto payment selection and order summary

## Testing the Site

### Test Shopping Flow

1. **Browse Products**: Go to `/products`
2. **View Product**: Click any product (e.g., BPC-157)
3. **Add to Cart**: Select size, set quantity, click "Add to Cart"
4. **View Cart**: Click cart icon in navigation (top right)
5. **Adjust Items**: Use +/- buttons or remove items
6. **Checkout**: Click "Proceed to Checkout"
7. **Fill Form**: Enter email, name, institution
8. **Select Crypto**: Choose payment method (BTC, ETH, etc.)
9. **Confirm RUO**: Check all three confirmation boxes
10. **Submit**: Click "Proceed to Payment"

**Note**: Without real NOWPayments credentials, the payment will fail. The flow demonstrates the full user experience up to that point.

### Test Features

- **Search**: Try searching for "BPC" or "healing" on products page
- **Filter**: Use category tabs (Healing & Recovery, Growth Hormone, etc.)
- **Sort**: Sort by name, price, or purity
- **Cart Persistence**: Add items, refresh page - cart persists
- **Mobile**: Resize browser to test responsive design
- **Disclaimers**: Notice RUO warnings on every page

## Customization Quick Tips

### Change Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  background: "#05080f",  // Main background
  cyan: "#00d4ff",        // Accent color
}
```

### Add/Edit Products

Edit `data/products.ts`:

```typescript
{
  id: "11",
  name: "New Peptide",
  slug: "new-peptide",
  category: "Your Category",
  purity: 99.5,
  // ... more fields
}
```

### Modify Site Name

Global search and replace "Lumo" with your company name in all files.

### Update Contact Email

Replace `support@lumopeptides.com` throughout the codebase.

## Production Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Deploy to Other Platforms

- **Netlify**: Connect GitHub repo, set build command to `npm run build`
- **AWS**: Use AWS Amplify or Elastic Beanstalk
- **Docker**: Create Dockerfile with Node.js and Next.js
- **VPS**: Use PM2 or systemd to run `npm start`

## NOWPayments Integration

### Sandbox Testing

1. Use NOWPayments sandbox environment
2. Get sandbox API key
3. Test with testnet cryptocurrencies
4. Verify webhook receives notifications

### Production Setup

1. Complete NOWPayments KYC verification
2. Enable desired cryptocurrencies (BTC, ETH, USDT, USDC, LTC)
3. Set IPN callback URL: `https://yourdomain.com/api/payment-webhook`
4. Test with small real transaction
5. Monitor payments in NOWPayments dashboard

## Troubleshooting

### Build Errors

**"Module not found"**
- Run `npm install` to ensure all dependencies are installed

**TypeScript errors**
- Check `tsconfig.json` is present
- Run `npm run build` to see detailed errors

### Runtime Errors

**"Cannot read property of undefined"**
- Check environment variables in `.env.local`
- Verify all required files exist

**Cart not persisting**
- Check browser localStorage is enabled
- Clear cache and try again

**Payment fails**
- Verify NOWPayments API key is correct
- Check API key has necessary permissions
- Review console for error messages

### Styling Issues

**Fonts not loading**
- Next.js will auto-fetch Google Fonts
- Check internet connection during development

**Tailwind classes not working**
- Run `npm run dev` to rebuild
- Check `tailwind.config.ts` paths are correct

## Support

- **Documentation**: See full `README.md`
- **Product Data**: Check `data/products.ts` for all product info
- **Components**: Browse `components/` folder for reusable UI elements
- **API Routes**: See `app/api/` for backend endpoints

## Next Steps

1. **Add Real Content**: Update product descriptions, research info
2. **Set Up Payments**: Get NOWPayments credentials and test
3. **Configure Email**: Add SMTP for order confirmations
4. **Add Analytics**: Integrate Google Analytics or similar
5. **SEO Optimization**: Add meta tags, sitemap, robots.txt
6. **Legal Pages**: Create Privacy Policy, Terms of Service
7. **SSL Certificate**: Ensure HTTPS in production
8. **Database**: Add persistent storage for orders (PostgreSQL, MongoDB)

---

**Ready to launch!** Your premium research peptide e-commerce site is built and tested. Just add your payment credentials and deploy.

⚠ **Remember**: This site is designed for legitimate research chemical sales with heavy RUO (Research Use Only) disclaimers. Ensure compliance with all applicable laws and regulations.
