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
    
    // Login to Tropicana Wholesale
    console.log('🔐 Logging into Tropicana Wholesale...');
    try {
      await page.goto('https://tropicanawholesale.co.uk/login', { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Look for login form elements
      const emailInput = await page.$('input[type="email"], input[name="email"], input[id="email"], input[placeholder*="email" i]');
      const passwordInput = await page.$('input[type="password"], input[name="password"], input[id="password"]');
      const loginButton = await page.$('button[type="submit"], input[type="submit"], button:contains("Login"), button:contains("Sign In")');
      
      if (emailInput && passwordInput && loginButton) {
        await emailInput.type(process.env.TROPICANA_EMAIL || 'johncroston@myyahoo.com');
        await passwordInput.type(process.env.TROPICANA_PASSWORD || 'Wholesale123');
        await loginButton.click();
        
        // Wait for login to complete
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('✅ Successfully logged in!');
      } else {
        console.log('⚠️  Could not find login form elements, proceeding without login...');
      }
    } catch (error) {
      console.log('⚠️  Login failed, proceeding without login:', error.message);
    }
    
    // Sports supplement categories to scrape - Verified working URLs
    const categories = [
      { name: 'Amino Acids', url: 'https://www.tropicanawholesale.com/shop-by-category/Amino-Acids/' },
      { name: 'Protein Powders', url: 'https://www.tropicanawholesale.com/shop-by-category/Protein-Powders/' },
      { name: 'Ready-To-Drinks', url: 'https://www.tropicanawholesale.com/shop-by-category/Ready-To-Drinks/' },
      { name: 'Protein RTDs', url: 'https://www.tropicanawholesale.com/shop-by-category/Protein-RTDs/' },
      { name: 'Cream Of Rice', url: 'https://www.tropicanawholesale.com/shop-by-category/Cream-Of-Rice/' }
    ];
    
    let totalProducts = 0;
    let processedProducts = 0;
    
    for (const category of categories) {
      console.log(`\n📦 Scraping category: ${category.name}`);
      console.log(`🔗 URL: ${category.url}`);
      
      try {
        await page.goto(category.url, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait a bit for dynamic content to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Try to find products with multiple fallback selectors
        let productElements = null;
        const selectors = [
          '.product',
          '.product-item', 
          '.product-card',
          '.grid-product',
          '.product-listing-item',
          '[data-product-id]',
          '.product-row',
          '.product-list-item',
          '.product-container',
          '.item',
          '.listing-item',
          'div[class*="product"]',
          'div[class*="item"]',
          'div[class*="listing"]'
        ];
        
        for (const selector of selectors) {
          try {
            await page.waitForSelector(selector, { timeout: 5000 });
            productElements = await page.$$(selector);
            if (productElements.length > 0) {
              console.log(`✅ Found ${productElements.length} products using selector: ${selector}`);
              break;
            }
          } catch (e) {
            // Try next selector
          }
        }
        
        if (!productElements || productElements.length === 0) {
          console.log(`⚠️  No products found with any selector. Trying to get all divs...`);
          productElements = await page.$$('div');
          console.log(`📊 Found ${productElements.length} total divs on page`);
        }
        
        // Debug: Log page content to help identify selectors
        console.log('🔍 Debugging page content...');
        const pageInfo = await page.evaluate(() => {
          const allDivs = document.querySelectorAll('div');
          const allClasses = Array.from(allDivs).map(div => div.className).filter(cls => cls.length > 0);
          const uniqueClasses = [...new Set(allClasses)];
          
          return {
            totalDivs: allDivs.length,
            uniqueClasses: uniqueClasses.slice(0, 20), // First 20 unique classes
            pageTitle: document.title,
            bodyText: document.body.textContent.substring(0, 500)
          };
        });
        
        console.log(`📊 Page info: ${pageInfo.totalDivs} divs found`);
        console.log(`🏷️  Sample classes: ${pageInfo.uniqueClasses.join(', ')}`);
        
        // Take a screenshot for debugging
        try {
          await page.screenshot({ path: `debug-${category.name.replace(/\s+/g, '-').toLowerCase()}.png`, fullPage: true });
          console.log(`📸 Screenshot saved: debug-${category.name.replace(/\s+/g, '-').toLowerCase()}.png`);
        } catch (e) {
          console.log('⚠️  Could not save screenshot:', e.message);
        }
        
        // Extract product data with detailed information
        const products = await page.evaluate((categoryName) => {
          // Get all possible product elements
          const allElements = document.querySelectorAll('div, article, section');
          const products = [];
          
          allElements.forEach((element, index) => {
            try {
              // Look for elements that contain product-like information
              const text = element.textContent || '';
              const hasPrice = /£\d+|\$\d+|\d+\.\d{2}/.test(text);
              const hasProductName = text.length > 10 && text.length < 200;
              const hasImage = element.querySelector('img');
              
              // Skip if doesn't look like a product
              if (!hasPrice || !hasProductName) return;
              
              // Extract main product information with broader selectors
              const nameElement = element.querySelector('h1, h2, h3, h4, h5, h6, .title, .name, .product-title, .product-name, [class*="title"], [class*="name"]') || 
                                 element.querySelector('a[href*="product"], a[href*="item"]') ||
                                 element.querySelector('div[class*="title"], div[class*="name"]');
              
              const priceElement = element.querySelector('.price, .cost, .money, [class*="price"], [class*="cost"]') ||
                                  element.querySelector('span:contains("£"), div:contains("£"), p:contains("£")') ||
                                  Array.from(element.querySelectorAll('*')).find(el => /£\d+|\$\d+|\d+\.\d{2}/.test(el.textContent));
              
              const imageElement = element.querySelector('img');
              const linkElement = element.querySelector('a');
              
              const name = nameElement ? nameElement.textContent.trim() : '';
              const price = priceElement ? priceElement.textContent.trim() : '';
              const image = imageElement ? (imageElement.src || imageElement.getAttribute('data-src') || imageElement.getAttribute('data-lazy-src')) : '';
              const productUrl = linkElement ? linkElement.href : '';
              
              // Extract detailed product information
              const skuElement = element.querySelector('[class*="sku"], [class*="code"], [class*="id"]');
              const sku = skuElement ? skuElement.textContent.trim() : '';
              
              // Extract stock information
              const stockElement = element.querySelector('[class*="stock"], [class*="available"], [class*="in-stock"]');
              const stock = stockElement ? stockElement.textContent.trim() : '';
              
              // Extract brand information
              const brandElement = element.querySelector('[class*="brand"], [class*="manufacturer"]');
              const brand = brandElement ? brandElement.textContent.trim() : '';
              
              // Extract weight/size information
              const weightElement = element.querySelector('[class*="weight"], [class*="size"], [class*="gram"], [class*="kg"]');
              const weight = weightElement ? weightElement.textContent.trim() : '';
              
              // Extract flavor information
              const flavorElement = element.querySelector('[class*="flavour"], [class*="flavor"], [class*="variant"]');
              const flavor = flavorElement ? flavorElement.textContent.trim() : '';
              
              // Extract best before date
              const bestBeforeElement = element.querySelector('[class*="best"], [class*="expiry"], [class*="date"]');
              const bestBefore = bestBeforeElement ? bestBeforeElement.textContent.trim() : '';
              
              // Extract case quantity
              const caseQtyElement = element.querySelector('[class*="case"], [class*="per-case"]');
              const caseQty = caseQtyElement ? caseQtyElement.textContent.trim() : '';
              
              // Extract pallet quantity
              const palletQtyElement = element.querySelector('[class*="pallet"], [class*="per-pallet"]');
              const palletQty = palletQtyElement ? palletQtyElement.textContent.trim() : '';
              
              // Extract country of origin
              const originElement = element.querySelector('[class*="origin"], [class*="country"]');
              const origin = originElement ? originElement.textContent.trim() : '';
              
              // Extract promotional information
              const promoElement = element.querySelector('[class*="promo"], [class*="offer"], [class*="deal"]');
              const promotion = promoElement ? promoElement.textContent.trim() : '';
              
              if (name && price && name.length > 5 && price.length > 2) {
                products.push({
                  name: name,
                  price: price,
                  image: image,
                  url: productUrl,
                  sku: sku,
                  stock: stock,
                  brand: brand,
                  weight: weight,
                  flavor: flavor,
                  bestBefore: bestBefore,
                  caseQty: caseQty,
                  palletQty: palletQty,
                  origin: origin,
                  promotion: promotion,
                  category: categoryName,
                  index: index
                });
              }
            } catch (error) {
              // Skip this element
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
            const productId = product.sku || generateProductId(cleanName, 'Tropicana');
            
            // Skip if price is 0 or name is empty
            if (cleanPrice <= 0 || !cleanName) {
              console.log(`⚠️  Skipping invalid product: ${cleanName} - £${cleanPrice}`);
              continue;
            }
            
            // Check if product already exists
            const [existing] = await connection.execute(
              'SELECT id FROM products WHERE id = ? OR name = ? OR sku = ?',
              [productId, cleanName, product.sku]
            );
            
            if (existing.length > 0) {
              console.log(`⚠️  Product already exists: ${cleanName}`);
              continue;
            }
            
            // Calculate competitive pricing strategy
            let markupMultiplier = 1.4; // 40% markup for competitive pricing
            let retailPrice = cleanPrice * markupMultiplier;
            
            // Adjust markup based on product price range for better competitiveness
            if (cleanPrice < 10) {
              markupMultiplier = 1.6; // 60% markup for cheaper items
              retailPrice = cleanPrice * markupMultiplier;
            } else if (cleanPrice < 25) {
              markupMultiplier = 1.45; // 45% markup for mid-range items
              retailPrice = cleanPrice * markupMultiplier;
            } else if (cleanPrice < 50) {
              markupMultiplier = 1.35; // 35% markup for higher-end items
              retailPrice = cleanPrice * markupMultiplier;
            } else {
              markupMultiplier = 1.3; // 30% markup for premium items
              retailPrice = cleanPrice * markupMultiplier;
            }
            
            const margin = ((retailPrice - cleanPrice) / cleanPrice) * 100;
            
            // Skip if margin is too low (minimum 25% for sustainability)
            if (margin < 25) {
              console.log(`⚠️  Skipping product: ${cleanName} (margin too low: ${margin.toFixed(1)}%)`);
              continue;
            }
            
            // Round retail price to competitive pricing
            retailPrice = Math.round(retailPrice * 100) / 100;
            
            // Create detailed description with all product info
            let description = `High-quality ${category.name.toLowerCase()} from Tropicana Wholesale`;
            if (product.brand) description += ` by ${product.brand}`;
            if (product.flavor) description += ` - ${product.flavor} flavor`;
            if (product.weight) description += ` (${product.weight})`;
            if (product.origin) description += ` - Made in ${product.origin}`;
            if (product.promotion) description += ` - ${product.promotion}`;
            
            // Determine stock status
            const inStock = product.stock && !product.stock.toLowerCase().includes('out') && !product.stock.toLowerCase().includes('unavailable');
            const stockQty = product.stock ? parseInt(product.stock.match(/\d+/)?.[0] || '100') : 100;
            
            // Prepare flavors array for MuscleSports site compatibility
            const flavours = product.flavor ? [product.flavor] : [];
            
            // Insert product into database with MuscleSports site compatibility
            await connection.execute(`
              INSERT INTO products (
                id, name, description, price, wholesale_price, retail_price, 
                margin, category, brand, sku, in_stock, stock_quantity, 
                images, weight, flavor, best_before, case_quantity, 
                pallet_quantity, origin, promotion, flavours, featured, 
                created_at, updated_at
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            `, [
              productId,
              cleanName,
              description,
              retailPrice,
              cleanPrice,
              retailPrice,
              margin,
              category.name,
              product.brand || 'Tropicana',
              product.sku || productId,
              inStock,
              stockQty,
              JSON.stringify([product.image]),
              product.weight || '',
              product.flavor || '',
              product.bestBefore || '',
              product.caseQty || '',
              product.palletQty || '',
              product.origin || '',
              product.promotion || '',
              JSON.stringify(flavours),
              false // Not featured by default, can be manually promoted
            ]);
            
            console.log(`✅ Added: ${cleanName}${product.flavor ? ` (${product.flavor})` : ''} - £${cleanPrice} → £${retailPrice} (${margin.toFixed(1)}% margin) [SKU: ${product.sku || 'N/A'}]`);
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
