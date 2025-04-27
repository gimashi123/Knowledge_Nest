import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import { Link } from 'react-router-dom';
import './notification.css';

function NotificationIndicator() {
  const [unreadCount, setUnreadCount] = useState(0);
  const userId = localStorage.getItem('userID');

  const fetchUnreadCount = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/notifications/${userId}/unread-count`);
      setUnreadCount(response.data.count);
    } catch (error) {
      console.error('Error fetching unread notifications count:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000); // Check every minute
      
      // Listen for custom events from NotificationsPage
      const handleNotificationUpdate = () => {
        fetchUnreadCount();
      };
      
      window.addEventListener('notificationUpdate', handleNotificationUpdate);
      
      return () => {
        clearInterval(interval);
        window.removeEventListener('notificationUpdate', handleNotificationUpdate);
      };
    }
  }, [userId]);

  return (
    <Link to="/notifications" className="notification-indicator">
      {unreadCount > 0 ? (
        <>
          <IoMdNotifications className="notification-icon active" />
          <span className="notification-badge">{unreadCount}</span>
        </>
      ) : (
        <IoMdNotificationsOutline className="notification-icon" />
      )}
    </Link>
  );
}

export default NotificationIndicator;