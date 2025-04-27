import React, { useEffect, useState } from 'react';
import { FaUserGraduate, FaSearch } from "react-icons/fa";
import { MdNotifications, MdNotificationsActive } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { IoMdSettings } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";
import axios from 'axios';
import './NavBar.css';
import './UserCard.css';

function NavBar() {
    const [unreadCount, setUnreadCount] = useState(0);
    const [showCard, setShowCard] = useState(false); 
    const [userData, setUserData] = useState(null); 
    const userId = localStorage.getItem('userID');

    const fetchUnreadCount = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/notifications/${userId}/unread-count`);
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error('Error fetching unread notifications count:', error);
        }
    };

    const fetchUserData = async () => {
        try {
            const response = await axios.get(`http://localhost:8080/user/${userId}`);
            // Ensure skills is an array, even if it comes back as null from the API
            if (!response.data.skills) {
                response.data.skills = [];
            }
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUnreadCount();
            fetchUserData();
            
            // Set up polling for new notifications
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

    const currentPath = window.location.pathname;

    return (
        <div className="nav_con">
            <div className="navbar">
                <div className='nav_item_set'>
                    <div className='site-logo'>
                        <FaUserGraduate className="site-logo-icon" />
                        <span>Knowledge Nest</span>
                    </div>
                    
                    <div className='nav_bar_item'>
                        <div className="notification-icon-container">
                            {unreadCount > 0 ? (
                                <>
                                    <MdNotificationsActive 
                                        className={`nav_item_icon ${currentPath === '/notifications' ? 'nav_item_icon_noty' : ''}`}
                                        onClick={() => (window.location.href = '/notifications')} 
                                    />
                                    <span className="notification-badge">{unreadCount}</span>
                                </>
                            ) : (
                                <MdNotifications
                                    className={`nav_item_icon ${currentPath === '/notifications' ? 'nav_item_icon_noty' : ''}`}
                                    onClick={() => (window.location.href = '/notifications')} 
                                />
                            )}
                        </div>
                        
                        <IoLogOut
                            className='nav_item_icon'
                            onClick={() => {
                                localStorage.removeItem('userID');
                                localStorage.removeItem('userType');
                                window.location.href = '/';
                            }}
                        />
                        <FaUserGraduate
                            className='nav_item_icon'
                            style={{ display: localStorage.getItem('userType') === 'google' ? 'none' : 'block' }}
                            onClick={() => setShowCard(!showCard)} 
                        />
                    </div>
                </div>
            </div>
            {showCard && userData && (
                <div className="user-card">
                    <div className="user-card-header">
                        <div className="user-avatar">
                            {userData.fullname.charAt(0).toUpperCase()}
                        </div>
                        <h3>{userData.fullname}</h3>
                        <p className="user-email">{userData.email}</p>
                    </div>
                    
                    <div className="user-details">
                        <div className="detail-item">
                            <span className="detail-label">Phone</span>
                            <span className="detail-value">{userData.phone || 'Not provided'}</span>
                        </div>
                        <div className="detail-item">
                            <span className="detail-label">Skills</span>
                            <div className="skills-container">
                                {userData.skills && userData.skills.length > 0 ? (
                                    userData.skills.map((skill, index) => (
                                        <span key={index} className="skill-tag">{skill}</span>
                                    ))
                                ) : (
                                    <span className="no-skills">No skills added</span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="user-card-actions">
                        <button 
                            className="update-btn"
                            onClick={() => (window.location.href = `/updateUserProfile/${userId}`)}
                        >
                            <IoMdSettings className="action-icon" />
                            Update Profile
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to delete your profile?')) {
                                    axios.delete(`http://localhost:8080/user/${userId}`)
                                        .then(() => {
                                            alert('Profile deleted successfully!');
                                            localStorage.removeItem('userID');
                                            window.location.href = '/';
                                        })
                                        .catch(error => console.error('Error deleting profile:', error));
                                }
                            }}
                        >
                            <RiDeleteBin6Line className="action-icon" />
                            Delete Profile
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default NavBar;