import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    const body = await request.json();
    const { action, productIds, inStock, featured } = body;

    if (!action || !productIds || !Array.isArray(productIds) || productIds.length === 0) {
      return NextResponse.json({ error: 'Action and productIds array are required' }, { status: 400 });
    }

    if (action === 'update-stock') {
      if (typeof inStock !== 'boolean') {
        return NextResponse.json({ error: 'inStock boolean is required for update-stock action' }, { status: 400 });
      }

      // Update stock status for all selected products
      const promises = productIds.map(productId => Database.updateProductStock(productId, inStock));
      await Promise.all(promises);

      return NextResponse.json({
        message: `Successfully updated stock status for ${productIds.length} product(s) to ${inStock ? 'in stock' : 'out of stock'}`
      });
    }

    if (action === 'update-featured') {
      if (typeof featured !== 'boolean') {
        return NextResponse.json({ error: 'featured boolean is required for update-featured action' }, { status: 400 });
      }

      // Update featured status for all selected products
      const promises = productIds.map(productId => Database.updateProductFeatured(productId, featured));
      await Promise.all(promises);

      return NextResponse.json({
        message: `Successfully updated featured status for ${productIds.length} product(s) to ${featured ? 'featured' : 'not featured'}`
      });
    }

    if (action === 'delete') {
      // Delete all selected products
      const promises = productIds.map(productId => Database.deleteProduct(productId));
      await Promise.all(promises);

      return NextResponse.json({
        message: `Successfully deleted ${productIds.length} product(s)`
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}