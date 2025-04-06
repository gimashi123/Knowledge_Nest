package com.paf.knowledgenest.repository;

import com.paf.knowledgenest.model.ChallengeAttempt;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface ChallengeAttemptRepository extends MongoRepository<ChallengeAttempt, String> {
    List<ChallengeAttempt> findByUserId(String userId);
    List<ChallengeAttempt> findByChallengeId(String challengeId);
    Optional<ChallengeAttempt> findByUserIdAndChallengeId(String userId, String challengeId); // allowing only 1 attempt
}
