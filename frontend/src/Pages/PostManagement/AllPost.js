import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { FaEdit, FaUserCircle, FaEllipsisH } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiSolidLike, BiLike } from "react-icons/bi";
import { BsBookmark, BsBookmarkFill } from "react-icons/bs";
import { MdOutlineInsertPhoto, MdOutlineSlowMotionVideo } from "react-icons/md";
import SideBar from "../../Components/SideBar/SideBar";
import Modal from "react-modal";
import "./Allcreateposts.css";

Modal.setAppElement("#root");

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [postOwners, setPostOwners] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [showingMyPosts, setShowingMyPosts] = useState(false);
  const [followedUsers, setFollowedUsers] = useState([]);
  const [newComment, setNewComment] = useState({});
  const [editingComment, setEditingComment] = useState({});
  const [savedPosts, setSavedPosts] = useState([]);
  const [showPostOptions, setShowPostOptions] = useState(null);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userID");

  // Fetch all posts and sort them by date (newest first)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/posts");
        const sortedPosts = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        setFilteredPosts(sortedPosts);

        const userIDs = [...new Set(sortedPosts.map((post) => post.userID))];
        const ownerPromises = userIDs.map((userID) =>
          axios
            .get(`http://localhost:8080/user/${userID}`)
            .then((res) => ({
              userID,
              fullName: res.data.fullname,
              avatar: res.data.avatar || null,
            }))
            .catch((error) => {
              console.error(
                `Error fetching user details for userID ${userID}:`,
                error
              );
              return { userID, fullName: "Anonymous", avatar: null };
            })
        );
        const owners = await Promise.all(ownerPromises);
        const ownerMap = owners.reduce((acc, owner) => {
          acc[owner.userID] = { name: owner.fullName, avatar: owner.avatar };
          return acc;
        }, {});
        setPostOwners(ownerMap);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPosts();
  }, []);

  // Fetch followed users and saved posts
  useEffect(() => {
    const fetchFollowedUsers = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:8080/user/${userId}/followedUsers`
          );
          setFollowedUsers(response.data);
        } catch (error) {
          console.error("Error fetching followed users:", error);
        }
      }
    };

    const fetchSavedPosts = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `http://localhost:8080/user/${userId}/savedPosts`
          );
          setSavedPosts(response.data);
        } catch (error) {
          console.error("Error fetching saved posts:", error);
        }
      }
    };

    fetchFollowedUsers();
    fetchSavedPosts();
  }, [userId]);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`);
      setPosts(posts.filter((post) => post.id !== postId));
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/updatePost/${postId}`);
  };

  const filterMyPosts = () => {
    if (!showingMyPosts) {
      const myPosts = posts.filter((post) => post.userID === userId);
      setFilteredPosts(myPosts);
      setShowingMyPosts(true);
    } else {
      setFilteredPosts(posts);
      setShowingMyPosts(false);
    }
  };

  const handleLike = async (postId) => {
    if (!userId) {
      alert("Please log in to like a post.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/posts/${postId}/like`,
        null,
        { params: { userID: userId } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleFollowToggle = async (postOwnerID) => {
    if (!userId) {
      alert("Please log in to follow/unfollow users.");
      return;
    }
    try {
      if (followedUsers.includes(postOwnerID)) {
        await axios.put(`http://localhost:8080/user/${userId}/unfollow`, {
          unfollowUserID: postOwnerID,
        });
        setFollowedUsers(followedUsers.filter((id) => id !== postOwnerID));
      } else {
        await axios.put(`http://localhost:8080/user/${userId}/follow`, {
          followUserID: postOwnerID,
        });
        setFollowedUsers([...followedUsers, postOwnerID]);
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  const handleSavePost = async (postId) => {
    if (!userId) {
      alert("Please log in to save posts.");
      return;
    }
    try {
      if (savedPosts.includes(postId)) {
        await axios.put(`http://localhost:8080/user/${userId}/unsavePost`, {
          postId,
        });
        setSavedPosts(savedPosts.filter((id) => id !== postId));
      } else {
        await axios.put(`http://localhost:8080/user/${userId}/savePost`, {
          postId,
        });
        setSavedPosts([...savedPosts, postId]);
      }
    } catch (error) {
      console.error("Error toggling save post:", error);
    }
  };

  const handleAddComment = async (postId) => {
    if (!userId) {
      alert("Please log in to comment.");
      return;
    }
    const content = newComment[postId] || "";
    if (!content.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/posts/${postId}/comment`,
        { userID: userId, content }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: response.data.comments }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: response.data.comments }
            : post
        )
      );

      setNewComment({ ...newComment, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await axios.delete(
        `http://localhost:8080/posts/${postId}/comment/${commentId}`,
        { params: { userID: userId } }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleSaveComment = async (postId, commentId, content) => {
    try {
      await axios.put(
        `http://localhost:8080/posts/${postId}/comment/${commentId}`,
        { userID: userId, content }
      );

      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.id === commentId ? { ...comment, content } : comment
                ),
              }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.id === commentId ? { ...comment, content } : comment
                ),
              }
            : post
        )
      );

      setEditingComment({});
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const openModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
  };

  const togglePostOptions = (postId) => {
    setShowPostOptions(showPostOptions === postId ? null : postId);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="all-post-container">
      <div className="container2">
        <div>
          <SideBar />
        </div>
        <div className="content-section">
          <p className="Auth_subheading">Published Posts</p>
          <button
            className="actionButton_add"
            onClick={() => navigate("/addNewPost")}
          >
            Create Post
          </button>
          <button className="action_btn_my" onClick={filterMyPosts}>
            {showingMyPosts ? "Show All Posts" : "Show My Posts"}
          </button>
          <div className="post-controls"></div>
          <div className="posts-grid">
            {filteredPosts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">
                  <MdOutlineInsertPhoto size={48} />
                </div>
                <h3>No posts found</h3>
                <p>When you create posts, they'll appear here</p>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/addNewPost")}
                >
                  Create Your First Post
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="post-card">
                  <div className="post-header">
                    <div className="post-user-info">
                      {postOwners[post.userID]?.avatar ? (
                        <img
                          src={`http://localhost:8080${
                            postOwners[post.userID].avatar
                          }`}
                          alt="User"
                          className="user-avatar"
                        />
                      ) : (
                        <FaUserCircle className="user-avatar default-avatar" />
                      )}
                      <div className="user-meta">
                        <span className="user-name">
                          {postOwners[post.userID]?.name || "Anonymous"}
                        </span>
                      
                      </div>
                    </div>

                    <div className="post-header-actions">
                      {post.userID !== userId && (
                        <button
                          className={`follow-btn ${
                            followedUsers.includes(post.userID)
                              ? "following"
                              : ""
                          }`}
                          onClick={() => handleFollowToggle(post.userID)}
                        >
                          {followedUsers.includes(post.userID)
                            ? "Following"
                            : "Follow"}
                        </button>
                      )}

                      <div className="post-actions-menu">
                        <button
                          className="menu-trigger"
                          onClick={() => togglePostOptions(post.id)}
                        >
                          <FaEllipsisH />
                        </button>

                        {showPostOptions === post.id && (
                          <div className="action-menu-dropdown">
                            {post.userID === userId && (
                              <>
                                <button
                                  className="menu-item"
                                  onClick={() => handleUpdate(post.id)}
                                >
                                  <FaEdit className="menu-icon" />
                                  <span>Edit Post</span>
                                </button>
                                <button
                                  className="menu-item delete-item"
                                  onClick={() => handleDelete(post.id)}
                                >
                                  <RiDeleteBin6Line className="menu-icon" />
                                  <span>Delete Post</span>
                                </button>
                              </>
                            )}
                            <button
                              className="menu-item"
                              onClick={() => handleSavePost(post.id)}
                            >
                              {savedPosts.includes(post.id) ? (
                                <>
                                  <BsBookmarkFill className="menu-icon" />
                                  <span>Unsave Post</span>
                                </>
                              ) : (
                                <>
                                  <BsBookmark className="menu-icon" />
                                  <span>Save Post</span>
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="post-content">
                    <h3 className="post-title">{post.title}</h3>
                    <p className="post-description">{post.description}</p>
                  </div>
                  {post.media.length > 0 && (
                    <div className="media-grid">
                      {post.media.slice(0, 4).map((mediaUrl, index) => (
                        <div
                          key={index}
                          className={`media-item ${
                            post.media.length > 4 && index === 3
                              ? "has-more"
                              : ""
                          }`}
                          onClick={() => openModal(mediaUrl)}
                        >
                          {mediaUrl.endsWith(".mp4") ? (
                            <>
                              <video>
                                <source
                                  src={`http://localhost:8080${mediaUrl}`}
                                  type="video/mp4"
                                />
                              </video>
                              <div className="media-badge">
                                <MdOutlineSlowMotionVideo />
                              </div>
                            </>
                          ) : (
                            <img
                              src={`http://localhost:8080${mediaUrl}`}
                              alt="Post Media"
                            />
                          )}
                          {post.media.length > 4 && index === 3 && (
                            <div className="more-media">
                              +{post.media.length - 4}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="post-stats">
                    <div className="likes-count">
                      <BiSolidLike className="like-icon" />
                      <span>
                        {Object.values(post.likes || {}).filter(Boolean).length}
                      </span>
                    </div>
                    <div className="comments-count">
                      <span>{post.comments?.length || 0} comments</span>
                    </div>
                  </div>

                  <div className="post-actions-bar">
                    <button
                      className={`action-btn ${
                        post.likes?.[userId] ? "active" : ""
                      }`}
                      onClick={() => handleLike(post.id)}
                    >
                      {post.likes?.[userId] ? (
                        <>
                          <BiSolidLike /> Liked
                        </>
                      ) : (
                        <>
                          <BiLike /> Like
                        </>
                      )}
                    </button>
                    <div className="comment-input-container">
                      <input
                        type="text"
                        className="comment-input"
                        placeholder="Write a comment..."
                        value={newComment[post.id] || ""}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            [post.id]: e.target.value,
                          })
                        }
                        onKeyPress={(e) =>
                          e.key === "Enter" && handleAddComment(post.id)
                        }
                      />
                      <button
                        className="comment-submit"
                        onClick={() => handleAddComment(post.id)}
                      >
                        <IoSend />
                      </button>
                    </div>
                  </div>

                  {post.comments?.length > 0 && (
                    <div className="comments-section">
                      {post.comments.map((comment) => (
                        <div key={comment.id} className="comment">
                          <div className="comment-user">
                            {comment.userAvatar ? (
                              <img
                                src={`http://localhost:8080${comment.userAvatar}`}
                                alt="User"
                                className="comment-avatar"
                              />
                            ) : (
                              <FaUserCircle className="comment-avatar default-avatar" />
                            )}
                            <div className="comment-content">
                              <span className="comment-username">
                                {comment.userFullName}
                              </span>
                              {editingComment.id === comment.id ? (
                                <div className="edit-comment">
                                  <input
                                    type="text"
                                    value={editingComment.content}
                                    onChange={(e) =>
                                      setEditingComment({
                                        ...editingComment,
                                        content: e.target.value,
                                      })
                                    }
                                    autoFocus
                                  />
                                  <div className="edit-comment-actions">
                                    <button
                                      className="btn-sm btn-primary"
                                      onClick={() =>
                                        handleSaveComment(
                                          post.id,
                                          comment.id,
                                          editingComment.content
                                        )
                                      }
                                    >
                                      Save
                                    </button>
                                    <button
                                      className="btn-sm btn-outline"
                                      onClick={() => setEditingComment({})}
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <p className="comment-text">
                                  {comment.content}
                                </p>
                              )}
                            </div>
                          </div>

                          {(comment.userID === userId ||
                            post.userID === userId) && (
                            <div className="comment-actions">
                              {comment.userID === userId && (
                                <>
                                  {editingComment.id !== comment.id && (
                                    <button
                                      className="action-link"
                                      onClick={() =>
                                        setEditingComment({
                                          id: comment.id,
                                          content: comment.content,
                                        })
                                      }
                                    >
                                      Edit
                                    </button>
                                  )}
                                </>
                              )}
                              <button
                                className="action-link"
                                onClick={() =>
                                  handleDeleteComment(post.id, comment.id)
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Media Modal"
        className="media-modal"
        overlayClassName="media-modal-overlay"
      >
        <button className="close-modal-btn" onClick={closeModal}>
          ×
        </button>
        {selectedMedia && selectedMedia.endsWith(".mp4") ? (
          <video controls className="modal-media" autoPlay>
            <source
              src={`http://localhost:8080${selectedMedia}`}
              type="video/mp4"
            />
          </video>
        ) : (
          <img
            src={`http://localhost:8080${selectedMedia}`}
            alt="Full Media"
            className="modal-media"
          />
        )}
      </Modal>
    </div>
  );
}

export default AllPost;
