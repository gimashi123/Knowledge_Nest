package com.paf.knowledgenest.repository;

import com.paf.knowledgenest.model.Challenge;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ChallengeRepository extends MongoRepository<Challenge, String> {
    List<Challenge> findBySkillCategory(String skillCategory);
    List<Challenge> findByCreatorId(String creatorId);
}
