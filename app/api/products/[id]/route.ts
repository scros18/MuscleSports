import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { Database } from '@/lib/database';

type PriceRow = { id?: string; sku?: string; price?: string; stock?: string; quantity?: string; qty?: string; instock?: string };
type PriceMap = { [id: string]: { price?: number; inStock?: boolean } };

function normalizePriceToPounds(v: any): number | undefined {
  if (v === null || v === undefined) return undefined;
  const num = Number(v);
  if (!Number.isFinite(num)) return undefined;
  // Heuristic: if value looks like pence stored as an integer (very large), convert to pounds
  if (num >= 10000) return Math.round(num) / 100;
  return num;
}

let pricingCache: { map: PriceMap; mtimeMs: number } | null = null;

async function readPricingCsv(): Promise<PriceMap> {
  try {
    const filePath = path.join(process.cwd(), 'aosomstockandprice.csv');
    const stat = fs.statSync(filePath);
    if (pricingCache && pricingCache.mtimeMs === stat.mtimeMs) {
      return pricingCache.map;
    }
    const map: PriceMap = {};
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row: any) => {
          const lower = Object.fromEntries(
            Object.entries(row).map(([k, v]) => [String(k).toLowerCase().trim(), typeof v === 'string' ? v.trim() : v])
          ) as Record<string, any>;
          // Support files where columns are Column1,Column2,Column4 and the next row contains actual labels
          const hasGeneric = 'column1' in lower || 'column2' in lower || 'column4' in lower;
          const skuVal = hasGeneric ? (row['Column1'] ?? row['column1']) : (lower.id ?? lower.sku);
          // Skip header-like rows
          if (typeof skuVal === 'string' && skuVal.trim().toLowerCase() === 'sku') return;
          const key = (skuVal ?? '').toString().trim();
          if (!key) return;
          // Parse price in pounds (CSV already provides values like "77.99 GBP")
          let priceNum: number | undefined;
          const priceStr = hasGeneric
            ? ((row['Column4'] ?? row['column4']) as string | undefined)
            : ((lower.price ?? (row as any).Price ?? (row as any).PRICE) as string | undefined);
          if (priceStr !== undefined) {
            const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
            const val = parseFloat(cleaned);
            if (Number.isFinite(val)) priceNum = val; // CSV prices are in pounds
          }
          const stockStr = hasGeneric
            ? ((row['Column2'] ?? row['column2']) as string | undefined)
            : ((lower.stock ?? lower.quantity ?? lower.qty ?? lower.instock) as string | undefined);
          let inStock: boolean | undefined;
          if (stockStr !== undefined) {
            const s = String(stockStr).toLowerCase();
            if (s.includes('out')) inStock = false;
            else if (s.includes('in')) inStock = true;
            else {
              const n = parseInt(s.replace(/[^0-9-]/g, '') || '0', 10);
              inStock = n > 0;
            }
          }
          map[key] = { price: priceNum, inStock };
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });
    pricingCache = { map, mtimeMs: stat.mtimeMs };
    return map;
  } catch (e) {
    return {};
  }
}

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { id } = params;
  try {
    // Get product from database
    let product = await Database.getProductById(id);
    if (!product) return new Response(null, { status: 404 });
    
    const pricing = await readPricingCsv();
    const override = pricing[id];
    const price = (override?.price !== undefined)
      ? override.price
      : (normalizePriceToPounds(product.price) ?? 0);
    const inStock = typeof override?.inStock === 'boolean' ? override.inStock : product.inStock;

    // sanitize name/description to remove bundle wording like 'pack of 5'
    const sanitize = (s: any) => {
      if (!s && s !== "") return s;
      try {
        return String(s).replace(/\(.*pack of 5.*\)/i, "").replace(/pack of 5/ig, "").replace(/\s+-\s+/g, " ").trim();
      } catch (e) {
        return s;
      }
    };

    const cleaned = { ...product, name: sanitize(product.name), description: sanitize(product.description) };
    
    // Return product with updated price and stock
    const responseProduct = { ...cleaned, price, inStock };

    return NextResponse.json(responseProduct);
  } catch (err: any) {
    console.error('Error in /api/products/[id]', err);
    return new Response(JSON.stringify({ error: 'Failed to load product' }), { status: 500 });
  }
}
