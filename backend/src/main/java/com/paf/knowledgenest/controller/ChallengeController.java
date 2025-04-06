package com.paf.knowledgenest.controller;

import com.paf.knowledgenest.model.Challenge;
import com.paf.knowledgenest.service.ChallengeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/challenges")
@CrossOrigin(origins = "*") // For allowing frontend to call API (adjust for security later)
public class ChallengeController {

    @Autowired
    private ChallengeService challengeService;

    // Create challenge
    @PostMapping
    public ResponseEntity<Challenge> createChallenge(@RequestBody Challenge challenge) {
        Challenge saved = challengeService.createChallenge(challenge);
        return ResponseEntity.ok(saved);
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
    public ResponseEntity<Challenge> updateChallenge(@PathVariable String id, @RequestBody Challenge updatedChallenge) {
        Optional<Challenge> updated = challengeService.updateChallenge(id, updatedChallenge);
        return updated.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    // Delete challenge
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteChallenge(@PathVariable String id) {
        challengeService.deleteChallenge(id);
        return ResponseEntity.noContent().build();
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
