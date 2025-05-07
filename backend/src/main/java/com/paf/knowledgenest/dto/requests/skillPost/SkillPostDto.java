package com.paf.knowledgenest.dto.requests.skillPost;

import com.paf.knowledgenest.model.skillpost.Comment;
import com.paf.knowledgenest.model.skillpost.SkillPost;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

public class SkillPostDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Request {
        @NotBlank(message = "Title is required")
        @Size(min = 3, max = 100, message = "Title must be between 3 and 100 characters")
        private String title;

        @NotBlank(message = "Description is required")
        @Size(min = 10, max = 500, message = "Description must be between 10 and 500 characters")
        private String description;

        @NotBlank(message = "Content is required")
        private String content;
        
        private String youtubeUrl;

        @NotEmpty(message = "At least one tag is required")
        private List<String> tags = new ArrayList<>();
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String title;
        private String description;
        private String content;
        private String youtubeUrl;
        private String userId;
        private String userName;
        private List<String> tags;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private int likes;
        private boolean userLiked;
        private List<CommentDto> comments;

        public static Response fromSkillPost(SkillPost skillPost, String currentUserId) {
            Response response = new Response();
            response.setId(skillPost.getId());
            response.setTitle(skillPost.getTitle());
            response.setDescription(skillPost.getDescription());
            response.setContent(skillPost.getContent());
            response.setYoutubeUrl(skillPost.getYoutubeUrl());
            response.setUserId(skillPost.getUserId());
            response.setUserName(skillPost.getUserName());
            response.setTags(skillPost.getTags());
            response.setCreatedAt(skillPost.getCreatedAt());
            response.setUpdatedAt(skillPost.getUpdatedAt());
            response.setLikes(skillPost.getLikes());
            response.setUserLiked(skillPost.getLikedBy().contains(currentUserId));
            response.setComments(skillPost.getComments().stream()
                    .map(CommentDto::fromComment)
                    .collect(Collectors.toList()));
            return response;
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentRequest {
        @NotBlank(message = "Comment content is required")
        @Size(min = 3, max = 1000, message = "Comment must be between 3 and 1000 characters")
        private String content;
        
        // Optional parent comment ID if this is a reply
        private String parentCommentId;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CommentDto {
        private String id;
        private String userId;
        private String userName;
        private String content;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private String parentCommentId;
        private List<CommentDto> replies;

        public static CommentDto fromComment(Comment comment) {
            CommentDto dto = new CommentDto();
            dto.setId(comment.getId());
            dto.setUserId(comment.getUserId());
            dto.setUserName(comment.getUserName());
            dto.setContent(comment.getContent());
            dto.setCreatedAt(comment.getCreatedAt());
            dto.setUpdatedAt(comment.getUpdatedAt());
            dto.setParentCommentId(comment.getParentCommentId());
            
            // Map nested replies if any
            if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
                dto.setReplies(comment.getReplies().stream()
                    .map(CommentDto::fromComment)
                    .collect(Collectors.toList()));
            } else {
                dto.setReplies(new ArrayList<>());
            }
            
            return dto;
        }
    }
} 