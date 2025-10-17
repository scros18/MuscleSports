const puppeteer = require('puppeteer');
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
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
  const match = priceText.match(/[\d.]+/);
  return match ? parseFloat(match[0]) : 0;
}

// Main scraping function for sports supplements
async function scrapeSportsSupplements() {
  let browser;
  let connection;
  
  try {
    console.log('🏋️ Starting Sports Supplements scraper...\n');
    
    // Connect to database
    console.log('📊 Connecting to database...');
    connection = await mysql.createConnection(dbConfig);
    console.log('✅ Database connected!\n');
    
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Sports supplement categories to scrape
    const categories = [
      { name: 'Protein Powders', url: 'https://tropicanawholesale.co.uk/collections/protein-powders' },
      { name: 'Pre-Workout', url: 'https://tropicanawholesale.co.uk/collections/pre-workout' },
      { name: 'Creatine', url: 'https://tropicanawholesale.co.uk/collections/creatine' },
      { name: 'Amino Acids', url: 'https://tropicanawholesale.co.uk/collections/amino-acids' },
      { name: 'Vitamins & Supplements', url: 'https://tropicanawholesale.co.uk/collections/vitamins-supplements' },
      { name: 'Weight Management', url: 'https://tropicanawholesale.co.uk/collections/weight-management' },
      { name: 'Sports Nutrition', url: 'https://tropicanawholesale.co.uk/collections/sports-nutrition' },
      { name: 'Health & Wellness', url: 'https://tropicanawholesale.co.uk/collections/health-wellness' }
    ];
    
    let totalProducts = 0;
    let processedProducts = 0;
    
    for (const category of categories) {
      console.log(`\n📦 Scraping category: ${category.name}`);
      console.log(`🔗 URL: ${category.url}`);
      
      try {
        await page.goto(category.url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait for products to load
        await page.waitForSelector('.product-item, .product-card, .grid-product', { timeout: 10000 });
        
        // Extract product data
        const products = await page.evaluate((categoryName) => {
          const productElements = document.querySelectorAll('.product-item, .product-card, .grid-product, [data-product-id]');
          const products = [];
          
          productElements.forEach((element, index) => {
            try {
              // Extract product information
              const nameElement = element.querySelector('.product-title, .product-name, h3, h4, .title');
              const priceElement = element.querySelector('.price, .product-price, .money, [data-price]');
              const imageElement = element.querySelector('img');
              const linkElement = element.querySelector('a');
              
              const name = nameElement ? nameElement.textContent.trim() : '';
              const price = priceElement ? priceElement.textContent.trim() : '';
              const image = imageElement ? imageElement.src || imageElement.getAttribute('data-src') : '';
              const productUrl = linkElement ? linkElement.href : '';
              
              if (name && price) {
                products.push({
                  name: name,
                  price: price,
                  image: image,
                  url: productUrl,
                  category: categoryName,
                  index: index
                });
              }
            } catch (error) {
              console.log(`Error processing product ${index}:`, error);
            }
          });
          
          return products;
        }, category.name);
        
        console.log(`📋 Found ${products.length} products in ${category.name}`);
        
        // Process each product
        for (const product of products) {
          try {
            const cleanName = cleanText(product.name);
            const cleanPrice = extractPrice(product.price);
            const productId = generateProductId(cleanName, 'Tropicana');
            
            // Skip if price is 0 or name is empty
            if (cleanPrice <= 0 || !cleanName) {
              console.log(`⚠️  Skipping invalid product: ${cleanName} - £${cleanPrice}`);
              continue;
            }
            
            // Check if product already exists
            const [existing] = await connection.execute(
              'SELECT id FROM products WHERE id = ? OR name = ?',
              [productId, cleanName]
            );
            
            if (existing.length > 0) {
              console.log(`⚠️  Product already exists: ${cleanName}`);
              continue;
            }
            
            // Calculate margin (50% markup for sports supplements)
            const retailPrice = cleanPrice * 1.5;
            const margin = ((retailPrice - cleanPrice) / cleanPrice) * 100;
            
            // Skip if margin is too low
            if (margin < 30) {
              console.log(`⚠️  Skipping product: ${cleanName} (margin too low: ${margin.toFixed(1)}%)`);
              continue;
            }
            
            // Insert product into database
            await connection.execute(`
              INSERT INTO products (
                id, name, description, price, wholesale_price, retail_price, 
                margin, category, brand, sku, in_stock, stock_quantity, 
                images, created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [
              productId,
              cleanName,
              `High-quality ${category.name.toLowerCase()} from Tropicana Wholesale`,
              retailPrice,
              cleanPrice,
              retailPrice,
              margin,
              category.name,
              'Tropicana',
              productId,
              true,
              100,
              JSON.stringify([product.image])
            ]);
            
            console.log(`✅ Added: ${cleanName} - £${cleanPrice} → £${retailPrice.toFixed(2)} (${margin.toFixed(1)}% margin)`);
            processedProducts++;
            
          } catch (error) {
            console.log(`❌ Error processing product: ${product.name}`, error.message);
          }
        }
        
        totalProducts += products.length;
        
        // Add delay between categories
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.log(`❌ Error scraping category ${category.name}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Scraping completed!`);
    console.log(`📊 Total products found: ${totalProducts}`);
    console.log(`✅ Products added to database: ${processedProducts}`);
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
  } finally {
    if (browser) {
      await browser.close();
    }
    if (connection) {
      await connection.end();
    }
  }
}

// Run the scraper
if (require.main === module) {
  scrapeSportsSupplements();
}

module.exports = { scrapeSportsSupplements };
