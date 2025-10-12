const fs = require('fs');
const path = require('path');

// Load all product chunks
function loadAllProducts() {
  const products = [];
  for (let i = 1; i <= 19; i++) {
    const chunkPath = path.join(__dirname, 'data', `products-chunk-${i}.json`);
    if (fs.existsSync(chunkPath)) {
      const chunk = JSON.parse(fs.readFileSync(chunkPath, 'utf-8'));
      products.push(...chunk);
    }
  }
  return products;
}

// Function to normalize product name (remove flavour and size)
function getBaseProductName(name) {
  // Remove common size patterns
  let baseName = name
    .replace(/\d+g\b/gi, '')
    .replace(/\d+kg\b/gi, '')
    .replace(/\d+ml\b/gi, '')
    .replace(/\d+l\b/gi, '')
    .replace(/\d+\s*servings?\b/gi, '')
    .replace(/\d+\s*caps?\b/gi, '')
    .replace(/\d+\s*tablets?\b/gi, '')
    .replace(/\d+\s*capsules?\b/gi, '')
    .replace(/\d+mg\b/gi, '')
    .replace(/\(\d+\s*pack\)/gi, '')
    .trim();
  
  return baseName;
}

// Group products by brand and base name
function groupProductsByFlavours(products) {
  const grouped = {};
  
  products.forEach(product => {
    // Skip CBD products
    if (product.category && (
      product.category.toLowerCase().includes('cbd') ||
      product.name.toLowerCase().includes('cbd') ||
      (product.keywords && product.keywords.toLowerCase().includes('cbd'))
    )) {
      console.log(`Skipping CBD product: ${product.name}`);
      return;
    }

    const brand = (product.brand || 'Unknown').toLowerCase();
    const baseName = getBaseProductName(product.name);
    const key = `${brand}|||${baseName}`;
    
    if (!grouped[key]) {
      grouped[key] = [];
    }
    
    grouped[key].push(product);
  });
  
  return grouped;
}

// Merge products with same base name and different flavours
function mergeFlavoredProducts(groupedProducts) {
  const mergedProducts = [];
  
  Object.entries(groupedProducts).forEach(([key, productGroup]) => {
    if (productGroup.length === 1) {
      // Single product, no flavours to merge
      mergedProducts.push(productGroup[0]);
    } else {
      // Multiple products - check if they have different flavours
      const flavours = productGroup
        .map(p => p.flavour)
        .filter(f => f && f.trim() && f !== 'N/A');
      
      const uniqueFlavours = [...new Set(flavours)];
      
      if (uniqueFlavours.length > 1) {
        // Create a merged product with flavours array
        const baseProduct = { ...productGroup[0] };
        baseProduct.flavours = uniqueFlavours;
        baseProduct.id = baseProduct.sku || baseProduct.id; // Use parent SKU if available
        
        // Use the first product's image as main, but collect all unique images
        const allImages = new Set();
        productGroup.forEach(p => {
          if (p.image) allImages.add(p.image);
          if (p.images) p.images.forEach(img => allImages.add(img));
        });
        baseProduct.images = Array.from(allImages);
        
        console.log(`Merged ${uniqueFlavours.length} flavours for: ${baseProduct.name}`);
        mergedProducts.push(baseProduct);
      } else {
        // Same flavour or no flavour info, keep separate
        productGroup.forEach(p => mergedProducts.push(p));
      }
    }
  });
  
  return mergedProducts;
}

// Main execution
console.log('Loading products...');
const allProducts = loadAllProducts();
console.log(`Loaded ${allProducts.length} products`);

console.log('\nGrouping products by flavours and removing CBD...');
const groupedProducts = groupProductsByFlavours(allProducts);

console.log('\nMerging flavoured products...');
const mergedProducts = mergeFlavoredProducts(groupedProducts);

console.log(`\nFinal product count: ${mergedProducts.length} (removed ${allProducts.length - mergedProducts.length} duplicates/CBD products)`);

// Split into chunks again
const CHUNK_SIZE = 500;
const chunks = [];
for (let i = 0; i < mergedProducts.length; i += CHUNK_SIZE) {
  chunks.push(mergedProducts.slice(i, i + CHUNK_SIZE));
}

// Save chunks
console.log(`\nSaving ${chunks.length} chunks...`);
chunks.forEach((chunk, index) => {
  const chunkPath = path.join(__dirname, 'data', `products-chunk-${index + 1}.json`);
  fs.writeFileSync(chunkPath, JSON.stringify(chunk, null, 2));
  console.log(`Saved chunk ${index + 1} with ${chunk.length} products`);
});

// Remove old chunks if there are fewer now
for (let i = chunks.length + 1; i <= 19; i++) {
  const oldChunkPath = path.join(__dirname, 'data', `products-chunk-${i}.json`);
  if (fs.existsSync(oldChunkPath)) {
    fs.unlinkSync(oldChunkPath);
    console.log(`Removed old chunk ${i}`);
  }
}

// Update categories (remove CBD)
const categoriesPath = path.join(__dirname, 'data', 'categories.json');
if (fs.existsSync(categoriesPath)) {
  const categories = JSON.parse(fs.readFileSync(categoriesPath, 'utf-8'));
  const filteredCategories = categories.filter(cat => !cat.toLowerCase().includes('cbd'));
  fs.writeFileSync(categoriesPath, JSON.stringify(filteredCategories, null, 2));
  console.log(`\nUpdated categories: removed ${categories.length - filteredCategories.length} CBD categories`);
}

console.log('\nDone! Products grouped by flavours and CBD products removed.');
