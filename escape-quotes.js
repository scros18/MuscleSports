const fs = require('fs');

const filePath = 'data/products.ts';

// Read the file
const content = fs.readFileSync(filePath, 'utf8');

// Extract the products array string
const start = content.indexOf('export const products: Product[] = [');
const end = content.lastIndexOf('];');
const productsString = content.substring(start + 'export const products: Product[] = ['.length, end);

// Parse the JSON
let products = JSON.parse(productsString);

// Escape quotes in descriptions
products.forEach(product => {
  if (product.description) {
    product.description = product.description.replace(/"/g, '\\"');
  }
});

// Convert back to string
const newProductsString = JSON.stringify(products, null, 2);

// Reconstruct the file content
const newContent = content.substring(0, start) + 'export const products: Product[] = ' + newProductsString + '];';

// Write back
fs.writeFileSync(filePath, newContent, 'utf8');

console.log('Escaped quotes in descriptions for ' + products.length + ' products');