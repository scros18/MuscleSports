# VPS Deployment Guide for MuscleSports

## Prerequisites
- VPS with Node.js 18+ installed
- MySQL/MariaDB database
- Nginx or Caddy for reverse proxy
- Domain pointed to VPS (musclesports.co.uk)

## Step 1: Clone the Repository

```bash
cd /var/www
git clone <your-repo-url> MuscleSports
cd MuscleSports
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
nano .env.local
```

Add the following configuration (update with your actual values):

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=MscS!2025_Reboot@42
DB_NAME=ecommerce

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# PayPal Configuration (Optional)
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
PAYPAL_MODE=sandbox

# Application URL
NEXT_PUBLIC_APP_URL=https://musclesports.co.uk
```

## Step 4: Initialize the Database

```bash
# Create tables
npm run db:init

# Set default MuscleSports theme and settings
npx ts-node scripts/set-default-settings.ts
```

## Step 5: Import Products (if needed)

If you have a products CSV file:

```bash
node scripts/import-tropicana-csv.js /path/to/products.csv
```

## Step 6: Build the Application

```bash
npm run build
```

## Step 7: Start the Application

For production, use PM2:

```bash
# Install PM2 globally if not already installed
npm install -g pm2

# Start the application
pm2 start npm --name "musclesports" -- start

# Save PM2 configuration
pm2 save

# Set PM2 to start on boot
pm2 startup
```

Or use the dev server for testing:

```bash
npm run dev
```

## Step 8: Verify Database Connection

The application should now be running. Check the logs:

```bash
pm2 logs musclesports
```

If you see database connection errors:
1. Verify MySQL is running: `systemctl status mysql`
2. Check database credentials in `.env.local`
3. Ensure the database exists: `mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS ecommerce;"`

## Step 9: Configure Nginx (if using Nginx)

Your existing Nginx configuration should work. Verify it's pointing to the correct port:

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name musclesports.co.uk www.musclesports.co.uk;

    location / {
        proxy_pass http://localhost:3000;
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
```

Reload Nginx:

```bash
systemctl reload nginx
```

## Step 10: Test the Site

Visit https://musclesports.co.uk and verify:
- ✓ Site loads with MuscleSports theme
- ✓ Products are visible
- ✓ Admin panel is accessible
- ✓ Theme persists after page refresh

## Troubleshooting

### Database Connection Issues

If you see "Access denied" errors:

```bash
# Login to MySQL
mysql -u root -p

# Grant permissions
GRANT ALL PRIVILEGES ON ecommerce.* TO 'root'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Port Already in Use

If port 3000 is already in use:

```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or change the port in package.json
"start": "next start -p 4000"
```

### Theme Not Loading

If the site shows the wrong theme:

```bash
# Run the default settings script again
npx ts-node scripts/set-default-settings.ts

# Restart the application
pm2 restart musclesports
```

### Build Errors

If you encounter build errors:

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Build again
npm run build
```

## Maintenance

### Updating the Site

```bash
cd /var/www/MuscleSports
git pull origin main
npm install
npm run build
pm2 restart musclesports
```

### Viewing Logs

```bash
pm2 logs musclesports
```

### Checking Status

```bash
pm2 status
```

### Database Backup

```bash
mysqldump -u root -p ecommerce > backup_$(date +%Y%m%d).sql
```

## Security Notes

1. **Change JWT_SECRET** - Use a strong, unique secret in production
2. **Database Credentials** - Use a dedicated MySQL user (not root) with limited privileges
3. **SSL Certificate** - Ensure SSL is configured in Nginx/Caddy
4. **Firewall** - Only allow necessary ports (80, 443, SSH)
5. **Regular Updates** - Keep dependencies updated: `npm update`

## Quick Reference

| Task | Command |
|------|---------|
| Start app | `pm2 start npm --name "musclesports" -- start` |
| Stop app | `pm2 stop musclesports` |
| Restart app | `pm2 restart musclesports` |
| View logs | `pm2 logs musclesports` |
| Update code | `git pull && npm install && npm run build && pm2 restart musclesports` |
| Init DB | `npm run db:init` |
| Set defaults | `npx ts-node scripts/set-default-settings.ts` |

## Support

If you encounter any issues, check:
1. PM2 logs: `pm2 logs musclesports`
2. Nginx error logs: `tail -f /var/log/nginx/error.log`
3. Database connection: `mysql -u root -p -e "SHOW DATABASES;"`

