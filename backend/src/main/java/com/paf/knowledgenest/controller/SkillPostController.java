package com.paf.knowledgenest.controller;

import com.paf.knowledgenest.dto.SkillPostDto;
import com.paf.knowledgenest.service.SkillPostService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skill-posts")
@RequiredArgsConstructor
public class SkillPostController {

    private final SkillPostService skillPostService;

    @PostMapping
    public ResponseEntity<SkillPostDto.Response> createSkillPost(
            @Valid @RequestBody SkillPostDto.Request request) {
        String userId = "test.user@example.com";
        String userName = "Test User";
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                userId = userDetails.getUsername();
                userName = userId;
            }
        } catch (Exception e) {
            // Use default values for testing
        }
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(skillPostService.createSkillPost(request, userId, userName));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SkillPostDto.Response> getSkillPostById(@PathVariable String id) {
        return ResponseEntity.ok(skillPostService.getSkillPostById(id));
    }

    @GetMapping
    public ResponseEntity<List<SkillPostDto.Response>> getAllSkillPosts() {
        return ResponseEntity.ok(skillPostService.getAllSkillPosts());
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SkillPostDto.Response>> getSkillPostsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(skillPostService.getSkillPostsByUser(userId));
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<List<SkillPostDto.Response>> getSkillPostsByTag(@PathVariable String tag) {
        return ResponseEntity.ok(skillPostService.getSkillPostsByTag(tag));
    }

    @GetMapping("/search")
    public ResponseEntity<List<SkillPostDto.Response>> searchSkillPosts(@RequestParam String keyword) {
        return ResponseEntity.ok(skillPostService.searchSkillPosts(keyword));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SkillPostDto.Response> updateSkillPost(
            @PathVariable String id,
            @Valid @RequestBody SkillPostDto.Request request) {
        String userId = "test.user@example.com";
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                userId = userDetails.getUsername();
            }
        } catch (Exception e) {
            // Use default values for testing
        }
        
        return ResponseEntity.ok(skillPostService.updateSkillPost(id, request, userId));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkillPost(@PathVariable String id) {
        String userId = "test.user@example.com";
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                userId = userDetails.getUsername();
            }
        } catch (Exception e) {
            // Use default values for testing
        }
        
        skillPostService.deleteSkillPost(id, userId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{postId}/comments")
    public ResponseEntity<SkillPostDto.Response> addComment(
            @PathVariable String postId,
            @Valid @RequestBody SkillPostDto.CommentRequest request) {
        String userId = "test.user@example.com";
        String userName = "Test User";
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                userId = userDetails.getUsername();
                userName = userId;
            }
        } catch (Exception e) {
            // Use default values for testing
        }
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(skillPostService.addComment(postId, request, userId, userName));
    }

    @PostMapping("/{postId}/like")
    public ResponseEntity<SkillPostDto.Response> likeSkillPost(@PathVariable String postId) {
        String userId = "test.user@example.com";
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                userId = userDetails.getUsername();
            }
        } catch (Exception e) {
            // Use default values for testing
        }
        
        return ResponseEntity.ok(skillPostService.likeSkillPost(postId, userId));
    }

    @GetMapping("/trending")
    public ResponseEntity<List<SkillPostDto.Response>> getTrendingSkillPosts(
            @RequestParam(defaultValue = "10") int limit) {
        return ResponseEntity.ok(skillPostService.getTrendingSkillPosts(limit));
    }

    @GetMapping("/by-tags")
    public ResponseEntity<List<SkillPostDto.Response>> getSkillPostsByMultipleTags(
            @RequestParam List<String> tags) {
        return ResponseEntity.ok(skillPostService.getSkillPostsByMultipleTags(tags));
    }

    @DeleteMapping("/batch")
    public ResponseEntity<Void> batchDeleteSkillPosts(@RequestBody List<String> ids) {
        String userId = "test.user@example.com";
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                userId = userDetails.getUsername();
            }
        } catch (Exception e) {
            // Use default values for testing
        }
        
        skillPostService.batchDeleteSkillPosts(ids, userId);
        return ResponseEntity.noContent().build();
    }

    @PutMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<SkillPostDto.Response> updateComment(
            @PathVariable String postId,
            @PathVariable String commentId,
            @Valid @RequestBody SkillPostDto.CommentRequest request) {
        String userId = "test.user@example.com";
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                userId = userDetails.getUsername();
            }
        } catch (Exception e) {
            // Use default values for testing
        }
        
        return ResponseEntity.ok(skillPostService.updateComment(postId, commentId, request, userId));
    }

    @DeleteMapping("/{postId}/comments/{commentId}")
    public ResponseEntity<SkillPostDto.Response> deleteComment(
            @PathVariable String postId,
            @PathVariable String commentId) {
        String userId = "test.user@example.com";
        
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
                UserDetails userDetails = (UserDetails) authentication.getPrincipal();
                userId = userDetails.getUsername();
            }
        } catch (Exception e) {
            // Use default values for testing
        }
        
        return ResponseEntity.ok(skillPostService.deleteComment(postId, commentId, userId));
    }
} 