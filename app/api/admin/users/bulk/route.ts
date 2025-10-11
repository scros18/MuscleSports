import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, handleAuthError } from '@/lib/auth';
import { Database } from '@/lib/database';

export async function POST(request: NextRequest) {
  try {
    // Check if user is admin
    const currentUser = await requireAdmin(request);

    const body = await request.json();
    const { action, userIds, role } = body;

    if (!action || !userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json({ error: 'Action and userIds array are required' }, { status: 400 });
    }

    // Prevent admin from affecting themselves in bulk operations
    const filteredUserIds = userIds.filter(id => id !== currentUser.id);

    if (action === 'change-role') {
      if (!role || !['user', 'admin'].includes(role)) {
        return NextResponse.json({ error: 'Valid role is required (user or admin)' }, { status: 400 });
      }

      // Update roles for all selected users
      const promises = filteredUserIds.map(userId => Database.updateUserRole(userId, role));
      await Promise.all(promises);

      return NextResponse.json({
        message: `Successfully updated ${filteredUserIds.length} user(s) to ${role} role`
      });
    }

    if (action === 'delete') {
      // Delete all selected users
      const promises = filteredUserIds.map(userId => Database.deleteUser(userId));
      await Promise.all(promises);

      return NextResponse.json({
        message: `Successfully deleted ${filteredUserIds.length} user(s)`
      });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    return handleAuthError(error as Error);
  }
}