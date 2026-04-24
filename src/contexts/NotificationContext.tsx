"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { notificationService, Notification } from "@/lib/firebaseServices";
import { onSnapshot, query, where, collection } from "firebase/firestore";
import { db } from "@/lib/firebaseClient";

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  refreshNotifications: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType>({
  notifications: [],
  unreadCount: 0,
  loading: true,
  refreshNotifications: async () => {},
  markAsRead: async () => {},
  markAllAsRead: async () => {},
  deleteNotification: async () => {},
});

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadNotifications = async () => {
    if (!user) {
      console.log('🔍 No user, clearing notifications');
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    try {
      console.log('🔍 Loading notifications for user:', user.id);
      setLoading(true);
      const [notifs, count] = await Promise.all([
        notificationService.getByUser(user.id),
        notificationService.getUnreadCount(user.id)
      ]);
      
      console.log('📨 Loaded notifications:', { 
        count: notifs.length, 
        unreadCount: count,
        notifications: notifs.map(n => ({ id: n.id, title: n.title, isRead: n.isRead }))
      });
      
      setNotifications(notifs);
      setUnreadCount(count);
    } catch (error) {
      console.error('❌ Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshNotifications = async () => {
    await loadNotifications();
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, isRead: true }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    
    try {
      await notificationService.markAllAsRead(user.id);
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
    }
  };

  const deleteNotification = async (notificationId: string) => {
    try {
      await notificationService.delete(notificationId);
      const notification = notifications.find(n => n.id === notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
      if (notification && !notification.isRead) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  // Set up real-time listener for notifications
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      setUnreadCount(0);
      setLoading(false);
      return;
    }

    console.log('🔔 Setting up real-time notification listener for user:', user.id);
    setLoading(true);

    // Create query for user's notifications (no orderBy to avoid composite index requirement)
    const notificationsQuery = query(
      collection(db, "notifications"),
      where("userId", "==", user.id)
    );

    // Set up real-time listener
    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      console.log('📨 Real-time notification update received:', {
        added: snapshot.docChanges().filter(change => change.type === 'added').length,
        modified: snapshot.docChanges().filter(change => change.type === 'modified').length,
        removed: snapshot.docChanges().filter(change => change.type === 'removed').length,
        total: snapshot.docs.length
      });

      const notifs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Notification[];

      // Sort client-side by createdAt descending (newest first)
      notifs.sort((a, b) => {
        const dateA = (a.createdAt as any)?.toDate?.()?.getTime() ?? 0;
        const dateB = (b.createdAt as any)?.toDate?.()?.getTime() ?? 0;
        return dateB - dateA;
      });

      const unread = notifs.filter(n => !n.isRead).length;

      console.log('📨 Updated notifications state:', {
        count: notifs.length,
        unreadCount: unread,
        notifications: notifs.map(n => ({ id: n.id, title: n.title, isRead: n.isRead }))
      });

      setNotifications(notifs);
      setUnreadCount(unread);
      setLoading(false);
    }, (error) => {
      console.error('❌ Error in real-time notification listener:', error);
      setLoading(false);
    });

    // Cleanup function
    return () => {
      console.log('🔔 Cleaning up real-time notification listener');
      unsubscribe();
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{
      notifications,
      unreadCount,
      loading,
      refreshNotifications,
      markAsRead,
      markAllAsRead,
      deleteNotification,
    }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
} 