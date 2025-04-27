import React, { useState } from 'react';
import './CommentSection.css';

const CommentSection = ({ 
  comments, 
  currentUserId, 
  onAddComment, 
  onUpdateComment, 
  onDeleteComment 
}) => {
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState('');

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const startEditing = (comment) => {
    setEditingCommentId(comment.id);
    setEditText(comment.content);
  };

  const cancelEditing = () => {
    setEditingCommentId(null);
    setEditText('');
  };

  const submitEdit = (commentId) => {
    if (editText.trim()) {
      onUpdateComment(commentId, editText);
      setEditingCommentId(null);
      setEditText('');
    }
  };

  return (
    <div className="comment-section">
      <h3>Comments</h3>
      
      <form onSubmit={handleAddComment} className="comment-form">
        <textarea
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
        />
        <button type="submit">Post</button>
      </form>
      
      <div className="comments-list">
        {comments && comments.length > 0 ? (
          comments.map(comment => (
            <div key={comment.id} className="comment">
              <div className="comment-header">
                <h4>{comment.userFullName}</h4>
                {comment.userID === currentUserId && (
                  <div className="comment-actions">
                    <button onClick={() => startEditing(comment)}>Edit</button>
                    <button onClick={() => onDeleteComment(comment.id)}>Delete</button>
                  </div>
                )}
              </div>
              
              {editingCommentId === comment.id ? (
                <div className="edit-comment">
                  <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="edit-actions">
                    <button onClick={() => submitEdit(comment.id)}>Save</button>
                    <button onClick={cancelEditing}>Cancel</button>
                  </div>
                </div>
              ) : (
                <p className="comment-content">{comment.content}</p>
              )}
            </div>
          ))
        ) : (
          <p className="no-comments">No comments yet. Be the first to comment!</p>
        )}
      </div>
    </div>
  );
};

export default CommentSection; 