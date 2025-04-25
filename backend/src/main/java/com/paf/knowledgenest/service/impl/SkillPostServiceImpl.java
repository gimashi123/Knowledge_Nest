package com.paf.knowledgenest.service.impl;

import com.paf.knowledgenest.dto.SkillPostDto;
import com.paf.knowledgenest.exception.SkillPostException;
import com.paf.knowledgenest.model.SkillPost;
import com.paf.knowledgenest.repository.SkillPostRepository;
import com.paf.knowledgenest.service.SkillPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SkillPostServiceImpl implements SkillPostService {

    private final SkillPostRepository skillPostRepository;

    @Override
    public SkillPostDto.Response createSkillPost(SkillPostDto.Request request, String userId, String userName) {
        LocalDateTime now = LocalDateTime.now();
        
        SkillPost skillPost = SkillPost.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .content(request.getContent())
                .userId(userId)
                .userName(userName)
                .tags(request.getTags())
                .createdAt(now)
                .updatedAt(now)
                .likes(0)
                .likedBy(new ArrayList<>())
                .comments(new ArrayList<>())
                .build();
        
        SkillPost savedPost = skillPostRepository.save(skillPost);
        return mapToResponseDto(savedPost);
    }

    @Override
    public SkillPostDto.Response getSkillPostById(String id) {
        SkillPost skillPost = skillPostRepository.findById(id)
                .orElseThrow(() -> new SkillPostException.NotFoundException(id));
        
        return mapToResponseDto(skillPost);
    }

    @Override
    public List<SkillPostDto.Response> getAllSkillPosts() {
        return skillPostRepository.findAll().stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SkillPostDto.Response> getSkillPostsByUser(String userId) {
        return skillPostRepository.findByUserId(userId).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SkillPostDto.Response> getSkillPostsByTag(String tag) {
        return skillPostRepository.findByTagsContaining(tag).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<SkillPostDto.Response> searchSkillPosts(String keyword) {
        return skillPostRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    public SkillPostDto.Response updateSkillPost(String id, SkillPostDto.Request request, String userId) {
        SkillPost skillPost = skillPostRepository.findById(id)
                .orElseThrow(() -> new SkillPostException.NotFoundException(id));
        
        if (!skillPost.getUserId().equals(userId)) {
            throw new SkillPostException.UnauthorizedException();
        }
        
        skillPost.setTitle(request.getTitle());
        skillPost.setDescription(request.getDescription());
        skillPost.setContent(request.getContent());
        skillPost.setTags(request.getTags());
        skillPost.setUpdatedAt(LocalDateTime.now());
        
        SkillPost updatedPost = skillPostRepository.save(skillPost);
        return mapToResponseDto(updatedPost);
    }

    @Override
    public void deleteSkillPost(String id, String userId) {
        SkillPost skillPost = skillPostRepository.findById(id)
                .orElseThrow(() -> new SkillPostException.NotFoundException(id));
        
        if (!skillPost.getUserId().equals(userId)) {
            throw new SkillPostException.UnauthorizedException();
        }
        
        skillPostRepository.delete(skillPost);
    }

    @Override
    public SkillPostDto.Response addComment(String postId, SkillPostDto.CommentRequest request, String userId, String userName) {
        SkillPost skillPost = skillPostRepository.findById(postId)
                .orElseThrow(() -> new SkillPostException.NotFoundException(postId));
        
        SkillPost.Comment comment = SkillPost.Comment.builder()
                .id(UUID.randomUUID().toString())
                .userId(userId)
                .userName(userName)
                .content(request.getContent())
                .createdAt(LocalDateTime.now())
                .build();
        
        if (skillPost.getComments() == null) {
            skillPost.setComments(new ArrayList<>());
        }
        
        skillPost.getComments().add(comment);
        SkillPost updatedPost = skillPostRepository.save(skillPost);
        
        return mapToResponseDto(updatedPost);
    }

    @Override
    public SkillPostDto.Response likeSkillPost(String postId, String userId) {
        SkillPost skillPost = skillPostRepository.findById(postId)
                .orElseThrow(() -> new SkillPostException.NotFoundException(postId));
        
        if (skillPost.getLikedBy() == null) {
            skillPost.setLikedBy(new ArrayList<>());
        }
        
        if (skillPost.getLikedBy().contains(userId)) {
            // Unlike the post
            skillPost.getLikedBy().remove(userId);
            skillPost.setLikes(skillPost.getLikes() - 1);
        } else {
            // Like the post
            skillPost.getLikedBy().add(userId);
            skillPost.setLikes(skillPost.getLikes() + 1);
        }
        
        SkillPost updatedPost = skillPostRepository.save(skillPost);
        return mapToResponseDto(updatedPost);
    }
    
    private SkillPostDto.Response mapToResponseDto(SkillPost skillPost) {
        List<SkillPostDto.CommentDto> commentDtos = skillPost.getComments() != null
                ? skillPost.getComments().stream()
                    .map(comment -> SkillPostDto.CommentDto.builder()
                            .id(comment.getId())
                            .userId(comment.getUserId())
                            .userName(comment.getUserName())
                            .content(comment.getContent())
                            .createdAt(comment.getCreatedAt())
                            .build())
                    .collect(Collectors.toList())
                : new ArrayList<>();
        
        return SkillPostDto.Response.builder()
                .id(skillPost.getId())
                .title(skillPost.getTitle())
                .description(skillPost.getDescription())
                .content(skillPost.getContent())
                .userId(skillPost.getUserId())
                .userName(skillPost.getUserName())
                .tags(skillPost.getTags())
                .createdAt(skillPost.getCreatedAt())
                .updatedAt(skillPost.getUpdatedAt())
                .likes(skillPost.getLikes())
                .comments(commentDtos)
                .build();
    }
} 