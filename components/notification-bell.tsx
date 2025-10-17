"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, Check, Trash2, X, Package, UserCheck, Gift, Info } from "lucide-react";
import { useNotifications } from "@/context/notification-context";
import { useAuth } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Don't render if user is not logged in (must be after all hooks)
  if (!user) {
    return null;
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return <Package className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case 'account':
        return <UserCheck className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      case 'promotion':
        return <Gift className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
      default:
        return <Info className="h-3.5 w-3.5 sm:h-4 sm:w-4" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'account':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      case 'promotion':
        return 'bg-purple-500/10 text-purple-600 dark:text-purple-400';
      default:
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400';
    }
  };

  const handleNotificationClick = (notification: any) => {
    if (!notification.read) {
      markAsRead(notification.id);
    }
    if (notification.action_url) {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Notification Bell Button */}
      <Button
        variant="outline"
        size="icon"
        className="relative h-9 w-9 sm:h-10 sm:w-10 hover:scale-105 active:scale-95 transition-all duration-200 shadow-sm hover:shadow-md"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ''}`}
      >
        <Bell className={`h-4 w-4 sm:h-5 sm:w-5 transition-all duration-300 ${isOpen ? 'rotate-12' : ''}`} />
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-1.5 -right-1.5 h-5 w-5 min-w-[20px] flex items-center justify-center p-0 text-[10px] sm:text-xs font-bold rounded-full animate-pulse shadow-lg"
          >
            {unreadCount > 9 ? '9+' : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="fixed inset-0 md:fixed md:bottom-auto md:top-16 md:left-4 md:right-4 bg-background border rounded-2xl shadow-2xl z-[100000] overflow-hidden animate-in slide-in-from-bottom-2 duration-300 md:animate-in md:slide-in-from-top-2 max-h-[90vh] md:max-h-[75vh]">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 p-4 sm:p-5 border-b flex items-center justify-between sticky top-0">
            <div>
              <h3 className="font-bold text-lg sm:text-xl text-white flex items-center gap-2">
                📬 Order Updates
              </h3>
              <p className="text-xs sm:text-sm text-white/90 mt-1">
                {unreadCount > 0 ? `${unreadCount} new update${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
              </p>
            </div>
            {notifications.length > 0 && unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  markAllAsRead();
                }}
                className="text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 font-semibold"
              >
                <Check className="h-4 w-4 mr-2" />
                Mark all read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {loading && notifications.length === 0 ? (
              <div className="p-8 sm:p-12 text-center text-muted-foreground">
                <div className="relative inline-block">
                  <div className="animate-spin rounded-full h-12 w-12 sm:h-14 sm:w-14 border-3 border-green-600 border-t-transparent mx-auto mb-4"></div>
                </div>
                <p className="text-sm sm:text-base font-medium">Loading updates...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 sm:p-12 text-center">
                <div className="relative inline-block mb-4">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-green-100 to-green-50 dark:from-green-950/30 dark:to-green-900/20 flex items-center justify-center mx-auto">
                    <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-green-600 dark:text-green-400" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-foreground mb-2">No updates yet</h3>
                <p className="text-sm text-muted-foreground">When you make a purchase, you&apos;ll see order updates here</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 sm:p-5 hover:bg-muted/30 transition-colors group border-l-4 cursor-pointer ${
                      !notification.read 
                        ? 'bg-green-50 dark:bg-green-950/20 border-l-green-600' 
                        : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex gap-3 sm:gap-4">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)} shadow-sm`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title */}
                        <h4 className={`text-sm sm:text-base font-bold mb-1 ${!notification.read ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {notification.title}
                        </h4>

                        {/* Message */}
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2 mb-2">
                          {notification.message}
                        </p>
                        
                        {/* Footer with time and actions */}
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[11px] sm:text-xs text-muted-foreground/70 font-medium">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                          
                          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            {notification.action_url && (
                              <Link href={notification.action_url}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-7 px-2 text-[11px] sm:text-xs hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400"
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  View
                                </Button>
                              </Link>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-3.5 w-3.5 text-red-500" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer - Only show if there are notifications */}
          {notifications.length > 3 && (
            <div className="p-2 border-t bg-muted/20 text-center">
              <Link href="/orders">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs w-full hover:bg-background h-8 font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  View all orders
                </Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
