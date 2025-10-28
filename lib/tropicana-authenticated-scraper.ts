/**
 * Advanced Tropicana Wholesale Authenticated Scraper
 * Logs in, scrapes all products with stock levels, and syncs to database
 * Built to work until TROPSHIP API is ready
 */

import type { Browser, Page } from 'puppeteer';
import { Database } from './database';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Use puppeteer-extra with stealth to reduce bot detection
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer-extra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

dotenv.config({ path: '.env.local' });

// Helper function to replace waitForTimeout
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const jitter = (min = 150, max = 450) => delay(Math.floor(Math.random() * (max - min + 1)) + min);
async function gentleScroll(page: Page) {
  try {
    await page.evaluate(async () => {
      await new Promise<void>((resolve) => {
        const distance = 300;
        const delay = 150;
        const timer = setInterval(() => {
          const { scrollY, innerHeight } = window;
          const maxY = document.body.scrollHeight - innerHeight;
          window.scrollBy(0, distance);
          if (scrollY >= maxY) {
            clearInterval(timer);
            resolve();
          }
        }, delay);
      });
    });
  } catch {}
}

interface ScrapedProduct {
  handle: string;
  name: string;
  sku: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  stockQuantity?: number;
  brand?: string;
  category?: string;
  description?: string;
  images: string[];
  variants?: Array<{
    name: string;
    sku: string;
    price: number;
    inStock: boolean;
    stockQuantity?: number;
  }>;
  tags?: string[];
  weight?: string;
  barcode?: string;
  flavours?: string[];
  sizes?: string[];
}

export class TropicanaAuthenticatedScraper {
  private browser: Browser | null = null;
  private page: Page | null = null;
  private isLoggedIn = false;
  private readonly sessionDir = path.resolve('.puppeteer');
  private readonly cookiesPath = path.join(this.sessionDir, 'tropicana-cookies.json');
  private readonly storagePath = path.join(this.sessionDir, 'tropicana-storage.json');
  
  private credentials = {
    email: process.env.TROPICANA_EMAIL || 'johncroston@myyahoo.com',
    password: process.env.TROPICANA_PASSWORD || 'Wholesale123',
    baseUrl: 'https://www.tropicanawholesale.com'
  };

  private settings = {
    headless: (process.env.PUPPETEER_HEADLESS || 'true') === 'true',
    slowMo: 0,
    timeout: 90000, // Increase to 90 seconds
    maxProducts: 10000,
    minMarginPercent: 35, // 35% minimum markup
    categoriesOfInterest: [
      'protein', 'pre-workout', 'post-workout', 'creatine', 'amino-acids',
      'bcaa', 'weight-loss', 'fat-burner', 'weight-gainer', 'mass-gainer',
      'vitamins', 'minerals', 'supplements', 'bars', 'snacks', 'drinks',
      'energy', 'recovery', 'joint-support', 'testosterone', 'cbd'
    ]
  };

