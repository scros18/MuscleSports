import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    // Get product by ID
    const product = await Database.getProductById(params.id);

    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    return handleAuthError(error as Error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    // Parse request body
    const body = await request.json();
    const { name, price, description, images, category, inStock, featured, flavours } = body;

    // Check if product exists
    const existingProduct = await Database.getProductById(params.id);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Update product
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (price !== undefined) updateData.price = parseFloat(price);
    if (description !== undefined) updateData.description = description;
    if (images !== undefined) updateData.images = images;
    if (category !== undefined) updateData.category = category;
    if (inStock !== undefined) updateData.inStock = inStock;
    if (featured !== undefined) updateData.featured = featured;
    if (flavours !== undefined) {
      updateData.flavours = flavours;
      
      // Build flavourImages mapping from the new flavor variation structure
      // This maintains backwards compatibility with existing code that expects flavourImages
      if (Array.isArray(flavours) && flavours.length > 0) {
        const flavourImages: Record<string, string> = {};
        flavours.forEach((flavour: any) => {
          if (flavour.image && flavour.name) {
            // Store by lowercase name for case-insensitive lookup
            flavourImages[flavour.name.toLowerCase()] = flavour.image;
          }
        });
        if (Object.keys(flavourImages).length > 0) {
          updateData.flavourImages = flavourImages;
        }
      }
    }

    await Database.updateProduct(params.id, updateData);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating product:', error);
    return handleAuthError(error as Error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    // Check if product exists
    const existingProduct = await Database.getProductById(params.id);
    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete product
    await Database.deleteProduct(params.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting product:', error);
    return handleAuthError(error as Error);
  }
}