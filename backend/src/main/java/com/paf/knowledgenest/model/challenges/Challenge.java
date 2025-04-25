package com.paf.knowledgenest.model.challenges;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.util.List;

@Data
@Document(collection = "challenges")
public class Challenge {

    @Id
    private String id;
    private String title;
    private String creatorId; // User who created the challenge
    private String skillCategory; // "coding", "cooking", "DIY"
    private String difficultyLevel; // "beginner", "intermediate", "pro"
    private List<String> tasks; // List of 5 questions/tasks
    private int timeLimit; // Time in minutes
    private boolean isActive; // Challenge status (active or blocked)
}
