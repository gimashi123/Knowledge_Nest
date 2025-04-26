package com.paf.knowledgenest.controller.socialFeature;

import com.paf.knowledgenest.dto.request.FollowerRequestDTO;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.service.socialFeature.SocialService;
import com.paf.knowledgenest.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social")

public class SocialFeatureController {

    private final SocialService socialService;

    @Autowired
    public SocialFeatureController(SocialService socialService) {
        this.socialService = socialService;
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
        return ResponseEntity.ok(socialService.unfollowUser(dto));
    }

    @GetMapping("/following/{userId}")
    public ResponseEntity<ApiResponse<List<User>>> getFollowingUsers(@PathVariable String userId) {
        return ResponseEntity.ok(socialService.getFollowingUsers(userId));
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<Boolean>> deleteUser(@PathVariable String userId) {
        return ResponseEntity.ok(socialService.deleteUser(userId));
    }


}
