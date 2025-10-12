const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

// Read the MuscleSports CSV
const csvPath = path.join(__dirname, 'musclesports-products.csv');
const csvContent = fs.readFileSync(csvPath, 'utf-8');

// Parse CSV
const records = parse(csvContent, {
  columns: true,
  skip_empty_lines: true,
  trim: true
});

console.log(`📦 Found ${records.length} products in CSV`);

// Convert to Lumify format
const products = records
  .filter(record => record.Type === 'simple' || record.Type === 'variable') // Only simple and variable products
  .map((record, index) => {
    const id = record.SKU || `PROD${index + 1}`;
    const name = record.FancyName || record.Name || 'Unknown Product';
    const price = parseFloat(record.Price) || 0;
    const category = record.Category || 'Uncategorized';
    const description = record.Description || '';
    const image = record.Image || '/placeholder.svg';
    const inStock = parseInt(record.Stock) > 0;
    const brand = record.Brand || '';
    const flavour = record.Flavour || '';
    const size = record.Size || '';

    return {
      id,
      name,
      price,
      category,
      description,
      image,
      images: [image], // Use same image for now
      inStock,
      featured: false,
      brand,
      flavour,
      size,
      sku: record.SKU,
      barcode: record.Barcode,
      keywords: record.Keywords || '',
      expiryDate: record.ExpiryDate
    };
  });

console.log(`✅ Converted ${products.length} products to Lumify format`);

// Get unique categories
const categories = [...new Set(products.map(p => p.category))].sort();
console.log(`📁 Found ${categories.length} categories:`, categories.slice(0, 10).join(', '), '...');

// Split into chunks for better performance
const CHUNK_SIZE = 500;
const chunks = [];
for (let i = 0; i < products.length; i += CHUNK_SIZE) {
  chunks.push(products.slice(i, i + CHUNK_SIZE));
}

// Save products in chunks
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

chunks.forEach((chunk, index) => {
  const filename = `products-chunk-${index + 1}.json`;
  fs.writeFileSync(
    path.join(dataDir, filename),
    JSON.stringify(chunk, null, 2)
  );
  console.log(`💾 Saved ${filename} (${chunk.length} products)`);
});

// Save all products in one file
fs.writeFileSync(
  path.join(dataDir, 'products-all.json'),
  JSON.stringify(products, null, 2)
);

// Save categories
fs.writeFileSync(
  path.join(dataDir, 'categories.json'),
  JSON.stringify(categories, null, 2)
);

console.log(`\n✨ Import complete!`);
console.log(`📊 Total products: ${products.length}`);
console.log(`📁 Total categories: ${categories.length}`);
console.log(`📂 Data saved to: ${dataDir}`);
console.log(`\n🚀 Next steps:`);
console.log(`1. Upload Lumify system to server`);
console.log(`2. Import products into database`);
console.log(`3. Configure MuscleSports theme`);
console.log(`4. Test the site`);
