#!/bin/bash

# MuscleSports Lumify Deployment Script
# Run this on the MuscleSports VPS (137.74.157.17)

echo "🚀 Starting MuscleSports Lumify Deployment"
echo "=========================================="

# 1. Create directory for the new site
echo "📁 Creating directory..."
sudo mkdir -p /var/www/musclesports-lumify
sudo chown -R deploy:deploy /var/www/musclesports-lumify
cd /var/www/musclesports-lumify

# 2. Clone the repository
echo "📥 Cloning Lumify repository..."
git clone https://github.com/Leon2k909/html.git .

# 3. Install dependencies
echo "📦 Installing dependencies..."
npm install

# 4. Create .env file
echo "⚙️  Creating environment configuration..."
cat << 'EOF' > .env
# Database Configuration
DATABASE_URL=mysql://root:password@localhost:3306/musclesports_lumify

# Node Environment
NODE_ENV=production
PORT=3001

# JWT Secret
JWT_SECRET=musclesports_secret_key_change_this_in_production

# Site Configuration
NEXT_PUBLIC_SITE_NAME=MuscleSports
NEXT_PUBLIC_SITE_URL=https://musclesports.co.uk
EOF

echo "✅ .env file created (PLEASE UPDATE DATABASE PASSWORD!)"

# 5. Create MySQL database
echo "🗄️  Creating database..."
sudo mysql << 'SQLEOF'
CREATE DATABASE IF NOT EXISTS musclesports_lumify;
CREATE USER IF NOT EXISTS 'lumify'@'localhost' IDENTIFIED BY 'Lumify2025!';
GRANT ALL PRIVILEGES ON musclesports_lumify.* TO 'lumify'@'localhost';
FLUSH PRIVILEGES;
SQLEOF

# Update .env with correct database credentials
sed -i 's|DATABASE_URL=.*|DATABASE_URL=mysql://lumify:Lumify2025!@localhost:3306/musclesports_lumify|' .env

echo "✅ Database created: musclesports_lumify"
echo "✅ Database user: lumify"
echo "✅ Database password: Lumify2025!"

# 6. Build the application
echo "🔨 Building production app..."
npm run build

# 7. Set up PM2 to run the application
echo "🔧 Setting up PM2..."
npm install -g pm2
pm2 delete musclesports-lumify 2>/dev/null || true
pm2 start npm --name "musclesports-lumify" -- start
pm2 save

# 8. Create nginx configuration
echo "🌐 Creating nginx configuration..."
sudo tee /etc/nginx/sites-available/musclesports-lumify << 'NGINXEOF'
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
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
NGINXEOF

# Enable the site (backup old config first)
sudo cp /etc/nginx/sites-enabled/musclesports.co.uk /etc/nginx/sites-enabled/musclesports.co.uk.backup 2>/dev/null || true
sudo ln -sf /etc/nginx/sites-available/musclesports-lumify /etc/nginx/sites-enabled/musclesports-lumify

# Test nginx config
echo "🧪 Testing nginx configuration..."
sudo nginx -t

echo ""
echo "=========================================="
echo "✨ Deployment Complete!"
echo "=========================================="
echo ""
echo "📋 Summary:"
echo "  - App directory: /var/www/musclesports-lumify"
echo "  - Running on: http://localhost:3001"
echo "  - Database: musclesports_lumify"
echo "  - PM2 process: musclesports-lumify"
echo ""
echo "🔄 Next Steps:"
echo "  1. Review and update .env file with correct settings"
echo "  2. Import products: cd /var/www/musclesports-lumify && node scripts/import-products.js"
echo "  3. Reload nginx: sudo systemctl reload nginx"
echo "  4. Check PM2 status: pm2 status"
echo "  5. View logs: pm2 logs musclesports-lumify"
echo ""
echo "🌐 Access your site at: http://musclesports.co.uk"
echo "=========================================="
