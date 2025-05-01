import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import {Progress} from "../../types/progress.ts";

interface ProgressFormProps {
  onSubmit: (progress: Progress) => void;
  initialData?: Progress | null;
  onCancel?: () => void;
}

const ProgressForm = ({ onSubmit, initialData, onCancel }: ProgressFormProps) => {
  const [title, setTitle] = useState('');
  const [topics, setTopics] = useState<string[]>([]);
  const [topicInput, setTopicInput] = useState('');
  const [progressValue, setProgressValue] = useState(0);
  const [timeValue, setTimeValue] = useState('');
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setTopics(initialData.topics);
      setProgressValue(initialData.progress);
      setCompletedTopics(initialData.completedTopics || []);
      if (initialData.lastUpdate) {
        setTimeValue(initialData.lastUpdate.substring(0, 5)); // Format HH:MM
      }
      setIsEditing(true);
    } else {
      resetForm();
      setIsEditing(false);
    }
  }, [initialData]);

  const resetForm = () => {
    setTitle('');
    setTopics([]);
    setTopicInput('');
    setProgressValue(0);
    setTimeValue('');
    setCompletedTopics([]);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a title');
      return;
    }
    
    if (topics.length === 0) {
      alert('Please add at least one topic');
      return;
    }
    
    const progressData: Progress = {
      title,
      topics,
      completedTopics: isEditing ? completedTopics : [],
      progress: isEditing ? progressValue : 0,
      lastUpdate: timeValue || undefined,
    };
    
    onSubmit(progressData);
    
    if (!isEditing) {
      resetForm();
    }
  };

  const handleAddTopic = () => {
    if (topicInput.trim() && !topics.includes(topicInput.trim())) {
      setTopics([...topics, topicInput.trim()]);
      setTopicInput('');
    }
  };

  const handleRemoveTopic = (index: number) => {
    const topicToRemove = topics[index];
    
    if (completedTopics.includes(topicToRemove)) {
      setCompletedTopics(completedTopics.filter(t => t !== topicToRemove));
    }
    
    setTopics(topics.filter((_, i) => i !== index));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTopic();
    }
  };

  return (
    <div className="progress-form-container">
      <h3>{isEditing ? 'Update Progress' : 'Add New Progress'}</h3>
      <form onSubmit={handleSubmit} className="progress-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
            placeholder="Enter title"
            required
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="topics">Topics</label>
          <div className="topic-input-group">
            <input
              type="text"
              id="topics"
              value={topicInput}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setTopicInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Add topic"
            />
            <button type="button" onClick={handleAddTopic} className="add-topic-btn">Add</button>
          </div>
          
          {topics.length > 0 && (
            <div className="topics-list">
              {topics.map((topic, index) => (
                <div key={index} className="topic-item">
                  <span>{topic}</span>
                  <button 
                    type="button" 
                    onClick={() => handleRemoveTopic(index)}
                    className="remove-topic-btn"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="time">Time</label>
          <input
            type="time"
            id="time"
            value={timeValue}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setTimeValue(e.target.value)}
          />
        </div>
        
        {isEditing && (
          <div className="form-group">
            <label htmlFor="progress">Progress (%): {progressValue}%</label>
            <input
              type="range"
              id="progress"
              min="0"
              max="100"
              value={progressValue}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setProgressValue(parseInt(e.target.value))}
            />
            <p className="progress-help-text">
              Note: Progress is automatically calculated based on completed topics.
              You can still manually adjust it if needed.
            </p>
          </div>
        )}
        
        <div className="form-actions">
          <button type="submit" className="submit-btn">
            {isEditing ? 'Update' : 'Add'}
          </button>
          {isEditing && onCancel && (
            <button type="button" onClick={onCancel} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProgressForm; 