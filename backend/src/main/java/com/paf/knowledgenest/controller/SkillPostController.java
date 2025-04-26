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
import com.paf.knowledgenest.dto.ApiResponseDto;
import com.paf.knowledgenest.exception.SkillPostException;
import com.paf.knowledgenest.model.SkillPost;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.stream.Collectors;
import java.util.Set;

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
    public ResponseEntity<ApiResponseDto<SkillPostDto.Response>> getSkillPostById(@PathVariable String id) {
        SkillPostDto.Response post = skillPostService.getSkillPostById(id);
        return ResponseEntity.ok(ApiResponseDto.success(post, "Skill post retrieved successfully"));
    }

    @GetMapping
    public ResponseEntity<ApiResponseDto<List<SkillPostDto.Response>>> getAllSkillPosts() {
        List<SkillPostDto.Response> posts = skillPostService.getAllSkillPosts();
        return ResponseEntity.ok(ApiResponseDto.success(posts, "All skill posts retrieved successfully"));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponseDto<List<SkillPostDto.Response>>> getSkillPostsByUser(@PathVariable String userId) {
        List<SkillPostDto.Response> posts = skillPostService.getSkillPostsByUser(userId);
        return ResponseEntity.ok(ApiResponseDto.success(posts, "User skill posts retrieved successfully"));
    }

    @GetMapping("/tag/{tag}")
    public ResponseEntity<ApiResponseDto<List<SkillPostDto.Response>>> getSkillPostsByTag(@PathVariable String tag) {
        List<SkillPostDto.Response> posts = skillPostService.getSkillPostsByTag(tag);
        return ResponseEntity.ok(ApiResponseDto.success(posts, "Tagged skill posts retrieved successfully"));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponseDto<List<SkillPostDto.Response>>> searchSkillPosts(@RequestParam String keyword) {
        List<SkillPostDto.Response> posts = skillPostService.searchSkillPosts(keyword);
        return ResponseEntity.ok(ApiResponseDto.success(posts, "Search results retrieved successfully"));
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
    @ResponseStatus(HttpStatus.OK)
    public ApiResponseDto<Map<String, Object>> deleteSkillPost(@PathVariable String id) {
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
        
        // Delete the post and handle any exceptions
        try {
            SkillPost deletedPost = skillPostService.deleteSkillPost(id, userId);
            
            // Create response data
            Map<String, Object> data = new HashMap<>();
            data.put("postId", id);
            data.put("title", deletedPost.getTitle());
            data.put("deletedAt", LocalDateTime.now().toString());
            data.put("deletedBy", userId);
            data.put("createdAt", deletedPost.getCreatedAt().toString());
            
            // Return success response
            return ApiResponseDto.success(data, "Skill post deleted successfully");
        } catch (SkillPostException.NotFoundException e) {
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("error", "Post not found");
            errorData.put("postId", id);
            throw e; // Let the exception handler handle this
        } catch (SkillPostException.UnauthorizedException e) {
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("error", "Unauthorized");
            errorData.put("postId", id);
            throw e; // Let the exception handler handle this
        } catch (Exception e) {
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("error", "Server error");
            errorData.put("postId", id);
            throw new SkillPostException.DeleteOperationException("Failed to delete skill post with id: " + id);
        }
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
    public ResponseEntity<ApiResponseDto<List<SkillPostDto.Response>>> getTrendingSkillPosts(
            @RequestParam(defaultValue = "10") int limit) {
        List<SkillPostDto.Response> posts = skillPostService.getTrendingSkillPosts(limit);
        return ResponseEntity.ok(ApiResponseDto.success(posts, "Trending skill posts retrieved successfully"));
    }

    @GetMapping("/by-tags")
    public ResponseEntity<ApiResponseDto<List<SkillPostDto.Response>>> getSkillPostsByMultipleTags(
            @RequestParam List<String> tags) {
        List<SkillPostDto.Response> posts = skillPostService.getSkillPostsByMultipleTags(tags);
        return ResponseEntity.ok(ApiResponseDto.success(posts, "Tagged skill posts retrieved successfully"));
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

    @GetMapping("/view")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> viewSkillPosts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) List<String> tags,
            @RequestParam(required = false) String userId) {
        
        // Create a map to store all response data
        Map<String, Object> response = new HashMap<>();
        
        // Fetch posts based on parameters
        List<SkillPostDto.Response> posts;
        
        // Handle different filtering scenarios
        if (keyword != null && !keyword.isEmpty()) {
            // Search by keyword
            posts = skillPostService.searchSkillPosts(keyword);
        } else if (tags != null && !tags.isEmpty()) {
            // Filter by tags
            posts = skillPostService.getSkillPostsByMultipleTags(tags);
        } else if (userId != null && !userId.isEmpty()) {
            // Get posts by user
            posts = skillPostService.getSkillPostsByUser(userId);
        } else {
            // Get all posts
            posts = skillPostService.getAllSkillPosts();
        }
        
        // Sort the posts
        if ("desc".equalsIgnoreCase(sortDir)) {
            // Descending order
            posts = sortPostsDesc(posts, sortBy);
        } else {
            // Ascending order
            posts = sortPostsAsc(posts, sortBy);
        }
        
        // Calculate pagination values
        int totalItems = posts.size();
        int totalPages = (int) Math.ceil((double) totalItems / size);
        
        // Apply pagination
        int fromIndex = page * size;
        int toIndex = Math.min(fromIndex + size, totalItems);
        
        List<SkillPostDto.Response> paginatedPosts = 
                fromIndex < toIndex ? posts.subList(fromIndex, toIndex) : new ArrayList<>();
        
        // Build response data
        response.put("posts", paginatedPosts);
        response.put("currentPage", page);
        response.put("totalItems", totalItems);
        response.put("totalPages", totalPages);
        response.put("pageSize", size);
        response.put("sortBy", sortBy);
        response.put("sortDirection", sortDir);
        
        return ResponseEntity.ok(ApiResponseDto.success(response, "Skill posts retrieved successfully"));
    }

    // Helper method to sort posts in ascending order
    private List<SkillPostDto.Response> sortPostsAsc(List<SkillPostDto.Response> posts, String sortBy) {
        return posts.stream()
                .sorted((p1, p2) -> {
                    switch (sortBy) {
                        case "title":
                            return p1.getTitle().compareToIgnoreCase(p2.getTitle());
                        case "likes":
                            return Integer.compare(p1.getLikes(), p2.getLikes());
                        case "updatedAt":
                            return p1.getUpdatedAt().compareTo(p2.getUpdatedAt());
                        case "createdAt":
                        default:
                            return p1.getCreatedAt().compareTo(p2.getCreatedAt());
                    }
                })
                .collect(Collectors.toList());
    }

    // Helper method to sort posts in descending order
    private List<SkillPostDto.Response> sortPostsDesc(List<SkillPostDto.Response> posts, String sortBy) {
        return posts.stream()
                .sorted((p1, p2) -> {
                    switch (sortBy) {
                        case "title":
                            return p2.getTitle().compareToIgnoreCase(p1.getTitle());
                        case "likes":
                            return Integer.compare(p2.getLikes(), p1.getLikes());
                        case "updatedAt":
                            return p2.getUpdatedAt().compareTo(p1.getUpdatedAt());
                        case "createdAt":
                        default:
                            return p2.getCreatedAt().compareTo(p1.getCreatedAt());
                    }
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/dashboard-summary")
    public ResponseEntity<ApiResponseDto<Map<String, Object>>> getSkillPostsDashboardSummary() {
        Map<String, Object> summary = new HashMap<>();
        
        // Get all posts
        List<SkillPostDto.Response> allPosts = skillPostService.getAllSkillPosts();
        
        // Calculate total counts
        int totalPosts = allPosts.size();
        
        // Get trending posts (top 5)
        List<SkillPostDto.Response> trendingPosts = skillPostService.getTrendingSkillPosts(5);
        
        // Calculate total likes across all posts
        int totalLikes = allPosts.stream().mapToInt(SkillPostDto.Response::getLikes).sum();
        
        // Calculate total comments across all posts
        int totalComments = allPosts.stream()
                .mapToInt(post -> post.getComments() != null ? post.getComments().size() : 0)
                .sum();
        
        // Extract all unique tags
        Set<String> allTags = allPosts.stream()
                .filter(post -> post.getTags() != null)
                .flatMap(post -> post.getTags().stream())
                .collect(Collectors.toSet());
        
        // Count posts by top tags
        Map<String, Long> postsByTag = allPosts.stream()
                .filter(post -> post.getTags() != null)
                .flatMap(post -> post.getTags().stream())
                .collect(Collectors.groupingBy(tag -> tag, Collectors.counting()));
        
        // Sort and get top 5 tags
        List<Map.Entry<String, Long>> topTags = postsByTag.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(5)
                .collect(Collectors.toList());
        
        // Recent posts (latest 5)
        List<SkillPostDto.Response> recentPosts = allPosts.stream()
                .sorted((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()))
                .limit(5)
                .collect(Collectors.toList());
        
        // Build the summary response
        summary.put("totalPosts", totalPosts);
        summary.put("totalLikes", totalLikes);
        summary.put("totalComments", totalComments);
        summary.put("totalTags", allTags.size());
        summary.put("trendingPosts", trendingPosts);
        summary.put("recentPosts", recentPosts);
        summary.put("topTags", topTags);
        
        return ResponseEntity.ok(ApiResponseDto.success(summary, "Dashboard summary retrieved successfully"));
    }

    // Test endpoint to debug the deletion issue
    @GetMapping("/test-delete/{id}")
    @ResponseStatus(HttpStatus.OK)
    public String testDeleteResponse(@PathVariable String id) {
        return "This is a test response for deleting post with ID: " + id + " - You should see this message with status 200.";
    }

    // Alternate delete endpoint with a different URL pattern
    @DeleteMapping("/remove/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ApiResponseDto<Map<String, Object>> removeSkillPost(@PathVariable String id) {
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
        
        try {
            SkillPost deletedPost = skillPostService.deleteSkillPost(id, userId);
            
            Map<String, Object> data = new HashMap<>();
            data.put("postId", id);
            data.put("title", deletedPost.getTitle());
            data.put("deletedAt", LocalDateTime.now().toString());
            data.put("deletedBy", userId);
            
            return ApiResponseDto.success(data, "Skill post removed successfully");
        } catch (Exception e) {
            Map<String, Object> errorData = new HashMap<>();
            errorData.put("error", "Error occurred");
            errorData.put("postId", id);
            
            return ApiResponseDto.failure(errorData, "Failed to remove post: " + e.getMessage());
        }
    }
} 