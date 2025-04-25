package com.paf.knowledgenest.model.challenges;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "challenge_attempts")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChallengeAttempt {
    @Id
    private String id;

    private String challengeId;
    private String userId; // Who attempted

    private List<String> userAnswers; // Answers given by user
    private int score; // Out of 5

    private boolean submittedInTime;
    private LocalDateTime startedAt;
    private LocalDateTime submittedAt;
}
