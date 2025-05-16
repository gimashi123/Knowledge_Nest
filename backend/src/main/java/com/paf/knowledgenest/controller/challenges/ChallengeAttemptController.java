package com.paf.knowledgenest.controller.challenges;

import com.paf.knowledgenest.enums.CoinType;
import com.paf.knowledgenest.model.challenges.ChallengeAttempt;
import com.paf.knowledgenest.service.challenges.ChallengeAttemptService;
import com.paf.knowledgenest.service.socialFeature.SocialService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/challenge-attempts")
@RequiredArgsConstructor
public class ChallengeAttemptController {

    private final ChallengeAttemptService attemptService;
    private final SocialService socialService;

    @PostMapping("/submit")
    public ChallengeAttempt submitChallenge(@RequestBody ChallengeSubmitRequest request) {
        socialService.addUserCoins(request.userId, CoinType.CHALLENGE_ATTEMPT);

        return attemptService.submitChallenge(
                request.getChallengeId(),
                request.getUserId(),
                request.getAnswers(),
                request.getStartedAt()
        );
    }

    // GET /user/{userId} — all attempts by a specific user
    @GetMapping("/user/{userId}")
    public List<ChallengeAttempt> getAttemptsByUser(@PathVariable String userId) {
        return attemptService.getAttemptsByUser(userId);
    }

    // GET /challenge/{challengeId} — all attempts for a specific challenge
    @GetMapping("/challenge/{challengeId}")
    public List<ChallengeAttempt> getAttemptsByChallenge(@PathVariable String challengeId) {
        return attemptService.getAttemptsByChallenge(challengeId);
    }

    // DTO for submission
    @Data
    public static class ChallengeSubmitRequest {
        private String challengeId;
        private String userId;
        private List<String> answers;
        private LocalDateTime startedAt;
    }

    @GetMapping("/result")
    public ChallengeAttempt getUserChallengeResult(@RequestParam String userId, @RequestParam String challengeId) {
        return attemptService.getUserChallengeResult(userId, challengeId);
    }

    // used for report generation remove if this begins to throw errors
    @GetMapping("/report/{challengeId}")
    public ResponseEntity<HashMap<Object, Object>> getChallengeReport(@PathVariable String challengeId) {
        HashMap<Object, Object> stats = attemptService.getChallengeStats(challengeId);
        return ResponseEntity.ok(stats);
    }


}
