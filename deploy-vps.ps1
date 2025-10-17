# MuscleSports VPS Deployment Script
# Run this to automatically deploy latest code to VPS

Write-Host "Deploying to VPS..." -ForegroundColor Green

# SSH connection details (update these with your VPS details)
$VPS_USER = "root"  # Change if different
$VPS_HOST = "musclesports.co.uk"  # Or use IP address
$VPS_PATH = "/var/www/MuscleSports"

# Commands to run on VPS
$DEPLOY_COMMANDS = @"
cd $VPS_PATH
echo '📥 Pulling latest code from Git...'
git pull origin main
echo '📦 Installing dependencies...'
npm install
echo '🔨 Building production version...'
npm run build
echo '🔄 Restarting PM2...'
pm2 restart all
echo '✅ Deployment complete!'
pm2 status
"@

# Execute via SSH
Write-Host "Connecting to VPS: $VPS_USER@$VPS_HOST" -ForegroundColor Cyan
ssh $VPS_USER@$VPS_HOST $DEPLOY_COMMANDS

Write-Host "`nDeployment finished!" -ForegroundColor Green
Write-Host "Visit: https://musclesports.co.uk" -ForegroundColor Cyan

