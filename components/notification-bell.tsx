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
  
  // Don't render if user is not logged in
  if (!user) {
    return null;
  }

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
        <div className="absolute right-0 top-full mt-2 w-[95vw] sm:w-[420px] md:w-[480px] bg-background border rounded-xl shadow-2xl z-[100000] overflow-hidden animate-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary/10 via-primary/5 to-background p-3 sm:p-4 border-b flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
                Order Updates
              </h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">
                {unreadCount > 0 ? `Track your order status and delivery updates` : 'All notifications viewed'}
              </p>
            </div>
            {notifications.length > 0 && unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  markAllAsRead();
                }}
                className="text-xs h-7 sm:h-8 px-2 sm:px-3 hover:bg-primary/10 hover:text-primary font-semibold"
              >
                <Check className="h-3 w-3 mr-1" />
                Clear all
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[70vh] sm:max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {loading && notifications.length === 0 ? (
              <div className="p-12 sm:p-16 text-center text-muted-foreground">
                <div className="relative inline-block">
                  <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-2 border-primary border-t-transparent mx-auto mb-3"></div>
                  <Bell className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-primary/40" />
                </div>
                <p className="text-xs sm:text-sm font-medium">Loading notifications...</p>
                <p className="text-[10px] sm:text-xs mt-1 text-muted-foreground/60">Just a moment</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-16 sm:p-20 text-center">
                <div className="relative inline-block mb-6">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mx-auto border-4 border-background shadow-inner">
                    <Bell className="h-10 w-10 sm:h-12 sm:w-12 text-primary/30" strokeWidth={1.5} />
                  </div>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground mb-2">No notifications yet</h3>
                <p className="text-sm text-muted-foreground mb-1">You&apos;ll see order updates here when you</p>
                <p className="text-sm text-muted-foreground">make a purchase</p>
              </div>
            ) : (
              <div className="divide-y divide-border/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-3 sm:p-4 hover:bg-muted/50 transition-colors group border-l-4 ${
                      !notification.read 
                        ? 'bg-primary/5 border-l-primary' 
                        : 'border-l-transparent'
                    }`}
                  >
                    <div className="flex gap-2 sm:gap-3">
                      {/* Icon - Smaller, more compact */}
                      <div className={`flex-shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center ${getNotificationColor(notification.type)} shadow-sm`}>
                        {getNotificationIcon(notification.type)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Title with time and unread indicator */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex items-center gap-1.5 flex-1 min-w-0">
                            <h4 className={`text-xs sm:text-sm font-bold ${!notification.read ? 'text-foreground' : 'text-muted-foreground'} truncate`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0 animate-pulse" />
                            )}
                          </div>
                        </div>

                        {/* Message with bullet point separator */}
                        <div className="flex items-start gap-1.5 mb-2">
                          <span className="text-muted-foreground text-[10px] mt-0.5 flex-shrink-0">•</span>
                          <p className="text-[11px] sm:text-xs text-muted-foreground leading-relaxed line-clamp-2">
                            {notification.message}
                          </p>
                        </div>
                        
                        {/* Footer with time and actions */}
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <svg className="w-3 h-3 text-muted-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="text-[10px] text-muted-foreground/80 font-medium">
                              {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {notification.action_url && (
                              <Link href={notification.action_url}>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-[10px] hover:bg-primary/10 hover:text-primary"
                                  onClick={() => handleNotificationClick(notification)}
                                >
                                  View
                                </Button>
                              </Link>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 hover:bg-red-50 dark:hover:bg-red-950/20"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                            >
                              <Trash2 className="h-3 w-3 text-red-500" />
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
