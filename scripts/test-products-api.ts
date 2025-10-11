import { Database } from '../lib/database.js';

async function testProductsAPI() {
  try {
    console.log('Testing database connection...');
    const allProducts = await Database.getAllProducts();
    console.log(`Found ${allProducts.length} products in database`);

    // Simulate API logic
    const page = 1;
    const pageSize = 48;
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, allProducts.length);
    const pageItems = allProducts.slice(start, end).map((p: any) => ({
      id: p.id,
      name: p.name,
      price: p.price,
      image: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
      images: p.images,
      category: p.category,
      inStock: p.inStock,
      featured: p.featured,
    }));

    console.log(`API would return ${pageItems.length} products on page 1`);
    console.log('Sample product:', {
      id: pageItems[0].id,
      name: pageItems[0].name?.substring(0, 50) + '...',
      price: pageItems[0].price,
      category: pageItems[0].category
    });

    console.log('Products API test completed successfully!');
  } catch (error) {
    console.error('Products API test failed:', error);
  }
}

testProductsAPI();