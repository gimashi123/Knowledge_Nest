import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

class UserService {
  // User Registration
  registerUser(userData) {
    return axios.post(`${API_BASE_URL}/user`, userData);
  }

  // User Login
  loginUser(credentials) {
    return axios.post(`${API_BASE_URL}/login`, credentials);
  }

  // Get User by ID
  getUserById(userId) {
    return axios.get(`${API_BASE_URL}/user/${userId}`);
  }

  // Update User Profile
  updateUserProfile(userId, userData) {
    return axios.put(`${API_BASE_URL}/user/${userId}`, userData);
  }

  // Delete User Account
  deleteUserAccount(userId) {
    return axios.delete(`${API_BASE_URL}/user/${userId}`);
  }

  // Check if Email Exists
  checkEmailExists(email) {
    return axios.get(`${API_BASE_URL}/checkEmail?email=${email}`);
  }

  // Follow User
  followUser(userId, followUserId) {
    return axios.put(`${API_BASE_URL}/user/${userId}/follow`, { followUserID: followUserId });
  }

  // Unfollow User
  unfollowUser(userId, unfollowUserId) {
    return axios.put(`${API_BASE_URL}/user/${userId}/unfollow`, { unfollowUserID: unfollowUserId });
  }

  // Get Followed Users
  getFollowedUsers(userId) {
    return axios.get(`${API_BASE_URL}/user/${userId}/followedUsers`);
  }

  // Get All Users
  getAllUsers() {
    return axios.get(`${API_BASE_URL}/user`);
  }
}

export default new UserService(); 