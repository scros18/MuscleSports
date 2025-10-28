# Tropicana Scraping Guide

## Problem
Tropicana Wholesale blocks your server's IP (93.184.252.3 times out). You need to scrape from your **local machine** where you can access the site normally.

## Solution: Local Scraper → Server Import

### Step 1: Run Scraper Locally (on your computer)

```bash
# Clone the repo to your local machine
git clone https://github.com/scros18/MuscleSports.git
cd MuscleSports

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local
# Edit .env.local with your Tropicana credentials

# Run the local scraper
npm run scrape:tropicana:local

# OR if you get tsx errors, use the plain JS version:
node scripts/local-tropicana-scraper.js
```

**What happens:**
1. Chrome opens (visible window)
2. You manually log in to Tropicana
3. Press Enter in terminal
4. Scraper discovers all SKUs from collections
5. Fetches product details via Tropicana API (Fred's method)
6. Saves to `data/tropicana-scraped/products-YYYY-MM-DD.json`

### Step 2: Upload to Server

```bash
# From your local machine, upload the JSON
scp data/tropicana-scraped/products-*.json root@musclesports.co.uk:/var/www/html-musclesports/data/tropicana-scraped/
```

### Step 3: Import on Server

```bash
# SSH to server
ssh root@musclesports.co.uk

# Import the products
cd /var/www/html-musclesports
npm run import:tropicana:local data/tropicana-scraped/products-YYYY-MM-DD.json

# Sync to main products table with SEO
npx tsx scripts/sync-tropicana-to-products.ts
```

### Step 4: Restart App

```bash
pm2 restart musclesports
```

---

## How It Works

### Fred's Method
Fred's JAR uses the Tropicana **API endpoint**:
```
POST https://www.tropicanawholesale.com/Services/ProductDetails.asmx/GetProductDetailsByCode
Content-Type: application/json; charset=UTF-8
Body: {"ProductCode": "SKU123"}
```

### Our Approach
1. **Manual Login**: You log in once, we save cookies/localStorage
2. **SKU Discovery**: Scrape all product handles from collections pages
3. **API Fetch**: Use Fred's API to get full product details (price, stock, flavours, etc.)
4. **Server Import**: Upload JSON and import into MySQL

---

## Automation

### Option A: Run locally on schedule
Set up a cron on your **local machine** that:
1. Runs the scraper
2. SCPs the file to server
3. SSHes to server and imports

### Option B: VPN/Proxy
If you have a VPN or residential proxy that can access Tropicana:
```bash
# Set proxy in .env.local on server
PROXY_SERVER=http://user:pass@proxy-host:port
```

---

## Troubleshooting

### "Navigation timeout"
- Tropicana is blocking your IP
- Run scraper from a different network

### "API returns 401/403"
- Session expired
- Delete `.puppeteer/tropicana-*` and log in again

### "No SKUs found"
- Check if you're logged in
- Collections page structure may have changed

---

## Next Steps

1. **Run locally RIGHT NOW**:
   ```bash
   npm run scrape:tropicana:local
   ```

2. **Upload & import** the JSON to server

3. **Verify** products show in admin

4. **Set up automation** with local cron or cloud scraper

---

## Files Created

- `scripts/local-tropicana-scraper.ts` - Local scraper with Fred's API
- `scripts/import-tropicana-local.ts` - Server-side importer
- `data/tropicana-scraped/` - Output directory for JSON files

## Commands

```bash
# Local machine
npm run scrape:tropicana:local

# Server
npm run import:tropicana:local data/tropicana-scraped/products-2024-10-28.json
```
