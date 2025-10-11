import { Database } from '../lib/database.js';

async function checkProducts() {
  try {
    const products = await Database.getAllProducts();
    console.log('Total products in database:', products.length);
    if (products.length > 0) {
      console.log('Sample product:', products[0]);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkProducts();