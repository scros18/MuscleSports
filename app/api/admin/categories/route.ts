import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    // Get all categories
    const categories = await Database.getAllCategories();

    return NextResponse.json({
      categories
    });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
    }

    // Generate ID from name (slug-like)
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

    // Check if category with this name already exists
    const existingCategories = await Database.getAllCategories();
    const existingCategory = existingCategories.find(cat => cat.name.toLowerCase() === name.toLowerCase());

    if (existingCategory) {
      return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 });
    }

    await Database.createCategory({
      id,
      name: name.trim(),
      description: description?.trim() || ''
    });

    return NextResponse.json({
      message: 'Category created successfully',
      category: { id, name: name.trim(), description: description?.trim() || '' }
    });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}