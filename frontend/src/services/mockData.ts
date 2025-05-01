import { Progress } from '../types/progress';

// Mock data for testing the UI without a backend
export const mockProgressItems: Progress[] = [
  {
    progressId: '1',
    title: 'JavaScript Fundamentals',
    topics: ['Variables', 'Functions', 'Objects', 'Arrays'],
    progress: 75,
    lastUpdate: '10:30'
  },
  {
    progressId: '2',
    title: 'React Basics',
    topics: ['Components', 'Props', 'State', 'Hooks'],
    progress: 60,
    lastUpdate: '14:15'
  },
  {
    progressId: '3',
    title: 'MongoDB',
    topics: ['Collections', 'CRUD Operations', 'Aggregation'],
    progress: 30,
    lastUpdate: '09:00'
  }
]; 