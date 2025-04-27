import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

class NotificationService {
  // Get all notifications for a user
  getUserNotifications(userId) {
    return axios.get(`${API_BASE_URL}/notifications/${userId}`);
  }

  // Mark a notification as read
  markAsRead(notificationId) {
    return axios.put(`${API_BASE_URL}/notifications/${notificationId}/markAsRead`);
  }

  // Delete a notification
  deleteNotification(notificationId) {
    return axios.delete(`${API_BASE_URL}/notifications/${notificationId}`);
  }
}

export default new NotificationService(); 