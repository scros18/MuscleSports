import * as mysql from 'mysql2/promise';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ordify_db',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Track if tables have been initialized
let tablesInitialized = false;

// Test products for local development without database
const TEST_PRODUCTS = [
  {
    id: 'test-whey-protein-1',
    name: 'MuscleSports Premium Whey Protein',
    price: 39.99,
    description: 'High-quality whey protein isolate with 25g of protein per serving. Perfect for muscle recovery and growth. Available in delicious chocolate and vanilla flavors.',
    images: [
      'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&q=80',
      'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&q=80'
    ],
    category: 'Protein',
    in_stock: true,
    inStock: true,
    featured: true,
    flavours: ['Chocolate', 'Vanilla', 'Strawberry'],
    strengths: ['1kg', '2kg', '5kg'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'test-pre-workout-2',
    name: 'Extreme Energy Pre-Workout',
    price: 29.99,
    description: 'Explosive energy and focus for intense workouts. Contains caffeine, beta-alanine, and citrulline for maximum performance.',
    images: [
      'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80'
    ],
    category: 'Pre-Workout',
    in_stock: true,
    inStock: true,
    featured: true,
    flavours: ['Blue Raspberry', 'Fruit Punch'],
    created_at: new Date(),
    updated_at: new Date()
  },
  {
    id: 'test-creatine-3',
    name: 'Micronized Creatine Monohydrate',
    price: 19.99,
    description: 'Pure creatine monohydrate for strength and power. Supports muscle growth and athletic performance.',
    images: [
      'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80'
    ],
    category: 'Creatine',
    in_stock: true,
    inStock: true,
    featured: false,
    created_at: new Date(),
    updated_at: new Date()
  }
];

// Helper to safely parse JSON fields returned from DB. mysql2 may return
// JSON columns as already-parsed objects or as strings depending on driver/config.
function safeJsonParse<T = any>(value: any, fallback: T | null = null): T | null {
  if (value === null || value === undefined) return fallback;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value) as T;
    } catch (err) {
      // If parsing fails, return the raw string (or fallback)
      return (fallback as any) ?? (value as any);
    }
  }
  // Already an object/array
  return value as T;
}

function safeJsonParseArray<T = any>(value: any): T[] {
  const parsed = safeJsonParse<T[]>(value, []);
  return Array.isArray(parsed) ? parsed : [];
}

// Database utility functions
export class Database {
  static async getConnection() {
    return await pool.getConnection();
  }

  static async query(sql: string, params: any[] = []) {
    // Initialize tables on first query if not already done
    if (!tablesInitialized) {
      await this.initTables();
      tablesInitialized = true;
    }

    const connection = await this.getConnection();
    try {
      const [rows] = await connection.execute(sql, params);
      return rows;
    } finally {
      connection.release();
    }
  }

