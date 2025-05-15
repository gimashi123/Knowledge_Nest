import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { Notification } from '@/types/notification';
import { NotificationService } from '@/services/notificationService';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Function to fetch notifications
  const fetchNotifications = useCallback(async (retryCount = 0) => {
    if (!currentUser) {
      console.log('No current user, skipping notification fetch');
      return;
    }
    
    // Maximum retry attempts
    const MAX_RETRIES = 2;
    
    console.log('Fetching notifications for user:', currentUser.id);
    setLoading(true);
    setError(null);
    
    try {
      const data = await NotificationService.getNotifications();
      console.log('Received notifications:', data);
      
      // Validate data structure to prevent UI errors
      if (data && Array.isArray(data.content)) {
        setNotifications(data.content);
      } else {
        console.warn('Invalid notification data format:', data);
        // Don't update state to avoid breaking the UI
      }
      
      // Fetch unread count
      try {
        const countData = await NotificationService.getUnreadCount();
        console.log('Received unread count:', countData);
        
        if (countData && typeof countData.unreadCount === 'number') {
          setUnreadCount(countData.unreadCount);
        } else {
          console.warn('Invalid unread count data format:', countData);
          // Keep previous count to avoid UI issues
        }
      } catch (countErr) {
        console.error('Error fetching unread count:', countErr);
        // Keep previous count to avoid UI issues
      }
    } catch (err: any) {
      console.error('Error fetching notifications:', err);
      setError(err?.message || 'Failed to fetch notifications');
      
      // Attempt retry for network errors
      if (retryCount < MAX_RETRIES) {
        console.log(`Retrying notification fetch (${retryCount + 1}/${MAX_RETRIES})...`);
        setTimeout(() => fetchNotifications(retryCount + 1), 3000);
      } else {
        console.error('Max retries reached for notification fetch');
      }
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  
  // Function to mark a notification as read
  const markAsRead = useCallback(async (id: string) => {
    try {
      await NotificationService.markAsRead(id);
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
      
      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to mark notification as read');
    }
  }, []);
  
  // Function to mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    try {
      await NotificationService.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      // Reset unread count
      setUnreadCount(0);
      
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to mark all notifications as read');
    }
  }, []);
  
  // Function to delete a notification
  const deleteNotification = useCallback(async (id: string) => {
    try {
      await NotificationService.deleteNotification(id);
      
      // Update local state - remove the deleted notification
      setNotifications(prev => prev.filter(notif => notif.id !== id));
      
      // If the notification was unread, update the unread count
      const wasUnread = notifications.find(n => n.id === id)?.read === false;
      if (wasUnread) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
      
      toast.success('Notification deleted');
    } catch (err) {
      console.error('Error deleting notification:', err);
      toast.error('Failed to delete notification');
    }
  }, [notifications]);
  
  // Fetch notifications on mount and when auth state changes
  useEffect(() => {
    if (currentUser) {
      fetchNotifications().then();
    } else {
      // Reset state when user logs out
      setNotifications([]);
      setUnreadCount(0);
    }
  }, [currentUser]);
  
  // Set up polling for new notifications
  useEffect(() => {
    if (!currentUser) return;
    
    const checkForNewNotifications = async () => {
      try {
        const countData = await NotificationService.getUnreadCount();
        
        if (countData.unreadCount > unreadCount) {
          // Only fetch full notifications if there are new ones
          fetchNotifications().then();
        } else {
          console.log('No new notifications found');
        }
      } catch (err) {
        console.error('Error checking for new notifications:', err);
      }
    };
    
    // Check for new notifications immediately and then every 3 min
    checkForNewNotifications().then();
    const intervalId = setInterval(checkForNewNotifications, (60000 * 3));
    
    return () => clearInterval(intervalId);
  }, [currentUser]);
  
  const value = {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
  };
  
  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}; 