  /**
   * Initialize browser and authenticate
   */
  async initialize(): Promise<boolean> {
    try {
      console.log('🚀 Starting Tropicana Scraper...');
      
  const launchArgs = [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--disable-gpu',
        '--window-size=1400,900',
      ];
  // Support rotating proxies via PROXY_LIST or single PROXY_SERVER
  const proxyList = process.env.PROXY_LIST?.split(',').map(s => s.trim()).filter(Boolean) || [];
  const proxy = proxyList.length ? proxyList[Math.floor(Math.random() * proxyList.length)] : (process.env.PROXY_SERVER || '');
  if (proxy) launchArgs.push(`--proxy-server=${proxy}`);

      this.browser = await puppeteer.launch({
        headless: this.settings.headless,
        slowMo: this.settings.slowMo,
        ignoreHTTPSErrors: true,
        args: launchArgs
      });

  this.page = await (this.browser as Browser).newPage();
      // Basic request slimming (avoid analytics/trackers)
      try {
        await this.page.setRequestInterception(true);
        const blockedHosts = [
          'google-analytics.com',
          'googletagmanager.com',
          'doubleclick.net',
          'hotjar.com',
          'clarity.ms',
          'sentry.io'
        ];
        this.page.on('request', (req) => {
          const url = req.url();
          const type = req.resourceType();
          if (blockedHosts.some(h => url.includes(h)) || ['font', 'media'].includes(type)) {
            return req.abort();
          }
          return req.continue();
        });
      } catch {}
      
      // Set viewport and user agent
  await this.page.setViewport({ width: 1366 + Math.floor(Math.random()*200), height: 800 + Math.floor(Math.random()*200) });
      const userAgents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
      ];
      const ua = userAgents[Math.floor(Math.random() * userAgents.length)];
      await this.page.setUserAgent(ua);

      // Set extra headers
      await this.page.setExtraHTTPHeaders({
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      });

      console.log('✅ Browser initialized');
      
      // Try reuse saved session first
  const reused = await this.tryReuseSession();
      if (reused) {
        console.log('🔁 Reused existing session successfully.');
        this.isLoggedIn = true;
        return true;
      }

      // Authenticate via form as fallback
      return await this.login();
    } catch (error) {
      console.error('❌ Failed to initialize:', error);
      return false;
    }
  }

  /**
   * Attempt to reuse a previously saved login session
   */
  private async tryReuseSession(): Promise<boolean> {
    if (!this.page) return false;
    try {
      if (!fs.existsSync(this.cookiesPath) || !fs.existsSync(this.storagePath)) {
        return false;
      }

      const cookies = JSON.parse(fs.readFileSync(this.cookiesPath, 'utf-8'));
      if (Array.isArray(cookies) && cookies.length) {
        await this.page.setCookie(...cookies);
      }

      // Navigate to base before setting localStorage
      await this.page.goto(this.credentials.baseUrl, { waitUntil: 'domcontentloaded', timeout: this.settings.timeout });
      const storageRaw = JSON.parse(fs.readFileSync(this.storagePath, 'utf-8'));
      const ls = storageRaw?.localStorage || {};
      await this.page.evaluate((entries) => {
        try {
          for (const [k, v] of Object.entries(entries)) {
            localStorage.setItem(k, String(v));
          }
        } catch {}
      }, ls);
      await delay(500);

      // Check account page
      await this.page.goto(`${this.credentials.baseUrl}/account`, { waitUntil: 'domcontentloaded', timeout: this.settings.timeout });
      await delay(1000);
      const url = this.page.url();
      if (url.includes('/account/login')) {
        return false;
      }
      // Heuristic: look for logout or account name
      const hasAccount = await this.page.evaluate(() => !!document.body.innerText.match(/account|orders|addresses|logout/i));
      return !!hasAccount;
    } catch (e) {
      return false;
    }
  }

  /**
   * Login to Tropicana Wholesale
   */
  private async login(): Promise<boolean> {
    if (!this.page) return false;

    try {
      console.log('🔐 Logging in to Tropicana Wholesale...');
      
      const loginUrl = `${this.credentials.baseUrl}/account/login`;
      console.log(`   Navigating to ${loginUrl}`);
      
      // Try with a very relaxed wait condition
      // Retry navigation with backoff
      const navAttempts = 3;
      for (let attempt=1; attempt<=navAttempts; attempt++){
        try {
          await this.page.goto(loginUrl, { waitUntil: 'load', timeout: 90000 });
          break;
        } catch (e) {
          if (attempt === navAttempts) throw e;
          const backoff = 1000 * attempt;
          console.log(`   Navigation failed (attempt ${attempt}/${navAttempts}). Backing off ${backoff}ms`);
          await delay(backoff);
        }
      }

  console.log('   Page loaded, waiting with jitter...');
  await delay(1500 + Math.floor(Math.random()*1200));
  await gentleScroll(this.page);

      console.log('   Looking for form...');

      // Wait for login form with shorter timeout
      try {
        await this.page.waitForSelector('form', { timeout: 5000 });
        console.log('   Form found');
      } catch (e) {
        console.log('   ⚠️  Form selector timed out, trying alternative approach');
      }

      // Find and fill email field
      const emailSelectors = [
        '#CustomerEmail',
        'input[name="customer[email]"]',
        'input[type="email"]',
        'input[name="email"]',
        '#customer_email'
      ];

      let emailFilled = false;
      for (const selector of emailSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            console.log(`   Filling email with selector: ${selector}`);
            await this.page.type(selector, this.credentials.email, { delay: 30 + Math.floor(Math.random()*40) });
            emailFilled = true;
            console.log(`   ✓ Email entered`);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!emailFilled) {
        throw new Error('Could not find email input field');
      }

      // Find and fill password field
      const passwordSelectors = [
        '#CustomerPassword',
        'input[name="customer[password]"]',
        'input[type="password"]',
        'input[name="password"]',
        '#customer_password'
      ];

      let passwordFilled = false;
      for (const selector of passwordSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            console.log(`   Filling password with selector: ${selector}`);
            await this.page.type(selector, this.credentials.password, { delay: 30 + Math.floor(Math.random()*40) });
            passwordFilled = true;
            console.log(`   ✓ Password entered`);
            break;
          }
        } catch (e) {
          continue;
        }
      }

      if (!passwordFilled) {
        throw new Error('Could not find password input field');
      }

  await jitter();

      // Submit form
      console.log('   Submitting form...');
      const submitSelectors = [
        'button[type="submit"]',
        'input[type="submit"]',
        'form button',
        '.btn-primary',
        '[type="submit"]'
      ];

      let submitted = false;
      for (const selector of submitSelectors) {
        try {
          const element = await this.page.$(selector);
          if (element) {
            console.log(`   Clicking submit: ${selector}`);
            // Don't wait for navigation, just click and handle separately
            await this.page.hover(selector);
            await jitter();
            await this.page.click(selector, { delay: 20 + Math.floor(Math.random()*30) });
            console.log('   Form submitted, waiting for response...');
            
            // Wait for navigation with generous timeout
            try {
              await this.page.waitForNavigation({ 
                waitUntil: 'load', 
                timeout: 90000 
              });
            } catch (navError) {
              console.log('   Navigation wait timed out, checking current page...');
            }
            
            submitted = true;
            break;
          }
        } catch (e) {
          const error = e as Error;
          console.log(`   Failed with selector ${selector}:`, error.message);
          continue;
        }
      }

      if (!submitted) {
        throw new Error('Could not submit login form');
      }

      // Verify login success
  await delay(1500 + Math.floor(Math.random()*1500));
      const currentUrl = this.page.url();
      console.log(`   Current URL after submit: ${currentUrl}`);
      
      // Check if we're logged in (not on login page anymore)
      if (currentUrl.includes('/account/login')) {
        // Check for error messages
        const errorText = await this.page.evaluate(() => {
          const errors = document.querySelectorAll('.errors, .error, [class*="error"]');
          return Array.from(errors).map(e => e.textContent).join(' ');
        });
        throw new Error(`Login failed: ${errorText || 'Invalid credentials'}`);
      }

      this.isLoggedIn = true;
      console.log('✅ Successfully logged in!');
      console.log(`📍 Current URL: ${currentUrl}`);
      
      return true;
    } catch (error) {
      console.error('❌ Login failed:', error);
      this.isLoggedIn = false;
      return false;
    }
  }

  /**
   * Scrape all products from all collections
   */
  async scrapeAllProducts(): Promise<ScrapedProduct[]> {
    if (!this.isLoggedIn || !this.page) {
      console.error('❌ Not logged in!');
      return [];
    }

    try {
      console.log('🔍 Discovering collections...');
      const collections = await this.discoverCollections();
      console.log(`✅ Found ${collections.length} collections`);

      const allProducts: ScrapedProduct[] = [];
      const seenHandles = new Set<string>();

      for (let i = 0; i < collections.length; i++) {
        const collection = collections[i];
        console.log(`\n📦 Scraping collection ${i + 1}/${collections.length}: ${collection.name}`);
        console.log(`🔗 ${collection.url}`);

        try {
          const products = await this.scrapeCollection(collection.url);
          
          // Deduplicate
          for (const product of products) {
            if (!seenHandles.has(product.handle)) {
              seenHandles.add(product.handle);
              allProducts.push(product);
            }
          }

          console.log(`✓ Collection complete: ${products.length} products (${allProducts.length} total unique)`);
          
          // Don't overwhelm the server
          await delay(1000);

          // Safety limit
          if (allProducts.length >= this.settings.maxProducts) {
            console.log(`⚠️ Reached maximum product limit (${this.settings.maxProducts})`);
            break;
          }
        } catch (error) {
          console.error(`❌ Error scraping collection ${collection.name}:`, error);
          continue;
        }
      }

      console.log(`\n✅ Scraping complete! Found ${allProducts.length} unique products`);
      return allProducts;
    } catch (error) {
      console.error('❌ Error scraping products:', error);
      return [];
    }
  }

  /**
   * Discover all available collections
   */
  private async discoverCollections(): Promise<Array<{ name: string; url: string }>> {
    if (!this.page) return [];

    try {
      // Try to find collections/catalog page
      const collectionsUrl = `${this.credentials.baseUrl}/collections`;
      await this.page.goto(collectionsUrl, { 
        waitUntil: 'networkidle2', 
        timeout: this.settings.timeout 
      });

      await delay(2000);

      // Extract collection links
      const collections = await this.page.evaluate((baseUrl) => {
        const links: Array<{ name: string; url: string }> = [];
        const seenUrls = new Set<string>();

        // Find all links that might be collections
        const anchors = Array.from(document.querySelectorAll('a[href*="/collections/"]'));
        
        for (const anchor of anchors) {
          const href = (anchor as HTMLAnchorElement).href;
          const text = (anchor as HTMLElement).innerText.trim();
          
          if (href && !seenUrls.has(href) && !href.includes('?') && !href.includes('#')) {
            seenUrls.add(href);
            links.push({ 
              name: text || href.split('/').pop() || 'Unknown', 
              url: href 
            });
          }
        }

        return links;
      }, this.credentials.baseUrl);

      // Filter to relevant categories if specified
      const filtered = collections.filter(c => {
        const nameLower = c.name.toLowerCase();
        const urlLower = c.url.toLowerCase();
        return this.settings.categoriesOfInterest.some(cat => 
          nameLower.includes(cat) || urlLower.includes(cat)
        );
      });

      // If filtering removed everything, return all
      return filtered.length > 0 ? filtered : collections;
    } catch (error) {
      console.error('Error discovering collections:', error);
      
      // Fallback: return common supplement collection URLs
      const fallbackCollections = [
        'all', 'protein', 'pre-workout', 'post-workout', 'creatine',
        'amino-acids', 'bcaa', 'weight-loss', 'vitamins', 'supplements',
        'protein-bars', 'energy-drinks', 'recovery'
      ];

      return fallbackCollections.map(slug => ({
        name: slug.replace(/-/g, ' ').toUpperCase(),
        url: `${this.credentials.baseUrl}/collections/${slug}`
      }));
    }
  }

  /**
   * Scrape all products from a single collection
   */
  private async scrapeCollection(collectionUrl: string): Promise<ScrapedProduct[]> {
    if (!this.page) return [];

    const products: ScrapedProduct[] = [];
    let currentPage = 1;
    let hasMorePages = true;

    while (hasMorePages && products.length < this.settings.maxProducts) {
      try {
        const pageUrl = currentPage === 1 
          ? collectionUrl 
          : `${collectionUrl}?page=${currentPage}`;

        // Retry navigation per-page
        const tries = 3;
        for (let i=1; i<=tries; i++){
          try {
            await this.page.goto(pageUrl, { waitUntil: 'networkidle2', timeout: this.settings.timeout });
            break;
          } catch (e) {
            if (i === tries) throw e;
            const back = 500 * i;
            console.log(`    Page nav failed (try ${i}/${tries}) backing off ${back}ms`);
            await delay(back);
          }
        }

        await delay(1500);
        await gentleScroll(this.page);

        // Extract products from current page
        const pageProducts = await this.page.evaluate(() => {
          const products: any[] = [];

          // Find product cards with various selectors
          const selectors = [
            '.product-item',
            '.product-card',
            '.grid-product',
            '[data-product-id]',
            '.product',
            'article[data-product]',
            '.collection-product'
          ];

          let productElements: Element[] = [];
          for (const selector of selectors) {
            const found = Array.from(document.querySelectorAll(selector));
            if (found.length > 0) {
              productElements = found;
              break;
            }
          }

          for (const element of productElements) {
            try {
              // Extract product data
              const titleEl = element.querySelector('.product-title, .product-name, h3, h2, .title, a[href*="/products/"]');
              const linkEl = element.querySelector('a[href*="/products/"]') || titleEl;
              const priceEl = element.querySelector('.price, .product-price, .money, [data-price]');
              const imgEl = element.querySelector('img');

              if (!linkEl) continue;

              const link = (linkEl as HTMLAnchorElement).href;
              const handle = link.split('/products/')[1]?.split('?')[0]?.split('#')[0] || '';
              const name = titleEl ? (titleEl as HTMLElement).innerText.trim() : '';
              const priceText = priceEl ? (priceEl as HTMLElement).innerText.trim() : '';
              
              // Parse price
              const priceMatch = priceText.replace(/,/g, '').match(/[\d.]+/);
              const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

              // Get image
              let image = '';
              if (imgEl) {
                image = (imgEl as HTMLImageElement).src || 
                        (imgEl as HTMLImageElement).getAttribute('data-src') || 
                        (imgEl as HTMLImageElement).getAttribute('data-original') || '';
              }

              // Check stock status from text
              const elementText = element.textContent?.toLowerCase() || '';
              const inStock = !(/out of stock|sold out|unavailable/i.test(elementText));

              if (handle && name) {
                products.push({
                  handle,
                  name,
                  price,
                  link,
                  image,
                  inStock
                });
              }
            } catch (e) {
              console.error('Error parsing product element:', e);
            }
          }

          return products;
        });

        console.log(`  Page ${currentPage}: Found ${pageProducts.length} products`);

        // Visit each product page for detailed info
        for (const basicProduct of pageProducts) {
          try {
            const detailedProduct = await this.scrapeProductPage(basicProduct.link);
            if (detailedProduct) {
              products.push(detailedProduct);
            }
            
            // Small delay between product pages
            await delay(300);
          } catch (error) {
            console.error(`  Error scraping product ${basicProduct.name}:`, error);
            
            // Add basic product info even if detailed scrape fails
            products.push({
              handle: basicProduct.handle,
              name: basicProduct.name,
              sku: basicProduct.handle,
              price: basicProduct.price,
              inStock: basicProduct.inStock,
              images: basicProduct.image ? [basicProduct.image] : []
            });
          }
        }

        // Check if there's a next page
        hasMorePages = await this.page.evaluate(() => {
          const nextLink = document.querySelector('a[rel="next"], .pagination a.next, a[aria-label*="Next"]');
          return !!nextLink;
        });

        if (!hasMorePages || pageProducts.length === 0) {
          break;
        }

        currentPage++;
      } catch (error) {
        console.error(`Error on page ${currentPage}:`, error);
        hasMorePages = false;
      }
    }

    return products;
  }

  /**
   * Scrape detailed product information from product page
   */
  private async scrapeProductPage(url: string): Promise<ScrapedProduct | null> {
    if (!this.page) return null;

    try {
      await this.page.goto(url, { 
        waitUntil: 'networkidle2', 
        timeout: this.settings.timeout 
      });

      await delay(1000);

      const productData = await this.page.evaluate(() => {
        // Extract product information
        const titleEl = document.querySelector('h1, .product-title, .product-name, [itemprop="name"]');
        const name = titleEl ? (titleEl as HTMLElement).innerText.trim() : '';

        // Get price
        const priceEl = document.querySelector('.price, .product-price, .money, [itemprop="price"]');
        const priceText = priceEl ? (priceEl as HTMLElement).innerText.trim() : '';
        const priceMatch = priceText.replace(/,/g, '').match(/[\d.]+/);
        const price = priceMatch ? parseFloat(priceMatch[0]) : 0;

        // Get compare at price (RRP)
        const compareEl = document.querySelector('.compare-at-price, .was-price, [class*="original"]');
        const compareText = compareEl ? (compareEl as HTMLElement).innerText.trim() : '';
        const compareMatch = compareText.replace(/,/g, '').match(/[\d.]+/);
        const compareAtPrice = compareMatch ? parseFloat(compareMatch[0]) : undefined;

        // Get description
        const descEl = document.querySelector('.product-description, .description, [itemprop="description"]');
        const description = descEl ? (descEl as HTMLElement).innerText.trim() : '';

        // Get images
        const images: string[] = [];
        const imgElements = document.querySelectorAll('.product-image img, .product-gallery img, [class*="product"] img');
        imgElements.forEach(img => {
          const src = (img as HTMLImageElement).src || 
                     (img as HTMLImageElement).getAttribute('data-src') || 
                     (img as HTMLImageElement).getAttribute('data-original');
          if (src && !src.includes('placeholder') && !images.includes(src)) {
            images.push(src);
          }
        });

        // Check stock status
        const bodyText = document.body.textContent?.toLowerCase() || '';
        const inStock = !(/out of stock|sold out|unavailable|notify.*when.*available/i.test(bodyText));

        // Try to extract stock quantity if visible
        let stockQuantity: number | undefined;
        const stockMatch = bodyText.match(/(\d+)\s*(in stock|available|left|remaining)/i);
        if (stockMatch) {
          stockQuantity = parseInt(stockMatch[1]);
        }

        // Get SKU
        let sku = '';
        const skuEl = document.querySelector('[class*="sku"], .product-sku, [itemprop="sku"]');
        if (skuEl) {
          sku = (skuEl as HTMLElement).innerText.trim().replace(/SKU:?\s*/i, '');
        }

        // Get brand
        let brand = '';
        const brandEl = document.querySelector('[class*="brand"], .product-brand, [itemprop="brand"]');
        if (brandEl) {
          brand = (brandEl as HTMLElement).innerText.trim();
        }

        // Get weight
        let weight = '';
        const weightMatch = bodyText.match(/(\d+(?:\.\d+)?)\s*(kg|g|lb|oz)/i);
        if (weightMatch) {
          weight = weightMatch[0];
        }

        // Get tags/categories
        const tags: string[] = [];
        const tagElements = document.querySelectorAll('.product-tag, .tag, [class*="category"]');
        tagElements.forEach(tag => {
          const text = (tag as HTMLElement).innerText.trim();
          if (text && !tags.includes(text)) {
            tags.push(text);
          }
        });

        // Extract variants (flavours, sizes, etc.)
        const variants: Array<{
          name: string;
          sku: string;
          price: number;
          inStock: boolean;
          stockQuantity?: number;
          type: string;
        }> = [];
        
        // Look for variant selectors (flavour/size dropdowns or buttons)
        const variantSelectors = document.querySelectorAll(
          'select[name*="variant"], select[id*="variant"], select[name*="option"], ' +
          '.variant-selector, .product-options select, .product-form__input select, ' +
          '[data-option-selector]'
        );
        
        variantSelectors.forEach(selector => {
          const selectEl = selector as HTMLSelectElement;
          const variantType = selectEl.name || selectEl.id || 'variant';
          const variantLabel = selectEl.previousElementSibling?.textContent?.trim() || 
                              selectEl.closest('label')?.textContent?.trim() || 
                              variantType;
          
          // Determine if this is flavour or size
          const isSize = /size|weight|quantity|amount|servings/i.test(variantLabel);
          const isFlavour = /flavour|flavor|taste|colour|color/i.test(variantLabel);
          const type = isSize ? 'size' : isFlavour ? 'flavour' : 'variant';
          
          Array.from(selectEl.options).forEach(option => {
            if (option.value && option.text && option.text !== 'Select' && option.text !== 'Choose') {
              const optionText = option.text.trim();
              const optionValue = option.value;
              const isAvailable = !option.disabled && !option.text.toLowerCase().includes('out of stock');
              
              variants.push({
                name: optionText,
                sku: optionValue,
                price: price, // Will be same as main price unless specified
                inStock: isAvailable,
                type: type
              });
            }
          });
        });
        
        // Also look for variant buttons/swatches
        const variantButtons = document.querySelectorAll(
          '.variant-button, .swatch, .option-value, [data-variant-option], ' +
          '.product-form__option-value, .variant-input'
        );
        
        variantButtons.forEach(button => {
          const value = button.textContent?.trim() || 
                       (button as HTMLElement).getAttribute('data-value') ||
                       (button as HTMLElement).getAttribute('value');
          
          if (value && value !== 'Select') {
            const container = button.closest('[class*="option"], [class*="variant"]');
            const label = container?.querySelector('label, .label, .option-label')?.textContent?.trim() || '';
            const isSize = /size|weight|quantity/i.test(label);
            const isFlavour = /flavour|flavor|taste|colour/i.test(label);
            const type = isSize ? 'size' : isFlavour ? 'flavour' : 'variant';
            const isAvailable = !button.classList.contains('disabled') && 
                               !button.classList.contains('unavailable') &&
                               !button.hasAttribute('disabled');
            
            variants.push({
              name: value,
              sku: value.toLowerCase().replace(/\s+/g, '-'),
              price: price,
              inStock: isAvailable,
              type: type
            });
          }
        });

        return {
          name,
          sku,
          price,
          compareAtPrice,
          inStock,
          stockQuantity,
          brand,
          description,
          images,
          tags,
          weight,
          variants: variants.length > 0 ? variants : undefined
        };
      });

      const handle = url.split('/products/')[1]?.split('?')[0]?.split('#')[0] || '';

      // Process variants and extract flavours/sizes
      const flavours: string[] = [];
      const sizes: string[] = [];
      const variants = productData.variants || [];
      
      variants.forEach((v: any) => {
        if (v.type === 'flavour' && !flavours.includes(v.name)) {
          flavours.push(v.name);
        } else if (v.type === 'size' && !sizes.includes(v.name)) {
          sizes.push(v.name);
        }
      });

      return {
        handle,
        name: productData.name,
        sku: productData.sku || handle,
        price: productData.price,
        compareAtPrice: productData.compareAtPrice,
        inStock: productData.inStock,
        stockQuantity: productData.stockQuantity,
        brand: productData.brand,
        description: productData.description,
        images: productData.images,
        tags: productData.tags,
        weight: productData.weight,
        variants: productData.variants,
        flavours: flavours.length > 0 ? flavours : undefined,
        sizes: sizes.length > 0 ? sizes : undefined
      };
    } catch (error) {
      console.error('Error scraping product page:', error);
      return null;
    }
  }

  /**
   * Sync scraped products to database
   */
  async syncToDatabase(products: ScrapedProduct[]): Promise<void> {
    console.log(`\n💾 Syncing ${products.length} products to database...`);

    const connection = await Database.getConnection();
    
    try {
      let created = 0;
      let updated = 0;
      let skipped = 0;

      for (const product of products) {
        try {
          // Calculate retail price with margin
          const wholesalePrice = product.price;
          const margin = this.settings.minMarginPercent;
          const retailPrice = wholesalePrice * (1 + margin / 100);

          // Check if product already exists
          const [existing] = await connection.execute(
            'SELECT id, retail_price FROM tropicana_products WHERE sku = ? OR handle = ?',
            [product.sku, product.handle]
          );

          const existingProduct = (existing as any[])[0];

          if (existingProduct) {
            // Update existing product
            await connection.execute(`
              UPDATE tropicana_products SET
                name = ?,
                wholesale_price = ?,
                retail_price = ?,
                margin = ?,
                description = ?,
                images = ?,
                in_stock = ?,
                stock_quantity = ?,
                brand = ?,
                weight = ?,
                compare_at_price = ?,
                tags = ?,
                flavours = ?,
                strengths = ?,
                last_synced = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
              WHERE id = ?
            `, [
              product.name,
              wholesalePrice,
              retailPrice,
              margin,
              product.description || '',
              JSON.stringify(product.images),
              product.inStock ? 1 : 0,
              product.stockQuantity || null,
              product.brand || '',
              product.weight || '',
              product.compareAtPrice || null,
              JSON.stringify(product.tags || []),
              JSON.stringify(product.flavours || []),
              JSON.stringify(product.sizes || []),
              existingProduct.id
            ]);
            updated++;
          } else {
            // Create new product
            const id = this.generateId();
            await connection.execute(`
              INSERT INTO tropicana_products (
                id, handle, sku, name, wholesale_price, retail_price, margin,
                description, images, in_stock, stock_quantity, brand, weight,
                compare_at_price, tags, flavours, strengths, active, last_synced
              ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [
              id,
              product.handle,
              product.sku,
              product.name,
              wholesalePrice,
              retailPrice,
              margin,
              product.description || '',
              JSON.stringify(product.images),
              product.inStock ? 1 : 0,
              product.stockQuantity || null,
              product.brand || '',
              product.weight || '',
              product.compareAtPrice || null,
              JSON.stringify(product.tags || []),
              JSON.stringify(product.flavours || []),
              JSON.stringify(product.sizes || []),
              1 // active by default
            ]);
            created++;
          }
        } catch (error) {
          console.error(`Error syncing product ${product.name}:`, error);
          skipped++;
        }
      }

      console.log(`✅ Sync complete!`);
      console.log(`   📊 Created: ${created}`);
      console.log(`   📊 Updated: ${updated}`);
      console.log(`   📊 Skipped: ${skipped}`);
    } finally {
      connection.release();
    }
  }

  /**
   * Close browser
   */
  async close(): Promise<void> {
    try {
      if (this.page) {
        await this.page.close();
        this.page = null;
      }
      if (this.browser) {
        await this.browser.close();
        this.browser = null;
      }
      console.log('✅ Browser closed');
    } catch (error) {
      console.error('Error closing browser:', error);
    }
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }
}

/**
 * Main execution function
 */
export async function runTropicanaSync(): Promise<void> {
  const scraper = new TropicanaAuthenticatedScraper();

  try {
    // Initialize and login
    const initialized = await scraper.initialize();
    if (!initialized) {
      throw new Error('Failed to initialize scraper');
    }

    // Scrape all products
    const products = await scraper.scrapeAllProducts();
    
    if (products.length === 0) {
      console.log('⚠️ No products found!');
      return;
    }

    // Sync to database
    await scraper.syncToDatabase(products);

    console.log('\n🎉 Tropicana sync completed successfully!');
  } catch (error) {
    console.error('❌ Sync failed:', error);
    throw error;
  } finally {
    await scraper.close();
  }
}
