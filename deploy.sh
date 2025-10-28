#!/bin/bash
# Quick deployment script for MuscleSports
# Run this after you've configured .env.local

echo "🚀 MuscleSports Quick Deploy"
echo "=============================="

# Navigate to directory
cd /var/www/html-musclesports || exit

# Install dependencies if not already done
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build
echo "🏗️  Building application..."
npm run build

# Deploy nginx config
echo "⚙️  Deploying nginx configuration..."
sudo cp nginx-musclesports.conf /etc/nginx/sites-available/musclesports
if [ ! -L "/etc/nginx/sites-enabled/musclesports" ]; then
    sudo ln -s /etc/nginx/sites-available/musclesports /etc/nginx/sites-enabled/musclesports
fi

# Test and reload nginx
echo "🔄 Reloading nginx..."
sudo nginx -t && sudo systemctl reload nginx

# Check if PM2 is installed
if command -v pm2 &> /dev/null; then
    echo "🔄 Starting with PM2..."
    pm2 stop musclesports 2>/dev/null || true
    pm2 delete musclesports 2>/dev/null || true
    pm2 start npm --name "musclesports" -- start
    pm2 save
    echo "✅ Started with PM2"
    pm2 status
else
    echo "⚠️  PM2 not found. Starting in foreground..."
    echo "   Install PM2 globally: sudo npm install -g pm2"
    npm start
fi

echo ""
echo "✅ Deployment complete!"
echo "   - App running on: http://localhost:4000"
echo "   - Domain: https://musclesports.co.uk (after DNS setup)"
echo ""
