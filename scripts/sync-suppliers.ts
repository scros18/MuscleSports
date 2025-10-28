#!/usr/bin/env tsx
/**
 * Combined supplier sync:
 * 1) Scrape Dolphin Fitness and Muscle Finesse public listings
 * 2) Upsert into supplier_products
 * 3) Sync into main products with margin
 */

import { ensureSupplierTables, syncSuppliersToProducts } from '../lib/suppliers';

async function main(){
  console.log('🔧 Ensuring schema...');
  await ensureSupplierTables();

  console.log('🕸️ Scraping Dolphin Fitness...');
  await import('./scrape-dolphin-fitness');

  console.log('🕸️ Scraping Muscle Finesse...');
  await import('./scrape-muscle-finesse');

  console.log('🔄 Syncing suppliers -> products (35% margin)...');
  const res = await syncSuppliersToProducts({ marginPercent: 35 });
  console.log(`✅ Done. Created: ${res.created}, Updated: ${res.updated}, Skipped: ${res.skipped}`);
}

if (require.main === module){
  main().then(()=>{ console.log('🎉 Supplier sync complete'); process.exit(0); }).catch(e=>{ console.error('❌ Supplier sync failed:', e); process.exit(1); });
}
