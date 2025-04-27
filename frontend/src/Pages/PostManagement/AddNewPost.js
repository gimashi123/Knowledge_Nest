import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import SideBar from '../../Components/SideBar/SideBar';
import { FaTimes, FaUpload, FaImage, FaVideo, FaPenAlt, FaAlignLeft } from 'react-icons/fa';
import "./Createpost.css";

function AddNewPost() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const userID = localStorage.getItem('userID');
  const navigate = useNavigate();
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const userId = localStorage.getItem("userID");

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        continue;
      }

      if (file.type.startsWith('image/')) {
        imageCount++;
      } else if (file.type === 'video/mp4') {
        videoCount++;

        const video = document.createElement('video');
        video.preload = 'metadata';
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(`Video ${file.name} exceeds the maximum duration of 30 seconds.`);
            return;
          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);
        continue;
      }

      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert('You can upload a maximum of 3 images.');
      return;
    }

    if (videoCount > 1) {
      alert('You can upload only 1 video.');
      return;
    }

    setMedia(files);
    setMediaPreviews(previews);
  };

  const toggleFilter = () => {
    if (showMyPosts) {
      setFilteredData(progressData); // Show all posts
    } else {
      const myPosts = progressData.filter(
        (progress) => progress.postOwnerID === userId
      );
      setFilteredData(myPosts); // Show only user's posts
    }
    setShowMyPosts(!showMyPosts); // Toggle filter mode
  };

  const removeMedia = (index) => {
    const newMedia = [...media];
    const newPreviews = [...mediaPreviews];
    
    newMedia.splice(index, 1);
    newPreviews.splice(index, 1);
    
    setMedia(newMedia);
    setMediaPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('title', title);
    formData.append('description', description);
    media.forEach((file) => formData.append('mediaFiles', file));

    try {
      await axios.post('http://localhost:8080/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Post created successfully!');
      navigate('/allPost');
    } catch (error) {
      console.error(error);
      alert('Failed to create post.');
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Any unsaved changes will be lost.')) {
      navigate('/allPost');
    }
  };

  return (
    <div className="app-container">
      <SideBar />
      <div className="main-content">
      <button
            className="actionButton_add"
            onClick={() => (window.location.href = "http://localhost:3000/addNewPost")}
          >
            create post
          </button>
          <button
            className="action_btn_my"
            onClick={() => {
              if (showMyPosts) {
                window.location.href =
                  "http://localhost:3000/allPost";          
              } else {
                toggleFilter();
              }
            }}
          >
            {showMyPosts ? "Show All Posts" : "Show My Posts"}
          </button>
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Create New Post</h1>
            <p className="form-subtitle">Share your knowledge with the community</p>
          </div>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon"><FaPenAlt /></span>
                Title
              </label>
              <input
                className="form-input"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter a descriptive title"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon"><FaAlignLeft /></span>
                Description
              </label>
              <textarea
                className="form-textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your post in detail..."
                required
                rows={5}
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon"><FaUpload /></span>
                Media
                <span className="media-hint">(Max 3 images or 1 video)</span>
              </label>
              
              <div className="media-preview-container">
                {mediaPreviews.map((preview, index) => (
                  <div key={index} className="media-preview-item">
                    {preview.type.startsWith('image/') ? (
                      <div className="media-preview">
                        <img src={preview.url} alt={`Preview ${index}`} />
                        <span className="media-type-badge"><FaImage /> Image</span>
                      </div>
                    ) : (
                      <div className="media-preview">
                        <video controls>
                          <source src={preview.url} type={preview.type} />
                        </video>
                        <span className="media-type-badge"><FaVideo /> Video</span>
                      </div>
                    )}
                    <button 
                      type="button" 
                      className="media-remove-btn"
                      onClick={() => removeMedia(index)}
                    >
                      <FaTimes />
                    </button>
                  </div>
                ))}
              </div>

              <label className="file-upload-btn">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg,video/mp4"
                  multiple
                  onChange={handleMediaChange}
                  className="file-input"
                />
                <span className="upload-text">Select Files</span>
              </label>
            </div>

            <div className="form-actions">
              <button 
                type="button" 
                className="form-cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className="form-submit-btn"
                disabled={!title || !description}
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;