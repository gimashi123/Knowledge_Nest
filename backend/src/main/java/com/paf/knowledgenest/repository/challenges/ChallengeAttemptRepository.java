package com.paf.knowledgenest.repository.challenges;

import com.paf.knowledgenest.model.challenges.ChallengeAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChallengeAttemptRepository extends MongoRepository<ChallengeAttempt, String> {
    List<ChallengeAttempt> findByUserId(String userId);
    List<ChallengeAttempt> findByChallengeId(String challengeId);
    Optional<ChallengeAttempt> findByUserIdAndChallengeId(String userId, String challengeId); // allowing only 1 attempt
}
