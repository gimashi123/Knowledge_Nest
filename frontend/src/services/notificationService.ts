import { Notification, NotificationCount } from "@/types/notification";
import axiosInstance from "@/services/axios.ts";

// Determine API URL based on environment
const API_URL = 
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' 
    ? 'http://localhost:8081/api' 
    : '/api';

export class NotificationService {
  static async getNotifications(page: number = 0, size: number = 10): Promise<{
    content: Notification[];
    totalElements: number;
    totalPages: number;
    number: number;
    size: number;
  }> {
    console.log(`Fetching notifications, page: ${page}, size: ${size}`);
    try {
      const response = await axiosInstance.get(`${API_URL}/notifications?page=${page}&size=${size}`);
      console.log('Notifications response:', response.data);
      
      // Validate response structure
      if (!response.data || !Array.isArray(response.data.content)) {
        console.warn('Invalid notifications response format:', response.data);
        // Return a valid but empty response
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: page,
          size: size
        };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Return a fallback response instead of throwing
      return {
        content: [],
        totalElements: 0,
        totalPages: 0,
        number: page,
        size: size
      };
    }
  }

  static async getUnreadNotifications(): Promise<Notification[]> {
    console.log('Fetching unread notifications');
    try {
      const response = await axiosInstance.get(`${API_URL}/notifications/unread`);
      console.log('Unread notifications response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching unread notifications:', error);
      throw error;
    }
  }

  static async getUnreadCount(): Promise<NotificationCount> {
    console.log('Fetching unread count');
    try {
      const response = await axiosInstance.get(`${API_URL}/notifications/count`);
      console.log('Unread count response:', response.data);
      
      // Validate response structure
      if (!response.data || typeof response.data.unreadCount !== 'number') {
        console.warn('Invalid unread count response format:', response.data);
        // Return a valid fallback
        return { unreadCount: 0 };
      }
      
      return response.data;
    } catch (error) {
      console.error('Error fetching unread count:', error);
      // Return a fallback instead of throwing
      return { unreadCount: 0 };
    }
  }

  static async markAsRead(id: string): Promise<Notification> {
    console.log(`Marking notification as read: ${id}`);
    try {
      const response = await axiosInstance.patch(`${API_URL}/notifications/${id}/read`);
      console.log('Mark as read response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }

  static async markAllAsRead(): Promise<void> {
    console.log('Marking all notifications as read');
    try {
      await axiosInstance.patch(`${API_URL}/notifications/read-all`);
      console.log('All notifications marked as read');
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  }

  static async deleteNotification(id: string): Promise<void> {
    console.log(`Deleting notification: ${id}`);
    try {
      await axiosInstance.delete(`${API_URL}/notifications/${id}`);
      console.log('Notification deleted');
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  }
} 