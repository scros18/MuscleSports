import { Database } from '../lib/database';
import { products } from '../data/products';

async function migrateProducts() {
  try {
    console.log(`Starting migration of ${products.length} products...`);

    for (const product of products) {
      try {
        await Database.createProduct({
          id: product.id,
          name: product.name,
          price: product.price,
          description: product.description,
          images: product.images,
          category: product.category,
          inStock: product.inStock,
          featured: product.featured
        });
        console.log(`✓ Migrated product: ${product.name}`);
      } catch (error) {
        console.error(`✗ Failed to migrate product ${product.id}:`, error);
      }
    }

    console.log('Migration completed!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    process.exit(0);
  }
}

migrateProducts();