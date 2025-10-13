# MuscleSports Deployment Guide

## VPS Deployment Instructions

### 1. Clone the Repository
```bash
cd /var/www
git clone <your-repo-url> MuscleSports
cd MuscleSports
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env.local` file with the following:

```bash
# Database Configuration
DB_HOST=137.74.157.17
DB_PORT=3306
DB_USER=root
DB_PASSWORD=MscS!2025_Reboot@42
DB_NAME=ecommerce

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this

# Node Environment
NODE_ENV=production
```

### 4. Build the Application
```bash
npm run build
```

### 5. Start the Application
```bash
# For development
npm run dev

# For production (recommended to use PM2)
pm2 start npm --name "musclesports" -- start
pm2 save
pm2 startup
```

### 6. Nginx Configuration
The site should already be configured at `/etc/nginx/sites-available/musclesports.conf`

If not, create the configuration:
```nginx
server {
    listen 80;
    listen [::]:80;
    server_name musclesports.co.uk www.musclesports.co.uk;

    location / {
        proxy_pass http://localhost:4000;
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

Then enable it:
```bash
sudo ln -s /etc/nginx/sites-available/musclesports.conf /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### 7. SSL Configuration (Optional)
```bash
sudo certbot --nginx -d musclesports.co.uk -d www.musclesports.co.uk
```

## Database Connection

The application is configured to connect to the MySQL database at:
- **Host:** 137.74.157.17
- **Port:** 3306
- **User:** root
- **Password:** MscS!2025_Reboot@42
- **Database:** ecommerce

### Database Tables
The following tables should already exist:
- users
- products
- categories
- orders
- order_items
- business_settings (with maintenance mode fields)
- site_layouts
- salon_services

### Maintenance Mode
Admins can toggle maintenance mode from the admin panel. When enabled:
- Regular users see the maintenance page
- Admin users can still access the admin panel
- Settings are saved to `business_settings` table with ID 'default'

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4000
fuser -k 4000/tcp
# Or find and kill the process
lsof -ti:4000 | xargs kill -9
```

### Database Connection Issues
Ensure the database credentials in `.env.local` match your MySQL configuration.

### Build Errors
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### PM2 Management
```bash
# View logs
pm2 logs musclesports

# Restart application
pm2 restart musclesports

# Stop application
pm2 stop musclesports

# Remove from PM2
pm2 delete musclesports
```

## Important Notes

1. The site runs on **port 4000** (configured in package.json)
2. Default theme is set to **'musclesports'**
3. Database password contains special characters - ensure it's properly escaped in `.env.local`
4. All maintenance mode data saves to the 'default' business_settings record
5. Ensure NODE_ENV=production for optimal performance

