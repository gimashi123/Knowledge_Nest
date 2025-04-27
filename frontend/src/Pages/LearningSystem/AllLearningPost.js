import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SideBar from '../../Components/SideBar/SideBar';
import './Allpost.css';
import { FaEdit, FaRegComment } from "react-icons/fa";
import { RiDeleteBin6Fill, RiShareForwardLine } from "react-icons/ri";
import { BiSolidLike } from "react-icons/bi";

function AllLearningPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [showingMyPosts, setShowingMyPosts] = useState(false);
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('http://localhost:8080/learningSystem');
        setPosts(response.data);
        setFilteredPosts(response.data); // Initially show all posts
      } catch (error) {
        console.error('Error fetching posts:', error);
      }
    };

    fetchPosts();
  }, []); // Ensure this runs only once on component mount

  const getEmbedURL = (url) => {
    try {
      if (url.includes('youtube.com/watch')) {
        const videoId = new URL(url).searchParams.get('v');
        return `https://www.youtube.com/embed/${videoId}`;
      }
      if (url.includes('youtu.be/')) {
        const videoId = url.split('youtu.be/')[1];
        return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // Return the original URL if it's not a YouTube link
    } catch (error) {
      console.error('Invalid URL:', url);
      return ''; // Return an empty string for invalid URLs
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this post?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/learningSystem/${id}`);
        alert('Post deleted successfully!');
        setFilteredPosts(filteredPosts.filter((post) => post.id !== id)); // Update the list after deletion
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post.');
      }
    }
  };

  const handleUpdate = (id) => {
    window.location.href = `/learningSystem/updateLearningPost/${id}`;
  };

  const handleLike = async (postId) => {
    const userID = localStorage.getItem('userID');
    if (!userID) {
      alert('Please log in to like a post.');
      return;
    }
    try {
      const response = await axios.put(`http://localhost:8080/learningSystem/${postId}/like`, null, {
        params: { userID },
      });

      // Update the specific post's likes in the state
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
      console.error('Error liking post:', error);
    }
  };

  const handleShare = (postId) => {
    // Implement your share functionality here
    const postUrl = `${window.location.origin}/learningSystem/post/${postId}`;
    navigator.clipboard.writeText(postUrl).then(() => {
      alert('Post link copied to clipboard!');
    });
  };

  const handleComment = (postId) => {
    // Implement your comment functionality here
    window.location.href = `/learningSystem/post/${postId}#comments`;
  };

  const filterMyPosts = () => {
    if (!showingMyPosts) {
      const myPosts = posts.filter((post) => post.postOwnerID === userId);
      setFilteredPosts(myPosts);
      setShowingMyPosts(true);
    } else {
      setFilteredPosts(posts); // Show all posts
      setShowingMyPosts(false);
    }
  };

  return (
    <div className='con1'>
      <div className='continer'>
        <div>
          <SideBar />
        </div>
        <div className='continSection'>
        <p className="Auth_subheading">Published Posts</p>   
          <button
            className='actionButton_add'
            onClick={() => (window.location.href = '/learningSystem/addLeariningPost')}
          >
            create post
          </button>
          <button
            className='action_btn_my'
            onClick={filterMyPosts}
          >
            {showingMyPosts ? 'All Posts' : 'My Posts'}
          </button>
          <div className='post_card_continer'>
            {filteredPosts.length === 0 ? (
              <div className='not_found_box'>
                <div className='not_found_img'></div>
                <p className='not_found_msg'>No posts found. Please create a new post.</p>
                <button className='not_found_btn' onClick={() => (window.location.href = '/learningSystem/addLeariningPost')}>Create New Post</button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className='post_card'>
                  <div className='user_details_card'>
                    <div>
                      <div className='name_section_post'>
                        <p className='name_section_post_owner_name'>{post.postOwnerName}</p>
                      </div>
                      <p className='time'>{post.createdAt}</p>
                    </div>
                    {post.postOwnerID === localStorage.getItem('userID') && (
                      <div className='action_btn_icon_post'>
                        <FaEdit
                          onClick={() => handleUpdate(post.id)} className='action_btn_icon' />
                        <RiDeleteBin6Fill
                          onClick={() => handleDelete(post.id)}
                          className='action_btn_icon' />
                      </div>
                    )}
                  </div>
                  <div className='user_details_card_di'>
                    <p className='card_post_title'>{post.title}</p>
                    <p className='card_post_description' style={{ whiteSpace: "pre-line" }}>{post.description}</p>
                  </div>
                  <div className='tag_con'>
                    {post.tags?.map((tag, index) => (
                      <p key={index}>#{tag}</p>
                    ))}
                  </div>
                  <div className='vide_card_ful'>
                    {post.contentURL ? (
                      <iframe
                        className='video_card'
                        src={getEmbedURL(post.contentURL)}
                        title={post.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <p>No video available</p>
                    )}
                  </div>
                  <div className='like_coment_lne'>
                    <div className='like_btn_con'>
                      <BiSolidLike className={post.likes?.[localStorage.getItem('userID')] ? 'unlikebtn' : 'likebtn'}
                        onClick={() => handleLike(post.id)} />
                      <p className='like_num'>{Object.values(post.likes || {}).filter((liked) => liked).length} </p>
                    </div>
                    <div className='action_btns_container'>
                      <button className='action_btn'>
                        <FaRegComment className='action_btn_icon' />
                        <span>Comment</span>
                      </button>
                      <button className='action_btn' onClick={() => handleShare(post.id)}>
                        <RiShareForwardLine className='action_btn_icon' />
                        <span>Share</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllLearningPost;