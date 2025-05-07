package com.paf.knowledgenest.service.notification;

import com.paf.knowledgenest.dto.notification.NotificationDto;
import com.paf.knowledgenest.exception.ResourceNotFoundException;
import com.paf.knowledgenest.model.notification.Notification;
import com.paf.knowledgenest.repository.notification.NotificationRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    
    // Explicit constructor injection instead of using Lombok
    public NotificationServiceImpl(NotificationRepository notificationRepository) {
        this.notificationRepository = notificationRepository;
    }

    @Override
    public NotificationDto.Response createNotification(
            String userId, 
            String actorId, 
            String actorName, 
            Notification.NotificationType type, 
            String message, 
            String resourceId, 
            String resourceType, 
            String commentId) {
        
        // Don't create self-notifications
        if (userId.equals(actorId)) {
            return null;
        }
        
        Notification notification = new Notification();
        notification.setId(UUID.randomUUID().toString());
        notification.setUserId(userId);
        notification.setActorId(actorId);
        notification.setActorName(actorName);
        notification.setType(type);
        notification.setMessage(message);
        notification.setResourceId(resourceId);
        notification.setResourceType(resourceType);
        notification.setCommentId(commentId);
        notification.setRead(false);
        notification.setCreatedAt(LocalDateTime.now());
        
        Notification savedNotification = notificationRepository.save(notification);
        return NotificationDto.Response.fromNotification(savedNotification);
    }

    @Override
    public List<NotificationDto.Response> getNotificationsForUser(String userId) {
        List<Notification> notifications = notificationRepository.findByUserId(userId);
        return NotificationDto.Response.fromNotifications(notifications);
    }

    @Override
    public Page<NotificationDto.Response> getNotificationsForUser(String userId, Pageable pageable) {
        try {
            System.out.println("NotificationService: Getting notifications for user: " + userId);
            
            if (userId == null || userId.isEmpty()) {
                System.err.println("NotificationService: User ID is null or empty");
                return new PageImpl<>(Collections.emptyList(), pageable, 0);
            }
            
            Page<Notification> notificationsPage = notificationRepository.findByUserId(userId, pageable);
            System.out.println("NotificationService: Found " + notificationsPage.getTotalElements() + " notifications");
            
            List<NotificationDto.Response> notificationResponses = notificationsPage.getContent().stream()
                    .map(notification -> {
                        try {
                            return NotificationDto.Response.fromNotification(notification);
                        } catch (Exception e) {
                            System.err.println("NotificationService: Error mapping notification: " + e.getMessage());
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
            
            return new PageImpl<>(notificationResponses, pageable, notificationsPage.getTotalElements());
        } catch (Exception e) {
            System.err.println("NotificationService: Error getting notifications for user: " + userId + ", error: " + e.getMessage());
            e.printStackTrace();
            return new PageImpl<>(Collections.emptyList(), pageable, 0);
        }
    }

    @Override
    public List<NotificationDto.Response> getUnreadNotificationsForUser(String userId) {
        try {
            System.out.println("NotificationService: Getting unread notifications for user: " + userId);
            
            if (userId == null || userId.isEmpty()) {
                System.err.println("NotificationService: User ID is null or empty");
                return Collections.emptyList();
            }
            
            List<Notification> notifications = notificationRepository.findByUserIdAndReadFalse(userId);
            System.out.println("NotificationService: Found " + notifications.size() + " unread notifications");
            
            return notifications.stream()
                    .map(notification -> {
                        try {
                            return NotificationDto.Response.fromNotification(notification);
                        } catch (Exception e) {
                            System.err.println("NotificationService: Error mapping notification: " + e.getMessage());
                            e.printStackTrace();
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            System.err.println("NotificationService: Error getting unread notifications for user: " + userId + ", error: " + e.getMessage());
            e.printStackTrace();
            return Collections.emptyList();
        }
    }

    @Override
    public NotificationDto.Response markNotificationAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new ResourceNotFoundException("Notification", "id", notificationId));
        
        notification.setRead(true);
        Notification updatedNotification = notificationRepository.save(notification);
        
        return NotificationDto.Response.fromNotification(updatedNotification);
    }

    @Override
    public void markAllNotificationsAsRead(String userId) {
        List<Notification> unreadNotifications = notificationRepository.findByUserIdAndReadFalse(userId);
        
        unreadNotifications.forEach(notification -> notification.setRead(true));
        
        notificationRepository.saveAll(unreadNotifications);
    }

    @Override
    public void deleteNotification(String notificationId) {
        notificationRepository.deleteById(notificationId);
    }

    @Override
    public NotificationDto.CountResponse getUnreadNotificationCount(String userId) {
        try {
            System.out.println("NotificationService: Getting unread count for user: " + userId);
            
            if (userId == null || userId.isEmpty()) {
                System.err.println("NotificationService: User ID is null or empty");
                return new NotificationDto.CountResponse(0);
            }
            
            long count = notificationRepository.countByUserIdAndReadFalse(userId);
            System.out.println("NotificationService: Found " + count + " unread notifications");
            
            return new NotificationDto.CountResponse(count);
        } catch (Exception e) {
            System.err.println("NotificationService: Error getting unread count for user: " + userId + ", error: " + e.getMessage());
            e.printStackTrace();
            return new NotificationDto.CountResponse(0);
        }
    }

    @Override
    public NotificationDto.Response createLikeNotification(
            String postOwnerId, 
            String likerId, 
            String likerName, 
            String postId, 
            String postTitle) {
        
        String message = likerName + " liked your post: " + postTitle;
        
        return createNotification(
                postOwnerId,
                likerId,
                likerName,
                Notification.NotificationType.LIKE,
                message,
                postId,
                "SKILL_POST",
                null
        );
    }

    @Override
    public NotificationDto.Response createCommentNotification(
            String postOwnerId, 
            String commenterId, 
            String commenterName, 
            String postId, 
            String postTitle, 
            String commentId, 
            String commentContent) {
        
        // Truncate comment content if it's too long for notification
        String truncatedComment = commentContent.length() > 50 
                ? commentContent.substring(0, 47) + "..." 
                : commentContent;
        
        String message = commenterName + " commented on your post: \"" + truncatedComment + "\"";
        
        return createNotification(
                postOwnerId,
                commenterId,
                commenterName,
                Notification.NotificationType.COMMENT,
                message,
                postId,
                "SKILL_POST",
                commentId
        );
    }

    @Override
    public NotificationDto.Response createCommentReplyNotification(
            String commentOwnerId,
            String replierId,
            String replierName,
            String postId,
            String postTitle,
            String parentCommentId,
            String replyCommentId,
            String replyContent) {
        
        // Truncate reply content if it's too long for notification
        String truncatedReply = replyContent.length() > 50 
                ? replyContent.substring(0, 47) + "..." 
                : replyContent;
        
        String message = replierName + " replied to your comment on \"" + postTitle + "\": \"" + truncatedReply + "\"";
        
        return createNotification(
                commentOwnerId,
                replierId,
                replierName,
                Notification.NotificationType.COMMENT_REPLY,
                message,
                postId,
                "SKILL_POST",
                replyCommentId
        );
    }
} 