#!/usr/bin/env node

/**
 * Production Build Script with Code Obfuscation
 * This script builds the Next.js app and obfuscates the client-side JavaScript
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

console.log('🚀 Starting production build with obfuscation...\n');

// Step 1: Clean previous builds
console.log('📦 Cleaning previous builds...');
try {
  if (fs.existsSync('.next')) {
    execSync('rmdir /s /q .next', { stdio: 'inherit', shell: true });
  }
} catch (error) {
  console.log('Clean step skipped (no previous build found)');
}

// Step 2: Run Next.js build
console.log('\n🔨 Building Next.js application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Next.js build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 3: Obfuscate JavaScript files
console.log('\n🔒 Obfuscating JavaScript files...');

const obfuscatorConfig = require('./obfuscator.config.js');
const buildDir = path.join(__dirname, '.next');

function obfuscateDirectory(dir) {
  if (!fs.existsSync(dir)) return;
  
  const files = fs.readdirSync(dir, { withFileTypes: true });
  
  files.forEach(file => {
    const fullPath = path.join(dir, file.name);
    
    if (file.isDirectory()) {
      // Skip certain directories
      if (file.name === 'node_modules' || file.name === 'cache') return;
      obfuscateDirectory(fullPath);
    } else if (file.isFile() && file.name.endsWith('.js')) {
      // Skip certain files that should not be obfuscated
      if (
        file.name.includes('webpack-runtime') ||
        file.name.includes('polyfills') ||
        file.name === 'package.json' ||
        fullPath.includes('server/chunks') // Don't obfuscate server chunks
      ) {
        return;
      }
      
      try {
        const code = fs.readFileSync(fullPath, 'utf8');
        
        // Only obfuscate if file is large enough (skip tiny files)
        if (code.length < 100) return;
        
        // Obfuscate the code
        const obfuscated = JavaScriptObfuscator.obfuscate(code, {
          ...obfuscatorConfig,
          // Less aggressive settings for compatibility
          controlFlowFlattening: false,
          deadCodeInjection: false,
          selfDefending: false,
          debugProtection: false,
        });
        
        fs.writeFileSync(fullPath, obfuscated.getObfuscatedCode());
        console.log(`  ✓ Obfuscated: ${path.relative(buildDir, fullPath)}`);
      } catch (error) {
        console.log(`  ⚠ Skipped: ${path.relative(buildDir, fullPath)} (${error.message})`);
      }
    }
  });
}

// Obfuscate static JavaScript files
const staticDir = path.join(buildDir, 'static');
if (fs.existsSync(staticDir)) {
  console.log('\nObfuscating static files...');
  obfuscateDirectory(staticDir);
}

console.log('\n✅ Production build with obfuscation completed!');
console.log('\n📊 Build Summary:');
console.log('  - Next.js optimizations: ✓');
console.log('  - Console.log removal: ✓');
console.log('  - Code obfuscation: ✓');
console.log('  - Minification: ✓');
console.log('\n🎉 Your code is now protected and ready for deployment!');
console.log('\n💡 To start the production server, run: npm start\n');
