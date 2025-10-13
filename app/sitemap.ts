import { MetadataRoute } from 'next';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://ordify.com';

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/products`,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ];

  // Fetch products dynamically
  let productPages: MetadataRoute.Sitemap = [];
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || baseUrl}/api/products?pageSize=1000`, {
      cache: 'no-store',
    });
    const data = await response.json();
    
    if (data.products && Array.isArray(data.products)) {
      productPages = data.products.map((product: any) => ({
        url: `${baseUrl}/products/${product.id}`,
        lastModified: new Date(product.updated_at || product.created_at || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: product.featured ? 0.9 : 0.7,
      }));
    }
  } catch (error) {
    console.error('Failed to fetch products for sitemap:', error);
  }

  return [...staticPages, ...productPages];
}
