#!/usr/bin/env tsx
/**
 * Tropicana session bootstrap (manual login, saved cookies)
 * 1) Opens a visible browser with stealth
 * 2) You log in manually to Tropicana Wholesale (.com)
 * 3) Press Enter in this terminal to save cookies/storage
 * 4) Future scrapes reuse the session and skip login hurdles
 */

import * as fs from 'fs';
import * as path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// Use puppeteer-extra with stealth to reduce bot detection
// eslint-disable-next-line @typescript-eslint/no-var-requires
const puppeteer = require('puppeteer-extra');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.use(StealthPlugin());

const BASE_URL = process.env.TROPICANA_BASE_URL || 'https://www.tropicanawholesale.com';
const SESSION_DIR = path.resolve('.puppeteer');
const COOKIES_PATH = path.join(SESSION_DIR, 'tropicana-cookies.json');
const STORAGE_PATH = path.join(SESSION_DIR, 'tropicana-storage.json');

async function prompt(msg: string){
  process.stdout.write(msg);
  return new Promise<void>((resolve)=>{
    process.stdin.resume();
    process.stdin.once('data', ()=>{ resolve(); });
  });
}

async function main(){
  if (!fs.existsSync(SESSION_DIR)) fs.mkdirSync(SESSION_DIR, { recursive: true });

  console.log('🚪 Launching Chrome for manual login (stealth enabled)...');
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--window-size=1400,900',
    ]
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36');

  console.log(`🔐 Navigate and log in: ${BASE_URL}/account/login`);
  await page.goto(`${BASE_URL}/account/login`, { waitUntil: 'load', timeout: 90000 });

  console.log('\n➡️  Please complete login in the browser window.');
  console.log('   After you are fully logged in (account page visible), return here and press Enter.');
  await prompt('   Press Enter to save session... ');

  // Save cookies and localStorage
  const cookies = await page.cookies();
  const storage = await page.evaluate(() => {
    const ls: Record<string,string> = {};
    for (let i=0; i<localStorage.length; i++){
      const k = localStorage.key(i);
      if (!k) continue;
      ls[k] = localStorage.getItem(k) || '';
    }
    return { localStorage: ls };
  });

  fs.writeFileSync(COOKIES_PATH, JSON.stringify(cookies, null, 2));
  fs.writeFileSync(STORAGE_PATH, JSON.stringify(storage, null, 2));
  console.log(`
✅ Session saved:
  - Cookies: ${COOKIES_PATH}
  - Storage: ${STORAGE_PATH}
`);

  await browser.close();
  console.log('🔚 Done. Future scrapes will reuse this session.');
}

if (require.main === module){
  main().catch((e)=>{ console.error('❌ Failed:', e); process.exit(1); });
}
