#!/usr/bin/env tsx
/**
 * Tropicana Wholesale Public Scraper
 * Based on Fred's working scraper - scrapes public product listings
 */

import puppeteer, { Browser, Page } from 'puppeteer';
import { Database } from '../lib/database';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface ScrapedProduct {
  name: string;
  price: number;
  image: string;
  category: string;
  sku?: string;
  brand: string;
  inStock: boolean;
}

// Categories to scrape from Tropicana public site
const CATEGORIES = [
  { name: 'Protein Powders', url: 'https://tropicanawholesale.co.uk/collections/protein-powders' },
  { name: 'Pre-Workout', url: 'https://tropicanawholesale.co.uk/collections/pre-workout' },
  { name: 'Creatine', url: 'https://tropicanawholesale.co.uk/collections/creatine' },
  { name: 'Amino Acids', url: 'https://tropicanawholesale.co.uk/collections/amino-acids' },
  { name: 'Vitamins & Supplements', url: 'https://tropicanawholesale.co.uk/collections/vitamins-supplements' },
  { name: 'Weight Management', url: 'https://tropicanawholesale.co.uk/collections/weight-management' },
  { name: 'Sports Nutrition', url: 'https://tropicanawholesale.co.uk/collections/sports-nutrition' },
  { name: 'Health & Wellness', url: 'https://tropicanawholesale.co.uk/collections/health-wellness' },
  { name: 'Protein Bars', url: 'https://tropicanawholesale.co.uk/collections/protein-bars' },
  { name: 'Energy Drinks', url: 'https://tropicanawholesale.co.uk/collections/energy-drinks' }
];

async function scrapeTropicana() {
  console.log('🚀 Starting Tropicana Wholesale Public Scraper...\n');
  
  let browser: Browser | null = null;
  
  try {
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });
    
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 });
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    );
    
    console.log('✅ Browser ready\n');
    
    const allProducts: ScrapedProduct[] = [];
    
    // Scrape each category
    for (const category of CATEGORIES) {
      console.log(`📦 Scraping: ${category.name}`);
      console.log(`   URL: ${category.url}`);
      
      try {
        await page.goto(category.url, {
          waitUntil: 'networkidle2',
          timeout: 30000
        });
        
        // Wait for products
        await page.waitForSelector('.product-item, .product-card, .grid-product, [class*="product"]', {
          timeout: 10000
        });
        
        await delay(2000);
        
        // Extract products
        const products = await page.evaluate((categoryName) => {
          const productEls = document.querySelectorAll('.product-item, .product-card, .grid-product, [data-product-id]');
          const products: any[] = [];
          
          productEls.forEach((el) => {
            try {
              const nameEl = el.querySelector('.product-title, .product-name, h3, h4, .title, [class*="title"]');
              const priceEl = el.querySelector('.price, .product-price, .money, [data-price], [class*="price"]');
              const imgEl = el.querySelector('img');
              
              const name = nameEl ? nameEl.textContent?.trim() : '';
              const priceText = priceEl ? priceEl.textContent?.trim() : '';
              const price = priceText.match(/[\d.]+/) ? parseFloat(priceText.match(/[\d.]+/)![0]) : 0;
              const image = imgEl ? imgEl.src || imgEl.getAttribute('data-src') || '' : '';
              
              // Check if in stock
              const bodyText = el.textContent?.toLowerCase() || '';
              const inStock = !bodyText.includes('sold out') && !bodyText.includes('out of stock');
              
              if (name && price > 0) {
                products.push({
                  name,
                  price,
                  image,
                  category: categoryName,
                  brand: 'Tropicana Wholesale',
                  inStock
                });
              }
            } catch (e) {
              // Skip invalid products
            }
          });
          
          return products;
        }, category.name);
        
        console.log(`   ✓ Found ${products.length} products`);
        allProducts.push(...products);
        
        await delay(1000);
        
      } catch (error) {
        console.error(`   ✗ Error: ${error}`);
      }
    }
    
    console.log(`\n📊 Total products scraped: ${allProducts.length}`);
    
    // Save to database
    if (allProducts.length > 0) {
      console.log('\n💾 Saving to database...');
      await saveToDatabase(allProducts);
    }
    
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
      console.log('✅ Browser closed');
    }
  }
}

async function saveToDatabase(products: ScrapedProduct[]) {
  const connection = await Database.getConnection();
  
  try {
    let created = 0;
    let updated = 0;
    let skipped = 0;
    
    for (const product of products) {
      try {
        const wholesalePrice = product.price;
        const retailPrice = wholesalePrice * 1.35; // 35% margin
        const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
        const sku = `TROP-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`.toUpperCase();
        
        // Check if exists
        const [existing] = await connection.execute(
          'SELECT id FROM products WHERE name = ? OR slug = ?',
          [product.name, slug]
        );
        
        if ((existing as any[]).length > 0) {
          // Update
          await connection.execute(`
            UPDATE products SET
              price = ?,
              cost_price = ?,
              category = ?,
              brand = ?,
              image_url = ?,
              in_stock = ?,
              updated_at = CURRENT_TIMESTAMP
            WHERE slug = ?
          `, [
            retailPrice,
            wholesalePrice,
            product.category,
            product.brand,
            product.image,
            product.inStock ? 1 : 0,
            slug
          ]);
          updated++;
        } else {
          // Create
          await connection.execute(`
            INSERT INTO products (
              sku, name, slug, price, cost_price, compare_at_price,
              category, brand, image_url, images, in_stock, active,
              description, meta_title, meta_description, keywords
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
          `, [
            sku,
            product.name,
            slug,
            retailPrice,
            wholesalePrice,
            retailPrice * 1.2,
            product.category,
            product.brand,
            product.image,
            JSON.stringify([product.image]),
            product.inStock ? 1 : 0,
            `${product.name} - Premium quality from ${product.brand}. Shop now at Muscle Sports UK.`,
            `${product.name} - ${product.brand} | Muscle Sports UK`,
            `Buy ${product.name} from ${product.brand}. High-quality supplements at competitive prices. Free UK shipping on orders over £50.`,
            `${product.name.toLowerCase()}, ${product.category.toLowerCase()}, ${product.brand.toLowerCase()}, supplements, muscle sports`
          ]);
          created++;
        }
        
      } catch (error) {
        console.error(`  ✗ Error saving ${product.name}:`, error);
        skipped++;
      }
    }
    
    console.log(`\n✅ Database sync complete!`);
    console.log(`   📊 Created: ${created}`);
    console.log(`   📊 Updated: ${updated}`);
    console.log(`   📊 Skipped: ${skipped}`);
    
  } finally {
    connection.release();
  }
}

// Run if called directly
if (require.main === module) {
  scrapeTropicana()
    .then(() => {
      console.log('\n🎉 Sync complete!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Sync failed:', error);
      process.exit(1);
    });
}

export { scrapeTropicana };
