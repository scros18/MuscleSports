# Tropicana Wholesale Scraper

This is a TypeScript port of Fred's Java-based Tropicana scraper, converted from the decompiled JAR file. It fetches product data from the Tropicana Wholesale API and can sync it to your database.

## Features

- ✅ Fetches product data from Tropicana Wholesale API
- ✅ Multi-threaded/concurrent requests (10 parallel requests with rate limiting)
- ✅ Automatic retry with exponential backoff for rate limits (429 errors)
- ✅ 500ms delay between requests to avoid overwhelming the API
- ✅ Exports to CSV format
- ✅ Downloads product images
- ✅ Database synchronization
- ✅ Progress tracking
- ✅ Error handling and retry logic

## Product Data Retrieved

For each SKU, the scraper fetches:
- Product name
- SKU/Product code
- Price
- Stock level
- Brand
- Barcode
- Flavour
- Size
- Category
- Nutritional information
- Expiry date
- Product images (LARGE size)

## Usage

### 1. Command Line (Standalone)

```bash
# Create a skus.txt file with your product SKUs (one per line)
echo "MS001" > skus.txt
echo "MS002" >> skus.txt
echo "MS003" >> skus.txt

# Run the scraper
npm run scrape:tropicana

# With image download
npm run scrape:tropicana -- --download-images

# Or use tsx directly
tsx scripts/run-tropicana-scraper.ts skus.txt
```

### 2. API Endpoint (Integrated)

```bash
# POST request to sync products
curl -X POST http://localhost:4000/api/admin/tropicana/sync \
  -H "Content-Type: application/json" \
  -d '{"skus": ["MS001", "MS002", "MS003"]}'

# GET request to check sync status
curl http://localhost:4000/api/admin/tropicana/sync
```

### 3. Programmatic Usage

```typescript
import { TropicanaScraper } from '@/lib/tropicana-scraper';

async function fetchProducts() {
  const scraper = new TropicanaScraper();
  
  // Fetch products from SKU file
  const products = await scraper.execute('skus.txt');
  
  // Export to CSV
  await scraper.exportToCsv();
  
  // Download images (optional)
  await scraper.downloadImages();
  
  // Access products
  console.log(`Fetched ${products.length} products`);
  products.forEach(product => {
    console.log(`${product.sku}: ${product.name} - £${product.productPrice}`);
  });
}
```

## Configuration

### API Details

The scraper uses the following Tropicana Wholesale API endpoint:
```
https://www.tropicanawholesale.com/Services/ProductDetails.asmx/GetProductDetailsByCode
```

**API Request Parameters:**
- `ProductCode`: The SKU to fetch
- `LanguageID`: 1 (English)
- `DomainNameID`: 1
- `ProductPriceListId`: 32735 (from Fred's implementation)

### Customization

```typescript
// Custom output paths
const scraper = new TropicanaScraper(
  'custom-images-folder',  // Image folder
  'custom-output.csv'       // CSV output path
);

// The scraper now uses 10 concurrent requests by default (reduced from 40)
// with automatic rate limiting and retry logic to handle API throttling
await scraper.execute('skus.txt');
```

## Output Files

### CSV Export (`DropshipProductFeed.csv`)

The scraper exports a CSV file with the following columns:
- SKU
- Name
- Tax (VAT)
- Stock Level
- Barcode
- Brand
- Flavour
- Category
- Nutritional Information
- Size
- Price
- Expiry Date
- Image URL
- Keywords
- Trimmed Name

### Image Downloads

Images are downloaded to the `tropicana-images/` folder by default, with filenames matching the SKU (e.g., `MS001.jpg`).

## Database Integration

The API route (`/api/admin/tropicana/sync`) automatically syncs fetched products to your database. It:

1. Fetches products from Tropicana API
2. Inserts new products or updates existing ones
3. Stores metadata (flavour, size, expiry date) as JSON
4. Returns statistics on synced products

### Database Schema

Products are stored in the `products` table with:
- `sku` (primary key)
- `name`
- `description` (nutritional information)
- `price`
- `stock`
- `brand`
- `category`
- `image_url`
- `barcode`
- `metadata` (JSON: flavour, size, expiry date, etc.)

## Comparison with Original Java Version

| Feature | Java (Fred's) | TypeScript (Ours) |
|---------|---------------|-------------------|
| Language | Java 21 | TypeScript/Node.js |
| Concurrency | ExecutorService (40 threads) | Promise.all batches (10 concurrent) |
| Rate Limiting | None | 500ms delay + exponential backoff |
| Retry Logic | None visible | 3 retries with backoff on 429 |
| HTTP Client | java.net.http.HttpClient | Node.js https |
| JSON Parsing | Gson | Native JSON.parse |
| CSV Export | Custom | Built-in |
| Image Download | Java File I/O | Node.js streams |
| Database | N/A in JAR | MySQL integration |

## How It Was Created

This scraper was reverse-engineered from Fred's Java JAR file:

1. **Decompiled** the JAR using `javap -c -private`
2. **Analyzed** the following classes:
   - `ScraperApplication.class` - Main entry point
   - `ProductModel.class` - Data model
   - `ApiFetchStage.class` - API integration
   - `ExportCsvStage.class` - CSV export
   - `CacheImageStage.class` - Image downloads
3. **Converted** Java patterns to TypeScript:
   - ExecutorService → Promise.all with batching
   - Gson → JSON.parse/stringify
   - File I/O → fs/promises
4. **Added** enhancements:
   - Database integration
   - API endpoints
   - Better error handling
   - Type safety

## Troubleshooting

### Rate Limiting (429 Errors)

If you see "API returned status 429" errors:
- ✅ **Already handled!** The scraper now automatically retries with exponential backoff
- The scraper uses 10 concurrent requests (reduced from 40) to be more API-friendly
- 500ms delay between individual requests
- Up to 3 automatic retries with 2s, 4s, 8s delays

To further reduce rate limiting:
```typescript
// You can manually reduce concurrency by modifying the fetchProducts call
// in lib/tropicana-scraper.ts, change concurrency = 10 to a lower number like 5
```

### No products fetched

- Verify your SKUs are correct
- Check API connectivity: `curl https://www.tropicanawholesale.com`
- Ensure `ProductPriceListId: 32735` is still valid

### Images not downloading

- Check image URLs are valid
- Ensure network access to `tropicanawholesale.com`
- Verify disk space and write permissions

### Database sync errors

- Check database connection in `.env.local`
- Ensure products table exists: `npm run db:init`
- Check for duplicate SKUs

## Future Enhancements

Potential improvements based on the original Java implementation:

- [ ] Add `DuplicateRemovalStage` - Remove duplicate products
- [ ] Add `GroupFlavourStage` - Group products by flavour
- [ ] Add `KeywordStage` - Generate SEO keywords
- [ ] Add `PriceCorrectionStage` - Apply pricing rules
- [ ] Add `CategoryMapStage` - Map Tropicana categories to internal ones
- [ ] Add caching layer for API responses
- [ ] Add rate limiting/throttling
- [ ] Add webhook notifications on completion

## Credits

Original Java implementation by **Fred** (`tropicana-scraper-1.0-SNAPSHOT.jar`)  
TypeScript conversion and enhancements by **MuscleSports Team**

## License

Same as the main MuscleSports project.
