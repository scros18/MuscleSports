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
    
    // Launch browser with SSL handling
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: [
        '--no-sandbox', 
        '--disable-setuid-sandbox',
        '--ignore-certificate-errors',
        '--ignore-ssl-errors',
        '--ignore-certificate-errors-spki-list',
        '--disable-web-security',
        '--allow-running-insecure-content'
      ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    
    // Login to Tropicana Wholesale
    console.log('🔐 Logging into Tropicana Wholesale...');
    let loginSuccess = false;
    
    // Try different login URLs
    const loginUrls = [
      'https://www.tropicanawholesale.com/login',
      'https://tropicanawholesale.com/login',
      'https://www.tropicanawholesale.com/account/login',
      'https://tropicanawholesale.com/account/login'
    ];
    
    for (const loginUrl of loginUrls) {
      try {
        console.log(`🔗 Trying login URL: ${loginUrl}`);
        await page.goto(loginUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Look for login form elements using the actual HTML structure
        const emailInput = await page.$('input[name="loginname"], input[id="loginemail"], input[type="email"]');
        const passwordInput = await page.$('input[type="password"], input[name="password"], input[id="password"]');
        
        // Find login button using the actual HTML structure
        const loginButton = await page.$('button[name="login-continue"], button[class*="primary-button"], button[type="submit"]');
        
        // Debug: Log what elements we found
        console.log(`📊 Found elements - Email: ${!!emailInput}, Password: ${!!passwordInput}, Button: ${!!loginButton}`);
        
        if (emailInput && passwordInput && loginButton) {
          await emailInput.type(process.env.TROPICANA_EMAIL || 'johncroston@myyahoo.com');
          await passwordInput.type(process.env.TROPICANA_PASSWORD || 'Wholesale123');
          await loginButton.click();
          
          // Wait for login to complete
          await new Promise(resolve => setTimeout(resolve, 5000));
          console.log('✅ Successfully logged in!');
          loginSuccess = true;
          break;
        } else {
          console.log('⚠️  Could not find login form elements on this URL');
          
          // Debug: Show what's on the page
          const pageInfo = await page.evaluate(() => {
            const forms = document.querySelectorAll('form');
            const inputs = document.querySelectorAll('input');
            const buttons = document.querySelectorAll('button');
            return {
              forms: forms.length,
              inputs: inputs.length,
              buttons: buttons.length,
              inputTypes: Array.from(inputs).map(i => i.type),
              buttonTexts: Array.from(buttons).map(b => b.textContent?.trim())
            };
          });
          console.log(`🔍 Page debug: ${pageInfo.forms} forms, ${pageInfo.inputs} inputs, ${pageInfo.buttons} buttons`);
          console.log(`📝 Input types: ${pageInfo.inputTypes.join(', ')}`);
          console.log(`🔘 Button texts: ${pageInfo.buttonTexts.join(', ')}`);
        }
      } catch (error) {
        console.log(`⚠️  Login failed for ${loginUrl}:`, error.message);
      }
    }
    
    if (!loginSuccess) {
      console.log('⚠️  All login attempts failed, proceeding without login...');
    }
    
    // Complete Tropicana Wholesale categories to scrape - All categories for MuscleSports rebrand
    const categories = [
      { name: 'Amino Acids', url: 'https://www.tropicanawholesale.com/shop-by-category/Amino-Acids/' },
      { name: 'Anti Inflammatory', url: 'https://www.tropicanawholesale.com/shop-by-category/Anti-Inflammatory/' },
      { name: 'Antioxidant Support', url: 'https://www.tropicanawholesale.com/shop-by-category/Antioxidant-Support/' },
      { name: 'Appetite Control', url: 'https://www.tropicanawholesale.com/shop-by-category/Appetite-Control/' },
      { name: 'Ashwagandha', url: 'https://www.tropicanawholesale.com/shop-by-category/Ashwagandha/' },
      { name: 'Caffeine', url: 'https://www.tropicanawholesale.com/shop-by-category/Caffeine/' },
      { name: 'Carbohydrate Powders', url: 'https://www.tropicanawholesale.com/shop-by-category/Carbohydrate-Powders/' },
      { name: 'CBD', url: 'https://www.tropicanawholesale.com/shop-by-category/CBD/' },
      { name: 'CLA', url: 'https://www.tropicanawholesale.com/shop-by-category/CLA/' },
      { name: 'Probiotics & Digestion', url: 'https://www.tropicanawholesale.com/shop-by-category/Probiotics-and-Digestion/' },
      { name: 'Clothing', url: 'https://www.tropicanawholesale.com/shop-by-category/Clothing/' },
      { name: 'Cognitive Support', url: 'https://www.tropicanawholesale.com/shop-by-category/Cognitive-Support/' },
      { name: 'Collagen', url: 'https://www.tropicanawholesale.com/shop-by-category/Collagen/' },
      { name: 'Cream Of Rice', url: 'https://www.tropicanawholesale.com/shop-by-category/Cream-Of-Rice/' },
      { name: 'Creams, Gels, Lotions, Ointments', url: 'https://www.tropicanawholesale.com/shop-by-category/Creams-Gels-Lotions-Ointments/' },
      { name: 'Creatine', url: 'https://www.tropicanawholesale.com/shop-by-category/Creatine/' },
      { name: 'Egg Whites', url: 'https://www.tropicanawholesale.com/shop-by-category/Egg-Whites/' },
      { name: 'Electrolytes', url: 'https://www.tropicanawholesale.com/shop-by-category/Electrolytes/' },
      { name: 'Energy & Endurance', url: 'https://www.tropicanawholesale.com/shop-by-category/Energy-Endurance/' },
      { name: 'Fish Oils & Omega', url: 'https://www.tropicanawholesale.com/shop-by-category/Fish-Oils-Omega/' },
      { name: 'Functional Foods', url: 'https://www.tropicanawholesale.com/shop-by-category/Functional-Foods/' },
      { name: 'Glutamine', url: 'https://www.tropicanawholesale.com/shop-by-category/Glutamine/' },
      { name: 'Health & Wellness', url: 'https://www.tropicanawholesale.com/shop-by-category/Health-Wellness/' },
      { name: 'Joint Support', url: 'https://www.tropicanawholesale.com/shop-by-category/Joint-Support/' },
      { name: 'Mass Gainers', url: 'https://www.tropicanawholesale.com/shop-by-category/Mass-Gainers/' },
      { name: 'Meal Replacements', url: 'https://www.tropicanawholesale.com/shop-by-category/Meal-Replacements/' },
      { name: 'Multivitamins', url: 'https://www.tropicanawholesale.com/shop-by-category/Multivitamins/' },
      { name: 'Muscle Recovery', url: 'https://www.tropicanawholesale.com/shop-by-category/Muscle-Recovery/' },
      { name: 'Omega 3', url: 'https://www.tropicanawholesale.com/shop-by-category/Omega-3/' },
      { name: 'Pre-Workout', url: 'https://www.tropicanawholesale.com/shop-by-category/Pre-Workout/' },
      { name: 'Protein Bars', url: 'https://www.tropicanawholesale.com/shop-by-category/Protein-Bars/' },
      { name: 'Protein Powders', url: 'https://www.tropicanawholesale.com/shop-by-category/Protein-Powders/' },
      { name: 'Protein RTDs', url: 'https://www.tropicanawholesale.com/shop-by-category/Protein-RTDs/' },
      { name: 'Ready-To-Drinks', url: 'https://www.tropicanawholesale.com/shop-by-category/Ready-To-Drinks/' },
      { name: 'Sleep Support', url: 'https://www.tropicanawholesale.com/shop-by-category/Sleep-Support/' },
      { name: 'Sports Nutrition', url: 'https://www.tropicanawholesale.com/shop-by-category/Sports-Nutrition/' },
      { name: 'Testosterone Support', url: 'https://www.tropicanawholesale.com/shop-by-category/Testosterone-Support/' },
      { name: 'Vitamins & Minerals', url: 'https://www.tropicanawholesale.com/shop-by-category/Vitamins-Minerals/' },
      { name: 'Weight Management', url: 'https://www.tropicanawholesale.com/shop-by-category/Weight-Management/' },
      { name: 'Whey Protein', url: 'https://www.tropicanawholesale.com/shop-by-category/Whey-Protein/' }
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
        
        // Extract product data using Tropicana Wholesale's exact selectors
        const products = await page.evaluate((categoryName) => {
          // Use the exact selectors from Tropicana Wholesale HTML structure
          const productElements = document.querySelectorAll('.product, .product-item, .product-card, .grid-product, .product-listing-item, [data-product-id], .product-row, .product-list-item, .product-container, .item, .listing-item');
          
          console.log(`Found ${productElements.length} product elements using Tropicana selectors`);
          
          // If no products found with standard selectors, try broader approach
          if (productElements.length === 0) {
            console.log('Trying broader selector approach...');
            const allDivs = document.querySelectorAll('div');
            const products = [];
            
            allDivs.forEach((element, index) => {
              try {
                // Look for elements that contain Tropicana product structure
                const hasProductName = element.querySelector('.product-name');
                const hasPrice = element.querySelector('.price');
                const hasStock = element.querySelector('.product-stock');
                
                if (!hasProductName || !hasPrice) return;
                
                // Extract using Tropicana's exact selectors
                const nameElement = element.querySelector('.product-name a, .product-name');
                const name = nameElement ? nameElement.textContent.trim() : '';
                
                const priceElement = element.querySelector('.price');
                const priceText = priceElement ? priceElement.textContent.trim() : '';
                
                // Clean price text (remove "Your price", "£", "+ VAT", etc.)
                const cleanPriceText = priceText.replace(/Your price|£|\+ VAT|VAT|small|span/gi, '').trim();
                const priceMatch = cleanPriceText.match(/[\d,]+\.?\d*/);
                const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : 0;
                
                const imageElement = element.querySelector('img');
                const image = imageElement ? (imageElement.src || imageElement.getAttribute('data-src') || imageElement.getAttribute('data-lazy-src')) : '';
                
                const linkElement = element.querySelector('.product-name a, a');
                const productUrl = linkElement ? linkElement.href : '';
                
                // Extract size/flavor using Tropicana's exact selector
                const sizeFlavorElement = element.querySelector('.product-sizeflavour');
                const sizeFlavorText = sizeFlavorElement ? sizeFlavorElement.textContent.trim() : '';
                
                // Split size and flavor
                const sizeFlavorParts = sizeFlavorText.split(' / ');
                const weight = sizeFlavorParts[0] || '';
                const flavor = sizeFlavorParts[1] || '';
                
                // Extract stock status using Tropicana's exact selector
                const stockElement = element.querySelector('.product-stock');
                const stockText = stockElement ? stockElement.textContent.trim() : '';
                const inStock = stockText.toLowerCase().includes('in stock');
                const stockQty = stockText.match(/\d+/);
                const stockQuantity = stockQty ? parseInt(stockQty[0]) : 0;
                
                // Extract additional details
                const skuElement = element.querySelector('[data-analyticstagmanager-product]');
                const sku = skuElement ? skuElement.getAttribute('data-analyticstagmanager-product') : '';
                
                const brand = 'Tropicana'; // Default brand
                
                if (name && price > 0 && name.length > 5) {
                  products.push({
                    name: name,
                    price: price,
                    image: image,
                    url: productUrl,
                    sku: sku,
                    stock: stockText,
                    inStock: inStock,
                    stockQuantity: stockQuantity,
                    brand: brand,
                    weight: weight,
                    flavor: flavor,
                    bestBefore: '',
                    caseQty: '',
                    palletQty: '',
                    origin: '',
                    promotion: '',
                    category: categoryName,
                    index: index
                  });
                }
              } catch (error) {
                // Skip this element
              }
            });
            
            return products;
          }
          
          // Process products found with standard selectors
          return Array.from(productElements).map((element, index) => {
            try {
              // Extract using Tropicana's exact selectors
              const nameElement = element.querySelector('.product-name a, .product-name');
              const name = nameElement ? nameElement.textContent.trim() : '';
              
              const priceElement = element.querySelector('.price');
              const priceText = priceElement ? priceElement.textContent.trim() : '';
              
              // Clean price text (remove "Your price", "£", "+ VAT", etc.)
              const cleanPriceText = priceText.replace(/Your price|£|\+ VAT|VAT|small|span/gi, '').trim();
              const priceMatch = cleanPriceText.match(/[\d,]+\.?\d*/);
              const price = priceMatch ? parseFloat(priceMatch[0].replace(',', '')) : 0;
              
              const imageElement = element.querySelector('img');
              const image = imageElement ? (imageElement.src || imageElement.getAttribute('data-src') || imageElement.getAttribute('data-lazy-src')) : '';
              
              const linkElement = element.querySelector('.product-name a, a');
              const productUrl = linkElement ? linkElement.href : '';
              
              // Extract size/flavor using Tropicana's exact selector
              const sizeFlavorElement = element.querySelector('.product-sizeflavour');
              const sizeFlavorText = sizeFlavorElement ? sizeFlavorElement.textContent.trim() : '';
              
              // Split size and flavor
              const sizeFlavorParts = sizeFlavorText.split(' / ');
              const weight = sizeFlavorParts[0] || '';
              const flavor = sizeFlavorParts[1] || '';
              
              // Extract stock status using Tropicana's exact selector
              const stockElement = element.querySelector('.product-stock');
              const stockText = stockElement ? stockElement.textContent.trim() : '';
              const inStock = stockText.toLowerCase().includes('in stock');
              const stockQty = stockText.match(/\d+/);
              const stockQuantity = stockQty ? parseInt(stockQty[0]) : 0;
              
              // Extract additional details
              const skuElement = element.querySelector('[data-analyticstagmanager-product]');
              const sku = skuElement ? skuElement.getAttribute('data-analyticstagmanager-product') : '';
              
              const brand = 'Tropicana'; // Default brand
              
              return {
                name: name,
                price: price,
                image: image,
                url: productUrl,
                sku: sku,
                stock: stockText,
                inStock: inStock,
                stockQuantity: stockQuantity,
                brand: brand,
                weight: weight,
                flavor: flavor,
                bestBefore: '',
                caseQty: '',
                palletQty: '',
                origin: '',
                promotion: '',
                category: categoryName,
                index: index
              };
            } catch (error) {
              console.log(`Error processing product ${index + 1}:`, error.message);
              return null;
            }
          }).filter(Boolean);
        }, category.name);
        
        console.log(`📋 Found ${products.length} products in ${category.name}`);
        
        // Process each product
        for (const product of products) {
          try {
            const cleanName = cleanText(product.name);
            const cleanPrice = product.price; // Already cleaned in extraction
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
            
            // Use the extracted stock data from Tropicana selectors
            const inStock = product.inStock || false;
            const stockQty = product.stockQuantity || 0;
            
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
    console.log(`⏰ Scraping took: ${((Date.now() - startTime) / 1000).toFixed(2)} seconds`);
    
    // Log completion for monitoring
    console.log(`\n🔄 Next scheduled update: ${new Date(Date.now() + 6 * 60 * 60 * 1000).toLocaleString()}`);
    console.log(`📈 Categories updated: ${categories.length}`);
    console.log(`🏪 MuscleSports products section ready for customers!`);
    
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
