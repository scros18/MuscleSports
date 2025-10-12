import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import csv from 'csv-parser'
import { Database } from '@/lib/database';
import { products as staticProducts } from '@/data/products';

export const dynamic = 'force-dynamic';
export const revalidate = 60; // Revalidate every 60 seconds

type PriceRow = { id?: string; sku?: string; price?: string; stock?: string; quantity?: string; qty?: string; instock?: string };
type PriceMap = { [id: string]: { price?: number; inStock?: boolean } };

let pricingCache: { map: PriceMap; mtimeMs: number } | null = null;

function normalizePriceToPounds(v: any): number | undefined {
  if (v === null || v === undefined) return undefined;
  const num = Number(v);
  if (!Number.isFinite(num)) return undefined;
  // Heuristic: if looks like pence (>= 10000), convert to pounds
  if (num >= 10000) return Math.round(num) / 100;
  // If looks like typical pounds value (e.g., 77.99 or 129), use as-is
  return num;
}

async function readPricingCsv(): Promise<PriceMap> {
  try {
    const filePath = path.join(process.cwd(), 'stockandprice.csv');
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
          let priceNum: number | undefined;
          const priceStr = hasGeneric
            ? ((row['Column4'] ?? row['column4']) as string | undefined)
            : ((lower.price ?? row.Price ?? row.PRICE) as string | undefined);
          if (priceStr !== undefined) {
            const cleaned = String(priceStr).replace(/[^0-9.]/g, '');
            const val = parseFloat(cleaned);
            if (Number.isFinite(val)) priceNum = val; // CSV prices are in pounds
          }
          // stock/quantity to boolean
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
          map[key] = {
            price: priceNum,
            inStock,
          };
        })
        .on('end', () => resolve())
        .on('error', (err) => reject(err));
    });
    pricingCache = { map, mtimeMs: stat.mtimeMs };
    return map;
  } catch (e) {
    // If file not present or parse fails, fallback silently
    return {};
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const pageParam = parseInt(url.searchParams.get('page') || '1', 10);
    const pageSizeParam = parseInt(url.searchParams.get('pageSize') || '48', 10);
    const categoryParam = url.searchParams.get('category') || '';
    const searchParam = url.searchParams.get('search') || '';
    const minPriceParam = url.searchParams.get('minPrice') || '';
    const maxPriceParam = url.searchParams.get('maxPrice') || '';

    const page = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;
    const pageSize = Number.isFinite(pageSizeParam) && pageSizeParam > 0 && pageSizeParam <= 200 ? pageSizeParam : 48;
    const minPrice = minPriceParam ? parseFloat(minPriceParam) : undefined;
    const maxPrice = maxPriceParam ? parseFloat(maxPriceParam) : undefined;

    // Try to get products from database, fall back to static products
    let allProducts;
    try {
      allProducts = await Database.getAllProducts();
      if (!allProducts || allProducts.length === 0) {
        console.log('Database returned no products, using static products');
        allProducts = staticProducts;
      }
    } catch (dbError) {
      console.log('Database error, using static products:', dbError);
      allProducts = staticProducts;
    }

    const pricing = await readPricingCsv();

    const categories = Array.from(new Set(allProducts.map((p: any) => p.category).filter(Boolean)));

    // Filter by category if provided (and not 'All')
    let filtered = categoryParam && categoryParam !== 'All'
      ? allProducts.filter((p: any) => p.category === categoryParam)
      : allProducts;

    // Filter by search query if provided
    if (searchParam.trim()) {
      const searchLower = searchParam.toLowerCase().trim();
      filtered = filtered.filter((p: any) =>
        p.name?.toLowerCase().includes(searchLower) ||
        p.category?.toLowerCase().includes(searchLower) ||
        p.description?.toLowerCase().includes(searchLower)
      );
    }

    // Apply price filtering
    if (filtered.length > 0) {
      filtered = filtered.filter((p: any) => {
        const override = pricing[p.id];
        const price = (override?.price !== undefined)
          ? override.price
          : p.price;
        
        if (typeof price !== 'number' || isNaN(price)) return false;
        
        if (minPrice !== undefined && price < minPrice) return false;
        if (maxPrice !== undefined && price > maxPrice) return false;
        
        return true;
      });
    }

    // Apply sorting if requested (use overridden price when available)
    const sortParam = url.searchParams.get('sort') || 'best_match';
    if (sortParam === 'price_asc') {
      filtered.sort((a: any, b: any) => {
        const pa = (pricing[a.id]?.price !== undefined) ? pricing[a.id].price : a.price;
        const pb = (pricing[b.id]?.price !== undefined) ? pricing[b.id].price : b.price;
        return (pa ?? 0) - (pb ?? 0);
      });
    } else if (sortParam === 'price_desc') {
      filtered.sort((a: any, b: any) => {
        const pa = (pricing[a.id]?.price !== undefined) ? pricing[a.id].price : a.price;
        const pb = (pricing[b.id]?.price !== undefined) ? pricing[b.id].price : b.price;
        return (pb ?? 0) - (pa ?? 0);
      });
    }

    const total = filtered.length;

    // Lightweight mapping and paging
    const start = (page - 1) * pageSize;
    const end = Math.min(start + pageSize, total);
    const sanitize = (s: any) => {
      if (!s && s !== "") return s;
      try {
        return String(s).replace(/\(.*pack of 5.*\)/i, "").replace(/pack of 5/ig, "").replace(/\s+-\s+/g, " ").trim();
      } catch (e) {
        return s;
      }
    };

    const pageItems = filtered.slice(start, end).map((p: any) => {
      const override = pricing[p.id];
      const price = (override?.price !== undefined)
        ? override.price
        : p.price;
      const inStock = typeof override?.inStock === 'boolean' ? override.inStock : p.inStock;
      return {
        id: p.id,
        name: sanitize(p.name),
        price,
        image: Array.isArray(p.images) && p.images.length ? p.images[0] : null,
        images: p.images,
        category: p.category,
        inStock,
        featured: p.featured,
        description: sanitize(p.description),
      };
    });

    return NextResponse.json({
      products: pageItems,
      total,
      page,
      pageSize,
      categories,
    });
  } catch (err: any) {
    console.error('Error in /api/products', err);
    return new Response(JSON.stringify({ error: 'Failed to load products' }), { status: 500 });
  }
}
