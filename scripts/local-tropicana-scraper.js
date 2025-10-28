#!/usr/bin/env node
/**
 * LOCAL Tropicana Scraper (run from your dev machine, not server)
 * Plain JavaScript version - no TypeScript compilation needed
 * 
 * Usage: node scripts/local-tropicana-scraper.js
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

// Use puppeteer-extra with stealth
const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const OUTPUT_DIR = path.resolve('data/tropicana-scraped');
const SESSION_DIR = path.resolve('.puppeteer');
const COOKIES_PATH = path.join(SESSION_DIR, 'tropicana-cookies.json');
const STORAGE_PATH = path.join(SESSION_DIR, 'tropicana-storage.json');

const BASE_URL = 'https://www.tropicanawholesale.com';
const API_ENDPOINT = `${BASE_URL}/Services/ProductDetails.asmx/GetProductDetailsByCode`;

function ensureDirs() {
  for (const dir of [OUTPUT_DIR, SESSION_DIR]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }
}

async function saveSession(page) {
  const cookies = await page.cookies();
  const storage = await page.evaluate(() => {
    const ls = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k) ls[k] = localStorage.getItem(k) || '';
    }
    return { localStorage: ls };
  });
  fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(storage, null, 2));
  console.log('✅ Session saved');
}

async function loadSession(page) {
  try {
    if (!fs.existsSync(COOKIES_PATH)) return false;
    const cookies = JSON.parse(fs.readFileSync(COOKIES_PATH, 'utf-8'));
    if (Array.isArray(cookies) && cookies.length) {
      await page.setCookie(...cookies);
    }
    await page.goto(BASE_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const storageRaw = JSON.parse(fs.readFileSync(STORAGE_PATH, 'utf-8'));
    await page.evaluate((entries) => {
      for (const [k, v] of Object.entries(entries)) {
        localStorage.setItem(k, String(v));
      }
    }, storageRaw?.localStorage || {});
    
    // Verify login
    await page.goto(`${BASE_URL}/account`, { waitUntil: 'domcontentloaded', timeout: 60000 });
    const url = page.url();
    if (url.includes('/account/login')) return false;
    const hasAccount = await page.evaluate(() => !!document.body.innerText.match(/account|orders|logout/i));
    return !!hasAccount;
  } catch {
    return false;
  }
}

async function manualLogin(page) {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔐 MANUAL LOGIN REQUIRED');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('\nA browser window will open.');
  console.log('Please log in to your Tropicana account.');
  console.log('After login, return here and press Enter.\n');
  
  await page.goto(`${BASE_URL}/account/login`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  
  // Wait for user to press Enter
  await new Promise((resolve) => {
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    rl.question('Press Enter after you have logged in... ', () => {
      rl.close();
      resolve();
    });
  });
  
  await saveSession(page);
}

async function discoverAllSKUs(page) {
  console.log('\n🔍 Discovering all product SKUs...');
  
  // Go to collections page
  await page.goto(`${BASE_URL}/collections`, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await delay(2000);
  
  // Get all collection URLs
  const collections = await page.evaluate((base) => {
    const links = Array.from(document.querySelectorAll('a[href*="/collections/"]'));
    const urls = new Set();
    links.forEach((a) => {
      const href = a.href;
      if (href && !href.includes('?') && !href.includes('#')) {
        urls.add(href);
      }
    });
    return Array.from(urls);
  }, BASE_URL);
  
  console.log(`   Found ${collections.length} collections`);
  
  const allSkus = new Set();
  
  for (let i = 0; i < collections.length; i++) {
    const collUrl = collections[i];
    console.log(`   [${i + 1}/${collections.length}] ${collUrl}`);
    
    try {
      await page.goto(collUrl, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await delay(1500);
      
      const skus = await page.evaluate(() => {
        const productLinks = Array.from(document.querySelectorAll('a[href*="/products/"]'));
        return productLinks.map((a) => {
          const match = a.href.match(/\/products\/([^?#/]+)/);
          return match ? match[1] : null;
        }).filter(Boolean);
      });
      
      skus.forEach((sku) => allSkus.add(sku));
      console.log(`      → ${skus.length} products`);
    } catch (e) {
      console.log(`      ⚠️  Failed: ${e.message}`);
    }
  }
  
  console.log(`\n✅ Total unique SKUs discovered: ${allSkus.size}`);
  return Array.from(allSkus);
}

async function fetchProductViaAPI(sku, page) {
  try {
    // Use Tropicana's API (Fred's method)
    const response = await page.evaluate(async (apiUrl, productSku) => {
      try {
        const res = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8'
          },
          body: JSON.stringify({ ProductCode: productSku })
        });
        const text = await res.text();
        return { ok: res.ok, status: res.status, body: text };
      } catch (e) {
        return { ok: false, status: 0, body: e.toString() };
      }
    }, API_ENDPOINT, sku);
    
    if (!response.ok) {
      console.log(`      ⚠️  API returned ${response.status}`);
      return null;
    }
    
    // Parse XML response (ASP.NET Web Service returns XML)
    const match = response.body.match(/<string[^>]*>({.*})<\/string>/);
    if (!match) return null;
    
    const data = JSON.parse(match[1]);
    
    if (!data || !data.ProductCode) {
      return null;
    }
    
    // Map API response to our product format
    const wholesalePrice = parseFloat(data.TradePrice || data.Price || 0);
    const retailPrice = wholesalePrice * 1.35; // 35% margin
    
    return {
      sku: data.ProductCode,
      name: data.ProductName || sku,
      wholesale_price: wholesalePrice,
      retail_price: retailPrice,
      description: data.Description || '',
      images: data.ImageUrl ? [data.ImageUrl] : [],
      in_stock: data.StockLevel > 0,
      stock_quantity: data.StockLevel || 0,
      brand: data.Brand || '',
      category: data.Category || '',
      weight: data.Weight || '',
      barcode: data.Barcode || '',
      flavours: data.Flavours ? data.Flavours.split(',').map((s) => s.trim()) : [],
      sizes: data.Sizes ? data.Sizes.split(',').map((s) => s.trim()) : []
    };
  } catch (e) {
    console.log(`      ❌ Error: ${e.message}`);
    return null;
  }
}

async function main() {
  ensureDirs();
  
  console.log('╔══════════════════════════════════════════╗');
  console.log('║  TROPICANA LOCAL SCRAPER                ║');
  console.log('║  Run this on your dev machine           ║');
  console.log('╚══════════════════════════════════════════╝\n');
  
  const browser = await puppeteer.launch({
    headless: false, // Visible for manual login
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1400,900'
    ]
  });
  
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1400, height: 900 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36');
    
    // Try to reuse saved session
    console.log('🔁 Checking for saved session...');
    const sessionValid = await loadSession(page);
    
    if (!sessionValid) {
      await manualLogin(page);
    } else {
      console.log('✅ Session restored');
    }
    
    // Discover all SKUs
    const skus = await discoverAllSKUs(page);
    
    if (skus.length === 0) {
      console.log('❌ No SKUs found!');
      return;
    }
    
    // Save SKUs list
    fs.writeFileSync(path.join(OUTPUT_DIR, 'skus.txt'), skus.join('\n'));
    console.log(`📝 SKUs saved to ${OUTPUT_DIR}/skus.txt`);
    
    // Fetch product details via API
    console.log('\n📦 Fetching product details...');
    const products = [];
    
    for (let i = 0; i < skus.length; i++) {
      const sku = skus[i];
      console.log(`   [${i + 1}/${skus.length}] ${sku}`);
      
      const product = await fetchProductViaAPI(sku, page);
      if (product) {
        products.push(product);
        console.log(`      ✓ ${product.name} - £${product.wholesale_price}`);
      }
      
      // Rate limit
      await delay(200);
    }
    
    // Save products
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputFile = path.join(OUTPUT_DIR, `products-${timestamp}.json`);
    fs.writeFileSync(outputFile, JSON.stringify(products, null, 2));
    
    console.log(`\n✅ Scraped ${products.length} products`);
    console.log(`📄 Saved to: ${outputFile}`);
    console.log('\n📤 Next step: Upload this file to your server and import it');
    console.log('\nUpload command:');
    console.log(`scp "${outputFile}" root@musclesports.co.uk:/var/www/html-musclesports/data/tropicana-scraped/`);
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

main().catch(console.error);
