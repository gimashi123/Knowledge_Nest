package com.paf.knowledgenest.controller.notification;

import com.paf.knowledgenest.dto.notification.NotificationDto;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.service.notification.NotificationService;
import com.paf.knowledgenest.service.user.AuthService;
import com.paf.knowledgenest.utils.ApiResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;
    private final AuthService authService;
    
    // Explicit constructor injection instead of using Lombok
    public NotificationController(NotificationService notificationService, AuthService authService) {
        this.notificationService = notificationService;
        this.authService = authService;
    }

    @GetMapping
    public ResponseEntity<?> getNotifications(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {
        
        try {
            String userEmail = authentication.getName();
            System.out.println("Fetching notifications for user: " + userEmail + ", page: " + page + ", size: " + size);

            Optional<User> user = authService.getUserByEmail(userEmail);
            if (user.isEmpty()) {
                return ResponseEntity.badRequest().body(ApiResponse.errorResponse("User not found"));
            }

            Sort.Direction sortDirection = direction.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
            Pageable pageable = PageRequest.of(page, size, Sort.by(sortDirection, sortBy));
            
            Page<NotificationDto.Response> notifications = notificationService.getNotificationsForUser(user.get().getId(), pageable);
            System.out.println("Found " + notifications.getTotalElements() + " notifications total, " + notifications.getNumberOfElements() + " on this page");
            
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            System.err.println("Error fetching notifications: " + e.getMessage());
            e.printStackTrace();
            
            // Return empty page if there's an error
            Page<NotificationDto.Response> emptyPage = new PageImpl<>(Collections.emptyList());
            return ResponseEntity.ok(emptyPage);
        }
    }

    @GetMapping("/unread")
    public ResponseEntity<?> getUnreadNotifications(Authentication authentication) {
        try {
            String userId = authentication.getName();
            System.out.println("Fetching unread notifications for user: " + userId);
            
            List<NotificationDto.Response> notifications = notificationService.getUnreadNotificationsForUser(userId);
            System.out.println("Found " + notifications.size() + " unread notifications");
            
            return ResponseEntity.ok(notifications);
        } catch (Exception e) {
            System.err.println("Error fetching unread notifications: " + e.getMessage());
            e.printStackTrace();
            
            // Return empty list if there's an error
            return ResponseEntity.ok(new ArrayList<NotificationDto.Response>());
        }
    }

    @GetMapping("/count")
    public ResponseEntity<?> getUnreadCount(Authentication authentication) {
        try {
            String userId = authentication.getName();
            System.out.println("Fetching unread notification count for user: " + userId);
            
            NotificationDto.CountResponse countResponse = notificationService.getUnreadNotificationCount(userId);
            System.out.println("Unread count for user " + userId + ": " + countResponse.getUnreadCount());
            
            return ResponseEntity.ok(countResponse);
        } catch (Exception e) {
            System.err.println("Error fetching unread count: " + e.getMessage());
            e.printStackTrace();
            
            // Return zero count if there's an error
            return ResponseEntity.ok(new NotificationDto.CountResponse(0));
        }
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markAsRead(
            @PathVariable String id,
            Authentication authentication) {
        
        try {
            NotificationDto.Response notification = notificationService.markNotificationAsRead(id);
            return ResponseEntity.ok(notification);
        } catch (Exception e) {
            System.err.println("Error marking notification as read: " + e.getMessage());
            
            ApiResponse response = new ApiResponse();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PatchMapping("/read-all")
    public ResponseEntity<ApiResponse> markAllAsRead(Authentication authentication) {
        try {
            String userId = authentication.getName();
            notificationService.markAllNotificationsAsRead(userId);
            
            ApiResponse response = new ApiResponse();
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            System.err.println("Error marking all notifications as read: " + e.getMessage());

            ApiResponse response = new ApiResponse();
            return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
//delete follow notification-----
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Boolean>> deleteNotification(@PathVariable String id) {

        ApiResponse<Boolean> response = notificationService.deleteNotification(id);

        return response.isSuccess()
                ? ResponseEntity.ok(response)
                : ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);

    }
} 