import { Database } from '../lib/database.js';

async function testLiveDatabase() {
  try {
    console.log('Testing live database connection...');
    const products = await Database.getAllProducts();
    console.log(`Found ${products.length} products in live database`);

    if (products.length > 0) {
      console.log('Database connection successful!');
      console.log('Sample product:', {
        id: products[0].id,
        name: products[0].name?.substring(0, 50) + '...',
        price: products[0].price
      });
    } else {
      console.log('No products found in database');
    }
  } catch (error) {
    console.error('Database connection failed:', error);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
  }
}

testLiveDatabase();