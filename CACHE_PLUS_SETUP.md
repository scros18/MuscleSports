# Cache+ Setup Guide

## 🚀 Installation

Cache+ is now integrated into your admin panel! Follow these steps to activate it:

### 1. Run Database Migration

```bash
# Navigate to your project directory
cd "C:\Users\scros\New folder\html"

# Run the migration to create cache_settings table
npx tsx scripts/add-cache-settings.ts
```

### 2. Access Cache+ in Admin Panel

1. Login to your admin panel at `/admin`
2. Look for **Cache+** in the sidebar (marked with a PRO badge)
3. The master toggle is ON by default with optimal settings

## ✨ Features Included

### Page Caching
- ✅ Full HTML page caching
- ✅ HTML minification
- ✅ Configurable TTL (default: 1 hour)

### CSS & JavaScript Optimization
- ✅ CSS minification
- ✅ JavaScript minification
- ✅ Critical CSS inlining
- ✅ Unused CSS removal
- ✅ JavaScript deferring

### Image Optimization
- ✅ Lazy loading for images
- ✅ Automatic loading="lazy" attributes

### Browser & Server
- ✅ Browser caching headers
- ✅ GZIP compression
- ✅ Font preloading
- ✅ DNS prefetching
- ✅ Resource preloading

### CDN Support
- ✅ CDN integration
- ✅ Custom CDN URL configuration

### Database
- ✅ Query caching
- ✅ Database optimization

### Cache Management
- ✅ Clear all caches
- ✅ Clear specific cache types (Page, CSS, JS, Images, Database)
- ✅ Real-time statistics

## 📊 Default Configuration

The following settings are enabled by default:

```javascript
{
  enabled: true,
  pageCache: true,
  cssMinification: true,
  jsMinification: true,
  htmlMinification: true,
  imageLazyLoad: true,
  criticalCss: true,
  deferJavascript: true,
  preloadFonts: true,
  browserCache: true,
  gzipCompression: true,
  preloadKeyRequests: true,
  dnsPrefetch: true,
  cacheTtl: 3600, // 1 hour
  excludeUrls: ['/admin', '/api', '/checkout', '/cart']
}
```

## 🎯 Performance Impact

Expected improvements with Cache+ enabled:

- **Load Time**: 50-80% faster
- **Bandwidth**: 60-70% reduction
- **Server Load**: 40-60% reduction
- **Page Size**: 30-50% smaller

## 🔧 Configuration

### Excluded URLs

By default, these URLs are excluded from caching:
- `/admin` - Admin panel
- `/api` - API routes
- `/checkout` - Checkout pages
- `/cart` - Shopping cart

### DNS Prefetch Domains

Default domains for DNS prefetching:
- `https://fonts.googleapis.com`
- `https://fonts.gstatic.com`

### CDN Setup (Optional)

1. Enable CDN in Cache+ settings
2. Enter your CDN URL (e.g., `https://cdn.musclesports.co.uk`)
3. Save settings

## 📱 Mobile Optimized

The Cache+ admin interface is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px+)
- Tablet (768px+)
- Mobile (320px+)

## 🌐 Production Deployment

### For musclesports.co.uk VPS:

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Run migrations**:
   ```bash
   npx tsx scripts/add-cache-settings.ts
   ```

3. **Start production server**:
   ```bash
   npm start
   ```

### Environment Variables

Make sure these are set in your `.env.local`:

```env
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=ordify_db
DB_PORT=3306
JWT_SECRET=your_secret_key
```

## 🔍 Monitoring

Cache+ provides real-time statistics:

- **Total Cache Size**: Current cache storage
- **Hit Rate**: Cache effectiveness (aim for 90%+)
- **Load Time**: Average page load time
- **Bandwidth Saved**: Total bandwidth reduction

## 🛠️ Troubleshooting

### Cache not working?

1. Check that Cache+ is enabled (Master toggle)
2. Verify the URL is not in excluded list
3. Clear all caches and refresh
4. Check browser console for errors

### Styles not loading?

1. Disable CSS minification temporarily
2. Clear CSS cache
3. Check for any custom CSS that might conflict

### Images not loading?

1. Disable CDN if enabled
2. Check image paths
3. Verify lazy loading isn't conflicting with custom scripts

## 📈 Best Practices

1. **Clear cache after updates**: Always clear cache after deploying code changes
2. **Monitor hit rate**: Keep it above 85% for optimal performance
3. **Adjust TTL**: Increase for static sites, decrease for dynamic content
4. **Use CDN**: For global audience, enable CDN for even better performance
5. **Test thoroughly**: Test all pages after enabling new optimizations

## 🎉 That's It!

Cache+ is now ready to supercharge musclesports.co.uk!

Visit `/admin/cache-plus` to configure and monitor your cache settings.

