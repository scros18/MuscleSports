# MuscleSports Setup Guide

## Overview
This is a separate instance of the MuscleSports e-commerce platform running on port 4000.

## Directory Structure
- **Location**: `/var/www/html-musclesports`
- **Port**: 4000 (configured in package.json)
- **Nginx Config**: `nginx-musclesports.conf`

## Setup Steps

### 1. Install Dependencies
```bash
cd /var/www/html-musclesports
npm install
```

### 2. Configure Environment Variables
Create a `.env.local` file with your database and configuration settings:
```bash
cp .env.example .env.local  # if example exists
# OR create new .env.local with required variables
```

Required environment variables (check existing .env files for reference):
- Database connection details
- JWT secrets
- Email configuration
- Any API keys

### 3. Database Setup
```bash
# Initialize database
npm run db:init

# Run migrations
npm run db:migrate:all

# Seed products if needed
npm run db:seed
```

### 4. Deploy Nginx Configuration
```bash
# Copy the nginx config to sites-available
sudo cp /var/www/html-musclesports/nginx-musclesports.conf /etc/nginx/sites-available/musclesports

# Create symbolic link to sites-enabled
sudo ln -s /etc/nginx/sites-available/musclesports /etc/nginx/sites-enabled/

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx
```

### 5. SSL Certificate Setup (after DNS is configured)
Once your domain DNS points to this server:
```bash
# Install certbot if not already installed
sudo apt-get update
sudo apt-get install certbot python3-certbot-nginx

# Generate SSL certificate
sudo certbot --nginx -d musclesports.co.uk -d www.musclesports.co.uk

# Update nginx config to use Let's Encrypt certificates
# Edit /etc/nginx/sites-available/musclesports and uncomment the SSL certificate lines
# Comment out the temporary self-signed certificate lines
```

### 6. Build and Start the Application

#### Development Mode
```bash
npm run dev
```

#### Production Mode
```bash
# Build the application
npm run build

# Start in production mode
npm start

# OR use the deployment script
npm run deploy:prod
```

### 7. Process Management (Optional - PM2)
To keep the application running:
```bash
# Install PM2 globally if not installed
sudo npm install -g pm2

# Start the application with PM2
pm2 start npm --name "musclesports" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

## Port Configuration
- **Main Ordify Instance**: Port 3000
- **QData Instance**: Port 3001
- **MuscleSports Instance**: Port 4000 ✓

## Domain Configuration
Update the nginx config with your actual domain names:
- Currently set to: `musclesports.co.uk` and `www.musclesports.co.uk`
- Modify `/etc/nginx/sites-available/musclesports` if different

## Firewall Configuration
Ensure port 4000 is not directly exposed to the internet:
```bash
# Check firewall status
sudo ufw status

# Port 4000 should only be accessible locally (not exposed)
# Only ports 80 and 443 should be open
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

## Troubleshooting

### Check Application Logs
```bash
# If using PM2
pm2 logs musclesports

# If running directly
# Check terminal output
```

### Check Nginx Logs
```bash
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

### Test Local Connection
```bash
# Test if the app is running on port 4000
curl http://localhost:4000
```

### Check Port Usage
```bash
# See what's running on port 4000
sudo netstat -tlnp | grep 4000
# OR
sudo lsof -i :4000
```

## Maintenance

### Update Application
```bash
cd /var/www/html-musclesports
git pull origin main
npm install
npm run build
pm2 restart musclesports  # if using PM2
# OR restart your process manually
```

### Database Migrations
```bash
npm run db:migrate:all
```

## Notes
- This instance runs independently from the main Ordify instance
- Both can run simultaneously on the same server
- Each uses its own database configuration
- Each has its own nginx configuration
- Each runs on a different port
