import { Metadata } from 'next';

export interface SEOConfig {
  siteName?: string;
  siteUrl?: string;
  defaultTitle?: string;
  defaultDescription?: string;
  twitterHandle?: string;
}

// Default SEO configuration - can be customized per branding
const defaultConfig: Required<SEOConfig> = {
  siteName: 'MuscleSports',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://musclesports.co.uk',
  defaultTitle: 'MuscleSports | Premium Sports Nutrition & Supplements UK | Protein, Pre-Workout & More',
  defaultDescription: 'Shop premium sports nutrition and supplements at MuscleSports UK. Wide range of protein powders, pre-workout, creatine, BCAAs, and vitamins. Fast free UK delivery. Expert advice. Trusted by athletes.',
  twitterHandle: '@musclesports',
};

let seoConfig: Required<SEOConfig> = { ...defaultConfig };

/**
 * Configure SEO settings globally
 */
export function configureSEO(config: Partial<SEOConfig>) {
  seoConfig = { ...seoConfig, ...config };
}

/**
 * Generate metadata for a page
 */
export function generateSEO({
  title,
  description,
  path = '',
  image,
  noIndex = false,
  type = 'website',
  publishedTime,
  modifiedTime,
  keywords = [],
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  type?: 'website' | 'article' | 'product';
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
}): Metadata {
  const pageTitle = title ? `${title} | ${seoConfig.siteName}` : seoConfig.defaultTitle;
  const pageDescription = description || seoConfig.defaultDescription;
  const url = `${seoConfig.siteUrl}${path}`;
  const imageUrl = image || `${seoConfig.siteUrl}/og-image.jpg`;

  const metadata: Metadata = {
    title: pageTitle,
    description: pageDescription,
    keywords: keywords.length > 0 ? keywords : [
      'sports nutrition uk',
      'protein powder',
      'pre workout supplements',
      'creatine monohydrate',
      'bcaa supplements',
      'fitness supplements',
      'bodybuilding supplements',
      'whey protein',
      'muscle building',
      'sports supplements online',
      'buy supplements uk',
      'musclesports',
    ],
    authors: [{ name: seoConfig.siteName }],
    creator: seoConfig.siteName,
    publisher: seoConfig.siteName,
    robots: noIndex ? 'noindex,nofollow' : 'index,follow',
    icons: {
      icon: '/favicon.ico',
      shortcut: '/favicon-16x16.png',
      apple: '/apple-touch-icon.png',
    },
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: title || seoConfig.defaultTitle,
      description: pageDescription,
      url,
      siteName: seoConfig.siteName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || seoConfig.siteName,
        },
      ],
      type: type === 'product' ? 'website' : type,
      publishedTime,
      modifiedTime,
    },
    twitter: {
      card: 'summary_large_image',
      title: title || seoConfig.defaultTitle,
      description: pageDescription,
      creator: seoConfig.twitterHandle,
      images: [imageUrl],
    },
  };

  return metadata;
}

/**
 * Generate JSON-LD structured data for Organization
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    logo: `${seoConfig.siteUrl}/logo.png`,
    description: seoConfig.defaultDescription,
    sameAs: [
      // Add social media links here
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['English'],
    },
  };
}

/**
 * Generate JSON-LD structured data for WebSite
 */
export function generateWebsiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: seoConfig.siteName,
    url: seoConfig.siteUrl,
    description: seoConfig.defaultDescription,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${seoConfig.siteUrl}/products?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

/**
 * Generate JSON-LD structured data for Product
 */
export function generateProductSchema(product: {
  id: string;
  name: string;
  description?: string;
  image?: string;
  price: number;
  currency?: string;
  brand?: string;
  category?: string;
  inStock?: boolean;
  sku?: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    '@id': `${seoConfig.siteUrl}/products/${product.id}`,
    name: product.name,
    description: product.description || product.name,
    image: product.image || `${seoConfig.siteUrl}/placeholder.svg`,
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || seoConfig.siteName,
    },
    category: product.category || 'General',
    offers: {
      '@type': 'Offer',
      url: `${seoConfig.siteUrl}/products/${product.id}`,
      priceCurrency: product.currency || 'GBP',
      price: product.price.toFixed(2),
      availability: product.inStock !== false
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: seoConfig.siteName,
      },
    },
  };
}

/**
 * Generate JSON-LD structured data for BreadcrumbList
 */
export function generateBreadcrumbSchema(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: `${seoConfig.siteUrl}${crumb.url}`,
    })),
  };
}

/**
 * Generate JSON-LD structured data for FAQPage
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate JSON-LD structured data for LocalBusiness
 */
export function generateLocalBusinessSchema({
  name,
  address,
  phone,
  priceRange = '££',
  openingHours = ['Mo-Fr 09:00-17:00'],
}: {
  name?: string;
  address?: string;
  phone?: string;
  priceRange?: string;
  openingHours?: string[];
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: name || seoConfig.siteName,
    image: `${seoConfig.siteUrl}/logo.png`,
    '@id': seoConfig.siteUrl,
    url: seoConfig.siteUrl,
    telephone: phone,
    address: address ? {
      '@type': 'PostalAddress',
      streetAddress: address,
      addressCountry: 'GB',
    } : undefined,
    priceRange,
    openingHoursSpecification: openingHours.map((hours) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: hours.split(' ')[0].split('-'),
      opens: hours.split(' ')[1]?.split('-')[0],
      closes: hours.split(' ')[1]?.split('-')[1],
    })),
  };
}

/**
 * Generate JSON-LD structured data for ItemList (Product Category)
 */
export function generateItemListSchema(items: Array<{ name: string; url: string; image?: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
      image: item.image,
    })),
  };
}

/**
 * Generate JSON-LD structured data for Review Aggregate
 */
export function generateAggregateRatingSchema({
  itemName,
  ratingValue,
  reviewCount,
  bestRating = 5,
}: {
  itemName: string;
  ratingValue: number;
  reviewCount: number;
  bestRating?: number;
}) {
  return {
    '@type': 'AggregateRating',
    itemReviewed: {
      '@type': 'Product',
      name: itemName,
    },
    ratingValue,
    reviewCount,
    bestRating,
  };
}

/**
 * Render JSON-LD data object (use in page components)
 */
export function getJsonLdScript(data: any) {
  return {
    __html: JSON.stringify(data),
  };
}
