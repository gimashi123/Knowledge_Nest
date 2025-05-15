import axios from 'axios';
import { SkillPost, SkillPostRequest, CommentRequest, SkillPostResponse } from '../types/skillpost';

const API_URL = 'http://localhost:8081/api/skill-posts';

// Add auth token to requests
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log(`Adding auth token to request: ${config.method?.toUpperCase()} ${config.url}`);
    } else {
      console.warn(`No auth token found for request: ${config.method?.toUpperCase()} ${config.url}`);
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
// Set to false to use real API, true to use mock data
const USE_MOCK = false;

// Log which mode we're using
console.log('SkillPostService using ' + (USE_MOCK ? 'MOCK' : 'REAL API') + ' mode');

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
    console.log('MOCK SERVICE: Creating a new post with data:', post);
    
    // Try to get the current user info from localStorage
    let userId = 'current-user';
    let userName = 'currentuser';
    
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        // Prioritize id over email to match backend behavior
        userId = user.id || user.email || userId;
        userName = user.name || user.userName || userName;
        
        console.log('MOCK SERVICE: Creating post with user ID:', userId, 'User name:', userName);
      } else {
        console.warn('MOCK SERVICE: No user found in localStorage when creating post');
      }
    } catch (error) {
      console.error('MOCK SERVICE: Error parsing user from localStorage:', error);
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
    
    console.log('MOCK SERVICE: Created new mock post:', newPost);
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
    console.log('MOCK SERVICE: Fetching posts for user ID:', userId);
    // When in fallback mode, see what user posts exist in MOCK_DATA
    console.log('Available mock posts:', MOCK_DATA.map(post => ({ id: post.id, userId: post.userId, title: post.title })));
    
    // Filter posts by the provided userId
    const filtered = MOCK_DATA.filter(p => {
      const matchesUserId = p.userId === userId;
      if (matchesUserId) {
        console.log('Found matching post for userId', userId, ':', p.title);
      }
      return matchesUserId;
    });
    
    console.log(`MOCK SERVICE: Found ${filtered.length} posts for user ${userId}`);
    
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
  
  replyToComment: async (postId: string, commentId: string, reply: CommentRequest): Promise<SkillPost> => {
    const post = MOCK_DATA.find(p => p.id === postId);
    if (!post) throw new Error(`Post with ID ${postId} not found`);
    
    // Find the parent comment
    const parentComment = post.comments.find(c => c.id === commentId);
    if (!parentComment) throw new Error(`Comment with ID ${commentId} not found`);
    
    // Initialize replies array if it doesn't exist
    if (!parentComment.replies) {
      parentComment.replies = [];
    }
    
    // Create new reply
    const newReply = {
      id: `reply-${Date.now()}`,
      ...reply,
      parentCommentId: commentId,
      userId: 'current-user',
      userName: 'currentuser',
      createdAt: new Date().toISOString()
    };
    
    // Add to replies array
    parentComment.replies.push(newReply);
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

  getByTags: async (tags: string[], page = 0, size = 10): Promise<SkillPostResponse> => {
    // Filter posts that have at least one of the requested tags
    const filtered = MOCK_DATA.filter(post => 
      post.tags.some(tag => tags.includes(tag))
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

  deleteMultiple: async (ids: string[]): Promise<void> => {
    for (const id of ids) {
      const index = MOCK_DATA.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_DATA.splice(index, 1);
      }
    }
  },

  getAllTags: async (): Promise<string[]> => {
    // Extract tags from MOCK_DATA
    const tags = new Set<string>();
    MOCK_DATA.forEach(post => post.tags.forEach(tag => tags.add(tag)));
    return Array.from(tags);
  }
};

// Export the appropriate service based on the USE_MOCK flag
export const SkillPostService = USE_MOCK ? MockSkillPostService : {
  // Get all posts with pagination
  getAll: async (page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc'): Promise<SkillPostResponse> => {
    try {
      console.log(`Fetching all posts - page: ${page}, size: ${size}, sortBy: ${sortBy}, sortDir: ${sortDir}`);
      const response = await axios.get(
        `${API_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
      );
      
      // Validate response structure
      const data = response.data;
      if (!data.content || !Array.isArray(data.content)) {
        console.error('Response data structure is not as expected:', data);
        // Return a valid empty response structure
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: page,
          size: size
        };
      }
      
      console.log(`Retrieved ${data.content.length} posts out of ${data.totalElements} total`);
      return data;
    } catch (error: any) {
      console.error('Error fetching skill posts:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: `${API_URL}?page=${page}&size=${size}&sortBy=${sortBy}&sortDir=${sortDir}`
      });
      
      // Fallback to mock if real API fails
      console.log('Falling back to mock service for getAll');
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
      // Log that we're about to create a post
      console.log('Creating new post with data:', post);
      
      // Validate required fields before sending
      if (!post.title) {
        console.error('Post title is missing or empty');
        throw new Error('Title is required');
      }
      
      if (!post.description || post.description.length < 10) {
        console.error('Post description is too short (minimum 10 characters)');
        throw new Error('Description must be at least 10 characters long');
      }
      
      if (!post.content) {
        console.error('Post content is missing or empty');
        throw new Error('Content is required');
      }
      
      if (!post.tags || post.tags.length === 0) {
        console.error('Post tags are missing');
        throw new Error('At least one tag is required');
      }
      
      // Get auth token to confirm it's available
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.warn('No auth token found when creating post - this may cause authorization errors');
      }
      
      // Make the API call with the token
      const response = await axios.post(API_URL, post, {
        headers: {
          'Authorization': `Bearer ${token || ''}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Post created successfully, response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error creating skill post:', error);
      
      // Show more detailed error information
      if (error.response) {
        console.error('Error response status:', error.response.status);
        console.error('Error response data:', error.response.data);
        
        // Extract validation errors if available
        const validationErrors = error.response?.data?.fieldErrors || 
                                 error.response?.data?.errors ||
                                 error.response?.data?.message;
        if (validationErrors) {
          console.error('Validation errors:', validationErrors);
        }
      }
      
      // Check if this is an auth error
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.error('Authentication error - check that you are logged in and your token is valid');
      }
      
      // Fallback to mock if real API fails
      console.log('Falling back to mock service for post creation');
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
      console.log(`Making API call to get posts for user: ${userId}`);
      
      if (!userId) {
        console.error('Cannot fetch posts for undefined userId');
        throw new Error('User ID is required to fetch posts');
      }
      
      // Make the API call with explicit logging
      console.log(`GET ${API_URL}/user/${userId}?page=${page}&size=${size}`);
      const response = await axios.get(`${API_URL}/user/${userId}?page=${page}&size=${size}`);
      
      // Verify the response structure is correct
      const data = response.data;
      console.log('Response data structure:', {
        hasContent: Array.isArray(data.content),
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        number: data.number,
        size: data.size
      });
      
      if (!data.content || !Array.isArray(data.content)) {
        console.error('Response does not contain the expected content array:', data);
        // Provide a valid response structure even if the backend didn't
        return {
          content: [],
          totalElements: 0,
          totalPages: 0,
          number: page,
          size: size
        };
      }
      
      return response.data;
    } catch (error: any) {
      console.error(`Error fetching skill posts for user ${userId}:`, error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: `${API_URL}/user/${userId}?page=${page}&size=${size}`
      });
      
      // Check if it's due to user token not having access
      if (error.response?.status === 403) {
        console.warn('Access forbidden - may be an authentication issue');
      }
      
      // Fallback to mock if real API fails
      console.log('Falling back to mock service for getByUser');
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

  // Get posts by multiple tags
  getByTags: async (tags: string[], page = 0, size = 10): Promise<SkillPostResponse> => {
    try {
      // Join tags as comma-separated list in the query parameter
      const tagsParam = encodeURIComponent(tags.join(','));
      console.log(`Fetching posts with tags: [${tags.join(', ')}], page: ${page}, size: ${size}`);
      const url = `${API_URL}/tags?tags=${tagsParam}&page=${page}&size=${size}`;
      console.log(`Making request to: ${url}`);
      
      const response = await axios.get(url);
      console.log(`Retrieved ${response.data.content.length} posts with tags: [${tags.join(', ')}]`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching skill posts with tags [${tags.join(', ')}]:`, error);
      // Fallback to mock if real API fails
      return MockSkillPostService.getByTags(tags, page, size);
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

  // Reply to a comment
  replyToComment: async (postId: string, commentId: string, reply: CommentRequest): Promise<SkillPost> => {
    try {
      const response = await axios.post(`${API_URL}/${postId}/comments/${commentId}/replies`, reply);
      return response.data;
    } catch (error) {
      console.error(`Error replying to comment ${commentId} on post ${postId}:`, error);
      // Fallback to mock implementation
      return MockSkillPostService.replyToComment(postId, commentId, reply);
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
  },

  // Get all unique tags
  getAllTags: async (): Promise<string[]> => {
    try {
      const response = await axios.get(`${API_URL}/tags/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching all tags:', error);
      // Fallback to extracting tags from mock data
      return MockSkillPostService.getAllTags();
    }
  }

};