import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

class LearningProgressService {
  // Create a new learning progress record
  createLearningProgress(progressData) {
    return axios.post(`${API_BASE_URL}/learningProgress`, progressData);
  }

  // Get all learning progress records
  getAllLearningProgress() {
    return axios.get(`${API_BASE_URL}/learningProgress`);
  }

  // Get a specific learning progress record by ID
  getLearningProgressById(id) {
    return axios.get(`${API_BASE_URL}/learningProgress/${id}`);
  }

  // Update a learning progress record
  updateLearningProgress(id, progressData) {
    return axios.put(`${API_BASE_URL}/learningProgress/${id}`, progressData);
  }

  // Delete a learning progress record
  deleteLearningProgress(id) {
    return axios.delete(`${API_BASE_URL}/learningProgress/${id}`);
  }
}

export default new LearningProgressService(); 