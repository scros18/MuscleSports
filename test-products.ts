import { Database } from './lib/database.js';

async function test() {
  try {
    const products = await Database.getAllProducts();
    console.log('Products in database:', products.length);
    if (products.length > 0) {
      console.log('First product:', products[0]);
      console.log('Sample products:', products.slice(0, 3));
    } else {
      console.log('No products found in database');
    }
  } catch (error) {
    console.error('Database error:', error);
  }
}

test();