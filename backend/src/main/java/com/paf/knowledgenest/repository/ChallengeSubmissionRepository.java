package com.paf.knowledgenest.repository;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.paf.knowledgenest.model.ChallengeSubmission;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChallengeSubmissionRepository extends MongoRepository<ChallengeSubmission, String> {
    List<ChallengeSubmission> findByUserId(String userId);
    List<ChallengeSubmission> findByChallengeId(String challengeId);
    ChallengeSubmission findByUserIdAndChallengeId(String userId, String challengeId);
}

