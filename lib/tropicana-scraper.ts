/**
 * Tropicana Wholesale API Scraper
 * Converted from Fred's Java implementation to TypeScript
 * Fetches product data from Tropicana Wholesale API
 */

import https from 'https';
import http from 'http';
import fs from 'fs/promises';
import path from 'path';

// Types based on the decompiled Java models
export interface ProductModel {
  sku: string;
  name: string;
  tax: string;
  stockLevel: number;
  barcode: string;
  brand: string;
  flavour: string;
  filterByCategory: string;
  nutritionalInformation: string;
  size: string;
  productPrice: number;
  expiryDate: string;
  imageUrl: string;
  keywords: string;
  trimmedName: string;
}

export interface ProductGroupModel {
  baseName: string;
  products: ProductModel[];
  mainProduct: ProductModel;
}

interface ApiRequest {
  request: {
    ProductCode: string;
    LanguageID: number;
    DomainNameID: number;
    ProductPriceListId: number;
  };
}

interface ApiResponse {
  d: {
    Product: {
      ProductName: string;
      ProductCode: string;
      ProductStockCheck: {
        StockLevel: number;
      };
      ProductPrice: {
        Price: number;
      };
      ProductCategoryID: string;
      Attributes?: {
        Barcode?: string;
        Brand?: string;
        Flavour?: string;
        NutritionalInformation?: string;
        Size?: string;
        ExpiryDate?: string;
      };
      ProductImages?: {
        DEFAULT?: {
          Images?: Array<{
            Sizes?: {
              LARGE?: {
                ImagePath: string;
              };
            };
          }>;
        };
      };
    };
  };
}

export class TropicanaScraper {
  private static readonly API_URL = 'https://www.tropicanawholesale.com/Services/ProductDetails.asmx/GetProductDetailsByCode';
  private static readonly PRICE_LIST_ID = 32735; // From decompiled code
  private static readonly MAX_RETRIES = 3;
  private static readonly RETRY_DELAY = 2000; // 2 seconds
  private static readonly RATE_LIMIT_DELAY = 500; // 500ms between requests
  
  private products: ProductModel[] = [];
  private groupedProducts: ProductGroupModel[] = [];
  private cachedImages: Map<string, string> = new Map();
  private imageFolder: string;
  private outputCsvPath: string;
  private lastRequestTime: number = 0;

  constructor(imageFolder = 'tropicana-images', outputCsvPath = 'DropshipProductFeed.csv') {
    this.imageFolder = imageFolder;
    this.outputCsvPath = outputCsvPath;
  }

  /**
   * Main execution method - reads SKUs and fetches product data
   */
  async execute(skuFilePath = 'skus.txt'): Promise<ProductModel[]> {
    try {
      // Read SKUs from file
      const skus = await this.readSkus(skuFilePath);
      console.log(`Found ${skus.length} SKUs to process`);

      // Fetch products with concurrency control
      await this.fetchProducts(skus);

      console.log(`\nSuccessfully fetched ${this.products.length} products`);
      return this.products;
    } catch (error) {
      console.error('Error executing scraper:', error);
      throw error;
    }
  }

