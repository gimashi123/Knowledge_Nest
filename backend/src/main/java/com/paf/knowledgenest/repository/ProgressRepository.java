package com.paf.knowledgenest.repository;

import com.paf.knowledgenest.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProgressRepository extends MongoRepository<Progress, Long> {

     Boolean existsProgressByProgressAndTitle(Integer progress, String title);

     Optional<Progress> findByProgressId(String progressId);

     void deleteByProgressId(String progressId);
}
