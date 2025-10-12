require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');

async function updateIVGPro12Images() {
  // Read the flavor images mapping
  const flavorImages = JSON.parse(fs.readFileSync('/tmp/flavor-images-mapping.json', 'utf8'));
  
  console.log('Flavor images mapping loaded:', Object.keys(flavorImages).length, 'flavors');
  
  // Connect to database
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ordify_db',
    port: parseInt(process.env.DB_PORT || '3306')
  });
  
  try {
    // Find the IVG Pro 12 product
    const [products] = await connection.execute(
      'SELECT * FROM products WHERE id LIKE ? OR name LIKE ?',
      ['%ivg%pro%12%', '%IVG%Pro%12%']
    );
    
    if (products.length === 0) {
      console.error('IVG Pro 12 product not found in database');
      console.log('Searching for products with "ivg" in the name...');
      
      const [ivgProducts] = await connection.execute(
        'SELECT id, name FROM products WHERE name LIKE ?',
        ['%IVG%']
      );
      
      console.log('Found IVG products:', ivgProducts.map(p => `${p.id}: ${p.name}`).join('\n'));
      process.exit(1);
    }
    
    console.log(`\nFound ${products.length} matching product(s):`);
    products.forEach(p => console.log(`  - ${p.id}: ${p.name}`));
    
    // Update each product with the flavor images
    for (const product of products) {
      console.log(`\nUpdating product ${product.id} (${product.name})...`);
      
      await connection.execute(
        'UPDATE products SET flavour_images = ? WHERE id = ?',
        [JSON.stringify(flavorImages), product.id]
      );
      
      console.log('✓ Successfully updated flavor images');
    }
    
    console.log('\n=== Update Complete ===');
    
  } catch (error) {
    console.error('Error updating database:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

// Run the update
updateIVGPro12Images()
  .then(() => {
    console.log('\nAll done!');
    process.exit(0);
  })
  .catch(err => {
    console.error('Failed:', err);
    process.exit(1);
  });

