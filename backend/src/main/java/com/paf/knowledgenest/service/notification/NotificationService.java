package com.paf.knowledgenest.service.notification;

import com.paf.knowledgenest.dto.notification.NotificationDto;
import com.paf.knowledgenest.model.notification.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NotificationService {
    
    // Create a notification
    NotificationDto.Response createNotification(
        String userId,         // Receiver 
        String actorId,        // Actor who triggered the notification
        String actorName,      // Actor name
        Notification.NotificationType type,
        String message,
        String resourceId,     // Related resource ID
        String resourceType,   // Type of resource
        String commentId       // Optional comment ID
    );
    
    // Get notifications for a user
    List<NotificationDto.Response> getNotificationsForUser(String userId);
    
    // Get notifications with pagination
    Page<NotificationDto.Response> getNotificationsForUser(String userId, Pageable pageable);
    
    // Get unread notifications for a user
    List<NotificationDto.Response> getUnreadNotificationsForUser(String userId);
    
    // Mark a notification as read
    NotificationDto.Response markNotificationAsRead(String notificationId);
    
    // Mark all notifications as read for a user
    void markAllNotificationsAsRead(String userId);
    
    // Delete a notification
    void deleteNotification(String notificationId);
    
    // Get unread notification count
    NotificationDto.CountResponse getUnreadNotificationCount(String userId);
    
    // Create a like notification
    NotificationDto.Response createLikeNotification(
        String postOwnerId, 
        String likerId, 
        String likerName, 
        String postId,
        String postTitle
    );
    
    // Create a comment notification
    NotificationDto.Response createCommentNotification(
        String postOwnerId, 
        String commenterId, 
        String commenterName, 
        String postId,
        String postTitle,
        String commentId,
        String commentContent
    );
    
    // Create a comment reply notification
    NotificationDto.Response createCommentReplyNotification(
        String commentOwnerId,
        String replierId,
        String replierName,
        String postId,
        String postTitle,
        String parentCommentId,
        String replyCommentId,
        String replyContent
    );
} 