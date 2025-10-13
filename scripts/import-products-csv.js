const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || '137.74.157.17',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'MscS!2025_Reboot@42',
  database: process.env.DB_NAME || 'ecommerce',
  port: process.env.DB_PORT || 3306
};

// Helper function to clean text
function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/\s+/g, ' ')
    .replace(/[^\w\s\-.,!?]/g, '')
    .trim();
}

// Helper function to generate product ID
function generateProductId(name, brand = '') {
  const cleanName = name.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 30);
  const cleanBrand = brand.toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 10);
  return `${cleanBrand}-${cleanName}-${Date.now()}`.substring(0, 50);
}

// Helper function to extract price from text
function extractPrice(priceText) {
  if (!priceText) return 0;
  const match = priceText.toString().match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

// Helper function to parse images from CSV
function parseImages(imageString) {
  if (!imageString) return [];
  try {
    // Try to parse as JSON first
    if (imageString.startsWith('[') || imageString.startsWith('{')) {
      return JSON.parse(imageString);
    }
    // Split by common delimiters
    return imageString.split(/[,;|]/).map(img => img.trim()).filter(img => img);
  } catch (error) {
    // If parsing fails, return as single image
    return [imageString.trim()];
  }
}

// Helper function to parse flavours from CSV
function parseFlavours(flavourString) {
  if (!flavourString) return [];
  try {
    // Try to parse as JSON first
    if (flavourString.startsWith('[') || flavourString.startsWith('{')) {
      return JSON.parse(flavourString);
    }
    // Split by common delimiters
    return flavourString.split(/[,;|]/).map(flavour => flavour.trim()).filter(flavour => flavour);
  } catch (error) {
    // If parsing fails, return as single flavour
    return [flavourString.trim()];
  }
}

// Main import function
async function importProductsFromCSV(csvFilePath) {
  let connection;
  
  try {
    console.log('🚀 Starting CSV product import...\n');
    
    // Check if file exists
    if (!fs.existsSync(csvFilePath)) {
      throw new Error(`CSV file not found: ${csvFilePath}`);
    }
    
    console.log(`📁 Reading CSV file: ${csvFilePath}`);
    
    // Connect to database
    console.log('📊 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected!\n');
    
    const products = [];
    let rowCount = 0;
    
    // Read CSV file
    await new Promise((resolve, reject) => {
      fs.createReadStream(csvFilePath)
        .pipe(csv())
        .on('data', (row) => {
          rowCount++;
          products.push(row);
        })
        .on('end', resolve)
        .on('error', reject);
    });
    
    console.log(`📋 Found ${products.length} products in CSV file\n`);
    
    let processedProducts = 0;
    let skippedProducts = 0;
    let errorProducts = 0;
    
    // Process each product
    for (let i = 0; i < products.length; i++) {
      const row = products[i];
      
      try {
        // Map CSV columns to product data
        // Adjust these field names based on your CSV structure
        const name = cleanText(row.name || row.title || row.product_name || row['Product Name']);
        const price = extractPrice(row.price || row.cost || row['Price'] || row['Cost']);
        const description = cleanText(row.description || row.desc || row['Description'] || '');
        const category = cleanText(row.category || row.type || row['Category'] || 'General');
        const images = parseImages(row.images || row.image_urls || row['Images'] || '');
        const flavours = parseFlavours(row.flavours || row.flavors || row['Flavours'] || '');
        const strengths = parseFlavours(row.strengths || row.strength || row['Strengths'] || '');
        const inStock = row.in_stock !== undefined ? 
          (row.in_stock === 'true' || row.in_stock === '1' || row.in_stock === 'yes') : true;
        const featured = row.featured !== undefined ? 
          (row.featured === 'true' || row.featured === '1' || row.featured === 'yes') : false;
        
        // Skip if essential data is missing
        if (!name || price <= 0) {
          console.log(`⚠️  Skipping row ${i + 1}: Missing name or invalid price`);
          skippedProducts++;
          continue;
        }
        
        // Generate product ID
        const productId = generateProductId(name, row.brand || 'MuscleSports');
        
        // Check if product already exists
        const [existing] = await connection.execute(
          'SELECT id FROM products WHERE id = ? OR name = ?',
          [productId, name]
        );
        
        if (existing.length > 0) {
          console.log(`⚠️  Product already exists: ${name}`);
          skippedProducts++;
          continue;
        }
        
        // Create product data
        const productData = {
          id: productId,
          name: name,
          price: price,
          description: description || `${name} - Premium product from MuscleSports. High quality and great value.`,
          images: images.length > 0 ? images : ['/placeholder.svg'],
          category: category,
          inStock: inStock,
          featured: featured,
          flavours: flavours,
          strengths: strengths
        };
        
        // Insert product into database
        await connection.execute(
          `INSERT INTO products (id, name, price, description, images, category, in_stock, featured, flavours, strengths) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            productData.id,
            productData.name,
            productData.price,
            productData.description,
            JSON.stringify(productData.images),
            productData.category,
            productData.inStock,
            productData.featured,
            JSON.stringify(productData.flavours),
            JSON.stringify(productData.strengths)
          ]
        );
        
        processedProducts++;
        console.log(`✅ [${i + 1}/${products.length}] Added: ${name} - £${price.toFixed(2)}`);
        
      } catch (error) {
        console.log(`❌ Error processing row ${i + 1}: ${error.message}`);
        errorProducts++;
      }
    }
    
    console.log(`\n🎉 Import completed!`);
    console.log(`📊 Total rows processed: ${products.length}`);
    console.log(`✅ Products added to database: ${processedProducts}`);
    console.log(`⚠️  Products skipped: ${skippedProducts}`);
    console.log(`❌ Products with errors: ${errorProducts}`);
    
  } catch (error) {
    console.error('❌ Import failed:', error);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// Command line usage
if (require.main === module) {
  const csvFilePath = process.argv[2];
  
  if (!csvFilePath) {
    console.log('Usage: node import-products-csv.js <path-to-csv-file>');
    console.log('Example: node import-products-csv.js /path/to/products.csv');
    process.exit(1);
  }
  
  importProductsFromCSV(csvFilePath);
}

module.exports = { importProductsFromCSV };
