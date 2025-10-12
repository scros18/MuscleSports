require('dotenv').config({ path: '.env.local' });
const mysql = require('mysql2/promise');
const fs = require('fs');

// Load the existing Washington Vapes mapping
const washingtonFlavors = JSON.parse(fs.readFileSync('/tmp/flavor-images-mapping.json', 'utf8'));

// Normalize flavor name for better matching
function normalizeFlavor(name) {
  return name
    .toLowerCase()
    .replace(/\s*&\s*/g, ' ') // ampersand to space  
    .replace(/\s+and\s+/g, ' ') // " and " to space
    .replace(/[^\w\s]/g, '') // remove special chars
    .replace(/\s+/g, ' ') // multiple spaces to single
    .trim();
}

// Find best match for a flavor name
function findBestMatch(flavorName, availableFlavors) {
  const normalized = normalizeFlavor(flavorName);
  
  // Try exact normalized match first
  if (availableFlavors[normalized]) {
    return availableFlavors[normalized];
  }
  
  // Try without spaces
  const noSpaces = normalized.replace(/\s+/g, '');
  for (const [key, url] of Object.entries(availableFlavors)) {
    if (key.replace(/\s+/g, '') === noSpaces) {
      return url;
    }
  }
  
  // Try partial match (contains)
  for (const [key, url] of Object.entries(availableFlavors)) {
    if (normalized.includes(key) || key.includes(normalized)) {
      return url;
    }
  }
  
  return null;
}

async function updateDatabase() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'ordify_db',
    port: parseInt(process.env.DB_PORT || '3306')
  });
  
  try {
    // Get the IVG Pro 12 product
    const [products] = await connection.execute(
      'SELECT id, name, flavours FROM products WHERE id = ?',
      ['ivg-pro-12']
    );
    
    if (products.length === 0) {
      console.log('Product not found');
      return;
    }
    
    const product = products[0];
    const flavours = JSON.parse(product.flavours);
    
    console.log(`\nProduct: ${product.name}`);
    console.log(`Total flavours: ${flavours.length}\n`);
    
    // Create smart mapping
    const smartMapping = {};
    let matched = 0;
    let unmatched = 0;
    
    flavours.forEach(flavor => {
      const normalized = normalizeFlavor(flavor);
      const match = findBestMatch(flavor, washingtonFlavors);
      
      if (match) {
        smartMapping[normalized] = match;
        console.log(`✓ ${flavor} -> ${normalized}`);
        matched++;
      } else {
        console.log(`✗ ${flavor} (no match found)`);
        unmatched++;
      }
    });
    
    console.log(`\n=== RESULTS ===`);
    console.log(`Matched: ${matched}/${flavours.length}`);
    console.log(`Unmatched: ${unmatched}/${flavours.length}`);
    
    // Update database
    await connection.execute(
      'UPDATE products SET flavour_images = ? WHERE id = ?',
      [JSON.stringify(smartMapping), 'ivg-pro-12']
    );
    
    console.log('\n✅ Database updated successfully!');
    
    // Save mapping to file for reference
    fs.writeFileSync('/tmp/smart-flavor-mapping.json', JSON.stringify(smartMapping, null, 2));
    console.log('Saved mapping to /tmp/smart-flavor-mapping.json');
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await connection.end();
  }
}

updateDatabase();

