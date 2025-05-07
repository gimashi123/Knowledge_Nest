package com.paf.knowledgenest.dto.notification;

import com.paf.knowledgenest.model.notification.Notification;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class NotificationDto {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Response {
        private String id;
        private String userId;
        private String actorId;
        private String actorName;
        private String type;
        private String message;
        private String resourceId;
        private String resourceType;
        private boolean read;
        private LocalDateTime createdAt;
        private String commentId;
        
        public static Response fromNotification(Notification notification) {
            Response response = new Response();
            response.setId(notification.getId());
            response.setUserId(notification.getUserId());
            response.setActorId(notification.getActorId());
            response.setActorName(notification.getActorName());
            response.setType(notification.getType().name());
            response.setMessage(notification.getMessage());
            response.setResourceId(notification.getResourceId());
            response.setResourceType(notification.getResourceType());
            response.setRead(notification.isRead());
            response.setCreatedAt(notification.getCreatedAt());
            response.setCommentId(notification.getCommentId());
            return response;
        }
        
        public static List<Response> fromNotifications(List<Notification> notifications) {
            return notifications.stream()
                .map(Response::fromNotification)
                .collect(Collectors.toList());
        }
    }
    
    // Using Lombok to avoid manual constructor duplication
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class CountResponse {
        private long unreadCount;
    }
} 