const fs = require('fs');

// Function to strip HTML tags
function stripHtml(html) {
  return html.replace(/<[^>]*>/g, '').trim();
}

// Read the products.ts file
const productsFile = fs.readFileSync('data/products.ts', 'utf8');

// Find the start of the products array
const startIndex = productsFile.indexOf('export const products: Product[] = ') + 'export const products: Product[] = '.length;
const categoriesIndex = productsFile.indexOf('export const categories');

if (categoriesIndex === -1) {
  console.error('Could not find categories');
  process.exit(1);
}

// Extract the products array string
const productsStr = productsFile.substring(startIndex, categoriesIndex).trim();
// Remove the trailing ;
const productsStrClean = productsStr.endsWith(';') ? productsStr.slice(0, -1) : productsStr;

let products;
try {
  products = JSON.parse(productsStrClean);
} catch (e) {
  console.error('Error parsing products array:', e);
  process.exit(1);
}

// Clean descriptions
products.forEach(product => {
  if (product.description) {
    product.description = stripHtml(product.description);
  }
});

console.log(`Cleaned descriptions for ${products.length} products`);

// Create the updated file content
const updatedTsContent = `import { Product } from "@/types/product";

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

// Write back to file
fs.writeFileSync('data/products.ts', updatedTsContent);
console.log('Successfully updated data/products.ts with cleaned descriptions');