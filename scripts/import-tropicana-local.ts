#!/usr/bin/env tsx
/**
 * Import Tropicana products from local scraper output
 * Run this on the server after uploading the JSON from local scraper
 */

import * as fs from 'fs';
import { Database } from '../lib/database';

interface ProductData {
  sku: string;
  name: string;
  wholesale_price: number;
  retail_price: number;
  description: string;
  images: string[];
  in_stock: boolean;
  stock_quantity?: number;
  brand?: string;
  category?: string;
  flavours?: string[];
  sizes?: string[];
  weight?: string;
  barcode?: string;
}

async function importProducts(jsonPath: string) {
  console.log('📥 Importing Tropicana products from local scraper...\n');
  
  if (!fs.existsSync(jsonPath)) {
    throw new Error(`File not found: ${jsonPath}`);
  }
  
  const products: ProductData[] = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  console.log(`   Found ${products.length} products in file`);
  
  const connection = await Database.getConnection();
  
  try {
    let created = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const product of products) {
      try {
        // Check if exists
        const [existing] = await connection.execute(
          'SELECT id FROM tropicana_products WHERE sku = ? OR handle = ?',
          [product.sku, product.sku]
        );
        
        const existingProduct = (existing as any[])[0];
        
        if (existingProduct) {
          // Update
          await connection.execute(`
            UPDATE tropicana_products SET
              name = ?,
              wholesale_price = ?,
              retail_price = ?,
              margin = 35,
              description = ?,
              images = ?,
              in_stock = ?,
              stock_quantity = ?,
              brand = ?,
              weight = ?,
              tags = ?,
              flavours = ?,
              strengths = ?,
              last_synced = CURRENT_TIMESTAMP,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
          `, [
            product.name,
            product.wholesale_price,
            product.retail_price,
            product.description,
            JSON.stringify(product.images),
            product.in_stock ? 1 : 0,
            product.stock_quantity || null,
            product.brand || '',
            product.weight || '',
            JSON.stringify([product.category].filter(Boolean)),
            JSON.stringify(product.flavours || []),
            JSON.stringify(product.sizes || []),
            existingProduct.id
          ]);
          updated++;
        } else {
          // Create
          const id = Date.now().toString(36) + Math.random().toString(36).substr(2);
          await connection.execute(`
            INSERT INTO tropicana_products (
              id, handle, sku, name, wholesale_price, retail_price, margin,
              description, images, in_stock, stock_quantity, brand, weight,
              tags, flavours, strengths, active, last_synced
            ) VALUES (?, ?, ?, ?, ?, ?, 35, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
          `, [
            id,
            product.sku,
            product.sku,
            product.name,
            product.wholesale_price,
            product.retail_price,
            product.description,
            JSON.stringify(product.images),
            product.in_stock ? 1 : 0,
            product.stock_quantity || null,
            product.brand || '',
            product.weight || '',
            JSON.stringify([product.category].filter(Boolean)),
            JSON.stringify(product.flavours || []),
            JSON.stringify(product.sizes || [])
          ]);
          created++;
        }
      } catch (error) {
        console.error(`   ❌ Failed to import ${product.sku}:`, error);
        skipped++;
      }
    }
    
    console.log(`\n✅ Import complete!`);
    console.log(`   📊 Created: ${created}`);
    console.log(`   📊 Updated: ${updated}`);
    console.log(`   📊 Skipped: ${skipped}`);
    
  } finally {
    connection.release();
  }
}

async function main() {
  const jsonPath = process.argv[2];
  
  if (!jsonPath) {
    console.error('Usage: npm run import:tropicana:local <path-to-json>');
    console.error('Example: npm run import:tropicana:local data/tropicana-scraped/products-2024-10-28.json');
    process.exit(1);
  }
  
  await importProducts(jsonPath);
}

if (require.main === module) {
  main().catch((e) => {
    console.error('❌ Import failed:', e);
    process.exit(1);
  });
}
