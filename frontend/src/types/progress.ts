export interface Progress {
  progressId?: string;
  title: string;
  topics: string[];
  completedTopics?: string[];
  progress: number;
  lastUpdate?: string;
  userId? : string;
}

export interface ProgressRequest {
  title: string;
  topics: string[];
  completedTopics?: string[];
  progress?: number;
  lastUpdate?: string;
} 