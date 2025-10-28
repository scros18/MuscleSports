#!/bin/bash

# Setup cron job for automated Tropicana product syncing

echo "Setting up Tropicana sync cron job..."

# Create log directory if it doesn't exist
sudo mkdir -p /var/log/tropicana
sudo chown www-data:www-data /var/log/tropicana

# Create logrotate configuration
sudo bash -c 'cat > /etc/logrotate.d/tropicana-sync << EOF
/var/log/tropicana-sync.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
}
EOF'

# Add cron job (runs every 6 hours at :00 minutes)
CRON_CMD="0 */6 * * * cd /var/www/html-musclesports && /usr/bin/npm run sync:tropicana:auto"

# Check if cron job already exists
if ! crontab -l 2>/dev/null | grep -q "sync:tropicana:auto"; then
    (crontab -l 2>/dev/null; echo "$CRON_CMD") | crontab -
    echo "✅ Cron job added: Tropicana sync will run every 6 hours"
else
    echo "⚠️  Cron job already exists, skipping..."
fi

echo ""
echo "Cron Schedule:"
echo "  - Every 6 hours (00:00, 06:00, 12:00, 18:00)"
echo ""
echo "Manual sync command:"
echo "  npm run sync:tropicana"
echo ""
echo "View logs:"
echo "  tail -f /var/log/tropicana-sync.log"
echo ""
echo "Current crontab:"
crontab -l | grep tropicana || echo "  (no tropicana cron jobs found)"
