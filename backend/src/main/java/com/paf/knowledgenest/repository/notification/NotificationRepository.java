package com.paf.knowledgenest.repository.notification;

import com.paf.knowledgenest.model.notification.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
    
    // Find notifications for a specific user
    List<Notification> findByUserId(String userId);
    
    // Find notifications with pagination
    Page<Notification> findByUserId(String userId, Pageable pageable);
    
    // Find unread notifications for a user
    List<Notification> findByUserIdAndReadFalse(String userId);
    
    // Count unread notifications for a user
    long countByUserIdAndReadFalse(String userId);
    
    // Find notifications for a specific resource
    List<Notification> findByResourceIdAndResourceType(String resourceId, String resourceType);
} 