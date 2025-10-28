/**
 * Enhanced Tropicana Product Sync with Categories and SEO
 * Syncs products from tropicana_products to main products table
 */

import { Database } from './database';

// Simple slug generator
function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

interface TropicanaProduct {
  id: string;
  handle: string;
  sku: string;
  name: string;
  retail_price: number;
  wholesale_price: number;
  description: string;
  images: string;
  in_stock: boolean;
  stock_quantity: number | null;
  brand: string;
  category: string;
  tags: string;
  weight: string;
  compare_at_price: number | null;
  flavours: string;
  strengths: string;
}

/**
 * Auto-categorize products based on name and tags
 */
function categorizeProdact(product: TropicanaProduct): string {
  const name = product.name.toLowerCase();
  const tags = product.tags ? JSON.parse(product.tags).map((t: string) => t.toLowerCase()) : [];
  const allText = [name, ...tags].join(' ');

  // Category mapping with keywords
  const categoryMap: { [key: string]: string[] } = {
    'Protein Supplements': ['protein', 'whey', 'isolate', 'casein', 'mass gainer', 'gainer'],
    'Pre-Workout': ['pre-workout', 'pre workout', 'pump', 'energy', 'stimulant', 'focus'],
    'Post-Workout': ['post-workout', 'post workout', 'recovery', 'bcaa', 'amino'],
    'Fat Burners': ['fat burner', 'thermogenic', 'weight loss', 'slimming', 'metabolism'],
    'Creatine': ['creatine', 'monohydrate'],
    'Vitamins & Minerals': ['vitamin', 'multivitamin', 'mineral', 'zinc', 'magnesium', 'calcium'],
    'Energy Drinks': ['energy drink', 'drink', 'beverage'],
    'Snacks & Bars': ['bar', 'snack', 'protein bar', 'cookie', 'brownie'],
    'Accessories': ['shaker', 'bottle', 'bag', 'strap', 'belt', 'gloves'],
    'Clothing': ['shirt', 'shorts', 'hoodie', 'joggers', 'apparel', 'clothing']
  };

  // Find matching category
  for (const [category, keywords] of Object.entries(categoryMap)) {
    if (keywords.some(keyword => allText.includes(keyword))) {
      return category;
    }
  }

  return 'Supplements'; // Default category
}

/**
 * Generate SEO-optimized metadata
 */
function generateSEOMetadata(product: TropicanaProduct, category: string) {
  const name = product.name;
  const brand = product.brand || 'Muscle Sports';
  
  // Meta title (55-60 characters)
  const metaTitle = `${name} - ${brand} | Muscle Sports UK`;
  
  // Meta description (150-160 characters)
  const description = product.description || `Buy ${name} from ${brand}. High-quality supplements at competitive prices.`;
  const metaDescription = description.length > 160 
    ? description.substring(0, 157) + '...'
    : description;
  
  // Generate keywords
  const keywords = [
    name.toLowerCase(),
    brand.toLowerCase(),
    category.toLowerCase(),
    'supplements',
    'muscle sports',
    'uk supplements',
    'sports nutrition'
  ];
  
  // Add product-specific keywords
  if (product.tags) {
    try {
      const tags = JSON.parse(product.tags);
      keywords.push(...tags.map((t: string) => t.toLowerCase()));
    } catch (e) {
      // Ignore JSON parse errors
    }
  }
  
  return {
    metaTitle,
    metaDescription,
    keywords: Array.from(new Set(keywords)).join(', '), // Remove duplicates
    ogTitle: `${name} - Available Now`,
    ogDescription: metaDescription,
    ogImage: product.images ? JSON.parse(product.images)[0] : null
  };
}

/**
 * Sync Tropicana products to main products table with categories and SEO
 */
export async function syncTropicanaToProducts(): Promise<void> {
  const connection = await Database.getConnection();

  try {
    console.log('🔄 Syncing Tropicana products to main products table...');
    
    // Get all active Tropicana products
    const [tropicanaProducts] = await connection.execute(
      'SELECT * FROM tropicana_products WHERE active = 1'
    );

    let created = 0;
    let updated = 0;
    let skipped = 0;

    for (const tropProduct of tropicanaProducts as TropicanaProduct[]) {
      try {
        // Auto-categorize
        const category = categorizeProdact(tropProduct);
        const slug = generateSlug(tropProduct.name);
        
        // Generate SEO metadata
        const seo = generateSEOMetadata(tropProduct, category);
        
        // Check if product exists in main table
        const [existing] = await connection.execute(
          'SELECT id FROM products WHERE sku = ? OR slug = ?',
          [tropProduct.sku, slug]
        );

        const existingProduct = (existing as any[])[0];
        const images = tropProduct.images ? JSON.parse(tropProduct.images) : [];
        const primaryImage = images[0] || '/placeholder.svg';
        
        // Parse flavours and sizes
        const flavours = tropProduct.flavours ? JSON.parse(tropProduct.flavours) : [];
        const sizes = tropProduct.strengths ? JSON.parse(tropProduct.strengths) : [];

        if (existingProduct) {
          // Update existing product
          await connection.execute(`
            UPDATE products SET
              name = ?,
              slug = ?,
              description = ?,
              price = ?,
              compare_at_price = ?,
              cost_price = ?,
              category = ?,
              brand = ?,
              image_url = ?,
              images = ?,
              stock_quantity = ?,
              in_stock = ?,
              weight = ?,
              flavours = ?,
              strengths = ?,
              meta_title = ?,
              meta_description = ?,
              keywords = ?,
              featured = 0,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [
            tropProduct.name,
            slug,
            tropProduct.description || '',
            tropProduct.retail_price,
            tropProduct.compare_at_price || tropProduct.retail_price * 1.2,
            tropProduct.wholesale_price,
            category,
            tropProduct.brand || 'Tropicana Wholesale',
            primaryImage,
            JSON.stringify(images),
            tropProduct.stock_quantity || 0,
            tropProduct.in_stock ? 1 : 0,
            tropProduct.weight || '',
            JSON.stringify(flavours),
            JSON.stringify(sizes),
            seo.metaTitle,
            seo.metaDescription,
            seo.keywords,
            existingProduct.id
          ]);
          updated++;
        } else {
          // Create new product
          await connection.execute(`
            INSERT INTO products (
              sku, name, slug, description, price, compare_at_price, cost_price,
              category, brand, image_url, images, stock_quantity, in_stock, weight,
              flavours, strengths, meta_title, meta_description, keywords, featured, active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, 1)
          `, [
            tropProduct.sku,
            tropProduct.name,
            slug,
            tropProduct.description || '',
            tropProduct.retail_price,
            tropProduct.compare_at_price || tropProduct.retail_price * 1.2,
            tropProduct.wholesale_price,
            category,
            tropProduct.brand || 'Tropicana Wholesale',
            primaryImage,
            JSON.stringify(images),
            tropProduct.stock_quantity || 0,
            tropProduct.in_stock ? 1 : 0,
            tropProduct.weight || '',
            JSON.stringify(flavours),
            JSON.stringify(sizes),
            seo.metaTitle,
            seo.metaDescription,
            seo.keywords
          ]);
          created++;
        }

        console.log(`  ✓ ${tropProduct.name} → ${category}`);
      } catch (error) {
        console.error(`  ✗ Error syncing ${tropProduct.name}:`, error);
        skipped++;
      }
    }

    console.log('');
    console.log('✅ Main products sync complete!');
    console.log(`   📊 Created: ${created}`);
    console.log(`   📊 Updated: ${updated}`);
    console.log(`   📊 Skipped: ${skipped}`);
  } finally {
    connection.release();
  }
}
