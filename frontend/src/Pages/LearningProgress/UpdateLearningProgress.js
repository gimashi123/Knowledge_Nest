import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SideBar from "../../Components/SideBar/SideBar";
import "./AddLearning.css";

function UpdateLearningProgress() {
  const { id } = useParams();
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
    fetch(`http://localhost:8080/learningProgress/${id}`)
      .then((response) => response.json())
      .then((data) => setFormData(data))
      .catch((error) =>
        console.error("Error fetching learning progress data:", error)
      );
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/learningProgress/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        alert("Learning Progress updated successfully!");
        window.location.href = "/allLearningProgress";
      } else {
        alert("Failed to update Learning Progress.");
      }
    } catch (error) {
      console.error("Error updating learning progress:", error);
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
            <p className="Auth_heading">Update Learning Progress</p>
            <p className="Auth_subheading1">
              Refine your learning journey and track your progress
            </p>
            <form onSubmit={handleSubmit} className="from_data">
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
                  <option value="UI/UX">UI/UX</option>
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
                  value={formData.level}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    setFormData({ ...formData, [name]: value });
                  }}
                  required
                />
                <div className="progress-labels">
                  <span>0%</span>
                  <span>100%</span>
                </div>
              </div>
              <div className="button-group">
                <button type="submit" className="Auth_button update-button">
                  Update
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

export default UpdateLearningProgress;
