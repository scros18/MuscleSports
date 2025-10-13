# Quick VPS Setup for MuscleSports

## Step 1: Pull the Latest Code
```bash
cd /var/www/MuscleSports
git pull origin main
```

## Step 2: Create Environment File
```bash
cat > .env.local << 'EOF'
DB_HOST=137.74.157.17
DB_PORT=3306
DB_USER=root
DB_PASSWORD=MscS!2025_Reboot@42
DB_NAME=ecommerce
JWT_SECRET=musclesports-jwt-secret-key-2025
NODE_ENV=production
EOF
```

## Step 3: Install Dependencies
```bash
npm install
```

## Step 4: Build the Application
```bash
npm run build
```

## Step 5: Start with PM2 (Port 4000)
```bash
# Kill any existing process on port 4000
fuser -k 4000/tcp

# Start the app
pm2 delete musclesports 2>/dev/null || true
pm2 start npm --name "musclesports" -- start
pm2 save
```

## Step 6: Verify It's Running
```bash
# Check PM2 status
pm2 status

# Check logs
pm2 logs musclesports --lines 50

# Test the endpoint
curl http://localhost:4000
```

## Step 7: Nginx Should Already Be Configured
Your nginx config at `/etc/nginx/sites-available/musclesports.conf` should already be pointing to port 4000.

If you need to verify:
```bash
cat /etc/nginx/sites-available/musclesports.conf
sudo nginx -t
sudo systemctl reload nginx
```

## Database Connection
✅ The app will connect to: **137.74.157.17:3306**
✅ Using credentials: **root / MscS!2025_Reboot@42**
✅ Database: **ecommerce**

## Admin Access
- Default admin user should already exist in your database
- Login at: https://musclesports.co.uk/login
- Admin panel: https://musclesports.co.uk/admin

## Maintenance Mode
- Accessible from Admin Panel → Settings
- Saves to database properly now
- Only admins can access site when maintenance is enabled

## Troubleshooting

### If port 4000 is busy:
```bash
fuser -k 4000/tcp
# or
lsof -ti:4000 | xargs kill -9
```

### If database connection fails:
Check that MySQL allows connections from localhost to the remote IP:
```bash
mysql -h 137.74.157.17 -u root -p
# Enter password: MscS!2025_Reboot@42
```

### If build fails:
```bash
rm -rf .next node_modules
npm install
npm run build
```

### View live logs:
```bash
pm2 logs musclesports --lines 100 -f
```

## Key Features Now Available:
✅ Unified blue-indigo-violet color scheme
✅ Review cards all same color (blue-indigo gradient)
✅ Nutrition Calculator (blue theme)
✅ Recipe Generator (violet theme)  
✅ Maintenance mode saves properly to database
✅ Theme defaults to 'musclesports'
✅ All changes pushed to git

