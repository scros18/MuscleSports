import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vouched Brands & Partners | MuscleSports',
  description: 'Discover our recommended gyms and wholesale suppliers. Curated partners that share our commitment to quality, excellence, and customer satisfaction.',
  keywords: [
    'recommended gyms',
    'fitness partners',
    'wholesale suppliers',
    'supplements wholesale',
    'gym recommendations',
    '100 Gym Boston',
    'Tropicana Wholesale',
    'trusted brands',
    'fitness equipment'
  ],
  openGraph: {
    title: 'Vouched Brands & Partners | MuscleSports',
    description: 'Discover our recommended gyms and wholesale suppliers.',
    type: 'website',
    url: 'https://musclesports.co.uk/recommended',
    images: [
      {
        url: 'https://musclesports.co.uk/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'MuscleSports Vouched Brands'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vouched Brands & Partners | MuscleSports',
    description: 'Discover our recommended gyms and wholesale suppliers.',
    images: ['https://musclesports.co.uk/og-image.jpg']
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1
  },
  alternates: {
    canonical: 'https://musclesports.co.uk/recommended'
  }
};

export default function RecommendedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
