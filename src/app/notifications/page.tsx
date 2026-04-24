"use client";

import { useNotifications } from "@/contexts/NotificationContext";
import { useAuth } from "@/contexts/AuthContext";
import { notificationService } from "@/lib/firebaseServices";
import AppLayout from "@/layouts/AppLayout";
import { Button } from "@/components/ui/button";
import { FiBell, FiCheck, FiTrash2, FiCheckCircle, FiXCircle } from "react-icons/fi";
import { useState } from "react";

export default function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification, refreshNotifications } = useNotifications();
  const { user } = useAuth();
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const handleMarkAsRead = async (notificationId: string) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  const handleDeleteNotification = async (notificationId: string) => {
    await deleteNotification(notificationId);
  };

  const handleDeleteSelected = async () => {
    await Promise.all(selectedNotifications.map(id => deleteNotification(id)));
    setSelectedNotifications([]);
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === notifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(notifications.map(n => n.id!));
    }
  };

  const handleSelectNotification = (notificationId: string) => {
    setSelectedNotifications(prev => 
      prev.includes(notificationId)
        ? prev.filter(id => id !== notificationId)
        : [...prev, notificationId]
    );
  };

  // Test function to create a notification
  const createTestNotification = async () => {
    if (!user) return;
    
    try {
      console.log('🧪 Creating test notification...');
      const testNotification = {
        title: "Test Notification",
        message: "This is a test notification to verify the system is working",
        userId: user.id,
        type: 'system' as const,
        relatedId: 'test-123',
        relatedType: 'test',
        fromUserId: 'system',
        fromUserName: 'System',
        isRead: false,
      };
      
      const notificationId = await notificationService.create(testNotification);
      console.log('✅ Test notification created with ID:', notificationId);
      
      // Refresh notifications
      await refreshNotifications();
    } catch (error) {
      console.error('❌ Error creating test notification:', error);
    }
  };

  // Test function to create a like notification
  const createTestLikeNotification = async () => {
    if (!user) return;
    
    try {
      console.log('🧪 Creating test like notification...');
      const notificationId = await notificationService.createLikeNotification(
        'test-snippet-123',
        'Test Snippet Title',
        user.id, // snippet owner (current user)
        'test-user-456', // user who liked
        'Test User'
      );
      console.log('✅ Test like notification created with ID:', notificationId);
      
      // Refresh notifications
      await refreshNotifications();
    } catch (error) {
      console.error('❌ Error creating test like notification:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      case 'snippet_shared':
        return '📤';
      default:
        return '🔔';
    }
  };

  const formatTime = (timestamp: any) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="spinner mx-auto mb-4"></div>
            <p>Loading...</p>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FiBell className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                <p className="text-gray-600">
                  {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}` : 'All caught up!'}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  onClick={handleMarkAllAsRead}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <FiCheckCircle className="h-4 w-4" />
                  Mark all read
                </Button>
              )}
              {selectedNotifications.length > 0 && (
                <Button
                  onClick={handleDeleteSelected}
                  variant="outline"
                  className="flex items-center gap-2 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <FiTrash2 className="h-4 w-4" />
                  Delete selected ({selectedNotifications.length})
                </Button>
              )}
              <Button
                onClick={createTestNotification}
                variant="outline"
                className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
              >
                🧪 Test Notification
              </Button>
              <Button
                onClick={createTestLikeNotification}
                variant="outline"
                className="flex items-center gap-2 text-green-600 border-green-300 hover:bg-green-50"
              >
                🧪 Test Like Notification
              </Button>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="text-center py-12">
              <FiBell className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications yet</h3>
              <p className="text-gray-600">
                When someone likes your public snippets or interacts with your content, you'll see notifications here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                <input
                  type="checkbox"
                  checked={selectedNotifications.length === notifications.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">
                  Select all ({notifications.length})
                </span>
              </div>

              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors ${
                    !notification.isRead
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <input
                      type="checkbox"
                      checked={selectedNotifications.includes(notification.id!)}
                      onChange={() => handleSelectNotification(notification.id!)}
                      className="mt-1 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <div className="flex-shrink-0 mt-1">
                      <span className="text-2xl">{getNotificationIcon(notification.type)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className={`font-medium ${!notification.isRead ? 'text-gray-900' : 'text-gray-700'}`}>
                            {notification.title}
                          </p>
                          <p className="text-gray-600 mt-1">
                            {notification.message}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            {formatTime(notification.createdAt)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 ml-4">
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleMarkAsRead(notification.id!)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <FiCheck className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id!)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <FiTrash2 className="h-4 w-4" />
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
      </div>
    </AppLayout>
  );
} 