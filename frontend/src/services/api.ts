import axios from 'axios';
import { Progress, ProgressRequest } from '../types/progress';
import { MockProgressService } from './mockApi';

const API_URL = 'http://localhost:8081/api/progress';

// Flag to use mock API instead of real backend
const USE_MOCK_API = false; // Set to false to use real backend

export const ProgressService = {
  // Get all progress items
  getAll: async (): Promise<Progress[]> => {
    if (USE_MOCK_API) {
      return MockProgressService.getAll();
    }

    try {
      const response = await axios.get(`${API_URL}/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching progress data:', error);
      // Fallback to mock data if backend is not available
      return MockProgressService.getAll();
    }
  },

  // Get progress by ID
  getById: async (id: string): Promise<Progress | null> => {
    if (USE_MOCK_API) {
      return MockProgressService.getById(id);
    }

    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching progress with ID ${id}:`, error);
      // Fallback to mock data if backend is not available
      return MockProgressService.getById(id);
    }
  },

  // Create new progress
  create: async (progress: ProgressRequest): Promise<Progress | null> => {
    if (USE_MOCK_API) {
      return MockProgressService.create(progress);
    }

    try {
      const response = await axios.post(`${API_URL}/add`, progress);
      return response.data;
    } catch (error) {
      console.error('Error creating progress:', error);
      // Fallback to mock data if backend is not available
      return MockProgressService.create(progress);
    }
  },

  // Update existing progress
  update: async (id: string, progress: ProgressRequest): Promise<Progress | null> => {
    if (USE_MOCK_API) {
      return MockProgressService.update(id, progress);
    }

    try {
      const response = await axios.put(`${API_URL}/${id}`, progress);
      return response.data;
    } catch (error) {
      console.error(`Error updating progress with ID ${id}:`, error);
      // Fallback to mock data if backend is not available
      return MockProgressService.update(id, progress);
    }
  },

  // Delete progress
  delete: async (id: string): Promise<boolean> => {
    if (USE_MOCK_API) {
      return MockProgressService.delete(id);
    }

    try {
      await axios.delete(`${API_URL}/${id}`);
      return true;
    } catch (error) {
      console.error(`Error deleting progress with ID ${id}:`, error);
      // Fallback to mock data if backend is not available
      return MockProgressService.delete(id);
    }
  }
}; 