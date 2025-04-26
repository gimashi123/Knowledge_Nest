package com.paf.knowledgenest.controller.challenges;

import com.paf.knowledgenest.model.challenges.Challenge;
import com.paf.knowledgenest.service.challenges.ChallengeService;
import com.paf.knowledgenest.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/challenges")
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    // Create challenge
    @PostMapping
    public ResponseEntity<ApiResponse<Challenge>> createChallenge(@RequestBody Challenge challenge) {
        ApiResponse<Challenge> saved = challengeService.createChallenge(challenge);
        return ResponseEntity.status(saved.isSuccess() ? HttpStatus.CREATED : HttpStatus.BAD_REQUEST).body(saved);
    }

    // Get all challenges
    @GetMapping
    public ResponseEntity<List<Challenge>> getAllChallenges() {
        return ResponseEntity.ok(challengeService.getAllChallenges());
    }

    // Get challenge by ID
    @GetMapping("/{id}")
    public ResponseEntity<Challenge> getChallengeById(@PathVariable String id) {
        Optional<Challenge> challenge = challengeService.getChallengeById(id);
        return challenge.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Get challenges by skill category
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Challenge>> getChallengesByCategory(@PathVariable String category) {
        return ResponseEntity.ok(challengeService.getChallengesByCategory(category));
    }

    // Get challenges created by a user
    @GetMapping("/creator/{creatorId}")
    public ResponseEntity<List<Challenge>> getChallengesByCreator(@PathVariable String creatorId) {
        return ResponseEntity.ok(challengeService.getChallengesByCreator(creatorId));
    }

    // Update challenge
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<Challenge>> updateChallenge(
            @PathVariable String id,
            @RequestBody Challenge updatedChallenge) {
        ApiResponse<Challenge> response = challengeService.updateChallenge(id, updatedChallenge);
        return ResponseEntity.status(response.isSuccess() ? HttpStatus.OK : HttpStatus.BAD_REQUEST)
                .body(response);
    }

    // Delete challenge
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteChallenge(@PathVariable String id) {
        ApiResponse<Void> response = challengeService.deleteChallenge(id);
        HttpStatus status = response.isSuccess() ? HttpStatus.OK : HttpStatus.NOT_FOUND;
        return ResponseEntity.status(status).body(response);
    }

    // Block a challenge manually (can also trigger from timeout logic later)
    @PutMapping("/{id}/block")
    public ResponseEntity<Void> blockChallenge(@PathVariable String id) {
        challengeService.blockChallenge(id);
        return ResponseEntity.ok().build();
    }

    // used to disable the challenge
    @PatchMapping("/{id}/toggle")
    public Challenge toggleChallenge(@PathVariable String id) {
        return challengeService.toggleChallengeStatus(id);
    }

}
