package com.paf.knowledgenest.service.challenges;

import com.paf.knowledgenest.model.challenges.Challenge;
import com.paf.knowledgenest.model.challenges.ChallengeAttempt;
import com.paf.knowledgenest.repository.challenges.ChallengeAttemptRepository;
import com.paf.knowledgenest.repository.challenges.ChallengeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Optional;

@Service
public class ChallengeAttemptService {

    private final ChallengeRepository challengeRepository;
    private final ChallengeAttemptRepository attemptRepository;

    @Autowired
    public ChallengeAttemptService(ChallengeRepository challengeRepository, ChallengeAttemptRepository attemptRepository) {
        this.challengeRepository = challengeRepository;
        this.attemptRepository = attemptRepository;
    }

    // Simulate auto-evaluation (you can replace this with smarter logic later)
    private int evaluateAnswers(List<String> correctTasks, List<String> userAnswers) {
        int score = 0;
        for (int i = 0; i < Math.min(correctTasks.size(), userAnswers.size()); i++) {
            // Simple logic: check if user's answer contains any keyword from question
            String task = correctTasks.get(i).toLowerCase();
            String answer = userAnswers.get(i).toLowerCase();
            if (answer.contains(task.split(" ")[0])) { // crude matching
                score++;
            }
        }
        return score;
    }

    public ChallengeAttempt submitChallenge(String challengeId, String userId, List<String> answers, LocalDateTime startedAt) {
        Optional<Challenge> challengeOpt = challengeRepository.findById(challengeId);
        if (challengeOpt.isEmpty()) {
            throw new RuntimeException("Challenge not found!");
        }

        Challenge challenge = challengeOpt.get();
        LocalDateTime submittedAt = LocalDateTime.now();
        boolean submittedInTime = submittedAt.isBefore(startedAt.plusSeconds(challenge.getTimeLimit()));

        int score = 0;
        if (submittedInTime) {
            score = evaluateAnswers(challenge.getTasks(), answers);
        }

        ChallengeAttempt attempt = ChallengeAttempt.builder()
                .challengeId(challengeId)
                .userId(userId)
                .userAnswers(answers)
                .startedAt(startedAt)
                .submittedAt(submittedAt)
                .submittedInTime(submittedInTime)
                .score(score)
                .build();

        return attemptRepository.save(attempt);
    }

    public List<ChallengeAttempt> getAttemptsByUser(String userId) {
        return attemptRepository.findByUserId(userId);
    }

    public List<ChallengeAttempt> getAttemptsByChallenge(String challengeId) {
        return attemptRepository.findByChallengeId(challengeId);
    }

    // allowing only 1 attempt
    public ChallengeAttempt getUserChallengeResult(String userId, String challengeId) {
        return attemptRepository.findByUserIdAndChallengeId(userId, challengeId)
                .stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Result not found"));
    }

    // used for report generation remove if this begins to throw errors
    public HashMap<Object, Object> getChallengeStats(String challengeId) {
        List<ChallengeAttempt> attempts = attemptRepository.findByChallengeId(challengeId);

        int totalAttempts = attempts.size();
        double averageScore = attempts.stream().mapToInt(ChallengeAttempt::getScore).average().orElse(0.0);
        int maxScore = attempts.stream().mapToInt(ChallengeAttempt::getScore).max().orElse(0);

        HashMap<Object, Object> stats = new HashMap<>();
        stats.put("challengeId", challengeId);
        stats.put("totalAttempts", totalAttempts);
        stats.put("averageScore", averageScore);
        stats.put("maxScore", maxScore);

        return stats;
    }


}
