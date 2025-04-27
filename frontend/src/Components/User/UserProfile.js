import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserService from '../../services/UserService';
import './UserProfile.css';

const UserProfile = ({ userId, isCurrentUser = false }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const currentUserId = localStorage.getItem('userID');

  useEffect(() => {
    loadUserData();
  }, [userId]);

  useEffect(() => {
    // Check if current user is following this profile user
    if (user && !isCurrentUser && currentUserId) {
      checkFollowingStatus();
    }
  }, [user, isCurrentUser, currentUserId]);

  const loadUserData = async () => {
    try {
      setLoading(true);
      const response = await UserService.getUserById(userId);
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to load user profile. Please try again later.');
      console.error('Error loading user:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkFollowingStatus = async () => {
    try {
      const response = await UserService.getFollowedUsers(currentUserId);
      setIsFollowing(response.data.includes(userId));
    } catch (err) {
      console.error('Error checking following status:', err);
    }
  };

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await UserService.unfollowUser(currentUserId, userId);
      } else {
        await UserService.followUser(currentUserId, userId);
      }
      setIsFollowing(!isFollowing);
    } catch (err) {
      console.error('Error updating follow status:', err);
      alert(isFollowing ? 'Failed to unfollow user.' : 'Failed to follow user.');
    }
  };

  if (loading) {
    return <div className="user-profile-loading">Loading profile...</div>;
  }

  if (error) {
    return <div className="user-profile-error">{error}</div>;
  }

  if (!user) {
    return <div className="user-profile-error">User not found</div>;
  }

  return (
    <div className="user-profile">
      <div className="user-profile-header">
        <h2>{user.fullname}</h2>
        {isCurrentUser ? (
          <Link to={`/updateUserProfile/${userId}`} className="edit-profile-btn">
            Edit Profile
          </Link>
        ) : (
          currentUserId && (
            <button 
              className={`follow-btn ${isFollowing ? 'following' : ''}`}
              onClick={handleFollow}
            >
              {isFollowing ? 'Following' : 'Follow'}
            </button>
          )
        )}
      </div>

      <div className="user-profile-info">
        <div className="info-item">
          <span className="label">Email:</span>
          <span className="value">{user.email}</span>
        </div>
        {user.phone && (
          <div className="info-item">
            <span className="label">Phone:</span>
            <span className="value">{user.phone}</span>
          </div>
        )}
      </div>

      {user.skills && user.skills.length > 0 && (
        <div className="user-skills">
          <h3>Skills</h3>
          <div className="skills-list">
            {user.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 