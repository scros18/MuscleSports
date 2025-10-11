import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    // Get all unique categories
    const categories = await Database.getProductCategories();

    return NextResponse.json({
      categories
    });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}