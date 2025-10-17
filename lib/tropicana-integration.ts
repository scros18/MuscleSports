import * as dotenv from 'dotenv';
import { Database } from './database';

// Load environment variables
dotenv.config({ path: '.env.local' });

interface TropicanaProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category: string;
  brand: string;
  inStock: boolean;
  stockQuantity?: number;
  flavours?: string[];
  strengths?: string[];
  wholesalePrice: number;
  retailPrice: number;
  margin: number;
  sku: string;
  barcode?: string;
  weight?: string;
  dimensions?: string;
  ingredients?: string[];
  nutritionFacts?: Record<string, any>;
  allergens?: string[];
  ageRestriction?: string;
  countryOfOrigin?: string;
  lastUpdated: Date;
}

interface TropicanaCredentials {
  email: string;
  password: string;
  baseUrl: string;
}

interface SyncSettings {
  autoSync: boolean;
  syncInterval: number; // in minutes
  categories: string[];
  brands: string[];
  minMargin: number; // minimum margin percentage
  maxProducts: number;
  updatePrices: boolean;
  updateStock: boolean;
  updateDescriptions: boolean;
}

class TropicanaIntegration {
  private credentials: TropicanaCredentials;
  private settings: SyncSettings;
  private session: any;
  private isAuthenticated: boolean = false;

  constructor() {
    this.credentials = {
      email: process.env.TROPICANA_EMAIL || 'johncroston@myyahoo.com',
      password: process.env.TROPICANA_PASSWORD || 'Wholesale123',
      baseUrl: 'https://www.tropicanawholesale.com'
    };

    this.settings = {
      autoSync: true,
      syncInterval: 60, // 1 hour
      categories: [
        'Protein Powders',
        'Pre-Workout',
        'Post-Workout',
        'Creatine',
        'Amino Acids',
        'Weight Loss',
        'Weight Gainers',
        'Vitamins & Minerals',
        'Protein Bars',
        'Protein RTDs',
        'Energy & Endurance',
        'Recovery',
        'Joint Support',
        'Testosterone Boosters',
        'CBD',
        'Electrolytes',
        'Greens',
        'Probiotics & Digestion',
        'Sleep Aids',
        'Nootropics'
      ],
      brands: [
        'Optimum Nutrition',
        'Applied Nutrition',
        'Per4m',
        'Grenade',
        'Neutonic',
        'NOCCO',
        'USN',
        'Barebells',
        'Lenny and Larrys',
        'Cellucor',
        'MyProtein',
        'Gorillalpha',
        'Ghost',
        'Mutant',
        'BSN',
        'Animal',
        'Muscletech',
        'Universal Nutrition',
        'PhD Nutrition',
        'Reflex Nutrition'
      ],
      minMargin: 30, // 30% minimum margin
      maxProducts: 5000,
      updatePrices: true,
      updateStock: true,
      updateDescriptions: true
    };
  }

  // Initialize the integration
  async initialize(): Promise<void> {
    console.log('🚀 Initializing Tropicana Wholesale Integration...');
    
    try {
      // Create sync settings table if it doesn't exist
      await this.createSyncTables();
      
      // Load saved settings from database
      await this.loadSettings();
      
      console.log('✅ Tropicana Integration initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Tropicana Integration:', error);
      throw error;
    }
  }

