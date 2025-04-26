package com.paf.knowledgenest.repository;

import com.paf.knowledgenest.model.Progress;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProgressRepository extends MongoRepository<Progress, Long> {

     Boolean existsProgressByProgressAndTitle(Integer progress, String title);
}
