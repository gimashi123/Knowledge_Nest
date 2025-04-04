package com.paf.knowledgenest.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collation = "challenges")
@Data
public class Challenge {

    @Id
    private String id;
    private String title;
    private String description;
    private SkillCategory category;
    private DifficultyLevel difficulty;
    private List<Task> tasks;
    private String createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int timeLimitMinutes;
}

enum SkillCategory {
    CODING, COOKING, DIY
}

enum DifficultyLevel {
    BEGINNER, INTERMEDIATE, PRO
}
