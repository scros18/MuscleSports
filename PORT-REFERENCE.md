# Port Allocation Reference

## Current Server Setup

| Service | Port | Domain | Directory |
|---------|------|--------|-----------|
| Main Ordify | 3000 | ordifydirect.com | /var/www/html |
| QData | 3001 | ordifydirect.com/qdata | /var/www/qData |
| MuscleSports | 4000 | musclesports.co.uk | /var/www/html-musclesports |

## Nginx Configurations

### Main Ordify
- **Config**: `/etc/nginx/sites-available/ordify`
- **Enabled**: `/etc/nginx/sites-enabled/ordify`
- **Proxy**: Port 3000 with /qdata path to port 3001

### MuscleSports
- **Config**: `/etc/nginx/sites-available/musclesports`
- **Enabled**: `/etc/nginx/sites-enabled/musclesports`
- **Proxy**: Port 4000

## Process Management Commands

### Check Running Processes
```bash
# Check what's running on each port
sudo netstat -tlnp | grep -E '3000|3001|4000'

# Or with lsof
sudo lsof -i :3000
sudo lsof -i :3001
sudo lsof -i :4000

# Check PM2 status
pm2 status
```

### Start/Stop Services

#### MuscleSports
```bash
cd /var/www/html-musclesports

# Development
npm run dev

# Production
npm start

# With PM2
pm2 start npm --name musclesports -- start
pm2 stop musclesports
pm2 restart musclesports
pm2 logs musclesports
```

#### Main Ordify
```bash
cd /var/www/html

# Check your existing process management setup
pm2 list
```

## Nginx Commands
```bash
# Test configuration
sudo nginx -t

# Reload nginx (without downtime)
sudo systemctl reload nginx

# Restart nginx
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx

# View nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log
```

## Firewall Status
```bash
# Check firewall
sudo ufw status

# Only these ports should be open to public:
# - 80 (HTTP)
# - 443 (HTTPS)
# - 22 (SSH)

# Ports 3000, 3001, 4000 should only be accessible via localhost
```

## Quick Health Check
```bash
# Test each service locally
curl http://localhost:3000  # Main Ordify
curl http://localhost:3001  # QData
curl http://localhost:4000  # MuscleSports

# Test via nginx
curl -k https://ordifydirect.com
curl -k https://musclesports.co.uk  # after DNS setup
```