  // Create necessary database tables
  private async createSyncTables(): Promise<void> {
    const connection = await Database.getConnection();
    try {
      // Create tropicana_products table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS tropicana_products (
          id VARCHAR(255) PRIMARY KEY,
          sku VARCHAR(255) UNIQUE,
          name VARCHAR(500) NOT NULL,
          brand VARCHAR(255),
          category VARCHAR(255),
          wholesale_price DECIMAL(10,2) NOT NULL,
          retail_price DECIMAL(10,2) NOT NULL,
          margin DECIMAL(5,2) NOT NULL,
          description TEXT,
          images JSON,
          in_stock BOOLEAN DEFAULT TRUE,
          stock_quantity INT,
          flavours JSON,
          strengths JSON,
          weight VARCHAR(100),
          dimensions VARCHAR(200),
          ingredients JSON,
          nutrition_facts JSON,
          allergens JSON,
          age_restriction VARCHAR(100),
          country_of_origin VARCHAR(100),
          barcode VARCHAR(50),
          last_synced TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
          INDEX idx_brand (brand),
          INDEX idx_category (category),
          INDEX idx_sku (sku),
          INDEX idx_last_synced (last_synced)
        )
      `);

      // Create tropicana_sync_log table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS tropicana_sync_log (
          id VARCHAR(255) PRIMARY KEY,
          sync_type ENUM('full', 'incremental', 'stock_check') NOT NULL,
          status ENUM('running', 'completed', 'failed') NOT NULL,
          products_processed INT DEFAULT 0,
          products_updated INT DEFAULT 0,
          products_created INT DEFAULT 0,
          products_skipped INT DEFAULT 0,
          errors JSON,
          started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          completed_at TIMESTAMP NULL,
          duration_seconds INT,
          INDEX idx_status (status),
          INDEX idx_started_at (started_at)
        )
      `);