  /**
   * Read SKUs from file (one per line)
   */
  private async readSkus(filePath: string): Promise<string[]> {
    const content = await fs.readFile(filePath, 'utf-8');
    return content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0);
  }

  /**
   * Fetch products from Tropicana API with concurrency control
   */
  private async fetchProducts(skus: string[], concurrency = 10): Promise<void> {
    let processed = 0;
    let successful = 0;
    const total = skus.length;

    console.log('Fetching product data from API...');
    console.log(`Note: Using reduced concurrency (${concurrency}) to avoid rate limiting`);

    // Process in batches for concurrency control - REDUCED from 40 to 10
    for (let i = 0; i < skus.length; i += concurrency) {
      const batch = skus.slice(i, i + concurrency);
      const promises = batch.map(async (sku) => {
        try {
          const product = await this.fetchProductWithRetry(sku);
          if (product) {
            this.products.push(product);
            successful++;
          }
          processed++;
          this.printProgress(processed, total, successful);
        } catch (error) {
          processed++;
          this.printProgress(processed, total, successful);
          console.error(`\nError fetching SKU ${sku}:`, (error as Error).message);
        }
      });

      await Promise.all(promises);
      
      // Add delay between batches to avoid overwhelming the API
      if (i + concurrency < skus.length) {
        await this.sleep(1000); // 1 second between batches
      }
    }

    console.log(`\nFetching complete: ${successful}/${total} products retrieved`);
  }

  /**
   * Fetch a single product with retry logic for rate limiting
   */
  private async fetchProductWithRetry(sku: string, retryCount = 0): Promise<ProductModel | null> {
    try {
      // Rate limiting: ensure minimum delay between requests
      const now = Date.now();
      const timeSinceLastRequest = now - this.lastRequestTime;
      if (timeSinceLastRequest < TropicanaScraper.RATE_LIMIT_DELAY) {
        await this.sleep(TropicanaScraper.RATE_LIMIT_DELAY - timeSinceLastRequest);
      }
      this.lastRequestTime = Date.now();

      return await this.fetchProduct(sku);
    } catch (error) {
      const errorMessage = (error as Error).message;
      
      // Check if it's a rate limit error (429)
      if (errorMessage.includes('429') && retryCount < TropicanaScraper.MAX_RETRIES) {
        const delay = TropicanaScraper.RETRY_DELAY * Math.pow(2, retryCount); // Exponential backoff
        console.log(`\n⏳ Rate limited on ${sku}, retrying in ${delay/1000}s... (attempt ${retryCount + 1}/${TropicanaScraper.MAX_RETRIES})`);
        await this.sleep(delay);
        return this.fetchProductWithRetry(sku, retryCount + 1);
      }
      
      throw error;
    }
  }

  /**
   * Sleep helper function
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch a single product from the Tropicana API
   */
  private async fetchProduct(sku: string): Promise<ProductModel | null> {
    const requestBody: ApiRequest = {
      request: {
        ProductCode: sku,
        LanguageID: 1,
        DomainNameID: 1,
        ProductPriceListId: TropicanaScraper.PRICE_LIST_ID
      }
    };

    try {
      const response = await this.makeApiRequest(requestBody);
      
      if (!response || !response.d || !response.d.Product) {
        return null;
      }

      const product = response.d.Product;
      const imageUrl = this.getImageUrl(product);

      if (!imageUrl) {
        console.error(`\nNo image found for SKU: ${sku}`);
      }

      // Build product model matching Java implementation
      const productModel: ProductModel = {
        sku: sku,
        name: product.ProductName,
        tax: 'VAT',
        stockLevel: product.ProductStockCheck?.StockLevel || 0,
        barcode: this.getFromAttributes(product, 'Barcode'),
        brand: this.getFromAttributes(product, 'Brand'),
        flavour: this.getFromAttributes(product, 'Flavour'),
        filterByCategory: product.ProductCategoryID,
        nutritionalInformation: this.getFromAttributes(product, 'NutritionalInformation'),
        size: this.getFromAttributes(product, 'Size'),
        productPrice: product.ProductPrice?.Price || 0,
        expiryDate: this.getFromAttributes(product, 'ExpiryDate'),
        imageUrl: imageUrl,
        keywords: '',
        trimmedName: product.ProductName
      };

      return productModel;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Make HTTP POST request to Tropicana API
   */
  private makeApiRequest(body: ApiRequest): Promise<ApiResponse> {
    return new Promise((resolve, reject) => {
      const url = new URL(TropicanaScraper.API_URL);
      const postData = JSON.stringify(body);

      const options = {
        hostname: url.hostname,
        port: url.port || 443,
        path: url.pathname,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
          'Content-Length': Buffer.byteLength(postData)
        }
      };

      const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          if (res.statusCode === 200) {
            try {
              const json = JSON.parse(data);
              resolve(json);
            } catch (error) {
              reject(new Error('Failed to parse API response'));
            }
          } else {
            reject(new Error(`API returned status ${res.statusCode}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.write(postData);
      req.end();
    });
  }

  /**
   * Extract attribute value from product Attributes object
   */
  private getFromAttributes(product: any, attributeName: string): string {
    if (product.Attributes && product.Attributes[attributeName]) {
      return product.Attributes[attributeName];
    }
    return '';
  }

  /**
   * Extract image URL from product data
   */
  private getImageUrl(product: any): string {
    if (!product.ProductImages || !product.ProductImages.DEFAULT) {
      return '';
    }

    const images = product.ProductImages.DEFAULT.Images;
    if (!images || images.length === 0) {
      return '';
    }

    const firstImage = images[0];
    if (firstImage.Sizes && firstImage.Sizes.LARGE && firstImage.Sizes.LARGE.ImagePath) {
      return `https://www.tropicanawholesale.com${firstImage.Sizes.LARGE.ImagePath}`;
    }

    return '';
  }

  /**
   * Print progress to console (similar to Java version)
   */
  private printProgress(processed: number, total: number, successful: number): void {
    const progress = `Progress: ${processed}/${total} | Success: ${successful}`;
    process.stdout.write(`\r${progress}`);
  }

  /**
   * Get the fetched products
   */
  getProducts(): ProductModel[] {
    return this.products;
  }

  /**
   * Export products to CSV (matching Java ExportCsvStage)
   */
  async exportToCsv(): Promise<void> {
    if (this.products.length === 0) {
      console.log('No products to export');
      return;
    }

    const headers = [
      'SKU',
      'Name',
      'Tax',
      'Stock Level',
      'Barcode',
      'Brand',
      'Flavour',
      'Category',
      'Nutritional Information',
      'Size',
      'Price',
      'Expiry Date',
      'Image URL',
      'Keywords',
      'Trimmed Name'
    ];

    const rows = this.products.map(p => [
      p.sku,
      this.escapeCsv(p.name),
      p.tax,
      p.stockLevel.toString(),
      p.barcode,
      p.brand,
      p.flavour,
      p.filterByCategory,
      this.escapeCsv(p.nutritionalInformation),
      p.size,
      p.productPrice.toFixed(2),
      p.expiryDate,
      p.imageUrl,
      this.escapeCsv(p.keywords),
      this.escapeCsv(p.trimmedName)
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    await fs.writeFile(this.outputCsvPath, csvContent, 'utf-8');
    console.log(`\nExported ${this.products.length} products to ${this.outputCsvPath}`);
  }

  /**
   * Escape CSV values
   */
  private escapeCsv(value: string): string {
    if (!value) return '';
    if (value.includes(',') || value.includes('"') || value.includes('\n')) {
      return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
  }

  /**
   * Download images for products
   */
  async downloadImages(): Promise<void> {
    // Create image folder if it doesn't exist
    await fs.mkdir(this.imageFolder, { recursive: true });

    console.log(`\nDownloading images to ${this.imageFolder}...`);
    let downloaded = 0;

    for (const product of this.products) {
      if (product.imageUrl) {
        try {
          const filename = `${product.sku}.jpg`;
          const filepath = path.join(this.imageFolder, filename);
          
          await this.downloadImage(product.imageUrl, filepath);
          this.cachedImages.set(product.sku, filepath);
          downloaded++;
          
          process.stdout.write(`\rDownloaded: ${downloaded}/${this.products.length}`);
        } catch (error) {
          console.error(`\nFailed to download image for ${product.sku}`);
        }
      }
    }

    console.log(`\nImage download complete: ${downloaded} images downloaded`);
  }

  /**
   * Download a single image
   */
  private downloadImage(url: string, filepath: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const parsedUrl = new URL(url);
      const protocol = parsedUrl.protocol === 'https:' ? https : http;

      protocol.get(url, (response) => {
        if (response.statusCode === 200) {
          const fileStream = require('fs').createWriteStream(filepath);
          response.pipe(fileStream);
          fileStream.on('finish', () => {
            fileStream.close();
            resolve();
          });
        } else {
          reject(new Error(`Failed to download: ${response.statusCode}`));
        }
      }).on('error', reject);
    });
  }
}

// Example usage
export async function runTropicanaScraper(skuFilePath?: string): Promise<ProductModel[]> {
  const scraper = new TropicanaScraper();
  
  const products = await scraper.execute(skuFilePath);
  
  // Export to CSV
  await scraper.exportToCsv();
  
  // Download images (optional)
  // await scraper.downloadImages();
  
  return products;
}
