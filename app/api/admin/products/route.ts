import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    // Get pagination and filter parameters
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json({ error: 'Invalid pagination parameters' }, { status: 400 });
    }

    // Get filtered and paginated products and total count
    const offset = (page - 1) * limit;
    const products = await Database.getProductsFiltered(limit, offset, search, category);
    const totalCount = await Database.getProductsFilteredCount(search, category);

    return NextResponse.json({
      products,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    // Parse request body
    const body = await request.json();
    const { id, name, price, description, images, category, inStock, featured } = body;

    // Validate required fields
    if (!id || !name || price === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Create product
    await Database.createProduct({
      id,
      name,
      price: parseFloat(price),
      description: description || '',
      images: images || [],
      category: category || '',
      inStock: inStock !== false,
      featured: featured === true
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating product:', error);
    return handleAuthError(error as Error);
  }
}