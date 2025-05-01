package com.paf.knowledgenest.repository.skillpost;

import com.paf.knowledgenest.model.skillpost.SkillPost;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SkillPostRepository extends MongoRepository<SkillPost, String> {
    
    // Find posts by user ID
    List<SkillPost> findByUserId(String userId);
    Page<SkillPost> findByUserId(String userId, Pageable pageable);
    
    // Find posts containing specific tag
    List<SkillPost> findByTagsContaining(String tag);
    Page<SkillPost> findByTagsContaining(String tag, Pageable pageable);
    
    // Find posts containing any of the provided tags
    @Query("{ 'tags': { $in: ?0 } }")
    List<SkillPost> findByTagsIn(List<String> tags);
    @Query("{ 'tags': { $in: ?0 } }")
    Page<SkillPost> findByTagsIn(List<String> tags, Pageable pageable);
    
    // Search by keyword in title
    List<SkillPost> findByTitleContainingIgnoreCase(String keyword);
    Page<SkillPost> findByTitleContainingIgnoreCase(String keyword, Pageable pageable);
    
    // Combined search by keyword in title or description
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    List<SkillPost> findByTitleOrDescriptionContainingIgnoreCase(String keyword);
    @Query("{ $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } } ] }")
    Page<SkillPost> findByTitleOrDescriptionContainingIgnoreCase(String keyword, Pageable pageable);
    
    // Delete multiple posts by IDs and userId (to ensure ownership)
    void deleteByIdInAndUserId(List<String> ids, String userId);
    
    // Count posts by userId (useful for dashboards/metrics)
    long countByUserId(String userId);
} 