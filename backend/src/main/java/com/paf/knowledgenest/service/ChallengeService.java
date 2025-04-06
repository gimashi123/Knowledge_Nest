package com.paf.knowledgenest.service;

import com.paf.knowledgenest.model.Challenge;
import com.paf.knowledgenest.repository.ChallengeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    // Create new challenge
    public Challenge createChallenge(Challenge challenge) {
        return challengeRepository.save(challenge);
    }

    // Get all challenges (admin or user view)
    public List<Challenge> getAllChallenges() {
        return challengeRepository.findAll();
    }

    // Get challenges by category (coding, cooking, DIY)
    public List<Challenge> getChallengesByCategory(String category) {
        return challengeRepository.findBySkillCategory(category);
    }

    // Get challenge by ID
    public Optional<Challenge> getChallengeById(String id) {
        return challengeRepository.findById(id);
    }

    // Get all challenges created by a specific user
    public List<Challenge> getChallengesByCreator(String creatorId) {
        return challengeRepository.findByCreatorId(creatorId);
    }

    // Update challenge
    public Optional<Challenge> updateChallenge(String id, Challenge updatedChallenge) {
        return challengeRepository.findById(id).map(challenge -> {
            challenge.setTitle(updatedChallenge.getTitle());
            challenge.setTasks(updatedChallenge.getTasks());
            challenge.setSkillCategory(updatedChallenge.getSkillCategory());
            challenge.setDifficultyLevel(updatedChallenge.getDifficultyLevel());
            challenge.setTimeLimit(updatedChallenge.getTimeLimit());
            return challengeRepository.save(challenge);
        });
    }

    // Delete challenge
    public void deleteChallenge(String id) {
        challengeRepository.deleteById(id);
    }

    // Block a challenge (if user doesn't complete in time)
    public void blockChallenge(String id) {
        challengeRepository.findById(id).ifPresent(challenge -> {
            challenge.setActive(false);
            challengeRepository.save(challenge);
        });
    }

    // disable the challenge
    public Challenge toggleChallengeStatus(String id) {
        Challenge challenge = challengeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Challenge not found"));
        challenge.setActive(!challenge.isActive());
        return challengeRepository.save(challenge);
    }

}
