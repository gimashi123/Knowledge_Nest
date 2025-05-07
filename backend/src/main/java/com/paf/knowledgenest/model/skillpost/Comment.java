package com.paf.knowledgenest.model.skillpost;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
public class Comment {
    private String id;
    private String userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Support for nested comments/replies
    private String parentCommentId;  // If this is a reply, points to parent comment
    private List<Comment> replies = new ArrayList<>(); // Replies to this comment
} 