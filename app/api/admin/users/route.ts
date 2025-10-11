import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    // Get all users
    const users = await Database.getAllUsers();

    return NextResponse.json({
      users
    });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}