import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    const category = await Database.getCategoryById(params.id);

    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    return NextResponse.json({ category });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    const body = await request.json();
    const { name, description } = body;

    // Check if category exists
    const existingCategory = await Database.getCategoryById(params.id);
    if (!existingCategory) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Validate name if provided
    if (name !== undefined) {
      if (typeof name !== 'string' || name.trim().length === 0) {
        return NextResponse.json({ error: 'Category name cannot be empty' }, { status: 400 });
      }

      // Check if another category with this name already exists
      const allCategories = await Database.getAllCategories();
      const duplicateCategory = allCategories.find(cat =>
        cat.id !== params.id && cat.name.toLowerCase() === name.toLowerCase().trim()
      );

      if (duplicateCategory) {
        return NextResponse.json({ error: 'Category with this name already exists' }, { status: 400 });
      }
    }

    const updateData: Partial<{ name: string; description: string }> = {};
    if (name !== undefined) updateData.name = name.trim();
    if (description !== undefined) updateData.description = description?.trim() || '';

    await Database.updateCategory(params.id, updateData);

    return NextResponse.json({
      message: 'Category updated successfully',
      category: {
        id: params.id,
        name: name !== undefined ? name.trim() : existingCategory.name,
        description: description !== undefined ? (description?.trim() || '') : existingCategory.description
      }
    });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    // Check if category exists
    const category = await Database.getCategoryById(params.id);
    if (!category) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // Check if category is being used by any products
    const products = await Database.getAllProducts();
    const productsUsingCategory = products.filter(product => product.category === category.name);

    if (productsUsingCategory.length > 0) {
      return NextResponse.json({
        error: `Cannot delete category. It is being used by ${productsUsingCategory.length} product(s).`
      }, { status: 400 });
    }

    await Database.deleteCategory(params.id);

    return NextResponse.json({ message: 'Category deleted successfully' });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}