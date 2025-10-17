import { NextRequest, NextResponse } from 'next/server';
import { TropicanaScraper } from '@/lib/tropicana-scraper';
import { Database } from '@/lib/database';

/**
 * API Route: Fetch and sync Tropicana products
 * POST /api/admin/tropicana/sync
 * 
 * This endpoint triggers the Tropicana scraper and syncs products to the database
 */
export async function POST(request: NextRequest) {
  try {
    const { skus } = await request.json();

    if (!skus || !Array.isArray(skus) || skus.length === 0) {
      return NextResponse.json(
        { error: 'SKUs array is required' },
        { status: 400 }
      );
    }

    console.log(`Starting Tropicana sync for ${skus.length} SKUs...`);

    const scraper = new TropicanaScraper();
    
    // Create temporary SKU file
    const fs = require('fs/promises');
    const skuFilePath = 'temp-skus.txt';
    await fs.writeFile(skuFilePath, skus.join('\n'), 'utf-8');

    // Execute scraper
    const products = await scraper.execute(skuFilePath);

    // Clean up temp file
    await fs.unlink(skuFilePath).catch(() => {});

    // Sync to database
    let syncedCount = 0;
    let errorCount = 0;

    for (const product of products) {
      try {
        await Database.query(
          `INSERT INTO products (
            sku, name, description, price, stock, 
            brand, category, image_url, barcode, 
            metadata, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
          ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            description = VALUES(description),
            price = VALUES(price),
            stock = VALUES(stock),
            brand = VALUES(brand),
            category = VALUES(category),
            image_url = VALUES(image_url),
            barcode = VALUES(barcode),
            metadata = VALUES(metadata),
            updated_at = NOW()`,
          [
            product.sku,
            product.name,
            product.nutritionalInformation || '',
            product.productPrice,
            product.stockLevel,
            product.brand,
            product.filterByCategory,
            product.imageUrl,
            product.barcode,
            JSON.stringify({
              flavour: product.flavour,
              size: product.size,
              expiryDate: product.expiryDate,
              tax: product.tax,
              keywords: product.keywords
            })
          ]
        );
        syncedCount++;
      } catch (error) {
        console.error(`Error syncing product ${product.sku}:`, error);
        errorCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Synced ${syncedCount} products from Tropicana`,
      stats: {
        fetched: products.length,
        synced: syncedCount,
        errors: errorCount
      }
    });

  } catch (error) {
    console.error('Tropicana sync error:', error);
    return NextResponse.json(
      { 
        error: 'Failed to sync Tropicana products',
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}

/**
 * GET: Check Tropicana sync status
 */
export async function GET() {
  try {
    const result = await Database.query(
      `SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN image_url LIKE '%tropicanawholesale%' THEN 1 END) as tropicana_products,
        MAX(updated_at) as last_sync
      FROM products
      WHERE image_url LIKE '%tropicanawholesale%'`
    ) as any[];

    return NextResponse.json({
      success: true,
      stats: result[0] || { total: 0, tropicana_products: 0, last_sync: null }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to get sync status' },
      { status: 500 }
    );
  }
}
