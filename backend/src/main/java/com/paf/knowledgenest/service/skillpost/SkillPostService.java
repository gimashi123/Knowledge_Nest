package com.paf.knowledgenest.service.skillpost;

import com.paf.knowledgenest.dto.requests.skillPost.SkillPostDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SkillPostService {
    
    // CRUD operations
    SkillPostDto.Response createPost(SkillPostDto.Request request, String userId, String userName);
    SkillPostDto.Response getPostById(String id, String currentUserId);
    SkillPostDto.Response updatePost(String id, SkillPostDto.Request request, String userId);
    void deletePost(String id, String userId);
    void deleteMultiplePosts(List<String> ids, String userId);
    
    // Retrieval methods
    Page<SkillPostDto.Response> getAllPosts(Pageable pageable, String currentUserId);
    Page<SkillPostDto.Response> getPostsByUser(String userId, Pageable pageable, String currentUserId);
    Page<SkillPostDto.Response> getPostsByTag(String tag, Pageable pageable, String currentUserId);
    Page<SkillPostDto.Response> getPostsByTags(List<String> tags, Pageable pageable, String currentUserId);
    Page<SkillPostDto.Response> searchPostsByKeyword(String keyword, Pageable pageable, String currentUserId);
    Page<SkillPostDto.Response> getTrendingPosts(Pageable pageable, String currentUserId);
    
    // Tag methods
    List<String> getAllUniqueTags();
    
    // Like functionality
    SkillPostDto.Response toggleLike(String postId, String userId);
    
    // Comment functionality
    SkillPostDto.Response addComment(String postId, SkillPostDto.CommentRequest request, String userId, String userName);
    SkillPostDto.Response updateComment(String postId, String commentId, SkillPostDto.CommentRequest request, String userId);
    SkillPostDto.Response deleteComment(String postId, String commentId, String userId);
    
    // Comment reply functionality
    SkillPostDto.Response replyToComment(String postId, String parentCommentId, SkillPostDto.CommentRequest request, String userId, String userName);
} 