/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      // Query parameter redirects for category filters
      {
        source: '/products',
        has: [{ type: 'query', key: 'category', value: 'Healing+%26+Recovery' }],
        destination: '/products?category=tissue-repair-research',
        permanent: true,
      },
      {
        source: '/products',
        has: [{ type: 'query', key: 'category', value: 'Healing+&+Recovery' }],
        destination: '/products?category=tissue-repair-research',
        permanent: true,
      },
      {
        source: '/products',
        has: [{ type: 'query', key: 'category', value: 'Metabolic' }],
        destination: '/products?category=metabolic-research',
        permanent: true,
      },
      {
        source: '/products',
        has: [{ type: 'query', key: 'category', value: 'Growth+Hormone' }],
        destination: '/products?category=secretagogue-research',
        permanent: true,
      },
      {
        source: '/products',
        has: [{ type: 'query', key: 'category', value: 'Skin+%26+Longevity' }],
        destination: '/products?category=dermal-research',
        permanent: true,
      },
      {
        source: '/products',
        has: [{ type: 'query', key: 'category', value: 'Skin+&+Longevity' }],
        destination: '/products?category=dermal-research',
        permanent: true,
      },
      {
        source: '/products',
        has: [{ type: 'query', key: 'category', value: 'Longevity' }],
        destination: '/products?category=cellular-research',
        permanent: true,
      },
      {
        source: '/products',
        has: [{ type: 'query', key: 'category', value: 'Nootropic' }],
        destination: '/products?category=neuro-research',
        permanent: true,
      },
      // Product renames (permanent 301)
      {
        source: '/products/semaglutide',
        destination: '/products/lp-sm',
        permanent: true,
      },
      {
        source: '/products/lumo-2-trz',
        destination: '/products/lp-tz',
        permanent: true,
      },
      {
        source: '/products/lumo-3-rt',
        destination: '/products/lp-rt',
        permanent: true,
      },
      // Path-based redirects (if they exist)
      {
        source: '/compounds/healing-recovery',
        destination: '/compounds/tissue-repair-research',
        permanent: true,
      },
      {
        source: '/compounds/metabolic',
        destination: '/compounds/metabolic-research',
        permanent: true,
      },
      {
        source: '/compounds/growth-hormone',
        destination: '/compounds/secretagogue-research',
        permanent: true,
      },
      {
        source: '/compounds/skin-longevity',
        destination: '/compounds/dermal-research',
        permanent: true,
      },
      {
        source: '/compounds/longevity',
        destination: '/compounds/cellular-research',
        permanent: true,
      },
      {
        source: '/compounds/nootropic',
        destination: '/compounds/neuro-research',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