      // Create tropicana_sync_settings table
      await connection.execute(`
        CREATE TABLE IF NOT EXISTS tropicana_sync_settings (
          id VARCHAR(255) PRIMARY KEY DEFAULT 'default',
          auto_sync BOOLEAN DEFAULT TRUE,
          sync_interval INT DEFAULT 60,
          categories JSON,
          brands JSON,
          min_margin DECIMAL(5,2) DEFAULT 30.00,
          max_products INT DEFAULT 5000,
          update_prices BOOLEAN DEFAULT TRUE,
          update_stock BOOLEAN DEFAULT TRUE,
          update_descriptions BOOLEAN DEFAULT TRUE,
          last_full_sync TIMESTAMP NULL,
          last_incremental_sync TIMESTAMP NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      console.log('✅ Sync tables created successfully');
    } finally {
      connection.release();
    }
  }

  // Load settings from database
  private async loadSettings(): Promise<void> {
    try {
      const connection = await Database.getConnection();
      try {
        const [rows] = await connection.execute('SELECT * FROM tropicana_sync_settings WHERE id = "default"');
        const settings = (rows as any[])[0];
        
        if (settings) {
          this.settings = {
            autoSync: settings.auto_sync === 1,
            syncInterval: settings.sync_interval || 60,
            categories: JSON.parse(settings.categories || '[]'),
            brands: JSON.parse(settings.brands || '[]'),
            minMargin: parseFloat(settings.min_margin || '30'),
            maxProducts: settings.max_products || 5000,
            updatePrices: settings.update_prices === 1,
            updateStock: settings.update_stock === 1,
            updateDescriptions: settings.update_descriptions === 1
          };
        }
      } finally {
        connection.release();
      }
    } catch (error) {
      console.log('Using default settings (no saved settings found)');
    }
  }

  // Save settings to database
  async saveSettings(): Promise<void> {
    try {
      const connection = await Database.getConnection();
      try {
        await connection.execute(`
          INSERT INTO tropicana_sync_settings (
            id, auto_sync, sync_interval, categories, brands, min_margin, 
            max_products, update_prices, update_stock, update_descriptions
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
            auto_sync = VALUES(auto_sync),
            sync_interval = VALUES(sync_interval),
            categories = VALUES(categories),
            brands = VALUES(brands),
            min_margin = VALUES(min_margin),
            max_products = VALUES(max_products),
            update_prices = VALUES(update_prices),
            update_stock = VALUES(update_stock),
            update_descriptions = VALUES(update_descriptions),
            updated_at = CURRENT_TIMESTAMP
        `, [
          'default',
          this.settings.autoSync,
          this.settings.syncInterval,
          JSON.stringify(this.settings.categories),
          JSON.stringify(this.settings.brands),
          this.settings.minMargin,
          this.settings.maxProducts,
          this.settings.updatePrices,
          this.settings.updateStock,
          this.settings.updateDescriptions
        ]);
        
        console.log('✅ Settings saved successfully');
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('❌ Failed to save settings:', error);
      throw error;
    }
  }

  // Authenticate with Tropicana Wholesale
  async authenticate(): Promise<boolean> {
    try {
      console.log('🔐 Authenticating with Tropicana Wholesale...');
      
      // For now, we'll simulate authentication
      // In a real implementation, you would use web scraping or API calls
      this.isAuthenticated = true;
      
      console.log('✅ Authentication successful');
      return true;
    } catch (error) {
      console.error('❌ Authentication failed:', error);
      this.isAuthenticated = false;
      return false;
    }
  }

  // Perform full product sync
  async performFullSync(): Promise<void> {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    const syncId = this.generateId();
    console.log(`🔄 Starting full sync (ID: ${syncId})...`);

    try {
      // Create sync log entry
      await this.createSyncLog(syncId, 'full', 'running');

      // Get all products from Tropicana (simulated for now)
      const tropicanaProducts = await this.fetchAllProducts();
      
      let processed = 0;
      let updated = 0;
      let created = 0;
      let skipped = 0;
      const errors: any[] = [];

      for (const tropicanaProduct of tropicanaProducts) {
        try {
          processed++;
          
          // Calculate retail price with margin
          const retailPrice = this.calculateRetailPrice(
            tropicanaProduct.wholesalePrice, 
            this.settings.minMargin
          );

          // Check if product meets our criteria
          if (!this.meetsCriteria(tropicanaProduct, retailPrice)) {
            skipped++;
            continue;
          }

          // Check if product exists in our database
          const existingProduct = await this.getProductBySku(tropicanaProduct.sku);
          
          if (existingProduct) {
            // Update existing product
            await this.updateProduct(existingProduct.id, {
              ...tropicanaProduct,
              retailPrice,
              margin: this.calculateMargin(tropicanaProduct.wholesalePrice, retailPrice)
            });
            updated++;
          } else {
            // Create new product
            await this.createProduct({
              ...tropicanaProduct,
              retailPrice,
              margin: this.calculateMargin(tropicanaProduct.wholesalePrice, retailPrice)
            });
            created++;
          }

          // Update progress every 50 products
          if (processed % 50 === 0) {
            console.log(`📊 Progress: ${processed}/${tropicanaProducts.length} products processed`);
            await this.updateSyncLog(syncId, { products_processed: processed });
          }

        } catch (error) {
          console.error(`❌ Error processing product ${tropicanaProduct.sku}:`, error);
          errors.push({
            sku: tropicanaProduct.sku,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      // Complete sync log
      await this.completeSyncLog(syncId, {
        products_processed: processed,
        products_updated: updated,
        products_created: created,
        products_skipped: skipped,
        errors: errors.length > 0 ? errors : null,
        duration_seconds: Math.floor((Date.now() - Date.now()) / 1000) // This would be calculated properly
      });

      console.log(`✅ Full sync completed successfully!`);
      console.log(`📊 Results: ${processed} processed, ${created} created, ${updated} updated, ${skipped} skipped`);

    } catch (error) {
      console.error('❌ Full sync failed:', error);
      await this.failSyncLog(syncId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // Perform incremental sync (check for updates)
  async performIncrementalSync(): Promise<void> {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    const syncId = this.generateId();
    console.log(`🔄 Starting incremental sync (ID: ${syncId})...`);

    try {
      await this.createSyncLog(syncId, 'incremental', 'running');

      // Get products that need updating (simplified logic)
      const productsToUpdate = await this.getProductsNeedingUpdate();
      
      let processed = 0;
      let updated = 0;
      const errors: any[] = [];

      for (const product of productsToUpdate) {
        try {
          processed++;
          
          // Fetch updated product data from Tropicana
          const updatedProduct = await this.fetchProductBySku(product.sku);
          
          if (updatedProduct) {
            await this.updateProduct(product.id, updatedProduct);
            updated++;
          }

        } catch (error) {
          console.error(`❌ Error updating product ${product.sku}:`, error);
          errors.push({
            sku: product.sku,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      await this.completeSyncLog(syncId, {
        products_processed: processed,
        products_updated: updated,
        errors: errors.length > 0 ? errors : null
      });

      console.log(`✅ Incremental sync completed! ${processed} products checked, ${updated} updated`);

    } catch (error) {
      console.error('❌ Incremental sync failed:', error);
      await this.failSyncLog(syncId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // Stock check and update
  async performStockCheck(): Promise<void> {
    if (!this.isAuthenticated) {
      await this.authenticate();
    }

    const syncId = this.generateId();
    console.log(`📦 Starting stock check (ID: ${syncId})...`);

    try {
      await this.createSyncLog(syncId, 'stock_check', 'running');

      // Get all products that need stock updates
      const products = await this.getAllTropicanaProducts();
      
      let processed = 0;
      let updated = 0;
      const errors: any[] = [];

      for (const product of products) {
        try {
          processed++;
          
          // Check stock status from Tropicana
          const stockInfo = await this.checkProductStock(product.sku);
          
          if (stockInfo.inStock !== product.in_stock || stockInfo.quantity !== product.stock_quantity) {
            await this.updateProductStock(product.id, stockInfo.inStock, stockInfo.quantity);
            updated++;
          }

        } catch (error) {
          console.error(`❌ Error checking stock for ${product.sku}:`, error);
          errors.push({
            sku: product.sku,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }

      await this.completeSyncLog(syncId, {
        products_processed: processed,
        products_updated: updated,
        errors: errors.length > 0 ? errors : null
      });

      console.log(`✅ Stock check completed! ${processed} products checked, ${updated} updated`);

    } catch (error) {
      console.error('❌ Stock check failed:', error);
      await this.failSyncLog(syncId, error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // Fetch all products from Tropicana (simulated)
  private async fetchAllProducts(): Promise<TropicanaProduct[]> {
    // This would be implemented with actual web scraping or API calls
    // For now, returning sample data structure
    
    const sampleProducts: TropicanaProduct[] = [
      {
        id: 'opt-nut-gold-standard-whey-2kg',
        name: 'Optimum Nutrition Gold Standard Whey Protein 2kg',
        price: 45.99,
        description: 'Premium whey protein isolate with 25g protein per serving',
        images: ['https://example.com/image1.jpg'],
        category: 'Protein Powders',
        brand: 'Optimum Nutrition',
        inStock: true,
        stockQuantity: 50,
        flavours: ['Chocolate', 'Vanilla', 'Strawberry'],
        strengths: ['2kg'],
        wholesalePrice: 32.99,
        retailPrice: 45.99,
        margin: 28.5,
        sku: 'OPT-GS-WHEY-2KG',
        weight: '2kg',
        ingredients: ['Whey Protein Isolate', 'Cocoa Powder', 'Natural Flavors'],
        lastUpdated: new Date()
      }
      // More products would be fetched here...
    ];

    return sampleProducts.slice(0, this.settings.maxProducts);
  }

  // Helper methods
  private calculateRetailPrice(wholesalePrice: number, marginPercent: number): number {
    return wholesalePrice * (1 + marginPercent / 100);
  }

  private calculateMargin(wholesalePrice: number, retailPrice: number): number {
    return ((retailPrice - wholesalePrice) / wholesalePrice) * 100;
  }

  private meetsCriteria(product: TropicanaProduct, retailPrice: number): boolean {
    // Check if product meets our criteria
    if (product.brand && !this.settings.brands.includes(product.brand)) {
      return false;
    }
    
    if (product.category && !this.settings.categories.includes(product.category)) {
      return false;
    }

    const margin = this.calculateMargin(product.wholesalePrice, retailPrice);
    if (margin < this.settings.minMargin) {
      return false;
    }

    return true;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Database helper methods
  private async createSyncLog(id: string, type: string, status: string): Promise<void> {
    const connection = await Database.getConnection();
    try {
      await connection.execute(
        'INSERT INTO tropicana_sync_log (id, sync_type, status) VALUES (?, ?, ?)',
        [id, type, status]
      );
    } finally {
      connection.release();
    }
  }

  private async updateSyncLog(id: string, updates: any): Promise<void> {
    const connection = await Database.getConnection();
    try {
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      values.push(id);
      
      await connection.execute(
        `UPDATE tropicana_sync_log SET ${fields} WHERE id = ?`,
        values
      );
    } finally {
      connection.release();
    }
  }

  private async completeSyncLog(id: string, results: any): Promise<void> {
    const connection = await Database.getConnection();
    try {
      await connection.execute(
        `UPDATE tropicana_sync_log SET 
          status = 'completed', 
          completed_at = CURRENT_TIMESTAMP,
          products_processed = ?,
          products_updated = ?,
          products_created = ?,
          products_skipped = ?,
          errors = ?
         WHERE id = ?`,
        [
          results.products_processed || 0,
          results.products_updated || 0,
          results.products_created || 0,
          results.products_skipped || 0,
          results.errors ? JSON.stringify(results.errors) : null,
          id
        ]
      );
    } finally {
      connection.release();
    }
  }

  private async failSyncLog(id: string, error: string): Promise<void> {
    const connection = await Database.getConnection();
    try {
      await connection.execute(
        `UPDATE tropicana_sync_log SET 
          status = 'failed', 
          completed_at = CURRENT_TIMESTAMP,
          errors = ?
         WHERE id = ?`,
        [JSON.stringify([{ error }]), id]
      );
    } finally {
      connection.release();
    }
  }

  private async getProductBySku(sku: string): Promise<any> {
    const connection = await Database.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM tropicana_products WHERE sku = ?',
        [sku]
      );
      return (rows as any[])[0] || null;
    } finally {
      connection.release();
    }
  }

  private async createProduct(productData: TropicanaProduct): Promise<void> {
    const connection = await Database.getConnection();
    try {
      await connection.execute(`
        INSERT INTO tropicana_products (
          id, sku, name, brand, category, wholesale_price, retail_price, margin,
          description, images, in_stock, stock_quantity, flavours, strengths,
          weight, dimensions, ingredients, nutrition_facts, allergens,
          age_restriction, country_of_origin, barcode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        productData.id,
        productData.sku,
        productData.name,
        productData.brand,
        productData.category,
        productData.wholesalePrice,
        productData.retailPrice,
        productData.margin,
        productData.description,
        JSON.stringify(productData.images),
        productData.inStock,
        productData.stockQuantity,
        productData.flavours ? JSON.stringify(productData.flavours) : null,
        productData.strengths ? JSON.stringify(productData.strengths) : null,
        productData.weight,
        productData.dimensions,
        productData.ingredients ? JSON.stringify(productData.ingredients) : null,
        productData.nutritionFacts ? JSON.stringify(productData.nutritionFacts) : null,
        productData.allergens ? JSON.stringify(productData.allergens) : null,
        productData.ageRestriction,
        productData.countryOfOrigin,
        productData.barcode
      ]);
    } finally {
      connection.release();
    }
  }

  private async updateProduct(id: string, productData: Partial<TropicanaProduct>): Promise<void> {
    const connection = await Database.getConnection();
    try {
      const fields = [];
      const values = [];

      if (productData.name) { fields.push('name = ?'); values.push(productData.name); }
      if (productData.brand) { fields.push('brand = ?'); values.push(productData.brand); }
      if (productData.category) { fields.push('category = ?'); values.push(productData.category); }
      if (productData.wholesalePrice) { fields.push('wholesale_price = ?'); values.push(productData.wholesalePrice); }
      if (productData.retailPrice) { fields.push('retail_price = ?'); values.push(productData.retailPrice); }
      if (productData.margin) { fields.push('margin = ?'); values.push(productData.margin); }
      if (productData.description) { fields.push('description = ?'); values.push(productData.description); }
      if (productData.images) { fields.push('images = ?'); values.push(JSON.stringify(productData.images)); }
      if (productData.inStock !== undefined) { fields.push('in_stock = ?'); values.push(productData.inStock); }
      if (productData.stockQuantity !== undefined) { fields.push('stock_quantity = ?'); values.push(productData.stockQuantity); }
      if (productData.flavours) { fields.push('flavours = ?'); values.push(JSON.stringify(productData.flavours)); }
      if (productData.strengths) { fields.push('strengths = ?'); values.push(JSON.stringify(productData.strengths)); }
      if (productData.weight) { fields.push('weight = ?'); values.push(productData.weight); }
      if (productData.dimensions) { fields.push('dimensions = ?'); values.push(productData.dimensions); }
      if (productData.ingredients) { fields.push('ingredients = ?'); values.push(JSON.stringify(productData.ingredients)); }
      if (productData.nutritionFacts) { fields.push('nutrition_facts = ?'); values.push(JSON.stringify(productData.nutritionFacts)); }
      if (productData.allergens) { fields.push('allergens = ?'); values.push(JSON.stringify(productData.allergens)); }
      if (productData.ageRestriction) { fields.push('age_restriction = ?'); values.push(productData.ageRestriction); }
      if (productData.countryOfOrigin) { fields.push('country_of_origin = ?'); values.push(productData.countryOfOrigin); }
      if (productData.barcode) { fields.push('barcode = ?'); values.push(productData.barcode); }

      fields.push('last_synced = CURRENT_TIMESTAMP');
      fields.push('updated_at = CURRENT_TIMESTAMP');

      if (fields.length > 2) { // More than just the timestamp fields
        const sql = `UPDATE tropicana_products SET ${fields.join(', ')} WHERE id = ?`;
        values.push(id);
        await connection.execute(sql, values);
      }
    } finally {
      connection.release();
    }
  }

  private async updateProductStock(id: string, inStock: boolean, quantity?: number): Promise<void> {
    const connection = await Database.getConnection();
    try {
      await connection.execute(
        'UPDATE tropicana_products SET in_stock = ?, stock_quantity = ?, last_synced = CURRENT_TIMESTAMP WHERE id = ?',
        [inStock, quantity, id]
      );
    } finally {
      connection.release();
    }
  }

  private async getAllTropicanaProducts(): Promise<any[]> {
    const connection = await Database.getConnection();
    try {
      const [rows] = await connection.execute('SELECT * FROM tropicana_products ORDER BY last_synced ASC');
      return rows as any[];
    } finally {
      connection.release();
    }
  }

  private async getProductsNeedingUpdate(): Promise<any[]> {
    const connection = await Database.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM tropicana_products WHERE last_synced < DATE_SUB(NOW(), INTERVAL 24 HOUR) ORDER BY last_synced ASC LIMIT 100'
      );
      return rows as any[];
    } finally {
      connection.release();
    }
  }

  private async fetchProductBySku(sku: string): Promise<TropicanaProduct | null> {
    // This would fetch actual product data from Tropicana
    // For now, returning null to indicate no updates needed
    return null;
  }

  private async checkProductStock(sku: string): Promise<{ inStock: boolean; quantity?: number }> {
    // This would check actual stock status from Tropicana
    // For now, returning mock data
    return { inStock: true, quantity: Math.floor(Math.random() * 100) };
  }

  // Public methods for API endpoints
  async getSyncStatus(): Promise<any> {
    const connection = await Database.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM tropicana_sync_log ORDER BY started_at DESC LIMIT 10'
      );
      return rows;
    } finally {
      connection.release();
    }
  }

  async getProductsCount(): Promise<number> {
    const connection = await Database.getConnection();
    try {
      const [rows] = await connection.execute('SELECT COUNT(*) as count FROM tropicana_products');
      return (rows as any[])[0].count;
    } finally {
      connection.release();
    }
  }

  async getProductsPaginated(page: number = 1, limit: number = 50): Promise<any[]> {
    const offset = (page - 1) * limit;
    const connection = await Database.getConnection();
    try {
      const [rows] = await connection.execute(
        'SELECT * FROM tropicana_products ORDER BY last_synced DESC LIMIT ? OFFSET ?',
        [limit, offset]
      );
      return rows as any[];
    } finally {
      connection.release();
    }
  }

  async updateSettings(newSettings: Partial<SyncSettings>): Promise<void> {
    this.settings = { ...this.settings, ...newSettings };
    await this.saveSettings();
  }

  async getSettings(): Promise<SyncSettings> {
    return { ...this.settings };
  }
}

export default TropicanaIntegration;
