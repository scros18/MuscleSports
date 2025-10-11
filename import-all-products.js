const fs = require('fs');
const csv = require('csv-parser');

const products = [];

fs.createReadStream('aosom.csv')
  .pipe(csv({
    headers: ['sku', 'title', 'shortDescription', 'description', 'baseImage', 'images', 'category', 'colour', 'categoryOne', 'categoryTwo', 'price']
  }))
  .on('data', (row) => {
    // Skip header rows - check for both BOM-prefixed and regular header values
    if (row.sku === 'Column1' || row.sku === '﻿Column1' || row.sku === 'SKU') return;

    // Parse images from column 6 (comma-separated)
    let imageArray = [];
    if (row.baseImage && row.baseImage.trim()) {
      imageArray.push(row.baseImage.trim());
    }
    if (row.images && row.images.trim()) {
      const additionalImages = row.images.split(',').map(img => img.trim()).filter(img => img);
      imageArray = imageArray.concat(additionalImages);
    }

    // Determine category
    let category = 'Home Goods'; // default
    if (row.category && row.category.trim()) {
      category = row.category.trim();
    }

    // Parse price
    let price = 0;
    if (row.price && row.price.trim()) {
      // Remove any non-numeric characters except decimal point
      const priceStr = row.price.replace(/[^\d.]/g, '');
      price = parseFloat(priceStr) || 0;
    }

    // Create product object
    const product = {
      id: row.sku,
      name: row.title || '',
      price: price,
      description: row.description || '',
      images: imageArray,
      category: category,
      inStock: true, // Default to true
      featured: false // Default to false
    };

    products.push(product);
  })
  .on('end', () => {
    console.log(`Parsed ${products.length} products from CSV`);

    // Create the TypeScript file content
    const tsContent = `import { Product } from "@/types/product";

export const products: Product[] = ${JSON.stringify(products, null, 2)};

export const categories = [
  "All",
  "Home Goods",
  "Garden & Outdoor",
  "Sports & Leisure",
  "Pet Supplies",
  "DIY Tools",
  "Office",
  "Health & Beauty",
  "Toys & Games",
];
`;

    // Write to file
    fs.writeFileSync('data/products.ts', tsContent);
    console.log('Successfully created data/products.ts with all products');
  })
  .on('error', (error) => {
    console.error('Error reading CSV:', error);
  });