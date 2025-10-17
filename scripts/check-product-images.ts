import dotenv from 'dotenv';
import { Database } from '../lib/database';

dotenv.config({ path: '.env.local' });

async function checkProductImages() {
  try {
    console.log('Checking product images in database...\n');

    // Check a few specific products
    const productIds = ['WAR173-P', 'WAR173', 'WAR172', '10X004-P'];

    for (const id of productIds) {
      const result = await Database.query(
        'SELECT id, name, images FROM products WHERE id = ?',
        [id]
      ) as any[];

      if (result.length > 0) {
        const product = result[0];
        console.log(`\n📦 Product: ${product.id}`);
        console.log(`   Name: ${product.name}`);
        console.log(`   Images raw: ${product.images}`);
        
        try {
          const parsed = JSON.parse(product.images || '[]');
          console.log(`   Images parsed:`, parsed);
          console.log(`   Image count: ${parsed.length}`);
          if (parsed.length > 0) {
            console.log(`   First image: ${parsed[0]}`);
          }
        } catch (e) {
          console.log(`   ⚠️  Failed to parse images JSON`);
        }
      } else {
        console.log(`\n❌ Product ${id} not found in database`);
      }
    }

    // Count products with no images or placeholder images
    const noImages = await Database.query(
      `SELECT COUNT(*) as count FROM products 
       WHERE images IS NULL 
       OR images = '[]' 
       OR images = 'null'
       OR images LIKE '%placeholder%'`
    ) as any[];

    console.log(`\n\n📊 Summary:`);
    console.log(`   Products with no/placeholder images: ${noImages[0].count}`);

    // Count total products
    const total = await Database.query(
      'SELECT COUNT(*) as count FROM products'
    ) as any[];
    
    console.log(`   Total products: ${total[0].count}`);

  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

checkProductImages()
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
