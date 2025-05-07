package com.paf.knowledgenest.controller.socialFeature;

import com.paf.knowledgenest.dto.requests.ProgressRequestDTO;
import com.paf.knowledgenest.dto.responses.skillPost.FollowerFollowingDTO;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.service.socialFeature.SocialService;
import com.paf.knowledgenest.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/social")

public class SocialFeatureController {

    private final SocialService socialService;

    @Autowired
    public SocialFeatureController(SocialService socialService) {
        this.socialService = socialService;
    }

    @PostMapping("/follow")
    public ResponseEntity<ApiResponse<Boolean>> followUser(@RequestBody ProgressRequestDTO.FollowerRequestDTO followerRequestDTO) {
        ApiResponse<Boolean> response = socialService.followUser(followerRequestDTO);
        if(response.isSuccess()){
            return ResponseEntity.ok(response);
        }else{
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/unfollow")
    public ResponseEntity<ApiResponse<Boolean>> unfollowUser(@RequestBody ProgressRequestDTO.FollowerRequestDTO dto) {
        return ResponseEntity.ok(socialService.unfollowUser(dto));
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


}
