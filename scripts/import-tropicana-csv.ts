#!/usr/bin/env tsx
/**
 * Import Tropicana products from CSV and sync to database
 * Filters out out-of-stock products
 * Run: tsx scripts/import-tropicana-csv.ts products.csv
 */

import { Database } from '../lib/database';
import fs from 'fs/promises';

interface CsvProduct {
  [key: string]: string;
}

/**
 * Advanced CSV parser that handles quoted fields with commas
 */
function parseCSV(content: string): CsvProduct[] {
  const lines = content.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  const parseCSVLine = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];
      
      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // End of field
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    // Push the last field
    result.push(current.trim());
    return result;
  };

  const headers = parseCSVLine(lines[0]);
  const records: CsvProduct[] = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    const record: CsvProduct = {};
    
    headers.forEach((header, index) => {
      record[header] = values[index] || '';
    });
    
    // Only add if we have at least a SKU
    if (record['SKU'] && record['SKU'].trim()) {
      records.push(record);
    }
  }

  return records;
}

async function importTropicanaCSV(csvPath: string) {
  console.log('=== Tropicana CSV Import ===\n');
  
  try {
    // CLEAR ALL EXISTING PRODUCTS FIRST
    console.log('⚠️  Clearing all existing products from database...');
    const deleteResult = await Database.query('DELETE FROM products');
    console.log(`✅ Deleted ${(deleteResult as any).affectedRows || 0} existing products\n`);
    
    // Read CSV file
    console.log(`Reading CSV from: ${csvPath}`);
    const fileContent = await fs.readFile(csvPath, 'utf-8');
    
    // Parse CSV
    const records: CsvProduct[] = parseCSV(fileContent);

    console.log(`Found ${records.length} products in CSV`);

    // Filter out products with 0 or no stock
    const inStockProducts = records.filter(product => {
      const stock = parseInt(product['Stock'] || '0', 10);
      return stock > 0;
    });

    console.log(`Filtered to ${inStockProducts.length} in-stock products (removed ${records.length - inStockProducts.length} out-of-stock)`);
    
    // Group products by parent (for variants)
    const productGroups = new Map<string, CsvProduct[]>();
    
    for (const product of inStockProducts) {
      const type = product['Type'] || 'simple';
      const parentSKU = product['ParentSKU'] || product['SKU'];
      
      if (type === 'variable') {
        // This is a parent product, use its own SKU
        if (!productGroups.has(product['SKU'])) {
          productGroups.set(product['SKU'], []);
        }
        productGroups.get(product['SKU'])!.push(product);
      } else if (type === 'simple' && parentSKU && parentSKU !== product['SKU']) {
        // This is a variant, group under parent
        if (!productGroups.has(parentSKU)) {
          productGroups.set(parentSKU, []);
        }
        productGroups.get(parentSKU)!.push(product);
      } else {
        // Standalone simple product
        if (!productGroups.has(product['SKU'])) {
          productGroups.set(product['SKU'], []);
        }
        productGroups.get(product['SKU'])!.push(product);
      }
    }
    
    console.log(`Grouped into ${productGroups.size} product families\n`);

    // Import to database
    let inserted = 0;
    let updated = 0;
    let errors = 0;

    for (const [parentSKU, variants] of Array.from(productGroups.entries())) {
      try {
        // Use the parent/first product for main details
        const mainProduct = variants[0];
        
        // Use SKU as the ID
        const id = mainProduct['SKU'];
        const name = mainProduct['FancyName'] || mainProduct['Name'] || '';
        const price = parseFloat(mainProduct['Price'] || '0');
        const brand = mainProduct['Brand'] || '';
        const category = mainProduct['Category'] || '';
        const barcode = mainProduct['Barcode'] || '';
        const size = mainProduct['Size'] || '';
        const keywords = mainProduct['Keywords'] || '';
        const expiryDate = mainProduct['ExpiryDate'] || '';
        
        // Build description with nutrition info
        let description = mainProduct['Description'] || '';
        if (!description && mainProduct['Size']) {
          description = `Size: ${mainProduct['Size']}`;
        }
        
        // Calculate total stock across all variants
        const totalStock = variants.reduce((sum: number, v: CsvProduct) => {
          return sum + parseInt(v['Stock'] || '0', 10);
        }, 0);
        
        // Determine if in stock
        const inStock = totalStock > 0;
        
        // Collect all unique flavors
        const flavours = variants
          .map((v: CsvProduct) => v['Flavour'] || '')
          .filter((f: string) => f && f.trim())
          .filter((f: string, i: number, arr: string[]) => arr.indexOf(f) === i);
        
        // Build images array - collect all unique images from variants
        const imageUrls = variants
          .map((v: CsvProduct) => v['Image'] || '')
          .filter((img: string) => img && img.trim())
          .filter((img: string, i: number, arr: string[]) => arr.indexOf(img) === i);
        
        // Build flavourImages object mapping flavour to image
        const flavourImages: { [key: string]: string } = {};
        variants.forEach((v: CsvProduct) => {
          const flavour = v['Flavour'];
          const image = v['Image'];
          if (flavour && image) {
            flavourImages[flavour] = image;
          }
        });

        if (!id || !name) {
          console.warn(`Skipping product without SKU or name`);
          continue;
        }

        // Check if product already exists
        const existing = await Database.query(
          'SELECT id FROM products WHERE id = ?',
          [id]
        ) as any[];

        if (existing.length > 0) {
          // Update existing product
          await Database.query(
            `UPDATE products SET
              name = ?,
              description = ?,
              price = ?,
              category = ?,
              images = ?,
              in_stock = ?,
              featured = FALSE,
              flavours = ?,
              flavour_images = ?,
              updated_at = NOW()
            WHERE id = ?`,
            [
              name,
              description,
              price,
              category,
              JSON.stringify(imageUrls),
              inStock,
              flavours.length > 0 ? JSON.stringify(flavours) : null,
              Object.keys(flavourImages).length > 0 ? JSON.stringify(flavourImages) : null,
              id
            ]
          );
          updated++;
        } else {
          // Insert new product
          await Database.query(
            `INSERT INTO products (
              id, name, description, price, category, images, in_stock, featured,
              flavours, flavour_images, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, FALSE, ?, ?, NOW(), NOW())`,
            [
              id,
              name,
              description,
              price,
              category,
              JSON.stringify(imageUrls),
              inStock,
              flavours.length > 0 ? JSON.stringify(flavours) : null,
              Object.keys(flavourImages).length > 0 ? JSON.stringify(flavourImages) : null
            ]
          );
          inserted++;
        }

        // Progress update every 50 products
        if ((inserted + updated) % 50 === 0) {
          process.stdout.write(`\rProgress: ${inserted + updated}/${productGroups.size} (${inserted} new, ${updated} updated)`);
        }

      } catch (error) {
        errors++;
        console.error(`\nError importing product ${parentSKU}:`, error);
      }
    }

    console.log(`\n\n✅ Import complete!`);
    console.log(`  Total product families: ${productGroups.size}`);
    console.log(`  Inserted: ${inserted}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Errors: ${errors}`);
    console.log(`  Filtered out (no stock): ${records.length - inStockProducts.length}`);

  } catch (error) {
    console.error('\n❌ Import failed:', error);
    process.exit(1);
  }
}

// Main execution
const csvPath = process.argv[2] || 'products.csv';

importTropicanaCSV(csvPath)
  .then(() => {
    console.log('\nDone!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
