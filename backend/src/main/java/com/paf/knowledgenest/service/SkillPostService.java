package com.paf.knowledgenest.service;

import com.paf.knowledgenest.dto.SkillPostDto;
import com.paf.knowledgenest.model.SkillPost;

import java.util.List;

public interface SkillPostService {
    
    SkillPostDto.Response createSkillPost(SkillPostDto.Request request, String userId, String userName);
    
    SkillPostDto.Response getSkillPostById(String id);
    
    List<SkillPostDto.Response> getAllSkillPosts();
    
    List<SkillPostDto.Response> getSkillPostsByUser(String userId);
    
    List<SkillPostDto.Response> getSkillPostsByTag(String tag);
    
    List<SkillPostDto.Response> searchSkillPosts(String keyword);
    
    SkillPostDto.Response updateSkillPost(String id, SkillPostDto.Request request, String userId);
    
    void deleteSkillPost(String id, String userId);
    
    SkillPostDto.Response addComment(String postId, SkillPostDto.CommentRequest request, String userId, String userName);
    
    SkillPostDto.Response likeSkillPost(String postId, String userId);
} 