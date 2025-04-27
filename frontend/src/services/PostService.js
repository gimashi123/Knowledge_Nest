import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

class PostService {
  // Create a new post with media files
  createPost(userID, title, description, mediaFiles) {
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    
    // Append each media file to the form data
    if (mediaFiles && mediaFiles.length > 0) {
      mediaFiles.forEach(file => {
        formData.append('mediaFiles', file);
      });
    }

    return axios.post(`${API_BASE_URL}/posts`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // Get all posts
  getAllPosts() {
    return axios.get(`${API_BASE_URL}/posts`);
  }

  // Get posts by user ID
  getPostsByUser(userID) {
    return axios.get(`${API_BASE_URL}/posts/user/${userID}`);
  }

  // Get a specific post by ID
  getPostById(postId) {
    return axios.get(`${API_BASE_URL}/posts/${postId}`);
  }

  // Update post
  updatePost(postId, title, description, newMediaFiles) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    
    // Append each new media file to the form data
    if (newMediaFiles && newMediaFiles.length > 0) {
      newMediaFiles.forEach(file => {
        formData.append('newMediaFiles', file);
      });
    }

    return axios.put(`${API_BASE_URL}/posts/${postId}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }

  // Delete post
  deletePost(postId) {
    return axios.delete(`${API_BASE_URL}/posts/${postId}`);
  }

  // Delete media from post
  deleteMedia(postId, mediaUrl) {
    return axios.delete(`${API_BASE_URL}/posts/${postId}/media`, {
      data: { mediaUrl }
    });
  }

  // Like/unlike post
  likePost(postId, userID) {
    return axios.put(`${API_BASE_URL}/posts/${postId}/like?userID=${userID}`);
  }

  // Add comment to post
  addComment(postId, userID, content) {
    return axios.post(`${API_BASE_URL}/posts/${postId}/comment`, {
      userID,
      content
    });
  }

  // Update comment
  updateComment(postId, commentId, userID, content) {
    return axios.put(`${API_BASE_URL}/posts/${postId}/comment/${commentId}`, {
      userID,
      content
    });
  }

  // Delete comment
  deleteComment(postId, commentId, userID) {
    return axios.delete(`${API_BASE_URL}/posts/${postId}/comment/${commentId}?userID=${userID}`);
  }
}

export default new PostService(); 