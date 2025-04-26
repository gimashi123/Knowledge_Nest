package com.paf.knowledgenest.repository;

import com.paf.knowledgenest.model.SkillPost;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillPostRepository extends MongoRepository<SkillPost, String> {
    
    List<SkillPost> findByUserId(String userId);
    
    List<SkillPost> findByTagsContaining(String tag);
    
    List<SkillPost> findByTitleContainingIgnoreCase(String keyword);
    
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } }, { 'content': { $regex: ?0, $options: 'i' } } ] }")
    List<SkillPost> findByKeywordInTitleDescriptionOrContent(String keyword);
} 