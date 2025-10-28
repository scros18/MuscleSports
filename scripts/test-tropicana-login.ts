#!/usr/bin/env tsx
/**
 * Test Tropicana Login - Debug Version with Stealth
 */

import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Use puppeteer-extra with stealth
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer-extra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function testLogin() {
  console.log('🧪 Testing Tropicana Login with Stealth...\n');
  
  // First, test basic connectivity
  console.log('🌐 Testing network connectivity...');
  try {
    const https = require('https');
    await new Promise((resolve, reject) => {
      https.get('https://www.tropicanawholesale.com', (res: any) => {
        console.log(`✅ Server responded: ${res.statusCode}`);
        resolve(true);
      }).on('error', reject).setTimeout(10000, () => reject(new Error('Connection timeout')));
    });
  } catch (e: any) {
    console.error('❌ Cannot reach Tropicana server:', e.message);
    console.log('Trying alternative URL check...');
  }
  
  const browser = await puppeteer.launch({
    headless: true,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--window-size=1400,900'
    ]
  });

  try {
    const page = await browser.newPage();
    
    // Set viewport and realistic user agent
    await page.setViewport({ width: 1400, height: 900 });
    const userAgents = [
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36',
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 13_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.1 Safari/605.1.15'
    ];
    await page.setUserAgent(userAgents[Math.floor(Math.random() * userAgents.length)]);

    // Hide webdriver property
    await page.evaluateOnNewDocument(() => {
      Object.defineProperty(navigator, 'webdriver', {
        get: () => false,
      });
    });

    console.log('📡 Navigating to Tropicana Wholesale...');
    
    // Retry navigation with backoff
    const maxAttempts = 4;
    let lastError: any = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`   Attempt ${attempt}/${maxAttempts}...`);
        await page.goto('https://www.tropicanawholesale.com/account/login', { 
          waitUntil: 'domcontentloaded',
          timeout: 60000
        });
        console.log('✅ Page loaded');
        lastError = null;
        break;
      } catch (e: any) {
        lastError = e;
        console.log(`   ⚠️  Attempt ${attempt} failed: ${e.message}`);
        if (attempt < maxAttempts) {
          const backoff = 2000 * attempt;
          console.log(`   Waiting ${backoff}ms before retry...`);
          await delay(backoff);
        }
      }
    }
    
    if (lastError) {
      console.error('❌ All navigation attempts failed');
      console.log('\nTrying direct curl test...');
      const { exec } = require('child_process');
      await new Promise((resolve) => {
        exec('curl -sI https://www.tropicanawholesale.com | head -5', (err: any, stdout: string) => {
          console.log(stdout || 'No response');
          resolve(true);
        });
      });
      throw lastError;
    }
    
    await delay(2000);
    
    // Take screenshot
    await page.screenshot({ path: '/tmp/tropicana-login-page.png' });
    console.log('📸 Screenshot saved to /tmp/tropicana-login-page.png');

    // Get page HTML to inspect form
    const html = await page.content();
    console.log('\n🔍 Looking for form elements...');
    
    // Try to find all input fields
    const inputs = await page.$$eval('input', (elements: any) => 
      elements.map((el: any) => ({
        type: el.type,
        name: el.name,
        id: el.id,
        placeholder: el.placeholder
      }))
    );
    
    console.log('Found inputs:', JSON.stringify(inputs, null, 2));

    // Try different email selectors
    const emailSelectors = [
      '#CustomerEmail',
      'input[name="customer[email]"]',
      'input[type="email"]',
      'input[name="email"]',
      '#customer_email'
    ];

    let emailSelector = null;
    for (const selector of emailSelectors) {
      const exists = await page.$(selector);
      if (exists) {
        emailSelector = selector;
        console.log(`✅ Found email field: ${selector}`);
        break;
      }
    }

    if (!emailSelector) {
      console.error('❌ Could not find email input!');
      console.log('\nPage title:', await page.title());
      console.log('Current URL:', page.url());
      return;
    }

    // Try different password selectors
    const passwordSelectors = [
      '#CustomerPassword',
      'input[name="customer[password]"]',
      'input[type="password"]',
      'input[name="password"]',
      '#customer_password'
    ];

    let passwordSelector = null;
    for (const selector of passwordSelectors) {
      const exists = await page.$(selector);
      if (exists) {
        passwordSelector = selector;
        console.log(`✅ Found password field: ${selector}`);
        break;
      }
    }

    if (!passwordSelector) {
      console.error('❌ Could not find password input!');
      return;
    }

    // Fill in credentials
    console.log('\n📝 Filling in credentials...');
    await page.type(emailSelector, 'johncroston@myyahoo.com', { delay: 100 });
    console.log('✅ Email entered');
    
    await page.type(passwordSelector, 'Wholesale123', { delay: 100 });
    console.log('✅ Password entered');

    await delay(1000);

    // Take screenshot before submit
    await page.screenshot({ path: '/tmp/tropicana-before-submit.png' });
    console.log('📸 Screenshot saved to /tmp/tropicana-before-submit.png');

    // Find submit button
    const submitSelectors = [
      'button[type="submit"]',
      'input[type="submit"]',
      '.btn[type="submit"]',
      'button.btn',
      'form button'
    ];

    let submitted = false;
    for (const selector of submitSelectors) {
      try {
        const button = await page.$(selector);
        if (button) {
          console.log(`\n🔘 Clicking submit button: ${selector}`);
          await button.click();
          submitted = true;
          break;
        }
      } catch (e) {
        continue;
      }
    }

    if (!submitted) {
      console.error('❌ Could not find submit button!');
      return;
    }

    console.log('⏳ Waiting for navigation...');
    await delay(5000);

    // Check if login was successful
    const currentUrl = page.url();
    console.log('\n📍 Current URL after submit:', currentUrl);
    
    await page.screenshot({ path: '/tmp/tropicana-after-submit.png' });
    console.log('📸 Screenshot saved to /tmp/tropicana-after-submit.png');

    if (currentUrl.includes('/account') && !currentUrl.includes('/login')) {
      console.log('\n✅ LOGIN SUCCESSFUL!');
      console.log('🎉 Credentials are working!');
      
      // Try to get some product page to verify
      console.log('\n📦 Testing product page access...');
      await page.goto('https://www.tropicanawholesale.com/collections', {
        waitUntil: 'domcontentloaded',
        timeout: 60000
      });
      
      await page.screenshot({ path: '/tmp/tropicana-collections.png' });
      console.log('📸 Collections page saved to /tmp/tropicana-collections.png');
      
      const bodyText = await page.evaluate(() => document.body.innerText);
      console.log('\n📄 Collections page preview:');
      console.log(bodyText.substring(0, 500));
      
    } else {
      console.log('\n⚠️  Still on login page - check for errors');
      
      // Look for error messages
      const errors = await page.evaluate(() => {
        const errorElements = document.querySelectorAll('.error, .errors, [class*="error"]');
        return Array.from(errorElements).map(el => el.textContent?.trim());
      });
      
      if (errors.length > 0) {
        console.log('❌ Errors found:', errors);
      }
    }

    console.log('\n⏸️  Keeping browser open for 10 seconds for inspection...');
    await delay(10000);

  } catch (error) {
    console.error('\n❌ Error during test:', error);
  } finally {
    await browser.close();
    console.log('\n🔚 Test complete');
  }
}

testLogin().catch(console.error);
