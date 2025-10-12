import { Metadata } from 'next';

export interface DynamicMetadataOptions {
  title?: string;
  description?: string;
  businessName?: string;
  businessType?: string;
  keywords?: string[];
}

/**
 * Generate dynamic metadata based on business settings
 * This should be called in page components to generate metadata
 */
export function generateDynamicMetadata(options: DynamicMetadataOptions): Metadata {
  const {
    title,
    description,
    businessName = 'Ordify Direct',
    businessType = 'ecommerce',
    keywords = []
  } = options;

  // Determine site name based on business type
  const siteName = businessName;
  
  // Build full title
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  // Generate description based on business type
  let defaultDescription = description;
  if (!defaultDescription) {
    switch (businessType) {
      case 'salon':
        defaultDescription = `${siteName} - Professional hair and beauty services. Book your appointment today for expert styling, coloring, and treatments.`;
        break;
      case 'gym':
        defaultDescription = `${siteName} - Premium fitness and wellness center. Transform your health with our expert trainers and state-of-the-art equipment.`;
        break;
      case 'ecommerce':
      default:
        defaultDescription = `${siteName} - Your trusted online store for quality products with fast shipping and great customer service.`;
        break;
    }
  }

  // Generate keywords based on business type
  const defaultKeywords = [];
  switch (businessType) {
    case 'salon':
      defaultKeywords.push(
        'hair salon',
        'hairdresser',
        'hair styling',
        'hair coloring',
        'beauty salon',
        'hair treatments',
        'barber',
        'haircut',
        siteName.toLowerCase()
      );
      break;
    case 'gym':
      defaultKeywords.push(
        'gym',
        'fitness',
        'personal training',
        'workout',
        'health club',
        'exercise',
        siteName.toLowerCase()
      );
      break;
    case 'ecommerce':
    default:
      defaultKeywords.push(
        'online shopping',
        'e-commerce',
        'buy online',
        'fast shipping',
        'online store',
        siteName.toLowerCase()
      );
      break;
  }

  const allKeywords = [...defaultKeywords, ...keywords];

  return {
    title: fullTitle,
    description: defaultDescription,
    keywords: allKeywords.join(', '),
    openGraph: {
      title: fullTitle,
      description: defaultDescription,
      siteName: siteName,
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description: defaultDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

/**
 * Helper to get business name for client-side title updates
 */
export function getPageTitle(pageTitle: string, businessName?: string): string {
  const siteName = businessName || 'Ordify Direct';
  return pageTitle ? `${pageTitle} | ${siteName}` : siteName;
}
