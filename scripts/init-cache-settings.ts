import { Database } from '../lib/database';

async function initCacheSettings() {
  try {
    console.log('🚀 Initializing Cache+ settings...');

    // Create or update default cache settings with optimal configuration
    await Database.createOrUpdateCacheSettings({
      id: 'default',
      enabled: true, // Enable by default for optimal performance
      pageCache: true,
      cssMinification: true,
      jsMinification: true,
      htmlMinification: true,
      imageLazyLoad: true,
      criticalCss: true,
      removeUnusedCss: false, // Disable by default as it requires analysis
      deferJavascript: true,
      preloadFonts: true,
      browserCache: true,
      gzipCompression: true,
      cdnEnabled: false,
      cdnUrl: '',
      preloadKeyRequests: true,
      dnsPrefetch: true,
      dnsPrefetchDomains: [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
        'https://images.unsplash.com',
        'https://img.aosomcdn.com'
      ],
      preconnectDomains: [
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com'
      ],
      cacheTtl: 3600, // 1 hour
      excludeUrls: [
        '/admin',
        '/api',
        '/checkout',
        '/cart',
        '/login',
        '/register',
        '/account'
      ],
      databaseOptimization: true
    });

    console.log('✅ Cache+ settings initialized successfully!');
    console.log('');
    console.log('📊 Default Configuration:');
    console.log('  - Master Cache: ENABLED');
    console.log('  - Page Cache: ENABLED');
    console.log('  - Minification (CSS/JS/HTML): ENABLED');
    console.log('  - Image Lazy Loading: ENABLED');
    console.log('  - Critical CSS: ENABLED');
    console.log('  - JavaScript Deferring: ENABLED');
    console.log('  - Font Preloading: ENABLED');
    console.log('  - Browser Cache: ENABLED');
    console.log('  - GZIP Compression: ENABLED');
    console.log('  - Database Optimization: ENABLED');
    console.log('  - Cache TTL: 1 hour (3600s)');
    console.log('');
    console.log('🎯 Your site is now optimized for maximum performance!');
    console.log('💡 Tip: Visit /admin/cache-plus to customize settings');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error initializing cache settings:', error);
    process.exit(1);
  }
}

initCacheSettings();

