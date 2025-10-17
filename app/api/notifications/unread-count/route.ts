import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notifications';
import { getUserIdFromToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/notifications/unread-count
 * Get the count of unread notifications for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    
    if (!userId) {
      return NextResponse.json({ count: 0 });
    }

    const count = await NotificationService.getUnreadCount(userId);

    return NextResponse.json({ count });
  } catch (error) {
    console.error('Error fetching unread count:', error);
    return NextResponse.json({ count: 0 });
  }
}
