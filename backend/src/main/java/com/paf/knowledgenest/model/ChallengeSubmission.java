package com.paf.knowledgenest.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "challenge_submissions")
@Data
public class ChallengeSubmission {
    @Id
    private String id;
    private String challengeId;
    private String userId;
    private List<TaskSubmission> taskSubmissions;
    private int totalScore;
    private LocalDateTime submittedAt;
    private boolean completed;
}

@Data
class TaskSubmission {
    private String taskId;
    private String answer;
    private boolean isCorrect;
    private int pointsEarned;
}