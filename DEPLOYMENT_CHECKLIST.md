# 🚀 Deployment Checklist for musclesports.co.uk VPS

## Pre-Deployment ✓

- [x] Build completed successfully
- [x] All TypeScript errors resolved
- [x] Cache+ system integrated
- [x] Mobile responsiveness verified
- [x] Database schema prepared
- [x] Migration script ready

## VPS Deployment Steps

### 1. Backup Current Site
```bash
# SSH into VPS
ssh user@musclesports.co.uk

# Create backup
cd /var/www
tar -czf musclesports_backup_$(date +%Y%m%d_%H%M%S).tar.gz html/

# Move backup to safe location
mv musclesports_backup_*.tar.gz ~/backups/
```

### 2. Upload New Build
```bash
# From your local machine
cd "C:\Users\scros\New folder\html"

# Option A: Using SCP
scp -r .next/ user@musclesports.co.uk:/var/www/html/
scp -r public/ user@musclesports.co.uk:/var/www/html/
scp package.json user@musclesports.co.uk:/var/www/html/
scp -r lib/ user@musclesports.co.uk:/var/www/html/
scp -r app/ user@musclesports.co.uk:/var/www/html/
scp -r components/ user@musclesports.co.uk:/var/www/html/
scp -r context/ user@musclesports.co.uk:/var/www/html/
scp -r scripts/ user@musclesports.co.uk:/var/www/html/
scp middleware.ts user@musclesports.co.uk:/var/www/html/

# Option B: Using Git (if setup)
git push origin main
# Then on VPS:
cd /var/www/html && git pull origin main
```

### 3. Install Dependencies (if needed)
```bash
# On VPS
cd /var/www/html
npm install
```

### 4. Run Database Migration
```bash
# On VPS
cd /var/www/html
npx tsx scripts/add-cache-settings.ts
```

Expected output:
```
🚀 Adding Cache+ settings to database...
✅ Cache+ settings added successfully!

Default settings:
- Page Cache: Enabled
- CSS/JS/HTML Minification: Enabled
- Image Lazy Loading: Enabled
- Browser Cache: Enabled (1 hour TTL)
- GZIP Compression: Enabled
- Excluded URLs: /admin, /api, /checkout, /cart

🎉 Cache+ is now ready to boost your site performance!
📊 Visit /admin/cache-plus to configure settings
```

### 5. Restart Application
```bash
# Using PM2 (recommended)
pm2 restart musclesports
pm2 save

# Or using systemd
sudo systemctl restart musclesports

# Or using npm (dev mode - not recommended for production)
npm run build && npm start
```

### 6. Verify Deployment
```bash
# Check if application is running
pm2 status

# View logs
pm2 logs musclesports --lines 50

# Check for errors
pm2 logs musclesports --err --lines 20
```

## Post-Deployment Verification

### 1. Test Main Site
- [ ] Visit https://musclesports.co.uk
- [ ] Homepage loads correctly
- [ ] Products page accessible
- [ ] Cart functionality works
- [ ] Checkout process functional

### 2. Test Admin Panel
- [ ] Login at https://musclesports.co.uk/admin
- [ ] Dashboard loads
- [ ] Products page works
- [ ] Orders page accessible

### 3. Test Cache+ System
- [ ] Navigate to /admin/cache-plus
- [ ] Verify settings page loads
- [ ] Check statistics display correctly
- [ ] Master toggle works
- [ ] Save settings functional
- [ ] Clear cache buttons work

### 4. Performance Checks
- [ ] Run Google PageSpeed Insights
- [ ] Check GTmetrix scores
- [ ] Verify cache headers (DevTools Network tab)
- [ ] Monitor server resources (top, htop)

### 5. Mobile Testing
- [ ] Test on mobile device
- [ ] Cache+ admin responsive
- [ ] All features accessible
- [ ] Touch controls work

## Environment Variables

Ensure these are set on your VPS (in `.env.local` or environment):

