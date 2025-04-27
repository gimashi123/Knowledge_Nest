import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import SideBar from "../../Components/SideBar/SideBar";
import {
  FaTimes,
  FaUpload,
  FaImage,
  FaVideo,
  FaPenAlt,
  FaAlignLeft,
  FaTrash,
} from "react-icons/fa";
import "./updatepost.css";

function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [existingMedia, setExistingMedia] = useState([]);
  const [newMedia, setNewMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const userId = localStorage.getItem("userID");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setTitle(post.title || "");
        setDescription(post.description || "");
        setExistingMedia(post.media || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Failed to fetch post details.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    const previews = [];
    newMedia.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        previews.push({
          url: reader.result,
          type: file.type.startsWith("image/") ? "image" : "video",
          name: file.name,
        });
        setMediaPreviews([...previews]);
      };
      reader.readAsDataURL(file);
    });
  }, [newMedia]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this media file?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setExistingMedia(existingMedia.filter((url) => url !== mediaUrl));
      alert("Media file deleted successfully!");
    } catch (error) {
      console.error("Error deleting media file:", error);
      alert("Failed to delete media file.");
    }
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

  const handleRemoveNewMedia = (index) => {
    const updatedMedia = [...newMedia];
    updatedMedia.splice(index, 1);
    setNewMedia(updatedMedia);

    const updatedPreviews = [...mediaPreviews];
    updatedPreviews.splice(index, 1);
    setMediaPreviews(updatedPreviews);
  };

  const validateVideoDuration = (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(
            `Video ${file.name} exceeds the maximum duration of 30 seconds.`
          );
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject(`Failed to load video metadata for ${file.name}.`);
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const maxImageCount = 3;

    let imageCount = existingMedia.filter(
      (url) => !url.endsWith(".mp4")
    ).length;
    let videoCount = existingMedia.filter((url) => url.endsWith(".mp4")).length;

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        return;
      }

      if (file.type.startsWith("image/")) {
        imageCount++;
        if (imageCount > maxImageCount) {
          alert("You can upload a maximum of 3 images.");
          return;
        }
      } else if (file.type === "video/mp4") {
        videoCount++;
        if (videoCount > 1) {
          alert("You can upload only 1 video.");
          return;
        }

        try {
          await validateVideoDuration(file);
        } catch (error) {
          alert(error);
          return;
        }
      } else {
        alert(`Unsupported file type: ${file.type}`);
        return;
      }
    }

    setNewMedia(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    newMedia.forEach((file) => formData.append("newMediaFiles", file));

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post updated successfully!");
      navigate("/allPost");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  const handleCancel = () => {
    if (
      title ||
      description ||
      newMedia.length > 0 ||
      existingMedia.length > 0
    ) {
      const confirmCancel = window.confirm(
        "Are you sure you want to cancel? All changes will be lost."
      );
      if (confirmCancel) {
        navigate("/allPost");
      }
    } else {
      navigate("/allPost");
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading post details...</p>
      </div>
    );
  }

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
            <h1 className="form-title">Update Post</h1>
            <p className="form-subtitle">Edit your content and media</p>
          </div>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">
                  <FaPenAlt />
                </span>
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
                <span className="label-icon">
                  <FaAlignLeft />
                </span>
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
                <span className="label-icon">
                  <FaUpload />
                </span>
                Existing Media
                <span className="media-hint">(Click trash icon to remove)</span>
              </label>

              <div className="media-preview-container">
                {existingMedia.map((mediaUrl, index) => (
                  <div key={`existing-${index}`} className="media-preview-item">
                    {mediaUrl.endsWith(".mp4") ? (
                      <div className="media-preview">
                        <video controls>
                          <source
                            src={`http://localhost:8080${mediaUrl}`}
                            type="video/mp4"
                          />
                        </video>
                        <span className="media-type-badge">
                          <FaVideo /> Video
                        </span>
                      </div>
                    ) : (
                      <div className="media-preview">
                        <img
                          src={`http://localhost:8080${mediaUrl}`}
                          alt={`Existing media ${index}`}
                        />
                        <span className="media-type-badge">
                          <FaImage /> Image
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="media-remove-btn"
                      onClick={() => handleDeleteMedia(mediaUrl)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">
                <span className="label-icon">
                  <FaUpload />
                </span>
                Add New Media
                <span className="media-hint">(Max 3 images or 1 video)</span>
              </label>

              <div className="media-preview-container">
                {mediaPreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="media-preview-item">
                    {preview.type === "image" ? (
                      <div className="media-preview">
                        <img src={preview.url} alt={`Preview ${index}`} />
                        <span className="media-type-badge">
                          <FaImage /> Image
                        </span>
                      </div>
                    ) : (
                      <div className="media-preview">
                        <video controls>
                          <source src={preview.url} type="video/mp4" />
                        </video>
                        <span className="media-type-badge">
                          <FaVideo /> Video
                        </span>
                      </div>
                    )}
                    <button
                      type="button"
                      className="media-remove-btn"
                      onClick={() => handleRemoveNewMedia(index)}
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
                  onChange={handleNewMediaChange}
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
                Update Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
