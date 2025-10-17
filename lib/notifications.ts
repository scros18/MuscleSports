import { Database } from './database';
import type { ResultSetHeader } from 'mysql2';

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: 'order' | 'account' | 'promotion' | 'system';
  read: boolean;
  action_url?: string;
  created_at: string;
}

export class NotificationService {
  /**
   * Create a new notification for a user
   */
  static async createNotification(
    userId: number,
    title: string,
    message: string,
    type: 'order' | 'account' | 'promotion' | 'system',
    actionUrl?: string
  ): Promise<Notification | null> {
    try {
      const result = await Database.query(
        `INSERT INTO notifications (user_id, title, message, type, action_url, created_at)
         VALUES (?, ?, ?, ?, ?, NOW())`,
        [userId, title, message, type, actionUrl || null]
      ) as ResultSetHeader;

      return {
        id: result.insertId,
        user_id: userId,
        title,
        message,
        type,
        read: false,
        action_url: actionUrl,
        created_at: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to create notification:', error);
      return null;
    }
  }

  /**
   * Get all notifications for a user
   */
  static async getUserNotifications(userId: number, limit = 20): Promise<Notification[]> {
    try {
      const rows = await Database.query(
        `SELECT * FROM notifications 
         WHERE user_id = ? 
         ORDER BY created_at DESC 
         LIMIT ?`,
        [userId, limit]
      );
      return rows as Notification[];
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      return [];
    }
  }

  /**
   * Get unread notification count for a user
   */
  static async getUnreadCount(userId: number): Promise<number> {
    try {
      const rows = await Database.query(
        `SELECT COUNT(*) as count FROM notifications 
         WHERE user_id = ? AND \`read\` = 0`,
        [userId]
      ) as any[];
      return rows[0]?.count || 0;
    } catch (error) {
      console.error('Failed to get unread count:', error);
      return 0;
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: number, userId: number): Promise<boolean> {
    try {
      await Database.query(
        `UPDATE notifications 
         SET \`read\` = 1 
         WHERE id = ? AND user_id = ?`,
        [notificationId, userId]
      );
      return true;
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  static async markAllAsRead(userId: number): Promise<boolean> {
    try {
      await Database.query(
        `UPDATE notifications 
         SET \`read\` = 1 
         WHERE user_id = ?`,
        [userId]
      );
      return true;
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      return false;
    }
  }

  /**
   * Delete a notification
   */
  static async deleteNotification(notificationId: number, userId: number): Promise<boolean> {
    try {
      await Database.query(
        `DELETE FROM notifications 
         WHERE id = ? AND user_id = ?`,
        [notificationId, userId]
      );
      return true;
    } catch (error) {
      console.error('Failed to delete notification:', error);
      return false;
    }
  }

  /**
   * Create an order notification
   */
  static async notifyOrderPlaced(userId: number, orderId: string, totalAmount: string): Promise<void> {
    await this.createNotification(
      userId,
      '🎉 Order Confirmed!',
      `Your order #${orderId} for ${totalAmount} has been successfully placed. We'll notify you when it ships!`,
      'order',
      `/orders/${orderId}`
    );
  }

  /**
   * Create an account verification notification
   */
  static async notifyAccountVerified(userId: number): Promise<void> {
    await this.createNotification(
      userId,
      '✅ Account Verified!',
      'Welcome to MuscleSports! Your account has been successfully verified. Start shopping for premium supplements now!',
      'account',
      '/products'
    );
  }

  /**
   * Create a welcome notification
   */
  static async notifyWelcome(userId: number, userName: string): Promise<void> {
    await this.createNotification(
      userId,
      `👋 Welcome ${userName}!`,
      'Thanks for joining MuscleSports! Explore our premium range of supplements and nutrition products.',
      'system',
      '/products'
    );
  }

  /**
   * Create a promotion notification
   */
  static async notifyPromotion(userId: number, title: string, message: string, actionUrl?: string): Promise<void> {
    await this.createNotification(
      userId,
      title,
      message,
      'promotion',
      actionUrl
    );
  }
}
