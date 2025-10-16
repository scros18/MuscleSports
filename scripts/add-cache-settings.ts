import { Database } from '../lib/database';

async function addCacheSettings() {
  try {
    console.log('🚀 Adding Cache+ settings to database...');

    // Create default cache settings
    await Database.createOrUpdateCacheSettings({
      id: 'default',
      enabled: true,
      pageCache: true,
      cssMinification: true,
      jsMinification: true,
      htmlMinification: true,
      imageLazyLoad: true,
      criticalCss: true,
      removeUnusedCss: false,
      deferJavascript: true,
      preloadFonts: true,
      browserCache: true,
      gzipCompression: true,
      cdnEnabled: false,
      cdnUrl: '',
      preloadKeyRequests: true,
      dnsPrefetch: true,
      dnsPrefetchDomains: ['https://fonts.googleapis.com', 'https://fonts.gstatic.com'],
      preconnectDomains: ['https://fonts.googleapis.com'],
      cacheTtl: 3600,
      excludeUrls: ['/admin', '/api', '/checkout', '/cart'],
      databaseOptimization: false,
    });

    console.log('✅ Cache+ settings added successfully!');
    console.log('');
    console.log('Default settings:');
    console.log('- Page Cache: Enabled');
    console.log('- CSS/JS/HTML Minification: Enabled');
    console.log('- Image Lazy Loading: Enabled');
    console.log('- Browser Cache: Enabled (1 hour TTL)');
    console.log('- GZIP Compression: Enabled');
    console.log('- Excluded URLs: /admin, /api, /checkout, /cart');
    console.log('');
    console.log('🎉 Cache+ is now ready to boost your site performance!');
    console.log('📊 Visit /admin/cache-plus to configure settings');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding cache settings:', error);
    process.exit(1);
  }
}

addCacheSettings();

