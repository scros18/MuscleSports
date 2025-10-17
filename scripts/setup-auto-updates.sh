#!/bin/bash

# MuscleSports Auto-Update Setup Script
# This script sets up automatic product updates from Tropicana Wholesale

echo "🚀 Setting up MuscleSports Auto-Update System..."

# Create the cron job to run every 6 hours
CRON_JOB="0 */6 * * * cd /var/www/MuscleSports && node scripts/scrape-sports-supplements.js >> /var/log/musclesports-scraper.log 2>&1"

# Add to crontab
(crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -

echo "✅ Cron job added: Every 6 hours"
echo "📝 Logs will be saved to: /var/log/musclesports-scraper.log"

# Create log file
touch /var/log/musclesports-scraper.log
chmod 644 /var/log/musclesports-scraper.log

echo "📊 Current crontab:"
crontab -l

echo ""
echo "🎯 Auto-update system ready!"
echo "🔄 Products will be updated every 6 hours"
echo "📈 All 38 categories will be scraped automatically"
echo "🏪 MuscleSports will always have fresh products!"

# Test run
echo ""
echo "🧪 Running test scrape..."
cd /var/www/MuscleSports
node scripts/scrape-sports-supplements.js