  // Initialize database tables
  static async initTables() {
    try {
      // Create users table
      const connection = await this.getConnection();
      try {
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS users (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            password VARCHAR(255) NOT NULL,
            role ENUM('user', 'admin') DEFAULT 'user',
            shipping_address JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);

        // Create orders table
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS orders (
            id VARCHAR(255) PRIMARY KEY,
            user_id VARCHAR(255) NOT NULL,
            items JSON NOT NULL,
            total DECIMAL(10,2) NOT NULL,
            status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
            shipping_address JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
          )
        `);

        // Create products table
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS products (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(500) NOT NULL,
            price DECIMAL(10,2) NOT NULL,
            description TEXT,
            images JSON,
            category VARCHAR(255),
            in_stock BOOLEAN DEFAULT TRUE,
            featured BOOLEAN DEFAULT FALSE,
            flavours JSON,
            flavour_images JSON,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);

        // Create categories table
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS categories (
            id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL UNIQUE,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);

        // Create salon/business settings table
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS business_settings (
            id VARCHAR(255) PRIMARY KEY,
            theme VARCHAR(50) NOT NULL DEFAULT 'ordify',
            business_name VARCHAR(255),
            business_type ENUM('salon', 'ecommerce', 'gym', 'other') DEFAULT 'ecommerce',
            logo_url TEXT,
            address TEXT,
            phone VARCHAR(50),
            email VARCHAR(255),
            opening_hours JSON,
            google_maps_embed TEXT,
            latitude DECIMAL(10, 8),
            longitude DECIMAL(11, 8),
            primary_color VARCHAR(20),
            secondary_color VARCHAR(20),
            description TEXT,
            social_media JSON,
            is_maintenance_mode BOOLEAN DEFAULT FALSE,
            maintenance_message TEXT,
            estimated_time VARCHAR(100),
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
          )
        `);

        // Create salon services table (for hairdressers/salons)
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS salon_services (
            id VARCHAR(255) PRIMARY KEY,
            business_id VARCHAR(255) NOT NULL,
            category VARCHAR(100) NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10,2) NOT NULL,
            duration_minutes INT,
            is_active BOOLEAN DEFAULT TRUE,
            display_order INT DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            FOREIGN KEY (business_id) REFERENCES business_settings(id) ON DELETE CASCADE
          )
        `);

        // Create site layout table (for drag-and-drop page builder)
        await connection.execute(`
          CREATE TABLE IF NOT EXISTS site_layouts (
            id VARCHAR(255) PRIMARY KEY,
            business_id VARCHAR(255) NOT NULL DEFAULT 'default',
            layout_data JSON NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            INDEX idx_business (business_id)
          )
        `);

        console.log('Database tables initialized successfully');
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error('Error initializing database tables:', error);
      throw error;
    }
  }

  static async createUser(userData: { id: string; name: string; email: string; password: string; role?: string }) {
    const { id, name, email, password, role = 'user' } = userData;
    await this.query(
      'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
      [id, name, email, password, role]
    );
  }

  static async findUserByEmail(email: string) {
    const rows = await this.query('SELECT * FROM users WHERE email = ?', [email]);
    return (rows as any[])[0] || null;
  }

  static async findUserById(id: string) {
    const rows = await this.query('SELECT * FROM users WHERE id = ?', [id]);
    return (rows as any[])[0] || null;
  }

  static async findUserByVerificationToken(token: string) {
    const rows = await this.query(
      'SELECT * FROM users WHERE verification_token = ? AND verification_token_expires > NOW()',
      [token]
    );
    return (rows as any[])[0] || null;
  }

  static async updateUserVerificationToken(userId: string, token: string, expiresAt: Date) {
    await this.query(
      'UPDATE users SET verification_token = ?, verification_token_expires = ? WHERE id = ?',
      [token, expiresAt, userId]
    );
  }

  static async verifyUserEmail(userId: string) {
    await this.query(
      'UPDATE users SET email_verified = TRUE, verification_token = NULL, verification_token_expires = NULL WHERE id = ?',
      [userId]
    );
  }

  static async getAllUsers() {
    return await this.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  }

  static async updateUserRole(userId: string, role: 'user' | 'admin') {
    await this.query('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, userId]);
  }

  static async deleteUser(userId: string) {
    await this.query('DELETE FROM users WHERE id = ?', [userId]);
  }

  static async updateUserShippingAddress(userId: string, shippingAddress: any) {
    await this.query(
      'UPDATE users SET shipping_address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [JSON.stringify(shippingAddress), userId]
    );
  }

  static async getUserShippingAddress(userId: string) {
    const rows = await this.query('SELECT shipping_address FROM users WHERE id = ?', [userId]);
    const user = (rows as any[])[0];
    return user ? safeJsonParse(user.shipping_address, null) : null;
  }

  static async updateUserPassword(userId: string, hashedPassword: string) {
    await this.query(
      'UPDATE users SET password = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [hashedPassword, userId]
    );
  }

  static async deleteUserData(userId: string) {
    // Delete user's orders but keep the user account
    await this.query('DELETE FROM orders WHERE user_id = ?', [userId]);
    // Clear shipping address
    await this.query(
      'UPDATE users SET shipping_address = NULL, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [userId]
    );
  }

  static async createOrder(orderData: { 
    id: string; 
    userId: string; 
    items: any[]; 
    total: number; 
    shippingAddress?: any;
    paymentMethod?: string;
    paymentId?: string;
    status?: string;
  }) {
    const { id, userId, items, total, shippingAddress, paymentMethod, paymentId, status } = orderData;
    await this.query(
      'INSERT INTO orders (id, user_id, items, total, shipping_address, payment_method, payment_id, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [
        id, 
        userId, 
        JSON.stringify(items), 
        total, 
        shippingAddress ? JSON.stringify(shippingAddress) : null,
        paymentMethod || null,
        paymentId || null,
        status || 'pending'
      ]
    );
  }

  static async getOrdersByUserId(userId: string) {
    const rows = await this.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return (rows as any[]).map(order => ({
      ...order,
      items: safeJsonParseArray(order.items),
      shippingAddress: safeJsonParse(order.shipping_address, null)
    }));
  }

  static async getOrderById(orderId: string) {
    const rows = await this.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const order = (rows as any[])[0];
    if (order) {
      return {
        ...order,
        items: safeJsonParseArray(order.items),
        shippingAddress: safeJsonParse(order.shipping_address, null)
      };
    }
    return null;
  }

  // Product CRUD operations
  static async createProduct(productData: {
    id: string;
    name: string;
    price: number;
    description: string;
    images: string[];
    category: string;
    inStock: boolean;
    featured: boolean;
    flavours?: string[];
    strengths?: string[];
  }) {
    const { id, name, price, description, images, category, inStock, featured, flavours, strengths } = productData;
    await this.query(
      'INSERT INTO products (id, name, price, description, images, category, in_stock, featured, flavours, strengths) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, price, description, JSON.stringify(images), category, inStock, featured, flavours ? JSON.stringify(flavours) : null, strengths ? JSON.stringify(strengths) : null]
    );
  }

  static async getAllProducts() {
    try {
      const rows = await this.query('SELECT * FROM products ORDER BY created_at DESC');
      return (rows as any[]).map(product => ({
        ...product,
        price: parseFloat(product.price),
        images: safeJsonParseArray(product.images),
        inStock: product.in_stock,
        featured: product.featured,
        flavours: product.flavours ? safeJsonParseArray(product.flavours) : undefined,
        flavourImages: product.flavour_images ? safeJsonParse(product.flavour_images, {}) : undefined,
        strengths: product.strengths ? safeJsonParseArray(product.strengths) : undefined
      }));
    } catch (error) {
      console.log('📦 Database unavailable, using test products');
      return TEST_PRODUCTS;
    }
  }

  static async getProductsPaginated(limit: number, offset: number) {
    const rows = await this.query('SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
    return (rows as any[]).map(product => ({
      ...product,
      price: parseFloat(product.price),
      images: safeJsonParseArray(product.images),
      inStock: product.in_stock,
      featured: product.featured,
      flavours: product.flavours ? safeJsonParseArray(product.flavours) : undefined,
      flavourImages: product.flavour_images ? safeJsonParse(product.flavour_images, {}) : undefined,
      strengths: product.strengths ? safeJsonParseArray(product.strengths) : undefined
    }));
  }

  static async getProductsCount() {
    const rows = await this.query('SELECT COUNT(*) as count FROM products');
    return (rows as any[])[0].count;
  }

  static async getProductById(id: string) {
    try {
      const rows = await this.query('SELECT * FROM products WHERE id = ?', [id]);
      const product = (rows as any[])[0];
      if (product) {
        return {
          ...product,
          price: parseFloat(product.price),
          images: safeJsonParseArray(product.images),
          inStock: product.in_stock,
          featured: product.featured,
          flavours: product.flavours ? safeJsonParseArray(product.flavours) : undefined,
          flavourImages: product.flavour_images ? safeJsonParse(product.flavour_images, {}) : undefined,
          strengths: product.strengths ? safeJsonParseArray(product.strengths) : undefined
        };
      }
      return null;
    } catch (error) {
      console.log('📦 Database unavailable, checking test products');
      return TEST_PRODUCTS.find(p => p.id === id) || null;
    }
  }

  static async updateProduct(id: string, productData: Partial<{
    name: string;
    price: number;
    description: string;
    images: string[];
    category: string;
    inStock: boolean;
    featured: boolean;
    flavours: string[];
    flavourImages: Record<string, string>;
    strengths: string[];
  }>) {
    const fields = [];
    const values = [];

    if (productData.name !== undefined) {
      fields.push('name = ?');
      values.push(productData.name);
    }
    if (productData.price !== undefined) {
      fields.push('price = ?');
      values.push(productData.price);
    }
    if (productData.description !== undefined) {
      fields.push('description = ?');
      values.push(productData.description);
    }
    if (productData.images !== undefined) {
      fields.push('images = ?');
      values.push(JSON.stringify(productData.images));
    }
    if (productData.category !== undefined) {
      fields.push('category = ?');
      values.push(productData.category);
    }
    if (productData.inStock !== undefined) {
      fields.push('in_stock = ?');
      values.push(productData.inStock);
    }
    if (productData.featured !== undefined) {
      fields.push('featured = ?');
      values.push(productData.featured);
    }
    if (productData.flavours !== undefined) {
      fields.push('flavours = ?');
      values.push(JSON.stringify(productData.flavours));
    }
    if (productData.flavourImages !== undefined) {
      fields.push('flavour_images = ?');
      values.push(JSON.stringify(productData.flavourImages));
    }
    if (productData.strengths !== undefined) {
      fields.push('strengths = ?');
      values.push(JSON.stringify(productData.strengths));
    }

    if (fields.length === 0) return;

    const sql = `UPDATE products SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(id);

    await this.query(sql, values);
  }

