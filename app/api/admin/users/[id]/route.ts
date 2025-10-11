import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if user is admin
    const currentUser = await requireAdmin(request);

    const { id } = params;

    // Check if user exists
    const user = await Database.findUserById(id);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Prevent admin from deleting themselves
    if (currentUser.id === id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }

    // Delete user
    await Database.deleteUser(id);

    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}