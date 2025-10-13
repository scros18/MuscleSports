#!/usr/bin/env node

/**
 * Project Cleanup Script
 * Removes all build artifacts, temporary files, and unused data
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🧹 Starting project cleanup...\n');

const filesToDelete = [
  '.next',
  'out',
  'tsconfig.tsbuildinfo',
  'ordify.err',
  '.DS_Store',
  'Thumbs.db',
];

const unusedFilesToDelete = [
  'clean-descriptions.js',
  'escape-quotes.js',
  'format-descriptions.js',
  'update-prices.js',
  'test-db.js',
  'test-products.ts',
  'import-all-products.js',
  'aosom.csv',
  'aosomstockandprice.csv',
  'nginx-config',
  'deploy-admin.sh',
  'DEPLOYMENT-COMPLETE.md',
  'FINAL-RELEASE-NOTES.md',
  'IMPLEMENTATION-SUMMARY.md',
  'LATEST-UPDATES.md', // Duplicate
  'PERFORMANCE.md', // Outdated
  'SEO-README.md', // Merged into main docs
];

let deletedCount = 0;

// Delete build artifacts
filesToDelete.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
        console.log(`  ✓ Deleted directory: ${file}`);
      } else {
        fs.unlinkSync(filePath);
        console.log(`  ✓ Deleted file: ${file}`);
      }
      deletedCount++;
    }
  } catch (error) {
    console.log(`  ⚠ Could not delete ${file}: ${error.message}`);
  }
});

// Delete unused files
unusedFilesToDelete.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`  ✓ Removed unused: ${file}`);
      deletedCount++;
    }
  } catch (error) {
    console.log(`  ⚠ Could not remove ${file}: ${error.message}`);
  }
});

// Clean node_modules cache (optional)
console.log('\\n📦 Cleaning npm cache...');
try {
  execSync('npm cache clean --force', { stdio: 'ignore' });
  console.log('  ✓ npm cache cleaned');
} catch (error) {
  console.log('  ⚠ Could not clean npm cache');
}

// Remove log files
const logFiles = ['.log', '.err'];
const rootDir = path.join(__dirname, '..');
fs.readdirSync(rootDir).forEach(file => {
  if (logFiles.some(ext => file.endsWith(ext))) {
    try {
      fs.unlinkSync(path.join(rootDir, file));
      console.log(`  ✓ Removed log: ${file}`);
      deletedCount++;
    } catch (error) {
      // Ignore
    }
  }
});

console.log(`\\n✅ Cleanup complete! Removed ${deletedCount} items.`);
console.log('\\n📊 Clean project structure:');
console.log('  - Build artifacts: Removed');
console.log('  - Temporary files: Removed');
console.log('  - Unused scripts: Removed');
console.log('  - Log files: Removed');
console.log('  - Cache: Cleared');
console.log('\\n💡 Run "npm install" if you need to reinstall dependencies.');
console.log('💡 Run "npm run dev" to start development.\\n');
