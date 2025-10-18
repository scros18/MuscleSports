import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vouched Brands & Verified Fitness Partner Network | MuscleSports',
  description: 'MuscleSports verified network of premium fitness gyms and legitimate wholesale supplement suppliers. Community-verified partners including 100 Gym Boston, Tropicana Wholesale, and Avasam. Join our trusted business community.',
  keywords: [
    'verified fitness gyms',
    'legitimate gym partners',
    'wholesale supplements UK',
    'supplement suppliers',
    'Tropicana Wholesale',
    'Avasam supplements',
    '100 Gym Boston',
    'verified partners',
    'trusted fitness businesses',
    'fitness community network',
    'UK supplement distribution',
    'wholesale fitness products',
    'certified gym facilities',
    'authentic fitness services',
    'community gyms',
    'fitness partnerships',
    'wellness products',
    'verified retailers',
    'legitimate wholesalers',
    'fitness business directory',
    'gym recommendations',
    'fitness equipment',
    'fitness community',
    'trusted fitness brands',
  ],
  icons: {
    icon: [
      { url: '/ms.png', sizes: '32x32', type: 'image/png' },
      { url: '/ms.png', sizes: '64x64', type: 'image/png' },
      { url: '/ms.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/ms.png',
    apple: [
      { url: '/ms.png', sizes: '120x120', type: 'image/png' },
      { url: '/ms.png', sizes: '152x152', type: 'image/png' },
      { url: '/ms.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'mask-icon',
        url: '/ms.png',
        color: '#10b981',
      },
      {
        rel: 'apple-touch-icon',
        url: '/ms.png',
        sizes: '180x180',
      },
      {
        rel: 'ms-icon',
        url: '/ms.png',
        sizes: '144x144',
      },
    ],
  },
  openGraph: {
    title: 'Vouched Brands & Verified Fitness Partner Network | MuscleSports',
    description: 'MuscleSports verified network of premium fitness gyms and legitimate wholesale supplement suppliers. Community-verified partners including 100 Gym Boston, Tropicana Wholesale, and Avasam.',
    type: 'website',
    url: 'https://musclesports.co.uk/recommended',
    siteName: 'MuscleSports',
    locale: 'en_GB',
    images: [
      {
        url: 'https://musclesports.co.uk/ms.png',
        width: 1024,
        height: 1024,
        alt: 'MuscleSports Logo',
        type: 'image/png',
      },
      {
        url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Recommended Fitness Gyms and Wholesale Suppliers',
        type: 'image/jpeg',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vouched Brands & Verified Fitness Partner Network | MuscleSports',
    description: 'Discover our hand-verified selection of premium fitness gyms and legitimate wholesale supplement suppliers. Trusted partners in the fitness community.',
    images: ['https://musclesports.co.uk/ms.png'],
    creator: '@MuscleSports',
    site: '@MuscleSports',
  },
  alternates: {
    canonical: 'https://musclesports.co.uk/recommended',
    languages: {
      'en-GB': 'https://musclesports.co.uk/recommended',
    },
  },
  robots: {
    index: true,
    follow: true,
    'max-snippet': -1,
    'max-image-preview': 'large',
    'max-video-preview': -1,
    googleBot: 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1',
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RecommendedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