```bash
# Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=ordify_db
DB_PORT=3306

# Authentication
JWT_SECRET=your_production_secret_key

# Email (if using)
EMAIL_HOST=smtp.your-provider.com
EMAIL_PORT=587
EMAIL_USER=your_email@domain.com
EMAIL_PASS=your_email_password

# PayPal (if using)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_secret
PAYPAL_MODE=live

# Application
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://musclesports.co.uk
```

## Rollback Plan (If Needed)

If anything goes wrong:

```bash
# Stop current application
pm2 stop musclesports

# Restore backup
cd /var/www
rm -rf html/
tar -xzf ~/backups/musclesports_backup_YYYYMMDD_HHMMSS.tar.gz

# Restart application
pm2 restart musclesports
```

## Performance Monitoring

### First Hour
- [ ] Monitor error logs
- [ ] Check cache hit rate
- [ ] Verify page load times
- [ ] Monitor server CPU/RAM

### First Day
- [ ] Review analytics
- [ ] Check conversion rates
- [ ] Monitor customer feedback
- [ ] Verify all features working

### First Week
- [ ] Analyze performance metrics
- [ ] Fine-tune cache settings
- [ ] Adjust TTL if needed
- [ ] Review bandwidth savings

## Cache+ Optimization Tips

### Recommended Settings for musclesports.co.uk

```javascript
{
  enabled: true,
  pageCache: true,
  cacheTtl: 3600,  // 1 hour for product pages
  
  // Minification
  cssMinification: true,
  jsMinification: true,
  htmlMinification: true,
  
  // Images
  imageLazyLoad: true,
  
  // Performance
  deferJavascript: true,
  preloadFonts: true,
  gzipCompression: true,
  
  // CDN (if you have one)
  cdnEnabled: false,  // Set to true if using CDN
  cdnUrl: '',
  
  // Exclusions (keep default)
  excludeUrls: ['/admin', '/api', '/checkout', '/cart']
}
```

### When to Clear Cache

Clear cache after:
- Product price updates
- Stock changes
- New product additions
- Design/layout changes
- Code deployments

## Troubleshooting Guide

### Issue: Site not loading
**Solution**: 
```bash
pm2 logs musclesports --err --lines 50
# Check for errors and fix
pm2 restart musclesports
```

### Issue: Cache+ not showing in admin
**Solution**:
```bash
# Check if migration ran
npx tsx scripts/add-cache-settings.ts

# Clear Next.js cache
rm -rf .next/cache/
npm run build
pm2 restart musclesports
```

### Issue: High server load
**Solution**:
```bash
# Check cache hit rate in admin
# If low, adjust TTL
# If high, check for other issues

# Monitor processes
top
htop
```

### Issue: Images not loading
**Solution**:
- Check /public directory permissions
- Verify image paths
- Disable CDN temporarily if enabled
- Clear image cache in Cache+

## Final Checklist

Before announcing deployment:

- [ ] Site loads correctly
- [ ] Admin panel accessible
- [ ] Cache+ functional
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Performance improved
- [ ] Backups created
- [ ] Monitoring active
- [ ] SSL certificate valid
- [ ] DNS pointing correctly

## Success Metrics

Track these KPIs post-deployment:

1. **Page Load Time**: Should decrease by 50-80%
2. **Bounce Rate**: Should decrease
3. **Conversion Rate**: Should increase or maintain
4. **Server Load**: Should decrease by 40-60%
5. **Bandwidth**: Should decrease by 60-70%

## Support Contacts

- **Technical Issues**: Check PM2 logs
- **Database Issues**: Review MySQL logs
- **Performance Issues**: Monitor Cache+ statistics
- **Emergency Rollback**: Use backup restoration steps above

---

## 🎉 You're Ready to Deploy!

**Current Status**: ✅ Build Complete (78 pages, 0 errors)

**Next Steps**:
1. Backup current site
2. Upload new build
3. Run migration
4. Restart app
5. Verify functionality
6. Enable Cache+ features
7. Monitor performance

**Good luck with your deployment to musclesports.co.uk!** 🚀

