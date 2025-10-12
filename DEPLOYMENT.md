# Lumify/Ordify Deployment Guide

## Server Details Found
- **FiveM Server**: root@144.76.238.92 (port 22)
- **SSH Key**: `C:\Users\scros\.ssh\id_rsa`
- **MuscleSports VPS**: root@137.74.157.17 (port 22)

## Pre-Deployment Checklist

### 1. Find Current OrdifyDirect Location
Before deploying, we need to find where ordifydirect.com is currently hosted:

```bash
# Connect to FiveM server
ssh -i C:\Users\scros\.ssh\id_rsa root@144.76.238.92

# Search for ordifydirect files
find /var/www -name "*ordify*" 2>/dev/null
find /home -name "*ordify*" 2>/dev/null
find / -name "ordifydirect.com" 2>/dev/null

# Check nginx/apache config
cat /etc/nginx/sites-enabled/* | grep ordify
cat /etc/apache2/sites-enabled/* | grep ordify 2>/dev/null

# Check common web directories
ls -la /var/www/
ls -la /var/www/html/
ls -la /home/*/public_html/
```

### 2. Check Current Version
Once location is found, check if it's the old master version:
```bash
cd /path/to/ordifydirect
git log --oneline -5
git status
```

## Deployment Options

### Option A: Deploy to Same Location (Update)
```bash
# Backup current version
cd /path/to/ordifydirect
cp -r . ../ordifydirect_backup_$(date +%Y%m%d)

# Pull latest changes
git fetch origin
git checkout main
git pull origin main

# Install dependencies and build
npm install
npm run build

# Restart service (PM2 or systemd)
pm2 restart ordifydirect
# OR
systemctl restart ordifydirect
```

### Option B: Deploy to New Location
```bash
# Clone repository to new location
cd /var/www/
git clone https://github.com/Leon2k909/html.git lumify
cd lumify

# Setup environment
cp .env.example .env
nano .env  # Configure database and settings

# Install and build
npm install
npm run build

# Start with PM2
pm2 start npm --name "lumify" -- start
pm2 save

# Update nginx config to point to new location
nano /etc/nginx/sites-enabled/ordifydirect.com
# Update proxy_pass to new port
nginx -t
systemctl reload nginx
```

## Environment Variables Required
```
DATABASE_URL=mysql://user:password@localhost:3306/ordify
NODE_ENV=production
PORT=3000
JWT_SECRET=your-secret-here
```

## Post-Deployment Verification
```bash
# Check if service is running
pm2 status
curl http://localhost:3000

# Check logs
pm2 logs lumify
tail -f /var/log/nginx/ordifydirect-error.log
```

## Rollback Plan
```bash
# If deployment fails, restore backup
cd /var/www/
rm -rf ordifydirect
mv ordifydirect_backup_YYYYMMDD ordifydirect
pm2 restart ordifydirect
```

---

## Next Steps
1. SSH into server and find current ordifydirect.com location
2. Verify it's the old master version
3. Choose deployment strategy (update or new location)
4. Execute deployment commands
5. Test the site on ordifydirect.com
