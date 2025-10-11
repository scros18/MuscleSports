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

  static async getAllUsers() {
    return await this.query('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
  }

  static async updateUserRole(userId: string, role: 'user' | 'admin') {
    await this.query('UPDATE users SET role = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [role, userId]);
  }

  static async deleteUser(userId: string) {
    await this.query('DELETE FROM users WHERE id = ?', [userId]);
  }

  static async createOrder(orderData: { id: string; userId: string; items: any[]; total: number; shippingAddress?: any }) {
    const { id, userId, items, total, shippingAddress } = orderData;
    await this.query(
      'INSERT INTO orders (id, user_id, items, total, shipping_address) VALUES (?, ?, ?, ?, ?)',
      [id, userId, JSON.stringify(items), total, shippingAddress ? JSON.stringify(shippingAddress) : null]
    );
  }

  static async getOrdersByUserId(userId: string) {
    const rows = await this.query('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    return (rows as any[]).map(order => ({
      ...order,
      items: JSON.parse(order.items),
      shippingAddress: order.shipping_address ? JSON.parse(order.shipping_address) : null
    }));
  }

  static async getOrderById(orderId: string) {
    const rows = await this.query('SELECT * FROM orders WHERE id = ?', [orderId]);
    const order = (rows as any[])[0];
    if (order) {
      return {
        ...order,
        items: JSON.parse(order.items),
        shippingAddress: order.shipping_address ? JSON.parse(order.shipping_address) : null
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
  }) {
    const { id, name, price, description, images, category, inStock, featured } = productData;
    await this.query(
      'INSERT INTO products (id, name, price, description, images, category, in_stock, featured) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [id, name, price, description, JSON.stringify(images), category, inStock, featured]
    );
  }

  static async getAllProducts() {
    const rows = await this.query('SELECT * FROM products ORDER BY created_at DESC');
    return (rows as any[]).map(product => ({
      ...product,
      price: parseFloat(product.price),
      images: JSON.parse(product.images || '[]'),
      inStock: product.in_stock,
      featured: product.featured
    }));
  }

  static async getProductsPaginated(limit: number, offset: number) {
    const rows = await this.query('SELECT * FROM products ORDER BY created_at DESC LIMIT ? OFFSET ?', [limit, offset]);
    return (rows as any[]).map(product => ({
      ...product,
      price: parseFloat(product.price),
      images: JSON.parse(product.images || '[]'),
      inStock: product.in_stock,
      featured: product.featured
    }));
  }

  static async getProductsCount() {
    const rows = await this.query('SELECT COUNT(*) as count FROM products');
    return (rows as any[])[0].count;
  }

  static async getProductById(id: string) {
    const rows = await this.query('SELECT * FROM products WHERE id = ?', [id]);
    const product = (rows as any[])[0];
    if (product) {
      return {
        ...product,
        price: parseFloat(product.price),
        images: JSON.parse(product.images || '[]'),
        inStock: product.in_stock,
        featured: product.featured
      };
    }
    return null;
  }

  static async updateProduct(id: string, productData: Partial<{
    name: string;
    price: number;
    description: string;
    images: string[];
    category: string;
    inStock: boolean;
    featured: boolean;
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
      images: JSON.parse(product.images || '[]'),
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
}