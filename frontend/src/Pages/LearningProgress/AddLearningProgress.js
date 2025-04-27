import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import SideBar from "../../Components/SideBar/SideBar";
import "./AddLearning.css";

function AddLearningProgress() {
  const navigate = useNavigate();
  const [showMyPosts, setShowMyPosts] = useState(false);
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const userId = localStorage.getItem("userID");

  const [formData, setFormData] = useState({
    skillTitle: "",
    description: "",
    field: "",
    startDate: "",
    endDate: "",
    level: "",
    postOwnerID: "",
    postOwnerName: "",
  });

  useEffect(() => {
    const userId = localStorage.getItem("userID");
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({
              ...prevData,
              postOwnerName: data.fullname,
            }));
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
    try {
      const response = await fetch("http://localhost:8080/learningProgress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Learning Progress added successfully!");
        window.location.href = "/allLearningProgress";
      } else {
        alert("Failed to add Learning Progress.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleCancel = () => {
    navigate("/allLearningProgress");
  };

  return (
    <div className="con1">
      <div className="continer">
        <div>
          {" "}
          <SideBar />
        </div>
        <div className="continSection1">
          <button
            className="actionButton_add"
            onClick={() => (window.location.href = "/addLearningProgress")}
          >
            create post
          </button>
          <button
            className="action_btn_my"
            onClick={() => {
              if (showMyPosts) {
                window.location.href =
                  "http://localhost:3000/allLearningProgress";          
              } else {
                toggleFilter();
              }
            }}
          >
            {showMyPosts ? "Show All Posts" : "Show My Posts"}
          </button>
          <div className="from_continer">
            <p className="Auth_heading">Add Learning Progress</p>
            <p className="Auth_subheading1">
              Track your learning journey and skill development
            </p>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                setFormData({
                  skillTitle: "",
                  description: "",
                  field: "",
                  startDate: "",
                  endDate: "",
                  level: "",
                  postOwnerID: formData.postOwnerID,
                  postOwnerName: formData.postOwnerName,
                });
              }}
              className="from_data"
            >
              <div className="Auth_formGroup">
                <label className="Auth_label">Title</label>
                <input
                  className="Auth_input"
                  name="skillTitle"
                  placeholder="Skill Title"
                  value={formData.skillTitle}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Description</label>
                <textarea
                  className="Auth_input"
                  name="description"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Field</label>
                <select
                  className="Auth_input"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Field
                  </option>
                  <option value="Frontend Development">
                    Frontend Development
                  </option>
                  <option value="Programming Language">
                    Programming Language
                  </option>
                  <option value="Backend Development">
                    Backend Development
                  </option>
                  <option value="UI/UX">UI/UX Design</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                </select>
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">Start Date</label>
                <input
                  className="Auth_input"
                  name="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">End Date</label>
                <input
                  className="Auth_input"
                  name="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    if (new Date(value) < new Date(formData.startDate)) {
                      alert("End date cannot be earlier than start date.");
                      return;
                    }
                    handleChange(e);
                  }}
                  required
                />
              </div>
              <div className="Auth_formGroup">
                <label className="Auth_label">
                  Progress Level: {formData.level}%
                </label>
                <input
                  type="range"
                  className="progress-slider"
                  name="level"
                  min="0"
                  max="100"
                  step="1"
                  value={formData.level || 0} // Ensure default value of 0
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setFormData({ ...formData, [name]: value });
                  }}
                  required
                  onInvalid={(e) => {
                    e.target.setCustomValidity(
                      "Please select a progress level"
                    );
                  }}
                  onInput={(e) => {
                    e.target.setCustomValidity("");
                    const { name, value } = e.target;
                    setFormData({ ...formData, [name]: value });
                  }}
                />
                <div className="progress-labels">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="button-group">
                <button type="submit" className="Auth_button add-button">
                  <IoMdAdd className="button-icon" /> Add
                </button>
                <button
                  type="button"
                  className="Auth_button cancel-button"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLearningProgress;
