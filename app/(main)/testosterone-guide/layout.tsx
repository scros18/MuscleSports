import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Testosterone Guide for Men | Natural Testosterone Support UK | MuscleSports',
  description: 'Comprehensive guide to boost testosterone naturally for young men. Learn about diet, supplements (zinc, magnesium, vitamin D3, ashwagandha), sleep, and exercise. Expert mens health advice from MuscleSports UK.',
  keywords: ['testosterone boosting supplements', 'natural testosterone support', 'mens health supplements uk', 'testosterone foods and supplements', 'boost testosterone naturally', 'ashwagandha benefits', 'zinc magnesium testosterone', 'vitamin d3 k2 testosterone', 'low testosterone young men', 'testosterone lifestyle guide'],
  openGraph: {
    title: 'Complete Testosterone Guide for Men | Natural Support & Supplements',
    description: 'Learn how to boost testosterone naturally through diet, supplements, sleep, and lifestyle. Expert guide for young men from MuscleSports UK.',
    type: 'article',
    url: 'https://musclesports.co.uk/testosterone-guide',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Testosterone Guide - Natural Support for Men',
    description: 'Boost testosterone naturally with diet, supplements & lifestyle changes. Comprehensive guide for young men.',
  },
  alternates: {
    canonical: 'https://musclesports.co.uk/testosterone-guide',
  },
};

export default function TestosteroneGuideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

