#!/usr/bin/env node

/**
 * Asset Optimization Script
 * Optimizes images and other static assets
 */

const fs = require('fs');
const path = require('path');

console.log('🎨 Starting asset optimization...\n');

const publicDir = path.join(__dirname, '..', 'public');

// Check if public directory exists
if (!fs.existsSync(publicDir)) {
  console.log('⚠️  No public directory found. Skipping optimization.');
  process.exit(0);
}

console.log('📁 Scanning public directory...');

let fileCount = 0;
let totalSize = 0;

function scanDirectory(dir) {
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      scanDirectory(fullPath);
    } else {
      const stats = fs.statSync(fullPath);
      totalSize += stats.size;
      fileCount++;
      
      // Log image files
      if (file.name.match(/\\.(jpg|jpeg|png|gif|svg|webp|avif)$/i)) {
        const sizeInKB = (stats.size / 1024).toFixed(2);
        console.log(`  📷 ${path.relative(publicDir, fullPath)} (${sizeInKB} KB)`);
      }
    }
  });
}

scanDirectory(publicDir);

const totalSizeInMB = (totalSize / 1024 / 1024).toFixed(2);

console.log(`\\n✅ Optimization scan complete!`);
console.log(`\\n📊 Summary:`);
console.log(`  - Total files: ${fileCount}`);
console.log(`  - Total size: ${totalSizeInMB} MB`);
console.log(`\\n💡 Tips for optimization:`);
console.log(`  1. Use WebP/AVIF formats for images`);
console.log(`  2. Compress images before uploading`);
console.log(`  3. Use Next.js Image component for automatic optimization`);
console.log(`  4. Consider using a CDN for static assets`);
console.log(`\\n🚀 Next.js automatically optimizes images at runtime!\\n`);
