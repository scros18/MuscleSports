# MuscleSports Deployment Summary

## ✅ Completed Setup

### 1. Repository Cloned
- **Source**: https://github.com/scros18/MuscleSports.git
- **Location**: `/var/www/html-musclesports`
- **Status**: Successfully cloned with 4078 objects

### 2. Nginx Configuration Created
- **File**: `/var/www/html-musclesports/nginx-musclesports.conf`
- **Port**: Configured to proxy to localhost:4000
- **Domain**: Set up for musclesports.co.uk and www.musclesports.co.uk
- **SSL**: Currently using temporary self-signed cert (update after DNS setup)
- **Features**:
  - HTTP to HTTPS redirect
  - Gzip compression
  - Security headers
  - Next.js static file caching
  - Image optimization proxy
  - WebSocket support for HMR

### 3. Documentation Created
Three helpful guides:
- **SETUP.md** - Complete setup instructions
- **PORT-REFERENCE.md** - Port allocation and quick commands
- **setup.sh** - Interactive setup script

### 4. Environment Template
- `.env.example` exists in the repository
- Ready to be copied to `.env.local` with your configuration

## 🔄 Next Steps to Complete

### Immediate Actions

1. **Install Dependencies**
   ```bash
   cd /var/www/html-musclesports
   npm install
   ```

2. **Configure Environment**
   ```bash
   cp .env.example .env.local
   # Then edit .env.local with your settings:
   # - Database credentials
   # - JWT secret
   # - Site URLs (change to musclesports.co.uk)
   # - Site name (change to MuscleSports)
   ```

3. **Deploy Nginx Configuration**
   ```bash
   sudo cp nginx-musclesports.conf /etc/nginx/sites-available/musclesports
   sudo ln -s /etc/nginx/sites-available/musclesports /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

4. **Database Setup**
   ```bash
   npm run db:init
   npm run db:migrate:all
   ```

5. **Build & Start**
   ```bash
   npm run build
   npm start
   # Or for production with PM2:
   pm2 start npm --name musclesports -- start
   pm2 save
   ```

### After DNS Configuration

Once you point musclesports.co.uk to this server:

```bash
# Install SSL certificate
sudo certbot --nginx -d musclesports.co.uk -d www.musclesports.co.uk

# Update nginx config to use Let's Encrypt cert
sudo nano /etc/nginx/sites-available/musclesports
# Uncomment the Let's Encrypt SSL lines
# Comment out the self-signed cert lines

sudo nginx -t
sudo systemctl reload nginx
```

## 📋 Port Allocation

| Service | Port | Status |
|---------|------|--------|
| Main Ordify | 3000 | ✓ Running |
| QData | 3001 | ✓ Running |
| MuscleSports | 4000 | ⚙️ To be started |

## 🛠️ Quick Start Script

For convenience, you can use the automated setup script:

```bash
cd /var/www/html-musclesports
./setup.sh
```

This interactive script will:
- Install dependencies
- Help create .env.local
- Deploy nginx configuration
- Initialize database
- Build the application

## 📁 File Structure

```
/var/www/html-musclesports/
├── nginx-musclesports.conf   # Nginx proxy configuration
├── SETUP.md                   # Detailed setup guide
├── PORT-REFERENCE.md          # Port and command reference
├── setup.sh                   # Interactive setup script
├── .env.example               # Environment variables template
├── package.json               # Dependencies (port 4000 configured)
└── ... (rest of the Next.js app)
```

## 🔐 Security Notes

1. **Ports**: Only 80, 443, and 22 should be open to the internet
2. **Internal**: Ports 3000, 3001, 4000 are only accessible via localhost
3. **SSL**: Update to proper SSL certificates after DNS setup
4. **Environment**: Keep .env.local secure with proper credentials

## 🐛 Troubleshooting

### Check if port 4000 is in use
```bash
sudo lsof -i :4000
```

### Test the app locally
```bash
curl http://localhost:4000
```

### View logs
```bash
pm2 logs musclesports  # if using PM2
sudo tail -f /var/log/nginx/error.log
```

### Check nginx config
```bash
sudo nginx -t
```

## 📞 Support Commands

```bash
# Check all running services
pm2 status

# Check port usage
sudo netstat -tlnp | grep -E '3000|3001|4000'

# Check nginx status
sudo systemctl status nginx
```

---

## Summary

✅ MuscleSports repository cloned to `/var/www/html-musclesports`
✅ Nginx configuration ready (port 4000)
✅ Setup documentation and scripts created
⚙️ Ready for npm install and configuration
⚙️ Ready to deploy nginx config
⚙️ Ready for SSL certificate after DNS setup

**You now have both e-commerce platforms ready to run on the same server!**
