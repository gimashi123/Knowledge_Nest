import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdClose } from "react-icons/io";
import { FaLink, FaTags, FaPenAlt, FaAlignLeft } from "react-icons/fa";
import "./AddPost.css";
import SideBar from "../../Components/SideBar/SideBar";

function AddLearningPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentURL, setContentURL] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const userId = localStorage.getItem("userID");

  const handleAddTag = () => {
    if (tagInput.trim() !== "" && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (indexToRemove) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const postOwnerID = localStorage.getItem("userID");
    const postOwnerName = localStorage.getItem("userFullName");

    if (!postOwnerID) {
      alert("Please log in to add a post.");
      navigate("/");
      return;
    }

    if (tags.length < 2) {
      alert("Please add at least two tags.");
      setIsSubmitting(false);
      return;
    }

    const newPost = {
      title,
      description,
      contentURL,
      tags,
      postOwnerID,
      postOwnerName,
    };

    try {
      await axios.post("http://localhost:8080/learningSystem", newPost);
      alert("Post added successfully!");
      setTitle("");
      setDescription("");
      setContentURL("");
      setTags([]);
      navigate("/learningSystem/allLearningPost");
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Failed to add post. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="con1">
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
          <div className="form-wrapper">
            <div className="form-container">
              <div className="form-header">
                <h1 className="form-title">Create Learning Post</h1>
                <p className="form-subtitle">
                  Share valuable resources with the community
                </p>
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
                    className="submit-btn"
                    disabled={isSubmitting || tags.length < 2}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Post"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLearningPost;
