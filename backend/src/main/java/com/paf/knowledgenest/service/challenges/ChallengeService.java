package com.paf.knowledgenest.service.challenges;

import com.paf.knowledgenest.model.challenges.Challenge;
import com.paf.knowledgenest.repository.challenges.ChallengeRepository;
import com.paf.knowledgenest.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ChallengeService {

    @Autowired
    private ChallengeRepository challengeRepository;

    // Create a new challenge
    public ApiResponse<Challenge> createChallenge(Challenge challenge) {
        try{
            Challenge savedChallenge =  challengeRepository.save(challenge);

            return ApiResponse.successResponse("Challenge Saved Successfully", savedChallenge);
        } catch (Exception e) {
            return ApiResponse.errorResponse("Unexpected Error Occurred while attempting to save challenge");
        }
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
    public ApiResponse<Challenge> updateChallenge(String id, Challenge updatedChallenge) {
        try {
            return challengeRepository.findById(id)
                    .map(existingChallenge -> {
                        existingChallenge.setTitle(updatedChallenge.getTitle());
                        existingChallenge.setTasks(updatedChallenge.getTasks());
                        existingChallenge.setSkillCategory(updatedChallenge.getSkillCategory());
                        existingChallenge.setDifficultyLevel(updatedChallenge.getDifficultyLevel());
                        existingChallenge.setTimeLimit(updatedChallenge.getTimeLimit());

                        Challenge savedChallenge = challengeRepository.save(existingChallenge);
                        return ApiResponse.successResponse("Challenge updated successfully", savedChallenge);
                    })
                    .orElse(ApiResponse.errorResponse("Challenge with ID " + id + " not found"));
        } catch (Exception e) {
            return ApiResponse.errorResponse("Failed to update challenge: " + e.getMessage());
        }
    }

    // Delete challenge
    public ApiResponse<Void> deleteChallenge(String id) {
        try {
            if (challengeRepository.existsById(id)) {
                challengeRepository.deleteById(id);
                return ApiResponse.successResponse(
                        "Challenge with ID " + id + " deleted successfully",
                        null
                );
            } else {
                return ApiResponse.errorResponse(
                        "Challenge with ID " + id + " not found"
                );
            }
        } catch (Exception e) {
            return ApiResponse.errorResponse(
                    "Failed to delete challenge with ID " + id + ": " + e.getMessage()
            );
        }
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
