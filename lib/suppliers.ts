import { Database } from './database';

export type SupplierCode = 'dolphin-fitness' | 'muscle-finesse';

export interface SupplierProduct {
  supplier: SupplierCode;
  supplier_sku: string;
  name: string;
  brand?: string;
  category?: string;
  price: number; // supplier price (wholesale/retail depending on source)
  currency?: string; // default GBP
  in_stock: boolean;
  stock_text?: string;
  stock_qty?: number | null;
  image_url?: string;
  product_url: string;
}

export async function ensureSupplierTables() {
  const conn = await Database.getConnection();
  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS supplier_products (
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        supplier VARCHAR(64) NOT NULL,
        supplier_sku VARCHAR(255) NOT NULL,
        name VARCHAR(500) NOT NULL,
        brand VARCHAR(255) NULL,
        category VARCHAR(255) NULL,
        price DECIMAL(10,2) NOT NULL,
        currency VARCHAR(8) DEFAULT 'GBP',
        in_stock BOOLEAN DEFAULT TRUE,
        stock_text VARCHAR(255) NULL,
        stock_qty INT NULL,
        image_url TEXT NULL,
        product_url TEXT NOT NULL,
        last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY uniq_supplier_sku (supplier, supplier_sku),
        INDEX idx_supplier (supplier),
        INDEX idx_last_seen (last_seen)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
    `);
  } finally {
    conn.release();
  }
}

export async function upsertSupplierProduct(p: SupplierProduct) {
  const conn = await Database.getConnection();
  try {
    await conn.execute(
      `INSERT INTO supplier_products
       (supplier, supplier_sku, name, brand, category, price, currency, in_stock, stock_text, stock_qty, image_url, product_url)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         brand = VALUES(brand),
         category = VALUES(category),
         price = VALUES(price),
         currency = VALUES(currency),
         in_stock = VALUES(in_stock),
         stock_text = VALUES(stock_text),
         stock_qty = VALUES(stock_qty),
         image_url = VALUES(image_url),
         product_url = VALUES(product_url),
         last_seen = CURRENT_TIMESTAMP`,
      [
        p.supplier,
        p.supplier_sku,
        p.name,
        p.brand || null,
        p.category || null,
        p.price,
        p.currency || 'GBP',
        p.in_stock ? 1 : 0,
        p.stock_text || null,
        p.stock_qty ?? null,
        p.image_url || null,
        p.product_url,
      ]
    );
  } finally {
    conn.release();
  }
}

// Simple slug generator for product name -> slug
export function toSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Sync supplier_products into main products table using a margin.
export async function syncSuppliersToProducts(options?: { marginPercent?: number }) {
  const marginPercent = options?.marginPercent ?? 35;
  const conn = await Database.getConnection();
  try {
    // Pull latest seen record per (name, brand) with preference for in_stock and lowest price
    const [rows] = await conn.execute(`
      SELECT sp.* FROM supplier_products sp
      JOIN (
        SELECT name, COALESCE(brand,'') AS brand, MIN(price) AS min_price
        FROM supplier_products
        WHERE in_stock = 1
        GROUP BY name, COALESCE(brand,'')
      ) t ON t.name = sp.name AND COALESCE(t.brand,'') = COALESCE(sp.brand,'') AND t.min_price = sp.price
    `);

    let created = 0, updated = 0, skipped = 0;
    for (const r of rows as any[]) {
      const name: string = r.name;
      const slug = toSlug(name);
      const brand: string = r.brand || 'Generic';
      const category: string = r.category || 'Supplements';
      const cost = Number(r.price) || 0;
      if (cost <= 0) { skipped++; continue; }
      const retail = +(cost * (1 + marginPercent / 100)).toFixed(2);
      const compare_at = +(retail * 1.15).toFixed(2);
      const img = r.image_url || '/placeholder.svg';
      const inStock = !!r.in_stock;

      const [existing] = await conn.execute('SELECT id FROM products WHERE slug = ? OR (name = ? AND brand = ?)', [slug, name, brand]);
      const row = (existing as any[])[0];
      if (row) {
        await conn.execute(
          `UPDATE products SET price=?, cost_price=?, compare_at_price=?, category=?, brand=?, image_url=?, images=?, in_stock=?, updated_at=CURRENT_TIMESTAMP
           WHERE id = ?`,
          [retail, cost, compare_at, category, brand, img, JSON.stringify([img]), inStock ? 1 : 0, row.id]
        );
        updated++;
      } else {
        await conn.execute(
          `INSERT INTO products (sku, name, slug, description, price, cost_price, compare_at_price, category, brand, image_url, images, in_stock, active, meta_title, meta_description, keywords)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?)`,
          [
            `SUP-${Date.now()}-${Math.random().toString(36).slice(2,7)}`.toUpperCase(),
            name,
            slug,
            `${name} by ${brand}. Sourced via supplier ${r.supplier}.`,
            retail,
            cost,
            compare_at,
            category,
            brand,
            img,
            JSON.stringify([img]),
            inStock ? 1 : 0,
            `${name} - ${brand} | Muscle Sports UK`,
            `Buy ${name} from ${brand}. High-quality supplements at competitive prices.`,
            `${name.toLowerCase()}, ${category.toLowerCase()}, ${brand.toLowerCase()}, supplements`
          ]
        );
        created++;
      }
    }
    return { created, updated, skipped };
  } finally {
    conn.release();
  }
}
