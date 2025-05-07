package com.paf.knowledgenest.model.skillpost;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.HashSet;

@Data
@Document(collection = "skillposts")
public class SkillPost {

    @Id
    private String id;
    private String title;
    private String description;
    private String content;
    private String youtubeUrl;
    private String userId;
    private String userName;
    private List<String> tags = new ArrayList<>();
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int likes = 0;
    private Set<String> likedBy = new HashSet<>();
    private List<Comment> comments = new ArrayList<>();
} 