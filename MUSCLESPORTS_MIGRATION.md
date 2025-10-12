# MuscleSports WordPress to Lumify Migration Plan

## Server Details
- **IP**: 137.74.157.17
- **User**: root
- **Current**: WordPress site
- **Target**: New Lumify/Next.js e-commerce system

## Migration Steps

### Phase 1: Explore Current WordPress Setup
```bash
# Connect to MuscleSports VPS
ssh root@137.74.157.17

# Find WordPress installation
find /var/www -name "wp-config.php" 2>/dev/null
ls -la /var/www/
ls -la /var/www/html/

# Check web server config
cat /etc/nginx/sites-enabled/musclesports* 2>/dev/null
cat /etc/apache2/sites-enabled/musclesports* 2>/dev/null

# Check database
mysql -e "SHOW DATABASES;" | grep -i muscle
```

### Phase 2: Extract WordPress Data

#### A. Export Products from WordPress
```bash
# Access WordPress database
mysql -u root -p

# Find WooCommerce products table
USE wordpress_db_name;
SHOW TABLES LIKE 'wp_%posts';
SHOW TABLES LIKE 'wp_%postmeta';

# Export products to CSV
SELECT 
    p.ID,
    p.post_title as name,
    p.post_content as description,
    p.post_excerpt as short_description,
    GROUP_CONCAT(DISTINCT pm1.meta_value) as price,
    GROUP_CONCAT(DISTINCT pm2.meta_value) as stock,
    GROUP_CONCAT(DISTINCT t.name) as category
FROM wp_posts p
LEFT JOIN wp_postmeta pm1 ON p.ID = pm1.post_id AND pm1.meta_key = '_regular_price'
LEFT JOIN wp_postmeta pm2 ON p.ID = pm2.post_id AND pm2.meta_key = '_stock'
LEFT JOIN wp_term_relationships tr ON p.ID = tr.object_id
LEFT JOIN wp_term_taxonomy tt ON tr.term_taxonomy_id = tt.term_taxonomy_id
LEFT JOIN wp_terms t ON tt.term_id = t.term_id
WHERE p.post_type = 'product' 
AND p.post_status = 'publish'
GROUP BY p.ID
INTO OUTFILE '/tmp/musclesports_products.csv'
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n';
```

#### B. Export Product Images
```bash
# Find WordPress uploads directory
cd /var/www/html/wp-content/uploads/

# Create archive of product images
tar -czf /tmp/musclesports_images.tar.gz .

# Download to local machine (run from Windows)
scp root@137.74.157.17:/tmp/musclesports_images.tar.gz "C:\Users\scros\New folder\html\html\musclesports_backup\"
scp root@137.74.157.17:/tmp/musclesports_products.csv "C:\Users\scros\New folder\html\html\musclesports_backup\"
```

### Phase 3: Prepare New Lumify Deployment

#### A. Backup Current WordPress Site
```bash
# On server
cd /var/www/html
tar -czf /root/backup_wordpress_musclesports_$(date +%Y%m%d).tar.gz .

# Backup database
mysqldump -u root -p wordpress_db_name > /root/backup_wordpress_musclesports_$(date +%Y%m%d).sql
```

#### B. Setup New Directory for Lumify
```bash
# Create new directory
mkdir -p /var/www/lumify-musclesports
cd /var/www/lumify-musclesports

# Clone repository
git clone https://github.com/Leon2k909/html.git .

# Switch to main branch
git checkout main
git pull origin main
```

### Phase 4: Import Data to Lumify

#### A. Create Product Import Script
We'll create a Node.js script to import WordPress products into the new system.

#### B. Setup Environment
```bash
cd /var/www/lumify-musclesports

# Create .env file
cat > .env << 'EOF'
DATABASE_URL=mysql://root:password@localhost:3306/lumify_musclesports
NODE_ENV=production
PORT=3001
JWT_SECRET=musclesports-secret-key-change-this
NEXT_PUBLIC_SITE_NAME=MuscleSports
NEXT_PUBLIC_THEME=musclesports
EOF

# Install dependencies
npm install

# Build production
npm run build
```

### Phase 5: Deploy with PM2
```bash
# Install PM2 if not already installed
npm install -g pm2

# Start Lumify
pm2 start npm --name "musclesports-lumify" -- start
pm2 save
pm2 startup
```

### Phase 6: Configure Nginx
```bash
# Backup current nginx config
cp /etc/nginx/sites-enabled/musclesports.co.uk /etc/nginx/sites-available/musclesports.co.uk.backup

# Create new config for Lumify
nano /etc/nginx/sites-enabled/musclesports.co.uk

# Add:
server {
    listen 80;
    server_name musclesports.co.uk www.musclesports.co.uk;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Test and reload nginx
nginx -t
systemctl reload nginx
```

### Phase 7: SSL Certificate
```bash
# Install/renew Let's Encrypt certificate
certbot --nginx -d musclesports.co.uk -d www.musclesports.co.uk
```

## Data Import Script Structure

Create `/var/www/lumify-musclesports/scripts/import-wordpress-products.js`:

```javascript
const mysql = require('mysql2/promise');
const fs = require('fs');
const csv = require('csv-parser');

async function importProducts() {
    // Read CSV
    // Parse products
    // Insert into new database
    // Map images
}

importProducts().catch(console.error);
```

## Rollback Plan
If anything goes wrong:
```bash
# Stop new service
pm2 stop musclesports-lumify

# Restore nginx config
cp /etc/nginx/sites-available/musclesports.co.uk.backup /etc/nginx/sites-enabled/musclesports.co.uk
nginx -t && systemctl reload nginx

# Restore WordPress files (if needed)
cd /var/www/html
rm -rf *
tar -xzf /root/backup_wordpress_musclesports_YYYYMMDD.tar.gz

# Restore database (if needed)
mysql -u root -p wordpress_db_name < /root/backup_wordpress_musclesports_YYYYMMDD.sql
```

---

## Next Steps
1. SSH into MuscleSports VPS (137.74.157.17)
2. Find WordPress directory and database name
3. Export products and images
4. Create import script for new system
5. Test on different port before switching
6. Update nginx to point to new system
