#!/usr/bin/env tsx
import puppeteer, { Page } from 'puppeteer';
import { ensureSupplierTables, upsertSupplierProduct, SupplierProduct } from '../lib/suppliers';

const delay = (ms:number)=>new Promise(r=>setTimeout(r,ms));

const CATEGORIES = [
  { name: 'Protein', url: 'https://www.dolphinfitness.co.uk/en/section/protein' },
  { name: 'Pre-Workout', url: 'https://www.dolphinfitness.co.uk/en/section/pre-workout' },
  { name: 'Creatine', url: 'https://www.dolphinfitness.co.uk/en/section/creatine' },
  { name: 'Vitamins', url: 'https://www.dolphinfitness.co.uk/en/section/vitamins-minerals' },
  { name: 'Amino Acids', url: 'https://www.dolphinfitness.co.uk/en/section/amino-acids' },
  { name: 'Protein Bars', url: 'https://www.dolphinfitness.co.uk/en/section/protein-bars' }
];

async function scrapeCategory(page: Page, cat:{name:string,url:string}){
  console.log(`\n📦 ${cat.name} -> ${cat.url}`);
  await page.goto(cat.url, { waitUntil: 'networkidle2', timeout: 60000 });
  await delay(1000);

  // Pagination loop: look for next page link
  while (true) {
  const products = await page.evaluate((category: string)=>{
      const out:any[]=[];
      document.querySelectorAll('.product-list .product, .product-grid .product').forEach((el, idx)=>{
        try {
          const name = (el.querySelector('.product-name a, .title a') as HTMLElement)?.innerText?.trim() || '';
          const url = (el.querySelector('.product-name a, .title a') as HTMLAnchorElement)?.href || '';
          const priceText = (el.querySelector('.price, .product-price, .price-new') as HTMLElement)?.innerText || '';
          const priceMatch = priceText.replace(/,/g,'').match(/[\d.]+/);
          const price = priceMatch? parseFloat(priceMatch[0]) : 0;
          const image = (el.querySelector('img') as HTMLImageElement)?.src || '';
          const stockText = (el.querySelector('.stock, .availability') as HTMLElement)?.innerText?.toLowerCase() || '';
          const inStock = !/out of stock|sold out|unavailable/.test(stockText);
          const brand = (el.querySelector('.manufacturer, .brand') as HTMLElement)?.innerText?.trim() || '';
          const sku = (el.getAttribute('data-product-id') || '').toString();
          if (name && url && price>0){ out.push({name, url, price, image, inStock, brand, category, sku}); }
        } catch {}
      });
      return out;
    }, cat.name);

    for (const p of products) {
      const sp: SupplierProduct = {
        supplier: 'dolphin-fitness',
        supplier_sku: p.sku || p.url,
        name: p.name,
        brand: p.brand,
        category: cat.name,
        price: p.price,
        currency: 'GBP',
        in_stock: p.inStock,
        stock_text: undefined,
        stock_qty: null,
        image_url: p.image,
        product_url: p.url,
      };
      await upsertSupplierProduct(sp);
    }

    // Check for next page
    const hasNext = await page.$('.pagination a[rel="next"], .pagination .next a');
    if (hasNext){
      await Promise.all([
        page.click('.pagination a[rel="next"], .pagination .next a'),
        page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 })
      ]);
      await delay(500);
    } else {
      break;
    }
  }
}

async function main(){
  await ensureSupplierTables();
  const browser = await puppeteer.launch({ headless: true, args:['--no-sandbox','--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36');

  try {
    for (const cat of CATEGORIES){
      try { await scrapeCategory(page, cat); } catch(e){ console.error(`✗ ${cat.name}:`, e); }
    }
  } finally {
    await browser.close();
  }
}

if (require.main === module){
  main().then(()=>{ console.log('\n✅ Dolphin Fitness scrape complete'); process.exit(0); }).catch(e=>{ console.error(e); process.exit(1); });
}
