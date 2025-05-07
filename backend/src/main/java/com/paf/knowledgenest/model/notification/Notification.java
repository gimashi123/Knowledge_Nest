package com.paf.knowledgenest.model.notification;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Data
@Document(collection = "notifications")
public class Notification {
    
    @Id
    private String id;
    
    // User who will receive this notification
    private String userId;
    
    // User who triggered the action
    private String actorId;
    private String actorName;
    
    // Type of notification: LIKE, COMMENT, REPLY, etc.
    private NotificationType type;
    
    // Content of the notification
    private String message;
    
    // Link to the relevant resource
    private String resourceId; // Usually a skill post id
    private String resourceType; // Type of resource (SKILL_POST)
    
    // Status
    private boolean read;
    private LocalDateTime createdAt;
    
    // Optional specific data
    private String commentId;
    
    public enum NotificationType {
        LIKE,
        COMMENT,
        COMMENT_REPLY,
        SYSTEM_NOTIFICATION
    }
    
    public enum ResourceType {
        SKILL_POST
    }
} 