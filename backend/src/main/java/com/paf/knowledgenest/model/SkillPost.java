package com.paf.knowledgenest.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "skill_posts")
public class SkillPost {
    
    @Id
    private String id;
    
    private String title;
    private String description;
    private String content;
    private String userId;
    private String userName;
    private List<String> tags;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likes;
    private List<String> likedBy;
    private List<Comment> comments;
    
    @Data
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Comment {
        private String id;
        private String userId;
        private String userName;
        private String content;
        private LocalDateTime createdAt;
    }
} 