import React, { useState } from 'react';
import './MediaDisplay.css';

const MediaDisplay = ({ mediaUrls, onDelete, allowDelete = false }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleDelete = (e, mediaUrl) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(mediaUrl);
    }
  };

  // Check if media is an image or video based on file extension
  const isVideo = (url) => {
    return url.toLowerCase().endsWith('.mp4');
  };

  if (!mediaUrls || mediaUrls.length === 0) {
    return <div className="no-media">No media files</div>;
  }

  return (
    <div className="media-container">
      <div className="media-main">
        {isVideo(mediaUrls[activeIndex]) ? (
          <video 
            controls 
            src={`http://localhost:8080${mediaUrls[activeIndex]}`} 
            className="main-media"
          />
        ) : (
          <img 
            src={`http://localhost:8080${mediaUrls[activeIndex]}`} 
            alt={`Media ${activeIndex + 1}`} 
            className="main-media"
          />
        )}
        
        {allowDelete && (
          <button 
            className="delete-media-btn" 
            onClick={(e) => handleDelete(e, mediaUrls[activeIndex])}
            aria-label="Delete media"
          >
            ×
          </button>
        )}
      </div>
      
      {mediaUrls.length > 1 && (
        <div className="media-thumbnails">
          {mediaUrls.map((mediaUrl, index) => (
            <div 
              key={index}
              className={`thumbnail ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
            >
              {isVideo(mediaUrl) ? (
                <video 
                  src={`http://localhost:8080${mediaUrl}`} 
                  className="thumbnail-media"
                />
              ) : (
                <img 
                  src={`http://localhost:8080${mediaUrl}`} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="thumbnail-media"
                />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaDisplay; 