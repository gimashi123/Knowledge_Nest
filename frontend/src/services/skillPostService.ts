import axios from "axios";

const API = "http://localhost:8081/api/skill-posts";

// Get auth header with token
const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// Create a new skill post
export const createSkillPost = async (skillPostData: {
  title: string;
  description: string;
  content: string;
  tags: string[];
}) => {
  const response = await axios.post(API, skillPostData, authHeader());
  return response.data;
};

// Get all skill posts with pagination and filters
export const getSkillPosts = async (params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDir?: string;
  keyword?: string;
  tags?: string[];
  userId?: string;
} = {}) => {
  const response = await axios.get(`${API}/view`, {
    params,
    ...authHeader(),
  });
  return response.data;
};

// Get skill post by id
export const getSkillPostById = async (id: string) => {
  const response = await axios.get(`${API}/${id}`, authHeader());
  return response.data;
};

// Update skill post
export const updateSkillPost = async (
  id: string,
  skillPostData: {
    title: string;
    description: string;
    content: string;
    tags: string[];
  }
) => {
  const response = await axios.put(`${API}/${id}`, skillPostData, authHeader());
  return response.data;
};

// Delete skill post
export const deleteSkillPost = async (id: string) => {
  const response = await axios.delete(`${API}/${id}`, authHeader());
  return response.data;
};

// Get trending skill posts
export const getTrendingSkillPosts = async (limit = 10) => {
  const response = await axios.get(`${API}/trending`, {
    params: { limit },
    ...authHeader(),
  });
  return response.data;
};

// Add comment to skill post
export const addComment = async (postId: string, content: string) => {
  const response = await axios.post(
    `${API}/${postId}/comments`,
    { content },
    authHeader()
  );
  return response.data;
};

// Like or unlike a skill post
export const toggleLike = async (postId: string) => {
  const response = await axios.post(
    `${API}/${postId}/like`,
    {},
    authHeader()
  );
  return response.data;
}; 