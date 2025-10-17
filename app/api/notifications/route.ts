import { NextRequest, NextResponse } from 'next/server';
import { NotificationService } from '@/lib/notifications';
import { getUserIdFromToken } from '@/lib/auth';

export const dynamic = 'force-dynamic';

/**
 * GET /api/notifications
 * Fetch all notifications for the authenticated user
 */
export async function GET(req: NextRequest) {
  try {
    const userId = await getUserIdFromToken(req);
    
    if (!userId) {
      return NextResponse.json(
        { notifications: [], unreadCount: 0 },
        { status: 200 }
      );
    }

    const notifications = await NotificationService.getUserNotifications(userId);
    const unreadCount = await NotificationService.getUnreadCount(userId);

    return NextResponse.json({
      notifications,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json(
      { notifications: [], unreadCount: 0 },
      { status: 200 }
    );
  }
}
