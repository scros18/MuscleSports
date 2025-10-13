import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import * as mysql from 'mysql2/promise';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface CSVRow {
  sku: string;
  stock: string;
  price: string;
  sin: string;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  
  return result;
}

function parseStockStatus(stockValue: string): boolean {
  stockValue = stockValue.trim().toLowerCase();
  
  // If it's "out of stock", return false
  if (stockValue === 'out of stock') {
    return false;
  }
  
  // If it's "in stock", return true
  if (stockValue === 'in stock') {
    return true;
  }
  
  // If it's a number, check if it's greater than 0
  const numValue = parseInt(stockValue);
  if (!isNaN(numValue)) {
    return numValue > 0;
  }
  
  // Default to true (in stock) if we can't determine
  return true;
}

function parsePrice(priceValue: string): number | null {
  // Remove "GBP" and any other non-numeric characters except dot
  const cleanPrice = priceValue.replace(/[^0-9.]/g, '').trim();
  const price = parseFloat(cleanPrice);
  
  if (isNaN(price)) {
    return null;
  }
  
  return price;
}

async function updatePricesAndStock() {
  let connection: mysql.Connection | null = null;
  
  try {
    console.log('🔄 Starting price and stock update process...\n');
    
    // Create database connection
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'ordify_db',
      port: parseInt(process.env.DB_PORT || '3306'),
    });
    
    console.log('✅ Database connection established\n');
    
    // Read the CSV file
    const csvPath = path.join(__dirname, '..', 'aosomstockandprice.csv');
    const csvContent = fs.readFileSync(csvPath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());
    
    console.log(`📄 CSV file loaded: ${lines.length} lines total\n`);
    
    // Skip the header row
    const header = lines[0];
    console.log(`Header: ${header}\n`);
    
    let updatedCount = 0;
    let notFoundCount = 0;
    let errorCount = 0;
    let skippedCount = 0;
    
    // Process each line (skip header)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      try {
        const columns = parseCSVLine(line);
        
        // Check if we have enough columns
        if (columns.length < 3) {
          console.log(`⚠️  Skipping line ${i + 1}: Not enough columns`);
          skippedCount++;
          continue;
        }
        
        const sku = columns[0].trim();
        const stockValue = columns[1].trim();
        const priceValue = columns[2].trim();
        
        // Skip if SKU is empty
        if (!sku) {
          skippedCount++;
          continue;
        }
        
        // Parse the values
        const inStock = parseStockStatus(stockValue);
        const price = parsePrice(priceValue);
        
        if (price === null) {
          console.log(`⚠️  Line ${i + 1} - SKU ${sku}: Invalid price format "${priceValue}"`);
          errorCount++;
          continue;
        }
        
        // Check if product exists
        const [rows] = await connection.execute(
          'SELECT id FROM products WHERE id = ?',
          [sku]
        );
        
        if ((rows as any[]).length === 0) {
          console.log(`❌ Line ${i + 1} - SKU ${sku}: Product not found in database`);
          notFoundCount++;
          continue;
        }
        
        // Update the product
        await connection.execute(
          'UPDATE products SET price = ?, in_stock = ?, updated_at = NOW() WHERE id = ?',
          [price, inStock, sku]
        );
        
        updatedCount++;
        
        // Show progress every 100 items
        if (updatedCount % 100 === 0) {
          console.log(`📊 Progress: ${updatedCount} products updated...`);
        }
        
      } catch (error) {
        console.error(`❌ Error processing line ${i + 1}:`, error);
        errorCount++;
      }
    }
    
    // Print summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 UPDATE SUMMARY');
    console.log('='.repeat(60));
    console.log(`✅ Successfully updated: ${updatedCount} products`);
    console.log(`❌ Products not found: ${notFoundCount}`);
    console.log(`⚠️  Errors: ${errorCount}`);
    console.log(`⏭️  Skipped: ${skippedCount}`);
    console.log(`📝 Total lines processed: ${lines.length - 1}`);
    console.log('='.repeat(60) + '\n');
    
    console.log('✅ Update process completed successfully!\n');
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('🔌 Database connection closed');
    }
  }
}

// Run the update
updatePricesAndStock();

