import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import {
  FaLink,
  FaTags,
  FaPenAlt,
  FaAlignLeft,
  FaRegClock,
  FaRegSave,
} from "react-icons/fa";
import "./post.css";
import SideBar from "../../Components/SideBar/SideBar";

function UpdateLearningPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentURL, setContentURL] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const userId = localStorage.getItem("userID");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/learningSystem/${id}`
        );
        const { title, description, contentURL, tags, createdAt } =
          response.data;
        setTitle(title);
        setDescription(description);
        setContentURL(contentURL);
        setTags(tags);
        setCreatedAt(createdAt);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [id]);

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = tags.filter((_, i) => i !== index);
    setTags(updatedTags);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const updatedPost = { title, description, contentURL, tags };

    try {
      await axios.put(
        `http://localhost:8080/learningSystem/${id}`,
        updatedPost
      );
      alert("Post updated successfully!");
      window.location.href = "/learningSystem/allLearningPost";
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (
      window.confirm(
        "Are you sure you want to cancel? Any unsaved changes will be lost."
      )
    ) {
      navigate("/learningSystem/allLearningPost");
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

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="app-container">
      <SideBar />

      <div className="main-content">
      <button
            className="actionButton_add"
            onClick={() => (window.location.href = "http://localhost:3000/learningSystem/addLeariningPost")}
          >
            create post
          </button>
          <button
            className="action_btn_my"
            onClick={() => {
              if (showMyPosts) {
                window.location.href =
                  "http://localhost:3000/learningSystem/allLearningPost";
              } else {
                toggleFilter();
              }
            }}
          >
            {showMyPosts ? "Show All Posts" : "Show My Posts"}
          </button>
        <div className="form-container">
          <div className="form-header">
            <h1 className="form-title">Update Learning Post</h1>
            {createdAt && (
              <div className="form-subtitle">
                <FaRegClock className="time-icon" />
                <span>Last updated: {formatDate(createdAt)}</span>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="post-form">
            <div className="form-group">
              <label className="form-label">
                <FaPenAlt className="input-icon" />
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
                <FaLink className="input-icon" />
                Content URL
              </label>
              <input
                className="form-input"
                type="url"
                value={contentURL}
                onChange={(e) => setContentURL(e.target.value)}
                placeholder="https://example.com/resource"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaTags className="input-icon" />
                Tags
                <span className="tag-count">{tags.length}/5</span>
              </label>
              <div className="tags-container">
                {tags.map((tag, index) => (
                  <div className="tag-item" key={index}>
                    {tag}
                    <button
                      type="button"
                      className="tag-remove"
                      onClick={() => handleRemoveTag(index)}
                    >
                      <IoMdClose />
                    </button>
                  </div>
                ))}
              </div>
              <div className="tag-input-container">
                <input
                  className="form-input"
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tags (min 2 required)"
                  disabled={tags.length >= 5}
                />
                <button
                  type="button"
                  className="tag-add-btn"
                  onClick={handleAddTag}
                  disabled={!tagInput.trim() || tags.length >= 5}
                >
                  <IoMdAdd />
                </button>
              </div>
              {tags.length < 2 && (
                <p className="tag-warning">
                  Please add at least 2 tags to categorize your post
                </p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <FaAlignLeft className="input-icon" />
                Description
              </label>
              <textarea
                className="form-input textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the resource and why it's valuable..."
                required
                rows={6}
              />
            </div>

            <div className="form-actions">
            <button
                    type="button"
                    className="cancel-btn"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
              <button
                type="submit"
                className="form-submit-btn"
                disabled={isSubmitting || tags.length < 2}
              >
                <FaRegSave className="submit-icon" />
                {isSubmitting ? "Updating..." : "Update Post"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateLearningPost;
