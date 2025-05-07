package com.paf.knowledgenest.service.skillpost;

import com.paf.knowledgenest.dto.requests.skillPost.SkillPostDto;
import com.paf.knowledgenest.exception.BatchOperationException;
import com.paf.knowledgenest.exception.ResourceNotFoundException;
import com.paf.knowledgenest.exception.UnauthorizedException;
import com.paf.knowledgenest.model.skillpost.Comment;
import com.paf.knowledgenest.model.skillpost.SkillPost;
import com.paf.knowledgenest.repository.skillpost.SkillPostRepository;
import com.paf.knowledgenest.service.notification.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillPostServiceImpl implements SkillPostService {

    private final SkillPostRepository skillPostRepository;
    private final NotificationService notificationService;

    @Override
    public SkillPostDto.Response createPost(SkillPostDto.Request request, String userId, String userName) {
        SkillPost skillPost = new SkillPost();
        skillPost.setTitle(request.getTitle());
        skillPost.setDescription(request.getDescription());
        skillPost.setContent(request.getContent());
        skillPost.setYoutubeUrl(request.getYoutubeUrl());
        skillPost.setTags(request.getTags());
        skillPost.setUserId(userId);
        skillPost.setUserName(userName);
        
        LocalDateTime now = LocalDateTime.now();
        skillPost.setCreatedAt(now);
        skillPost.setUpdatedAt(now);
        
        SkillPost savedPost = skillPostRepository.save(skillPost);
        return SkillPostDto.Response.fromSkillPost(savedPost, userId);
    }

    @Override
    public SkillPostDto.Response getPostById(String id, String currentUserId) {
        SkillPost post = skillPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SkillPost", "id", id));
        return SkillPostDto.Response.fromSkillPost(post, currentUserId);
    }

    @Override
    public SkillPostDto.Response updatePost(String id, SkillPostDto.Request request, String userId) {
        SkillPost post = skillPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SkillPost", "id", id));
        
        // Check ownership
        if (!post.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this post");
        }
        
        post.setTitle(request.getTitle());
        post.setDescription(request.getDescription());
        post.setContent(request.getContent());
        post.setYoutubeUrl(request.getYoutubeUrl());
        post.setTags(request.getTags());
        post.setUpdatedAt(LocalDateTime.now());
        
        SkillPost updatedPost = skillPostRepository.save(post);
        return SkillPostDto.Response.fromSkillPost(updatedPost, userId);
    }

    @Override
    public void deletePost(String id, String userId) {
        SkillPost post = skillPostRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SkillPost", "id", id));
        
        // Check ownership
        if (!post.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this post");
        }
        
        skillPostRepository.delete(post);
    }

    @Override
    @Transactional
    public void deleteMultiplePosts(List<String> ids, String userId) {
        // Verify ownership of all posts first
        List<SkillPost> postsToDelete = skillPostRepository.findAllById(ids);
        
        // Check if all posts exist
        if (postsToDelete.size() != ids.size()) {
            List<String> foundIds = postsToDelete.stream()
                    .map(SkillPost::getId)
                    .collect(Collectors.toList());
            List<String> missingIds = ids.stream()
                    .filter(id -> !foundIds.contains(id))
                    .collect(Collectors.toList());
            
            throw new BatchOperationException("Some posts were not found", missingIds);
        }
        
        // Check ownership of all posts
        List<String> unauthorizedIds = postsToDelete.stream()
                .filter(post -> !post.getUserId().equals(userId))
                .map(SkillPost::getId)
                .collect(Collectors.toList());
        
        if (!unauthorizedIds.isEmpty()) {
            throw new BatchOperationException("You are not authorized to delete some posts", unauthorizedIds);
        }
        
        // Delete all posts
        skillPostRepository.deleteByIdInAndUserId(ids, userId);
    }

    @Override
    public Page<SkillPostDto.Response> getAllPosts(Pageable pageable, String currentUserId) {
        Page<SkillPost> posts = skillPostRepository.findAll(pageable);
        return mapPostsToResponsePage(posts, currentUserId);
    }

    @Override
    public Page<SkillPostDto.Response> getPostsByUser(String userId, Pageable pageable, String currentUserId) {
        Page<SkillPost> posts = skillPostRepository.findByUserId(userId, pageable);
        return mapPostsToResponsePage(posts, currentUserId);
    }

    @Override
    public Page<SkillPostDto.Response> getPostsByTag(String tag, Pageable pageable, String currentUserId) {
        Page<SkillPost> posts = skillPostRepository.findByTagsContaining(tag, pageable);
        return mapPostsToResponsePage(posts, currentUserId);
    }

    @Override
    public Page<SkillPostDto.Response> getPostsByTags(List<String> tags, Pageable pageable, String currentUserId) {
        Page<SkillPost> posts = skillPostRepository.findByTagsIn(tags, pageable);
        return mapPostsToResponsePage(posts, currentUserId);
    }

    @Override
    public Page<SkillPostDto.Response> searchPostsByKeyword(String keyword, Pageable pageable, String currentUserId) {
        Page<SkillPost> posts = skillPostRepository.findByTitleOrDescriptionContainingIgnoreCase(keyword, pageable);
        return mapPostsToResponsePage(posts, currentUserId);
    }

    @Override
    public Page<SkillPostDto.Response> getTrendingPosts(Pageable pageable, String currentUserId) {
        // Get all posts and sort them by a trending score
        // Trending score = likes + (comments * 2) + recency factor
        
        List<SkillPost> allPosts = skillPostRepository.findAll();
        
        // Calculate a trending score for each post
        LocalDateTime now = LocalDateTime.now();
        List<Map.Entry<SkillPost, Double>> postsWithScores = allPosts.stream()
                .map(post -> {
                    // Calculate recency factor (1.0 for new posts, decreasing to 0.1 for older posts)
                    double daysOld = java.time.Duration.between(post.getCreatedAt(), now).toDays();
                    double recencyFactor = Math.max(0.1, 1.0 - (daysOld / 30.0)); // 30 days to decay to 0.1
                    
                    // Calculate trending score
                    double score = post.getLikes() + 
                                  (post.getComments().size() * 2) + 
                                  (recencyFactor * 10);
                    
                    return new AbstractMap.SimpleEntry<>(post, score);
                })
                .sorted(Map.Entry.<SkillPost, Double>comparingByValue().reversed())
                .collect(Collectors.toList());
        
        // Apply pagination manually
        int start = (int) pageable.getOffset();
        int end = Math.min((start + pageable.getPageSize()), postsWithScores.size());
        
        if (start >= postsWithScores.size()) {
            return new PageImpl<>(Collections.emptyList(), pageable, postsWithScores.size());
        }
        
        List<SkillPost> pagedPosts = postsWithScores.subList(start, end).stream()
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
        
        // Convert to DTOs
        List<SkillPostDto.Response> responses = pagedPosts.stream()
                .map(post -> SkillPostDto.Response.fromSkillPost(post, currentUserId))
                .collect(Collectors.toList());
        
        return new PageImpl<>(responses, pageable, postsWithScores.size());
    }

    @Override
    public SkillPostDto.Response toggleLike(String postId, String userId) {
        SkillPost post = skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillPost", "id", postId));
        
        // Toggle like status
        if (post.getLikedBy().contains(userId)) {
            post.getLikedBy().remove(userId);
            post.setLikes(post.getLikes() - 1);
        } else {
            post.getLikedBy().add(userId);
            post.setLikes(post.getLikes() + 1);
            
            // Create a notification for the post owner when their post is liked
            // Only if the liker is not the post owner
            if (!post.getUserId().equals(userId)) {
                try {
                    // Get the user's name from the session or user object
                    String likerName = getUserName(userId);
                    
                    notificationService.createLikeNotification(
                        post.getUserId(),       // Post owner receives the notification
                        userId,                 // User who liked the post
                        likerName,              // Now using actual username instead of "A user"
                        postId,                 // The post that was liked
                        post.getTitle()         // Title of the post
                    );
                    
                    System.out.println("Created like notification: User " + userId + " (" + likerName + ") liked post " + postId + " owned by " + post.getUserId());
                } catch (Exception e) {
                    // Log the error but don't fail the like operation
                    System.err.println("Error creating notification: " + e.getMessage());
                    e.printStackTrace();
                }
            }
        }
        
        SkillPost updatedPost = skillPostRepository.save(post);
        return SkillPostDto.Response.fromSkillPost(updatedPost, userId);
    }

    @Override
    public SkillPostDto.Response addComment(String postId, SkillPostDto.CommentRequest request, String userId, String userName) {
        SkillPost post = skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillPost", "id", postId));
        
        Comment comment = new Comment();
        comment.setId(UUID.randomUUID().toString());
        comment.setUserId(userId);
        comment.setUserName(userName);
        comment.setContent(request.getContent());
        
        LocalDateTime now = LocalDateTime.now();
        comment.setCreatedAt(now);
        comment.setUpdatedAt(now);
        
        // If this is a reply to another comment, set the parent ID
        if (request.getParentCommentId() != null && !request.getParentCommentId().isEmpty()) {
            return replyToComment(postId, request.getParentCommentId(), request, userId, userName);
        }
        
        post.getComments().add(comment);
        SkillPost updatedPost = skillPostRepository.save(post);
        
        // Create a notification for the post owner when someone comments on their post
        // Only if the commenter is not the post owner
        if (!post.getUserId().equals(userId)) {
            notificationService.createCommentNotification(
                post.getUserId(),       // Post owner receives the notification
                userId,                 // User who commented
                userName,               // Name of the commenter
                postId,                 // The post that was commented on
                post.getTitle(),        // Title of the post
                comment.getId(),        // ID of the comment
                comment.getContent()    // Content of the comment
            );
        }
        
        return SkillPostDto.Response.fromSkillPost(updatedPost, userId);
    }
    
    @Override
    public SkillPostDto.Response replyToComment(String postId, String parentCommentId, 
                                           SkillPostDto.CommentRequest request, 
                                           String userId, String userName) {
        SkillPost post = skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillPost", "id", postId));
        
        // Find the parent comment
        Optional<Comment> parentCommentOpt = findCommentById(post.getComments(), parentCommentId);
        
        if (parentCommentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Comment", "id", parentCommentId);
        }
        
        Comment parentComment = parentCommentOpt.get();
        
        // Create the reply comment
        Comment reply = new Comment();
        reply.setId(UUID.randomUUID().toString());
        reply.setUserId(userId);
        reply.setUserName(userName);
        reply.setContent(request.getContent());
        reply.setParentCommentId(parentCommentId);
        
        LocalDateTime now = LocalDateTime.now();
        reply.setCreatedAt(now);
        reply.setUpdatedAt(now);
        
        // Add the reply to the parent comment's replies list
        if (parentComment.getReplies() == null) {
            parentComment.setReplies(new ArrayList<>());
        }
        parentComment.getReplies().add(reply);
        
        // Save the updated post
        SkillPost updatedPost = skillPostRepository.save(post);
        
        // Create a notification for the parent comment owner
        // Only if the replier is not the comment owner
        if (!parentComment.getUserId().equals(userId)) {
            notificationService.createCommentReplyNotification(
                parentComment.getUserId(),  // Comment owner receives the notification
                userId,                     // User who replied
                userName,                   // Name of the replier
                postId,                     // The post containing the comment
                post.getTitle(),            // Title of the post
                parentCommentId,            // ID of the parent comment
                reply.getId(),              // ID of the reply comment
                reply.getContent()          // Content of the reply
            );
        }
        
        // Also notify the post owner if they're different from the parent comment owner
        // and different from the replier
        if (!post.getUserId().equals(parentComment.getUserId()) && 
            !post.getUserId().equals(userId)) {
            notificationService.createCommentNotification(
                post.getUserId(),        // Post owner receives the notification
                userId,                  // User who replied
                userName,                // Name of the replier
                postId,                  // The post ID
                post.getTitle(),         // Title of the post
                reply.getId(),           // ID of the reply
                reply.getContent()       // Content of the reply
            );
        }
        
        return SkillPostDto.Response.fromSkillPost(updatedPost, userId);
    }
    
    // Helper method to find a comment by ID (including in nested replies)
    private Optional<Comment> findCommentById(List<Comment> comments, String commentId) {
        if (comments == null || comments.isEmpty()) {
            return Optional.empty();
        }
        
        // First, check the top-level comments
        for (Comment comment : comments) {
            if (comment.getId().equals(commentId)) {
                return Optional.of(comment);
            }
            
            // If not found, recursively check in replies
            if (comment.getReplies() != null && !comment.getReplies().isEmpty()) {
                Optional<Comment> found = findCommentById(comment.getReplies(), commentId);
                if (found.isPresent()) {
                    return found;
                }
            }
        }
        
        return Optional.empty();
    }

    @Override
    public SkillPostDto.Response updateComment(String postId, String commentId, SkillPostDto.CommentRequest request, String userId) {
        SkillPost post = skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillPost", "id", postId));
        
        // Find the comment
        Optional<Comment> commentOpt = post.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst();
        
        if (commentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Comment", "id", commentId);
        }
        
        Comment comment = commentOpt.get();
        
        // Check ownership
        if (!comment.getUserId().equals(userId) && !post.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to update this comment");
        }
        
        comment.setContent(request.getContent());
        comment.setUpdatedAt(LocalDateTime.now());
        
        SkillPost updatedPost = skillPostRepository.save(post);
        return SkillPostDto.Response.fromSkillPost(updatedPost, userId);
    }

    @Override
    public SkillPostDto.Response deleteComment(String postId, String commentId, String userId) {
        SkillPost post = skillPostRepository.findById(postId)
                .orElseThrow(() -> new ResourceNotFoundException("SkillPost", "id", postId));
        
        // Find the comment
        Optional<Comment> commentOpt = post.getComments().stream()
                .filter(c -> c.getId().equals(commentId))
                .findFirst();
        
        if (commentOpt.isEmpty()) {
            throw new ResourceNotFoundException("Comment", "id", commentId);
        }
        
        Comment comment = commentOpt.get();
        
        // Check ownership (comment author or post owner can delete)
        if (!comment.getUserId().equals(userId) && !post.getUserId().equals(userId)) {
            throw new UnauthorizedException("You are not authorized to delete this comment");
        }
        
        post.getComments().removeIf(c -> c.getId().equals(commentId));
        SkillPost updatedPost = skillPostRepository.save(post);
        
        return SkillPostDto.Response.fromSkillPost(updatedPost, userId);
    }
    
    // Helper method to map Page<SkillPost> to Page<SkillPostDto.Response>
    private Page<SkillPostDto.Response> mapPostsToResponsePage(Page<SkillPost> postPage, String currentUserId) {
        List<SkillPostDto.Response> responses = postPage.getContent().stream()
                .map(post -> SkillPostDto.Response.fromSkillPost(post, currentUserId))
                .collect(Collectors.toList());
        
        return new PageImpl<>(responses, postPage.getPageable(), postPage.getTotalElements());
    }

    @Override
    public List<String> getAllUniqueTags() {
        // Get all skill posts
        List<SkillPost> allPosts = skillPostRepository.findAll();
        
        // Extract all tags and collect them into a set to ensure uniqueness
        Set<String> uniqueTags = new HashSet<>();
        
        System.out.println("Collecting tags from " + allPosts.size() + " posts");
        for (SkillPost post : allPosts) {
            if (post.getTags() != null && !post.getTags().isEmpty()) {
                uniqueTags.addAll(post.getTags());
            }
        }
        
        // Convert to a sorted list
        List<String> sortedTags = new ArrayList<>(uniqueTags);
        Collections.sort(sortedTags);
        
        System.out.println("Found " + sortedTags.size() + " unique tags");
        return sortedTags;
    }

    // Helper method to get user name
    private String getUserName(String userId) {
        try {
            // Try to find a post by this user to get their name
            List<SkillPost> userPosts = skillPostRepository.findByUserId(userId);
            if (!userPosts.isEmpty()) {
                String userName = userPosts.get(0).getUserName();
                if (userName != null && !userName.isEmpty()) {
                    return userName;
                }
            }
            
            // Fallback to default name if user has no posts or no name set
            return "User";
        } catch (Exception e) {
            System.err.println("Error getting user name: " + e.getMessage());
            return "User";
        }
    }
} 