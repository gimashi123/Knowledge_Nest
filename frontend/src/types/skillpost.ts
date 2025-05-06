export interface SkillPost {
  id: string;
  title: string;
  description: string;
  content: string;
  youtubeUrl?: string;
  userId: string;
  userName: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  likedBy: string[];
  comments: Comment[];
}

export interface Comment {
  id: string;
  content: string;
  userId: string;
  userName: string;
  createdAt: string;
  updatedAt?: string;
  parentCommentId?: string;
  replies?: Comment[];
}

export interface SkillPostRequest {
  title: string;
  description: string;
  content: string;
  youtubeUrl?: string;
  tags: string[];
}

export interface CommentRequest {
  content: string;
  parentCommentId?: string;
}

export interface SkillPostResponse {
  content: SkillPost[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
} 