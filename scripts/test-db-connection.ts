import { Database } from '../lib/database.js';

async function testDatabase() {
  try {
    console.log('Testing database connection...');
    const products = await Database.getAllProducts();
    console.log(`Found ${products.length} products in database`);

    if (products.length > 0) {
      console.log('Sample product:', {
        id: products[0].id,
        name: products[0].name?.substring(0, 50) + '...',
        price: products[0].price,
        category: products[0].category
      });
    }

    console.log('Database test completed successfully!');
  } catch (error) {
    console.error('Database test failed:', error);
  }
}

testDatabase();