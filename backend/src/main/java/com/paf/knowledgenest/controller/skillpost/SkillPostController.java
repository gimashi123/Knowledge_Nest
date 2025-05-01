package com.paf.knowledgenest.controller.skillpost;

import com.paf.knowledgenest.dto.skillpost.SkillPostDto;
import com.paf.knowledgenest.service.skillpost.SkillPostService;
import com.paf.knowledgenest.utils.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skill-posts")
@RequiredArgsConstructor
public class SkillPostController {

    private final SkillPostService skillPostService;

    // Create a new post
    @PostMapping
    public ResponseEntity<SkillPostDto.Response> createPost(
            @Valid @RequestBody SkillPostDto.Request request,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        String userName = authentication.getName();
        SkillPostDto.Response response = skillPostService.createPost(request, userId, userName);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Get all posts with pagination
    @GetMapping
    public ResponseEntity<Page<SkillPostDto.Response>> getAllPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        Pageable pageable = PageRequest.of(
                page, size,
                Sort.Direction.fromString(sortDir), sortBy
        );
        Page<SkillPostDto.Response> posts = skillPostService.getAllPosts(pageable, userId);
        return ResponseEntity.ok(posts);
    }

    // Get post by ID
    @GetMapping("/{id}")
    public ResponseEntity<SkillPostDto.Response> getPostById(
            @PathVariable String id,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        SkillPostDto.Response post = skillPostService.getPostById(id, userId);
        return ResponseEntity.ok(post);
    }

    // Update post
    @PutMapping("/{id}")
    public ResponseEntity<SkillPostDto.Response> updatePost(
            @PathVariable String id,
            @Valid @RequestBody SkillPostDto.Request request,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        SkillPostDto.Response response = skillPostService.updatePost(id, request, userId);
        return ResponseEntity.ok(response);
    }

    // Delete post
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> deletePost(
            @PathVariable String id,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        skillPostService.deletePost(id, userId);
        return ResponseEntity.ok(ApiResponse.successResponse("Post deleted successfully", null));
    }

    // Delete multiple posts
    @DeleteMapping("/batch")
    public ResponseEntity<ApiResponse<String>> deleteMultiplePosts(
            @RequestBody List<String> ids,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        skillPostService.deleteMultiplePosts(ids, userId);
        return ResponseEntity.ok(ApiResponse.successResponse("Posts deleted successfully", null));
    }

    // Get posts by user
    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<SkillPostDto.Response>> getPostsByUser(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String currentUserId = getUserIdFromAuth(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillPostDto.Response> posts = skillPostService.getPostsByUser(userId, pageable, currentUserId);
        return ResponseEntity.ok(posts);
    }

    // Get posts by tag
    @GetMapping("/tag/{tag}")
    public ResponseEntity<Page<SkillPostDto.Response>> getPostsByTag(
            @PathVariable String tag,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillPostDto.Response> posts = skillPostService.getPostsByTag(tag, pageable, userId);
        return ResponseEntity.ok(posts);
    }

    // Get posts by multiple tags
    @GetMapping("/tags")
    public ResponseEntity<Page<SkillPostDto.Response>> getPostsByTags(
            @RequestParam List<String> tags,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillPostDto.Response> posts = skillPostService.getPostsByTags(tags, pageable, userId);
        return ResponseEntity.ok(posts);
    }

    // Search posts by keyword
    @GetMapping("/search")
    public ResponseEntity<Page<SkillPostDto.Response>> searchPosts(
            @RequestParam String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillPostDto.Response> posts = skillPostService.searchPostsByKeyword(keyword, pageable, userId);
        return ResponseEntity.ok(posts);
    }

    // Get trending posts
    @GetMapping("/trending")
    public ResponseEntity<Page<SkillPostDto.Response>> getTrendingPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        Pageable pageable = PageRequest.of(page, size);
        Page<SkillPostDto.Response> posts = skillPostService.getTrendingPosts(pageable, userId);
        return ResponseEntity.ok(posts);
    }

    // Toggle like on a post
    @PostMapping("/{id}/like")
    public ResponseEntity<SkillPostDto.Response> toggleLike(
            @PathVariable String id,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        SkillPostDto.Response response = skillPostService.toggleLike(id, userId);
        return ResponseEntity.ok(response);
    }

    // Add comment to a post
    @PostMapping("/{id}/comments")
    public ResponseEntity<SkillPostDto.Response> addComment(
            @PathVariable String id,
            @Valid @RequestBody SkillPostDto.CommentRequest request,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        String userName = authentication.getName();
        SkillPostDto.Response response = skillPostService.addComment(id, request, userId, userName);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // Update comment
    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<SkillPostDto.Response> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @Valid @RequestBody SkillPostDto.CommentRequest request,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        SkillPostDto.Response response = skillPostService.updateComment(postId, commentId, request, userId);
        return ResponseEntity.ok(response);
    }

    // Delete comment
    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<SkillPostDto.Response> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            Authentication authentication) {
        String userId = getUserIdFromAuth(authentication);
        SkillPostDto.Response response = skillPostService.deleteComment(postId, commentId, userId);
        return ResponseEntity.ok(response);
    }

    // Helper method to extract userId from authentication
    private String getUserIdFromAuth(Authentication authentication) {
        if (authentication == null) {
            throw new UsernameNotFoundException("User not authenticated");
        }
        // Authentication name contains the email address, similar to userRepository.findByEmail() pattern
        // used elsewhere in your app. In a real implementation, you'd likely fetch the user ID from 
        // your User entity using the email.
        return authentication.getName();
    }
} 