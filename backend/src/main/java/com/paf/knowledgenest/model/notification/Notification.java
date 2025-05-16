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

    // Content of the notification
    private String message;

    // Type of notification: LIKE, COMMENT, REPLY, etc.
    private NotificationType type;
    
    // User who triggered the action
    private String actorId;
    private String actorName;

    // Status
    private boolean read = false;
    private LocalDateTime createdAt;
    

    //-----------------------------------------------
    
    // Link to the relevant resource
    private String resourceId; // Usually a skill post id
    private String resourceType; // Type of resource (SKILL_POST)

    // Optional specific data
    private String commentId;
    
    public enum NotificationType {
        LIKE,
        COMMENT,
        COMMENT_REPLY,
        SYSTEM_NOTIFICATION,
        FOLLOW,
        UNFOLLOW,
    }
} 