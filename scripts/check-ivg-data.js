require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');

async function checkIVGData() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ordify_db',
    port: parseInt(process.env.DB_PORT || '3306')
  });
  
  try {
    const [products] = await connection.execute(
      'SELECT id, name, flavours, flavour_images FROM products WHERE id = ?',
      ['ivg-pro-12']
    );
    
    if (products.length === 0) {
      console.log('Product not found');
      return;
    }
    
    const product = products[0];
    console.log('Product:', product.name);
    console.log('\nFlavours in database:');
    const flavours = JSON.parse(product.flavours);
    console.log(flavours.slice(0, 10)); // First 10
    
    console.log('\nFlavour Images keys:');
    const flavourImages = JSON.parse(product.flavour_images);
    console.log(Object.keys(flavourImages).slice(0, 10)); // First 10 keys
    
    console.log('\n\n=== CHECKING MAPPING ===');
    // Check if flavours match the keys
    const matched = [];
    const unmatched = [];
    
    flavours.forEach(f => {
      const normalized = f.toLowerCase();
      if (flavourImages[normalized]) {
        matched.push(f);
      } else {
        unmatched.push(f);
      }
    });
    
    console.log(`\nMatched: ${matched.length}/${flavours.length}`);
    if (unmatched.length > 0) {
      console.log('\nUnmatched flavours:');
      unmatched.forEach(f => console.log(`  - "${f}" (looking for "${f.toLowerCase()}")`));
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

checkIVGData();

