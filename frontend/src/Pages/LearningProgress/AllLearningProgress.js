import React, { useEffect, useState } from 'react';
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import SideBar from '../../Components/SideBar/SideBar';
import { FaUserCircle } from "react-icons/fa";
import { HiCalendarDateRange } from "react-icons/hi2";
import './AllLearning.css';

function AllLearningProgress() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false); // Track filter mode
  const userId = localStorage.getItem('userID');

  useEffect(() => {
    fetch('http://localhost:8080/learningProgress')
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data); // Initially show all data
      })
      .catch((error) => console.error('Error fetching learning progress data:', error));
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this learning progress?')) {
      try {
        const response = await fetch(`http://localhost:8080/learningProgress/${id}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          alert('Learning Progress deleted successfully!');
          setFilteredData(filteredData.filter((progress) => progress.id !== id));
        } else {
          alert('Failed to delete Learning Progress.');
        }
      } catch (error) {
        console.error('Error deleting learning progress:', error);
      }
    }
  };

  const toggleFilter = () => {
    if (showMyPosts) {
      setFilteredData(progressData); // Show all posts
    } else {
      const myPosts = progressData.filter((progress) => progress.postOwnerID === userId);
      setFilteredData(myPosts); // Show only user's posts
    }
    setShowMyPosts(!showMyPosts); // Toggle filter mode
  };

  return (
    <div className='con1'>
      <div className='continer'>
        <div><SideBar /></div>
        <div className='continSection'>
        <p className="Auth_subheading">Learning Plans</p>   
          <button
            className='actionButton_add'
            onClick={() => (window.location.href = '/addLearningProgress')}
          >
            create post
          </button>
          <button className='action_btn_my' onClick={toggleFilter}>
            {showMyPosts ? 'Show All Posts' : 'Show My Posts'}
          </button>
          <div className='post_card_continer'>
            {filteredData.length === 0 ? (
              <div className='not_found_box'>
                <div className='not_found_img'></div>
                <p className='not_found_msg'>No posts found. Please create a new post.</p>
                <button
                  className='not_found_btn'
                  onClick={() => (window.location.href = '/addLearningProgress')}
                >
                  Create New Post
                </button>
              </div>
            ) : (
              filteredData.map((progress) => (
                <div key={progress.id} className='post_card'>
                  <div className='user_details_card'>
                    <div className='name_section_post'>
                      <p className='name_section_post_owner_name'><FaUserCircle />{progress.postOwnerName}</p>
                    </div>
                    {progress.postOwnerID === userId && (
                      <div>
                        <div className='action_btn_icon_post'>
                          <FaEdit
                            onClick={() => (window.location.href = `/updateLearningProgress/${progress.id}`)} className='action_btn_icon' />
                          <RiDeleteBin6Fill
                            onClick={() => handleDelete(progress.id)}
                            className='action_btn_icon' />
                        </div>
                      </div>
                    )}
                  </div>
                  <p className='topic_cont'>{progress.skillTitle}{" "}<span className='topic_cont_b'>{progress.field}{" "}</span><span className='topic_cont_b'>{progress.level}%</span></p>
                  <div className='dis_con'>
                    <p className='dis_con_topic'>Description</p>
                    <p className='dis_con_pera' style={{ whiteSpace: "pre-line" }}>{progress.description}</p>
                  </div>
                  <div className='date_card'>
                    <p className='date_card_dte'><HiCalendarDateRange /> {progress.startDate} to {progress.endDate}</p>
                  </div>
                  <p></p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      </div>
  );
}

export default AllLearningProgress;
