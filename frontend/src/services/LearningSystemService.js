import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

class LearningSystemService {
  // Create a new learning system entry
  createLearningPost(learningPostData) {
    return axios.post(`${API_BASE_URL}/learningSystem`, learningPostData);
  }

  // Get all learning system entries
  getAllLearningPosts() {
    return axios.get(`${API_BASE_URL}/learningSystem`);
  }

  // Get a specific learning post by ID
  getLearningPostById(id) {
    return axios.get(`${API_BASE_URL}/learningSystem/${id}`);
  }

  // Update a learning post
  updateLearningPost(id, learningPostData) {
    return axios.put(`${API_BASE_URL}/learningSystem/${id}`, learningPostData);
  }

  // Delete a learning post
  deleteLearningPost(id) {
    return axios.delete(`${API_BASE_URL}/learningSystem/${id}`);
  }

  // Like/unlike a learning post
  likePost(id, userID) {
    return axios.put(`${API_BASE_URL}/learningSystem/${id}/like?userID=${userID}`);
  }

  // Add a comment to a learning post
  addComment(id, comment) {
    return axios.post(`${API_BASE_URL}/learningSystem/${id}/comment`, comment);
  }

  // Update a comment on a learning post
  updateComment(id, commentId, updatedComment) {
    return axios.put(`${API_BASE_URL}/learningSystem/${id}/comment/${commentId}`, updatedComment);
  }

  // Delete a comment from a learning post
  deleteComment(id, commentId, userID) {
    return axios.delete(`${API_BASE_URL}/learningSystem/${id}/comment/${commentId}?userID=${userID}`);
  }
}

export default new LearningSystemService(); 