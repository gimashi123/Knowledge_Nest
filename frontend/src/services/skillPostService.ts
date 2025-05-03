import axios from 'axios';
import { SkillPost, SkillPostRequest, CommentRequest, SkillPostResponse } from '../types/skillpost';

const API_URL = 'http://localhost:8081/api/skill-posts';

// Add auth token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Mock data for development/testing
const MOCK_DATA: SkillPost[] = [
  {
    id: '1',
    title: 'Introduction to React Hooks',
    description: 'Learn how to use React Hooks for state management and side effects',
    content: 'React Hooks were introduced in React 16.8 and provide a way to use state and other React features without writing a class component.\n\nThe most commonly used hooks are useState, useEffect, and useContext. They allow for more concise and readable code, make it easier to reuse stateful logic between components, and help organize related code better than the lifecycle methods in class components.',
    userId: 'user1',
    userName: 'johnsmith',
    tags: ['react', 'javascript', 'frontend'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 3).toISOString(),
    likes: 15,
    likedBy: ['user2', 'user3'],
    comments: [
      {
        id: 'c1',
        content: 'Great article! Really helped me understand hooks better.',
        userId: 'user2',
        userName: 'janedoe',
        createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString()
      }
    ]
  },
  {
    id: '2',
    title: 'Mastering TypeScript',
    description: 'Tips and tricks for effective TypeScript development',
    content: 'TypeScript adds static typing to JavaScript, which can help catch errors early and make your code more robust. It\'s especially useful in large codebases where type safety becomes increasingly important.\n\nIn this post, we\'ll cover advanced TypeScript concepts such as generics, utility types, and type guards.',
    userId: 'user2',
    userName: 'janedoe',
    tags: ['typescript', 'javascript', 'development'],
    createdAt: new Date(Date.now() - 3600000 * 24 * 7).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24 * 6).toISOString(),
    likes: 23,
    likedBy: ['user1', 'user3', 'user4'],
    comments: []
  }
];

// A flag to determine whether to use the mock service or real API
// Set to true to use mock data, false to use real API
const USE_MOCK = true;

