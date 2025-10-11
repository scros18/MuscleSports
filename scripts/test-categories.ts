import { Database } from '../lib/database.js';

async function testCategoriesTable() {
  try {
    const categories = await Database.getAllCategories();
    console.log('Categories table exists, found', categories.length, 'categories');
    if (categories.length > 0) {
      console.log('Sample category:', categories[0]);
    }
  } catch (error) {
    console.error('Error accessing categories table:', error);
  } finally {
    process.exit(0);
  }
}

testCategoriesTable();