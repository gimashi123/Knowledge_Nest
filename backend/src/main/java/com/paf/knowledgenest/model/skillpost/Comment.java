package com.paf.knowledgenest.model.skillpost;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class Comment {
    private String id;
    private String userId;
    private String userName;
    private String content;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
} 