// Mock service implementation
const MockSkillPostService = {
  getAll: async (page = 0, size = 10): Promise<SkillPostResponse> => {
    const start = page * size;
    const end = start + size;
    const paginatedData = MOCK_DATA.slice(start, end);
    
    return {
      content: paginatedData,
      totalElements: MOCK_DATA.length,
      totalPages: Math.ceil(MOCK_DATA.length / size),
      number: page,
      size: size
    };
  },
  
  getById: async (id: string): Promise<SkillPost> => {
    const post = MOCK_DATA.find(p => p.id === id);
    if (!post) throw new Error(`Post with ID ${id} not found`);
    return post;
  },
  
  create: async (post: SkillPostRequest): Promise<SkillPost> => {
    // Try to get the current user info from localStorage
    let userId = 'current-user';
    let userName = 'currentuser';
    
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        userId = user.id || user._id || user.email || userId;
        userName = user.name || user.userName || userName;
      }
    } catch (error) {
      console.error('Error parsing user from localStorage:', error);
    }
    
    const newPost: SkillPost = {
      id: `mock-${Date.now()}`,
      ...post,
      userId: userId,
      userName: userName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      likes: 0,
      likedBy: [],
      comments: []
    };
    
    MOCK_DATA.unshift(newPost);
    return newPost;
  },
  
  update: async (id: string, postData: SkillPostRequest): Promise<SkillPost> => {
    const index = MOCK_DATA.findIndex(p => p.id === id);
    if (index === -1) throw new Error(`Post with ID ${id} not found`);
    
    const updatedPost = {
      ...MOCK_DATA[index],
      ...postData,
      updatedAt: new Date().toISOString()
    };
    
    MOCK_DATA[index] = updatedPost;
    return updatedPost;
  },
  
  delete: async (id: string): Promise<void> => {
    const index = MOCK_DATA.findIndex(p => p.id === id);
    if (index !== -1) {
      MOCK_DATA.splice(index, 1);
    }
  },
  
  // Implement other methods similar to the real service but using MOCK_DATA
  getByUser: async (userId: string, page = 0, size = 10): Promise<SkillPostResponse> => {
    const filtered = MOCK_DATA.filter(p => p.userId === userId);
    const start = page * size;
    const end = start + size;
    const paginatedData = filtered.slice(start, end);
    
    return {
      content: paginatedData,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size: size
    };
  },
  
  search: async (keyword: string, page = 0, size = 10): Promise<SkillPostResponse> => {
    const normalized = keyword.toLowerCase();
    const filtered = MOCK_DATA.filter(p => 
      p.title.toLowerCase().includes(normalized) || 
      p.description.toLowerCase().includes(normalized) ||
      p.content.toLowerCase().includes(normalized)
    );
    
    const start = page * size;
    const end = start + size;
    const paginatedData = filtered.slice(start, end);
    
    return {
      content: paginatedData,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size: size
    };
  },
  
  getTrending: async (page = 0, size = 10): Promise<SkillPostResponse> => {
    // Sort by likes for "trending"
    const sorted = [...MOCK_DATA].sort((a, b) => b.likes - a.likes);
    const start = page * size;
    const end = start + size;
    const paginatedData = sorted.slice(start, end);
    
    return {
      content: paginatedData,
      totalElements: sorted.length,
      totalPages: Math.ceil(sorted.length / size),
      number: page,
      size: size
    };
  },
  
  toggleLike: async (id: string): Promise<SkillPost> => {
    const post = MOCK_DATA.find(p => p.id === id);
    if (!post) throw new Error(`Post with ID ${id} not found`);
    
    const userId = 'current-user'; // Simulating current user
    const hasLiked = post.likedBy.includes(userId);
    
    if (hasLiked) {
      post.likedBy = post.likedBy.filter(id => id !== userId);
      post.likes--;
    } else {
      post.likedBy.push(userId);
      post.likes++;
    }
    
    return post;
  },
  
  addComment: async (postId: string, comment: CommentRequest): Promise<SkillPost> => {
    const post = MOCK_DATA.find(p => p.id === postId);
    if (!post) throw new Error(`Post with ID ${postId} not found`);
    
    const newComment = {
      id: `comment-${Date.now()}`,
      ...comment,
      userId: 'current-user',
      userName: 'currentuser',
      createdAt: new Date().toISOString()
    };
    
    post.comments.push(newComment);
    return post;
  },
  
  updateComment: async (postId: string, commentId: string, comment: CommentRequest): Promise<SkillPost> => {
    const post = MOCK_DATA.find(p => p.id === postId);
    if (!post) throw new Error(`Post with ID ${postId} not found`);
    
    const commentIndex = post.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) throw new Error(`Comment with ID ${commentId} not found`);
    
    post.comments[commentIndex] = {
      ...post.comments[commentIndex],
      ...comment
    };
    
    return post;
  },
  
  deleteComment: async (postId: string, commentId: string): Promise<SkillPost> => {
    const post = MOCK_DATA.find(p => p.id === postId);
    if (!post) throw new Error(`Post with ID ${postId} not found`);
    
    post.comments = post.comments.filter(c => c.id !== commentId);
    return post;
  },

  getByTag: async (tag: string, page = 0, size = 10): Promise<SkillPostResponse> => {
    const filtered = MOCK_DATA.filter(p => p.tags.includes(tag));
    const start = page * size;
    const end = start + size;
    const paginatedData = filtered.slice(start, end);
    
    return {
      content: paginatedData,
      totalElements: filtered.length,
      totalPages: Math.ceil(filtered.length / size),
      number: page,
      size: size
    };
  },

  deleteMultiple: async (ids: string[]): Promise<void> => {
    for (const id of ids) {
      const index = MOCK_DATA.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_DATA.splice(index, 1);
      }
    }
  }
};

