import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    await requireAdmin(request);

    const { id } = params;
    const body = await request.json();
    const { role } = body;

    if (!role || !['user', 'admin'].includes(role)) {
      return NextResponse.json({ error: 'Valid role is required (user or admin)' }, { status: 400 });
    }

    // Check if user exists
    const user = await Database.findUserById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Update user role
    await Database.updateUserRole(id, role);

    return NextResponse.json({
      message: 'User role updated successfully'
    });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}