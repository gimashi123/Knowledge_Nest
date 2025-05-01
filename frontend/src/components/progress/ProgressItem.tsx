import { useState } from 'react';
import {Progress} from "../../types/progress.ts";
import {ProgressService} from "../../services/api.ts";

interface ProgressItemProps {
  progress: Progress;
  onEdit: () => void;
  onDelete: () => void;
  onUpdate?: (updatedProgress: Progress) => void;
}

const ProgressItem = ({ progress, onEdit, onDelete, onUpdate }: ProgressItemProps) => {
  const [completedTopics, setCompletedTopics] = useState<string[]>(
    progress.completedTopics || []
  );

  const calculateProgress = (completed: string[]): number => {
    if (progress.topics.length === 0) return 0;
    const percentage = Math.round((completed.length / progress.topics.length) * 100);
    return percentage > 100 ? 100 : percentage;
  };

  const handleTopicToggle = async (topic: string, isChecked: boolean) => {
    let updatedCompletedTopics: string[];
    
    if (isChecked) {
      // Add topic to completed list if not already there
      updatedCompletedTopics = [...completedTopics, topic];
    } else {
      // Remove topic from completed list
      updatedCompletedTopics = completedTopics.filter(t => t !== topic);
    }
    
    setCompletedTopics(updatedCompletedTopics);
    
    // Calculate new progress percentage
    const newProgressValue = calculateProgress(updatedCompletedTopics);
    
    // Create updated progress object
    const updatedProgress: Progress = {
      ...progress,
      completedTopics: updatedCompletedTopics,
      progress: newProgressValue
    };
    
    // Update backend
    if (progress.progressId) {
      try {
        await ProgressService.update(progress.progressId, updatedProgress);
        if (onUpdate) {
          onUpdate(updatedProgress);
        }
      } catch (error) {
        console.error('Failed to update topic completion status:', error);
        // Revert state on error
        setCompletedTopics(progress.completedTopics || []);
      }
    }
  };

  return (
    <div className="progress-item">
      <div className="progress-item-header">
        <h3>{progress.title}</h3>
        <div className="progress-actions">
          <button onClick={onEdit} className="edit-btn">Edit</button>
          <button onClick={onDelete} className="delete-btn">Delete</button>
        </div>
      </div>
      
      <div className="progress-details">
        <div className="progress-bar-container">
          <div 
            className="progress-bar" 
            style={{ width: `${progress.progress}%` }}
          ></div>
          <span className="progress-percentage">{progress.progress}%</span>
        </div>
        
        <div className="progress-topics">
          <h4>Topics:</h4>
          <ul className="topic-checklist">
            {progress.topics.map((topic, index) => (
              <li key={index} className="topic-item-checkable">
                <label className="topic-checkbox-label">
                  <input
                    type="checkbox"
                    checked={completedTopics.includes(topic)}
                    onChange={(e) => handleTopicToggle(topic, e.target.checked)}
                  />
                  <span className={completedTopics.includes(topic) ? 'completed-topic' : ''}>{topic}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
        
        <div className="progress-last-update">
          <p>Last updated: {progress.lastUpdate}</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressItem; 