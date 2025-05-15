package com.paf.knowledgenest.controller.socialFeature;

import com.paf.knowledgenest.dto.requests.FollowerRequestDTO;
import com.paf.knowledgenest.dto.requests.ProgressRequestDTO;
import com.paf.knowledgenest.dto.responses.skillPost.FollowerFollowingDTO;
import com.paf.knowledgenest.model.notification.Notification;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.service.notification.NotificationService;
import com.paf.knowledgenest.service.socialFeature.SocialService;
import com.paf.knowledgenest.service.user.AuthService;
import com.paf.knowledgenest.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@Slf4j
@RestController
@RequestMapping("/api/social")

public class SocialFeatureController {

    private final SocialService socialService;
    private final AuthService authService;
    private final NotificationService notificationService;

    @Autowired
    public SocialFeatureController(SocialService socialService, AuthService authService, NotificationService notificationService) {
        this.authService = authService;
        this.socialService = socialService;
        this.notificationService = notificationService;
    }

    @PostMapping("/follow")
    public ResponseEntity<ApiResponse<Boolean>> followUser(@RequestBody FollowerRequestDTO followerRequestDTO) {

        ApiResponse<Boolean> response = socialService.followUser(followerRequestDTO);
        if(response.isSuccess()){
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/unfollow")
    public ResponseEntity<ApiResponse<Boolean>> unfollowUser(@RequestBody FollowerRequestDTO dto) {

        ApiResponse<Boolean> success = socialService.unfollowUser(dto);
        return ResponseEntity.ok(success);
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<ApiResponse<List<User>>> getFollowingUsers(@PathVariable String userId) {
        return ResponseEntity.ok(socialService.getFollowingUsers(userId));
    }


    @GetMapping("/user/followers/{userId}")
    public ResponseEntity<ApiResponse<FollowerFollowingDTO>> getFollowerFollowingUsers(@PathVariable String userId) {
        log.info("getFollowerFollowingUsers called");
        return ResponseEntity.ok(socialService.getFollowersAndFolowingUsers(userId));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Boolean>> deleteUser(@PathVariable String userId) {
        return ResponseEntity.ok(socialService.deleteUser(userId));
    }

    @GetMapping("/isFollowing")
    public ResponseEntity<ApiResponse<Boolean>> isFollowing(
            @RequestParam String followerId,
            @RequestParam String followeeId) {
        try {
            boolean isFollowing = socialService.isUserFollowing(followerId, followeeId);
            return ResponseEntity.ok(ApiResponse.successResponse("Check successful", isFollowing));
        } catch (Exception e) {
            log.error(e.getMessage());
            return ResponseEntity.status(500).body(ApiResponse.errorResponse("An unexpected error occurred. Please try again later."));
        }
    }

}
