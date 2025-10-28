#!/usr/bin/env tsx
/**
 * Complete Tropicana Sync Script
 * 1. Scrapes products from Tropicana with authentication
 * 2. Syncs to tropicana_products table with flavours/sizes
 * 3. Syncs to main products table with categories and SEO
 */

import { runTropicanaSync } from '../lib/tropicana-authenticated-scraper';
import { spawn } from 'child_process';
import { syncTropicanaToProducts } from '../lib/tropicana-product-sync';

async function main() {
  console.log('╔══════════════════════════════════════╗');
  console.log('║  TROPICANA WHOLESALE SYNC TOOL      ║');
  console.log('║  Complete Product & Stock Sync       ║');
  console.log('╚══════════════════════════════════════╝');
  console.log('');

  try {
    // Step 1: Scrape from Tropicana and sync to tropicana_products
    console.log('📦 STEP 1: Scraping Tropicana Wholesale...');
  await runTropicanaSync();
    
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    // Step 2: Sync from tropicana_products to main products table
  console.log('📦 STEP 2: Syncing to main products with SEO...');
    await syncTropicanaToProducts();
    
    console.log('');
    console.log('🎉 COMPLETE! All products synced successfully.');
    console.log('   - Stock levels updated');
    console.log('   - Flavours and sizes processed');
    console.log('   - Categories auto-assigned');
    console.log('   - SEO metadata generated');
    console.log('');
    
    process.exit(0);
  } catch (error) {
    console.error('');
    console.error('❌ Primary sync failed. Attempting JAR fallback...');
    try {
      await new Promise<void>((resolve, reject) => {
        const p = spawn('bash', ['-lc', 'scripts/run-tropicana-jar.sh'], { stdio: 'inherit', cwd: process.cwd() });
        p.on('exit', (code) => code === 0 ? resolve() : reject(new Error(`Jar script exited ${code}`)));
      });
      console.log('🔁 JAR fallback completed. Proceeding to SEO sync...');
      await syncTropicanaToProducts();
      console.log('🎉 COMPLETE via fallback!');
      process.exit(0);
    } catch (e) {
      console.error('❌ Fallback also failed:', e);
      console.error('');
      process.exit(1);
    }
  }
}

main();
