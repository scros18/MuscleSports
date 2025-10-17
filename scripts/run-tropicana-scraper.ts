#!/usr/bin/env tsx
/**
 * Tropicana Scraper CLI
 * Run: npm run scrape:tropicana
 * or: tsx scripts/run-tropicana-scraper.ts
 */

import { TropicanaScraper } from '../lib/tropicana-scraper';
import fs from 'fs/promises';
import path from 'path';

async function main() {
  console.log('=== Tropicana Wholesale Scraper ===\n');

  const skuFilePath = process.argv[2] || 'skus.txt';
  
  // Check if SKU file exists
  try {
    await fs.access(skuFilePath);
  } catch (error) {
    console.error(`Error: SKU file not found: ${skuFilePath}`);
    console.log('\nUsage: tsx scripts/run-tropicana-scraper.ts [sku-file.txt]');
    console.log('\nCreate a skus.txt file with one SKU per line, for example:');
    console.log('MS001');
    console.log('MS002');
    console.log('MS003');
    process.exit(1);
  }

  try {
    const scraper = new TropicanaScraper();

    // Execute scraper
    console.log(`Reading SKUs from: ${skuFilePath}\n`);
    const products = await scraper.execute(skuFilePath);

    if (products.length === 0) {
      console.log('\nNo products were fetched. Check your SKU file and API connectivity.');
      process.exit(1);
    }

    // Export to CSV
    await scraper.exportToCsv();

    // Optionally download images
    const downloadImages = process.argv.includes('--download-images');
    if (downloadImages) {
      await scraper.downloadImages();
    } else {
      console.log('\nTip: Add --download-images flag to download product images');
    }

    console.log('\n✓ Scraping complete!');
    console.log(`  Products fetched: ${products.length}`);
    console.log('  Output: DropshipProductFeed.csv');
    
    if (downloadImages) {
      console.log('  Images: tropicana-images/');
    }

    // Show sample of first product
    if (products.length > 0) {
      console.log('\nSample product:');
      console.log('  SKU:', products[0].sku);
      console.log('  Name:', products[0].name);
      console.log('  Brand:', products[0].brand);
      console.log('  Price:', `£${products[0].productPrice.toFixed(2)}`);
      console.log('  Stock:', products[0].stockLevel);
    }

  } catch (error) {
    console.error('\n❌ Scraping failed:', (error as Error).message);
    process.exit(1);
  }
}

main();