// Export the appropriate service based on the USE_MOCK flag
export const SkillPostService = USE_MOCK ? MockSkillPostService : {
  // Get all posts with pagination
  getAll: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Promise<SkillPostResponse> => {
    try {
      const response = await axios.get(
        `${API_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching skill posts:', error);
      // Fallback to mock if real API fails
      return MockSkillPostService.getAll(page, size);
    }
  },

  // Get post by ID
  getById: async (id: string): Promise<SkillPost> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching skill post with ID ${id}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.getById(id);
    }
  },

  // Create new post
  create: async (post: SkillPostRequest): Promise<SkillPost> => {
    try {
      const response = await axios.post(API_URL, post);
      return response.data;
    } catch (error) {
      console.error('Error creating skill post:', error);
      // Fallback to mock if real API fails
      return MockSkillPostService.create(post);
    }
  },

  // Update existing post
  update: async (id: string, post: SkillPostRequest): Promise<SkillPost> => {
    try {
      const response = await axios.put(`${API_URL}/${id}`, post);
      return response.data;
    } catch (error) {
      console.error(`Error updating skill post with ID ${id}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.update(id, post);
    }
  },

  // Delete post
  delete: async (id: string): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/${id}`);
    } catch (error) {
      console.error(`Error deleting skill post with ID ${id}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.delete(id);
    }
  },

  // Delete multiple posts
  deleteMultiple: async (ids: string[]): Promise<void> => {
    try {
      await axios.delete(`${API_URL}/batch`, { data: ids });
    } catch (error) {
      console.error('Error deleting multiple skill posts:', error);
      // Fallback to mock if real API fails
      return MockSkillPostService.deleteMultiple(ids);
    }
  },

  // Get posts by user
  getByUser: async (userId: string, page = 0, size = 10): Promise<SkillPostResponse> => {
    try {
      const response = await axios.get(`${API_URL}/user/${userId}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching skill posts for user ${userId}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.getByUser(userId, page, size);
    }
  },

  // Get posts by tag
  getByTag: async (tag: string, page = 0, size = 10): Promise<SkillPostResponse> => {
    try {
      const response = await axios.get(`${API_URL}/tag/${tag}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching skill posts with tag ${tag}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.getByTag(tag, page, size);
    }
  },

  // Search posts by keyword
  search: async (keyword: string, page = 0, size = 10): Promise<SkillPostResponse> => {
    try {
      const response = await axios.get(`${API_URL}/search?keyword=${keyword}&page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error(`Error searching skill posts with keyword ${keyword}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.search(keyword, page, size);
    }
  },

  // Get trending posts
  getTrending: async (page = 0, size = 10): Promise<SkillPostResponse> => {
    try {
      const response = await axios.get(`${API_URL}/trending?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching trending skill posts:', error);
      // Fallback to mock if real API fails
      return MockSkillPostService.getTrending(page, size);
    }
  },

  // Toggle like on a post
  toggleLike: async (id: string): Promise<SkillPost> => {
    try {
      const response = await axios.post(`${API_URL}/${id}/like`);
      return response.data;
    } catch (error) {
      console.error(`Error toggling like for skill post with ID ${id}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.toggleLike(id);
    }
  },

  // Add comment to a post
  addComment: async (postId: string, comment: CommentRequest): Promise<SkillPost> => {
    try {
      const response = await axios.post(`${API_URL}/${postId}/comments`, comment);
      return response.data;
    } catch (error) {
      console.error(`Error adding comment to skill post with ID ${postId}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.addComment(postId, comment);
    }
  },

  // Update comment
  updateComment: async (postId: string, commentId: string, comment: CommentRequest): Promise<SkillPost> => {
    try {
      const response = await axios.put(`${API_URL}/${postId}/comments/${commentId}`, comment);
      return response.data;
    } catch (error) {
      console.error(`Error updating comment ${commentId} for skill post ${postId}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.updateComment(postId, commentId, comment);
    }
  },

  // Delete comment
  deleteComment: async (postId: string, commentId: string): Promise<SkillPost> => {
    try {
      const response = await axios.delete(`${API_URL}/${postId}/comments/${commentId}`);
      return response.data;
    } catch (error) {
      console.error(`Error deleting comment ${commentId} for skill post ${postId}:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.deleteComment(postId, commentId);
    }
  }
}; 