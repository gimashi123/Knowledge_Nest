import { Progress, ProgressRequest } from '../types/progress';
import { mockProgressItems } from './mockData';

// Mock API that simulates backend functionality for testing the UI
export const MockProgressService = {
  // In-memory data store
  _data: [...mockProgressItems],

  // Get all progress items
  getAll: async (): Promise<Progress[]> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return [...MockProgressService._data];
  },

  // Get progress by ID
  getById: async (id: string): Promise<Progress | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    const item = MockProgressService._data.find(p => p.progressId === id);
    return item ? { ...item } : null;
  },

  // Create new progress
  create: async (progress: ProgressRequest): Promise<Progress | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 700));
    
    const newId = String(MockProgressService._data.length + 1);
    const newProgress: Progress = {
      progressId: newId,
      title: progress.title,
      topics: progress.topics,
      progress: progress.progress || 0,
      lastUpdate: progress.lastUpdate || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    MockProgressService._data.push(newProgress);
    return { ...newProgress };
  },

  // Update existing progress
  update: async (id: string, progress: ProgressRequest): Promise<Progress | null> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const index = MockProgressService._data.findIndex(p => p.progressId === id);
    if (index === -1) return null;
    
    const updatedProgress: Progress = {
      progressId: id,
      title: progress.title,
      topics: progress.topics,
      progress: progress.progress || MockProgressService._data[index].progress,
      lastUpdate: progress.lastUpdate || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    MockProgressService._data[index] = updatedProgress;
    return { ...updatedProgress };
  },

  // Delete progress
  delete: async (id: string): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const index = MockProgressService._data.findIndex(p => p.progressId === id);
    if (index === -1) return false;
    
    MockProgressService._data.splice(index, 1);
    return true;
  }
}; 