const fs = require('fs');
const csv = require('csv-parser');

const priceMap = new Map();

fs.createReadStream('stockandprice.csv')
  .pipe(csv({
    headers: ['Column1', 'Column2', 'Column4']
  }))
  .on('data', (row) => {
    // Skip header rows
    if (row.Column1 === 'Column1' || row.Column1 === 'SKU') return;

    const sku = row.Column1;
    const priceStr = row.Column4; // e.g., "77.99 GBP"

    if (priceStr && priceStr.includes('GBP')) {
      const price = parseFloat(priceStr.replace(' GBP', ''));
      if (!isNaN(price)) {
        priceMap.set(sku, price);
      }
    }
  })
  .on('end', () => {
    console.log(`Parsed ${priceMap.size} prices from stockandprice.csv`);

    // Read the file
    const productsFile = fs.readFileSync('data/products.ts', 'utf8');

    // Find the start of the products array
    const startIndex = productsFile.indexOf('export const products: Product[] = ') + 'export const products: Product[] = '.length;
    const categoriesIndex = productsFile.indexOf('export const categories');

    // Extract the products array string
    const productsStr = productsFile.substring(startIndex, categoriesIndex).trim();
    // Remove the trailing ;
    const productsStrClean = productsStr.endsWith(';') ? productsStr.slice(0, -1) : productsStr;

    console.log('productsStrClean length:', productsStrClean.length);
    console.log('productsStrClean start:', productsStrClean.substring(0, 100));
    console.log('productsStrClean end:', productsStrClean.substring(productsStrClean.length - 100));

    let products;
    try {
      products = JSON.parse(productsStrClean);
    } catch (e) {
      console.error('Error parsing products array:', e);
      return;
    }

    // Update prices
    let updatedCount = 0;
    products.forEach(product => {
      if (priceMap.has(product.id)) {
        console.log(`Updating ${product.id} from ${product.price} to ${priceMap.get(product.id)}`);
        product.price = priceMap.get(product.id);
        console.log(`Set price to ${product.price}`);
        updatedCount++;
      }
    });

    console.log(`Updated prices for ${updatedCount} products`);

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
    console.log('Successfully updated data/products.ts with new prices');
  })
  .on('error', (error) => {
    console.error('Error reading stockandprice.csv:', error);
  });