  static async getProductsFiltered(limit: number, offset: number, search: string = '', category: string = '') {
    let sql = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    const rows = await this.query(sql, params);
    return (rows as any[]).map(product => ({
      ...product,
      price: parseFloat(product.price),
      images: safeJsonParseArray(product.images),
      inStock: product.in_stock,
      featured: product.featured
    }));
  }

  static async getProductsFilteredCount(search: string = '', category: string = '') {
    let sql = 'SELECT COUNT(*) as count FROM products WHERE 1=1';
    const params: any[] = [];

    if (search) {
      sql += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      sql += ' AND category = ?';
      params.push(category);
    }

    const rows = await this.query(sql, params);
    return (rows as any[])[0].count;
  }

  static async getProductCategories() {
    const rows = await this.query('SELECT DISTINCT category FROM products WHERE category IS NOT NULL AND category != "" ORDER BY category');
    return (rows as any[]).map(row => row.category);
  }

  static async deleteProduct(id: string) {
    await this.query('DELETE FROM products WHERE id = ?', [id]);
  }

  static async updateProductStock(id: string, inStock: boolean) {
    await this.query('UPDATE products SET in_stock = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [inStock, id]);
  }

  static async updateProductFeatured(id: string, featured: boolean) {
    await this.query('UPDATE products SET featured = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [featured, id]);
  }

  // Category CRUD operations
  static async createCategory(categoryData: { id: string; name: string; description?: string }) {
    const { id, name, description } = categoryData;
    await this.query(
      'INSERT INTO categories (id, name, description) VALUES (?, ?, ?)',
      [id, name, description || null]
    );
  }

  static async getAllCategories() {
    const rows = await this.query('SELECT * FROM categories ORDER BY name');
    return (rows as any[]);
  }

  static async getCategoryById(id: string) {
    const rows = await this.query('SELECT * FROM categories WHERE id = ?', [id]);
    return (rows as any[])[0] || null;
  }

  static async updateCategory(id: string, categoryData: Partial<{ name: string; description: string }>) {
    const fields = [];
    const values = [];

    if (categoryData.name !== undefined) {
      fields.push('name = ?');
      values.push(categoryData.name);
    }
    if (categoryData.description !== undefined) {
      fields.push('description = ?');
      values.push(categoryData.description);
    }

    if (fields.length === 0) return;

    const sql = `UPDATE categories SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(id);

    await this.query(sql, values);
  }

  static async deleteCategory(id: string) {
    await this.query('DELETE FROM categories WHERE id = ?', [id]);
  }

  // Business Settings CRUD operations
  static async createOrUpdateBusinessSettings(settingsData: {
    id: string;
    theme?: string;
    businessName?: string;
    businessType?: string;
    logoUrl?: string;
    address?: string;
    phone?: string;
    email?: string;
    openingHours?: any;
    googleMapsEmbed?: string;
    latitude?: number;
    longitude?: number;
    primaryColor?: string;
    secondaryColor?: string;
    description?: string;
    socialMedia?: any;
    isMaintenanceMode?: boolean;
    maintenanceMessage?: string;
    estimatedTime?: string;
  }) {
    const {
      id,
      theme,
      businessName,
      businessType,
      logoUrl,
      address,
      phone,
      email,
      openingHours,
      googleMapsEmbed,
      latitude,
      longitude,
      primaryColor,
      secondaryColor,
      description,
      socialMedia,
      isMaintenanceMode,
      maintenanceMessage,
      estimatedTime
    } = settingsData;

    // Check if settings exist
    const existing = await this.query('SELECT id FROM business_settings WHERE id = ?', [id]);
    
    if ((existing as any[]).length > 0) {
      // Update existing
      const fields = [];
      const values = [];

      if (theme !== undefined) { fields.push('theme = ?'); values.push(theme); }
      if (businessName !== undefined) { fields.push('business_name = ?'); values.push(businessName); }
      if (businessType !== undefined) { fields.push('business_type = ?'); values.push(businessType); }
      if (logoUrl !== undefined) { fields.push('logo_url = ?'); values.push(logoUrl); }
      if (address !== undefined) { fields.push('address = ?'); values.push(address); }
      if (phone !== undefined) { fields.push('phone = ?'); values.push(phone); }
      if (email !== undefined) { fields.push('email = ?'); values.push(email); }
      if (openingHours !== undefined) { fields.push('opening_hours = ?'); values.push(JSON.stringify(openingHours)); }
      if (googleMapsEmbed !== undefined) { fields.push('google_maps_embed = ?'); values.push(googleMapsEmbed); }
      if (latitude !== undefined) { fields.push('latitude = ?'); values.push(latitude); }
      if (longitude !== undefined) { fields.push('longitude = ?'); values.push(longitude); }
      if (primaryColor !== undefined) { fields.push('primary_color = ?'); values.push(primaryColor); }
      if (secondaryColor !== undefined) { fields.push('secondary_color = ?'); values.push(secondaryColor); }
      if (description !== undefined) { fields.push('description = ?'); values.push(description); }
      if (socialMedia !== undefined) { fields.push('social_media = ?'); values.push(JSON.stringify(socialMedia)); }
      if (isMaintenanceMode !== undefined) { fields.push('is_maintenance_mode = ?'); values.push(isMaintenanceMode ? 1 : 0); }
      if (maintenanceMessage !== undefined) { fields.push('maintenance_message = ?'); values.push(maintenanceMessage); }
      if (estimatedTime !== undefined) { fields.push('estimated_time = ?'); values.push(estimatedTime); }

      if (fields.length > 0) {
        const sql = `UPDATE business_settings SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
        values.push(id);
        await this.query(sql, values);
      }
    } else {
      // Insert new
      await this.query(
        `INSERT INTO business_settings (
          id, theme, business_name, business_type, logo_url, address, phone, email,
          opening_hours, google_maps_embed, latitude, longitude, primary_color,
          secondary_color, description, social_media, is_maintenance_mode, maintenance_message, estimated_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, theme || 'musclesports', businessName || null, businessType || 'ecommerce', logoUrl || null,
          address || null, phone || null, email || null,
          openingHours ? JSON.stringify(openingHours) : null,
          googleMapsEmbed || null, latitude || null, longitude || null,
          primaryColor || null, secondaryColor || null, description || null,
          socialMedia ? JSON.stringify(socialMedia) : null,
          isMaintenanceMode ? 1 : 0, maintenanceMessage || null, estimatedTime || null
        ]
      );
    }
  }

  static async getBusinessSettings(id: string = 'default') {
    const rows = await this.query('SELECT * FROM business_settings WHERE id = ?', [id]);
    const settings = (rows as any[])[0];
    if (settings) {
      return {
        ...settings,
        openingHours: safeJsonParse(settings.opening_hours, null),
        socialMedia: safeJsonParse(settings.social_media, null),
        isMaintenanceMode: settings.is_maintenance_mode === 1,
        maintenanceMessage: settings.maintenance_message,
        estimatedTime: settings.estimated_time
      };
    }
    return null;
  }

  static async deleteBusinessSettings(id: string) {
    await this.query('DELETE FROM business_settings WHERE id = ?', [id]);
  }

  // Salon Services CRUD operations
  static async createSalonService(serviceData: {
    id: string;
    businessId: string;
    category: string;
    name: string;
    description?: string;
    price: number;
    durationMinutes?: number;
    isActive?: boolean;
    displayOrder?: number;
  }) {
    const { id, businessId, category, name, description, price, durationMinutes, isActive, displayOrder } = serviceData;
    await this.query(
      `INSERT INTO salon_services (
        id, business_id, category, name, description, price, duration_minutes, is_active, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, businessId, category, name, description || null, price, durationMinutes || null, isActive ?? true, displayOrder || 0]
    );
  }

  static async getSalonServices(businessId: string = 'default') {
    const rows = await this.query(
      'SELECT * FROM salon_services WHERE business_id = ? AND is_active = TRUE ORDER BY category, display_order, name',
      [businessId]
    );
    return (rows as any[]).map(service => ({
      ...service,
      price: parseFloat(service.price),
      isActive: service.is_active,
      durationMinutes: service.duration_minutes,
      displayOrder: service.display_order
    }));
  }

  static async getAllSalonServices(businessId: string = 'default') {
    const rows = await this.query(
      'SELECT * FROM salon_services WHERE business_id = ? ORDER BY category, display_order, name',
      [businessId]
    );
    return (rows as any[]).map(service => ({
      ...service,
      price: parseFloat(service.price),
      isActive: service.is_active,
      durationMinutes: service.duration_minutes,
      displayOrder: service.display_order
    }));
  }

  static async getSalonServiceById(id: string) {
    const rows = await this.query('SELECT * FROM salon_services WHERE id = ?', [id]);
    const service = (rows as any[])[0];
    if (service) {
      return {
        ...service,
        price: parseFloat(service.price),
        isActive: service.is_active,
        durationMinutes: service.duration_minutes,
        displayOrder: service.display_order
      };
    }
    return null;
  }

  static async updateSalonService(id: string, serviceData: Partial<{
    category: string;
    name: string;
    description: string;
    price: number;
    durationMinutes: number;
    isActive: boolean;
    displayOrder: number;
  }>) {
    const fields = [];
    const values = [];

    if (serviceData.category !== undefined) { fields.push('category = ?'); values.push(serviceData.category); }
    if (serviceData.name !== undefined) { fields.push('name = ?'); values.push(serviceData.name); }
    if (serviceData.description !== undefined) { fields.push('description = ?'); values.push(serviceData.description); }
    if (serviceData.price !== undefined) { fields.push('price = ?'); values.push(serviceData.price); }
    if (serviceData.durationMinutes !== undefined) { fields.push('duration_minutes = ?'); values.push(serviceData.durationMinutes); }
    if (serviceData.isActive !== undefined) { fields.push('is_active = ?'); values.push(serviceData.isActive); }
    if (serviceData.displayOrder !== undefined) { fields.push('display_order = ?'); values.push(serviceData.displayOrder); }

    if (fields.length === 0) return;

    const sql = `UPDATE salon_services SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP WHERE id = ?`;
    values.push(id);

    await this.query(sql, values);
  }

  static async deleteSalonService(id: string) {
    await this.query('DELETE FROM salon_services WHERE id = ?', [id]);
  }

  static async getSalonServicesByCategory(businessId: string = 'default', category: string) {
    const rows = await this.query(
      'SELECT * FROM salon_services WHERE business_id = ? AND category = ? AND is_active = TRUE ORDER BY display_order, name',
      [businessId, category]
    );
    return (rows as any[]).map(service => ({
      ...service,
      price: parseFloat(service.price),
      isActive: service.is_active,
      durationMinutes: service.duration_minutes,
      displayOrder: service.display_order
    }));
  }

  static async getSalonServiceCategories(businessId: string = 'default') {
    const rows = await this.query(
      'SELECT DISTINCT category FROM salon_services WHERE business_id = ? ORDER BY category',
      [businessId]
    );
    return (rows as any[]).map(row => row.category);
  }

  // Site Layout CRUD operations
  static async saveSiteLayout(layoutData: {
    businessId: string;
    layout: any;
  }) {
    const { businessId, layout } = layoutData;
    
    // Check if layout exists
    const existing = await this.query('SELECT id FROM site_layouts WHERE business_id = ?', [businessId]);
    
    if ((existing as any[]).length > 0) {
      // Update existing
      await this.query(
        'UPDATE site_layouts SET layout_data = ?, updated_at = CURRENT_TIMESTAMP WHERE business_id = ?',
        [JSON.stringify(layout), businessId]
      );
    } else {
      // Insert new
  const id = (globalThis as any)?.crypto?.randomUUID ? (globalThis as any).crypto.randomUUID() : String(Date.now()) + '-' + Math.random().toString(36).slice(2, 9);
      await this.query(
        'INSERT INTO site_layouts (id, business_id, layout_data) VALUES (?, ?, ?)',
        [id, businessId, JSON.stringify(layout)]
      );
    }
  }

  static async getSiteLayout(businessId: string = 'default') {
    const rows = await this.query('SELECT * FROM site_layouts WHERE business_id = ?', [businessId]);
    const layout = (rows as any[])[0];
    if (layout) {
      return {
        id: layout.id,
        businessId: layout.business_id,
        layout: safeJsonParse(layout.layout_data, null),
        createdAt: layout.created_at,
        updatedAt: layout.updated_at
      };
    }
    return null;
  }

  static async deleteSiteLayout(businessId: string) {
    await this.query('DELETE FROM site_layouts WHERE business_id = ?', [businessId]);
  }
}