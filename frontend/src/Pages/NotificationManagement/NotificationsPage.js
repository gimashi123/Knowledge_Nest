import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../Components/SideBar/SideBar';
import './notification.css';
import { RiDeleteBin6Fill } from "react-icons/ri";
import { IoMdNotificationsOutline, IoMdNotifications } from "react-icons/io";
import { MdOutlineMarkEmailRead } from "react-icons/md";

function NotificationsPage() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem('userID');

  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/notifications/${userId}`);
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchNotifications();
    }
  }, [userId]);

  const handleMarkAsRead = async (id) => {
    try {
      await axios.put(`http://localhost:8080/notifications/${id}/markAsRead`);
      setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
      // Trigger event to update navbar count
      window.dispatchEvent(new Event('notificationUpdate'));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/notifications/${id}`);
      setNotifications(notifications.filter(n => n.id !== id));
      // Trigger event to update navbar count
      window.dispatchEvent(new Event('notificationUpdate'));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  return (
    <div className='con1'>
      <div className='notification-container'>
        <div className='notification-layout'>
          <div><SideBar /></div>
          <div className='notification-content'>
            <div className='notification-header'>
              <h2>All Notifications</h2>
              <span className='notification-count'>{notifications.length}</span>
            </div>
            
            <div className='notification-list'>
              {notifications.length === 0 ? (
                <div className='empty-notifications'>
                  <IoMdNotificationsOutline className='empty-icon' />
                  <p>No notifications available</p>
                </div>
              ) : (
                notifications.map(notification => (
                  <div key={notification.id} className={`notification-card ${notification.read ? 'read' : 'unread'}`}>
                    <div className='notification-icon'>
                      {notification.read ? 
                        <IoMdNotificationsOutline className='read-icon' /> : 
                        <IoMdNotifications className='unread-icon' />
                      }
                    </div>
                    <div className='notification-body'>
                      <p className='notification-message'>{notification.message}</p>
                      <p className='notification-time'>
                        {new Date(notification.createdAt).toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className='notification-actions'>
                      {!notification.read && (
                        <button 
                          className='mark-read-btn'
                          onClick={() => handleMarkAsRead(notification.id)}
                          title="Mark as read"
                        >
                          <MdOutlineMarkEmailRead />
                        </button>
                      )}
                      <button 
                        className='delete-btn'
                        onClick={() => handleDelete(notification.id)}
                        title="Delete notification"
                      >
                        <RiDeleteBin6Fill />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotificationsPage;