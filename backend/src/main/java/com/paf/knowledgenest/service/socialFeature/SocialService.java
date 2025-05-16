package com.paf.knowledgenest.service.socialFeature;


import com.paf.knowledgenest.dto.requests.FollowerRequestDTO;
import com.paf.knowledgenest.dto.responses.skillPost.FollowerFollowingDTO;
import com.paf.knowledgenest.dto.responses.skillPost.UserFollowResponse;
import com.paf.knowledgenest.enums.CoinType;
import com.paf.knowledgenest.model.notification.Notification;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.repository.user.UserRepository;
import com.paf.knowledgenest.service.notification.NotificationService;
import com.paf.knowledgenest.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class SocialService {


    private final UserRepository userRepository;
    private final NotificationService notificationService;

    @Autowired
    public SocialService(UserRepository userRepository, NotificationService notificationService) {
        this.userRepository = userRepository;
        this.notificationService = notificationService;
    }

    public ApiResponse<Boolean> followUser(FollowerRequestDTO followerRequestDTO) {
        try {
            if (followerRequestDTO.getTargetUserId().equals(followerRequestDTO.getUserId())) {
                throw new RuntimeException("You can't follow yourself");
            }

            User currentUser = userRepository.findById(followerRequestDTO.getUserId()).orElseThrow(() -> new RuntimeException("User Not Found"));

            User targetUser = userRepository.findById(followerRequestDTO.getTargetUserId())
                    .orElseThrow(() -> new RuntimeException("Followed User Not Found"));

            // Initialize lists if null
            if (currentUser.getFollowing() == null) currentUser.setFollowing(new ArrayList<>());
            if (targetUser.getFollowers() == null) targetUser.setFollowers(new ArrayList<>());

            // Prevent duplicate follows
            if (currentUser.getFollowing().contains(targetUser.getId())) {
                return ApiResponse.errorResponse("Already following " + targetUser.getName());
            }

            currentUser.getFollowing().add(targetUser.getId());
            targetUser.getFollowers().add(currentUser.getId());

            userRepository.save(currentUser);
            userRepository.save(targetUser);

            this.addUserCoins(targetUser.getId(), CoinType.FOLLOW);

            notificationService.createNotificationBySystem(
                    targetUser.getId(), "You are followed by " + currentUser.getName(), Notification.NotificationType.FOLLOW
            );

            return ApiResponse.successResponse(("Followed " + targetUser.getName() + " Successfully"), true);
        } catch (RuntimeException e) {
            return ApiResponse.errorResponse(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.errorResponse("Unexpected Error Occurred while attempting to follow user");
        }
    }

    public ApiResponse<Boolean> unfollowUser(FollowerRequestDTO followerRequestDTO) {
        try {
            if (followerRequestDTO.getTargetUserId().equals(followerRequestDTO.getUserId())) {
                throw new RuntimeException("You can't unfollow yourself");
            }

            User user = userRepository.findById(followerRequestDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            User followedUser = userRepository.findById(followerRequestDTO.getTargetUserId())
                    .orElseThrow(() -> new RuntimeException("User to unfollow not found"));

            if (user.getFollowing() == null || !user.getFollowing().contains(followedUser.getId())) {
                return ApiResponse.errorResponse("You are not following " + followedUser.getName());
            }

            // Remove each other's IDs
            user.getFollowing().remove(followedUser.getId());

            if (followedUser.getFollowers() != null) {
                followedUser.getFollowers().remove(user.getId());
            }

            userRepository.save(user);
            userRepository.save(followedUser);

            return ApiResponse.successResponse("Unfollowed " + followedUser.getName() + " successfully", true);
        } catch (RuntimeException e) {
            return ApiResponse.errorResponse(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.errorResponse("Unexpected error occurred while attempting to unfollow user");
        }
    }


    public ApiResponse<List<User>> getFollowingUsers(String userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<String> followingIds = user.getFollowing();
            if (followingIds == null || followingIds.isEmpty()) {
                return ApiResponse.successResponse("User is not following anyone", new ArrayList<>());
            }

            List<User> followingUsers = userRepository.findAllById(followingIds);
            return ApiResponse.successResponse("Following users fetched", followingUsers);
        } catch (RuntimeException e) {
            return ApiResponse.errorResponse(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.errorResponse("Unexpected error occurred while fetching following users");
        }
    }

    public ApiResponse<Boolean> deleteUser(String userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            // Deleting the user from the database
            userRepository.delete(user);

            return ApiResponse.successResponse("User deleted successfully", true);
        } catch (RuntimeException e) {
            return ApiResponse.errorResponse(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.errorResponse("Unexpected error occurred while deleting the user");
        }
    }


    public ApiResponse<FollowerFollowingDTO> getFollowersAndFolowingUsers(String userId) {
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("User not found"));

            List<String> followers = user.getFollowers();
            List<String> following = user.getFollowing();

            // Handle potential nulls
            if (followers == null) followers = new ArrayList<>();
            if (following == null) following = new ArrayList<>();

            List<UserFollowResponse> followerDTO = followers.stream().map(followerId -> {
                User follower = userRepository.findById(followerId)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                return UserFollowResponse.builder()
                        .email(follower.getEmail())
                        .name(follower.getName())
                        .username(follower.getUsername())
                        .profilePic(follower.getProfilePic())
                        .userId(follower.getId())
                        .build();
            }).toList();

            List<UserFollowResponse> followingDTO = following.stream().map(followingId -> {
                User followingUser = userRepository.findById(followingId)
                        .orElseThrow(() -> new RuntimeException("User not found"));
                return UserFollowResponse.builder()
                        .email(followingUser.getEmail())
                        .name(followingUser.getName())
                        .username(followingUser.getUsername())
                        .profilePic(followingUser.getProfilePic())
                        .userId(followingUser.getId())
                        .build();
            }).toList();

            FollowerFollowingDTO response = new FollowerFollowingDTO();
            response.setFollowers(followerDTO);
            response.setFollowings(followingDTO);

            return ApiResponse.successResponse("Followers/Following fetched", response);

        } catch (Exception e) {
            log.error("Error in getFollowersAndFolowingUsers: {}", e.getMessage(), e);
            return ApiResponse.errorResponse("Unexpected error occurred while fetching followers");
        }
    }

    public boolean isUserFollowing(String followerId, String followeeId) {
        User follower = userRepository.findById(followerId)
                .orElseThrow(() -> new RuntimeException("Follower not found"));

        List<String> followingList = follower.getFollowing();
        return followingList != null && followingList.contains(followeeId);
    }

    public void addUserCoins(String userId, CoinType coinType) {
        try {
            User user = userRepository.findById(userId).orElseThrow(
                    () -> new RuntimeException("User not found")
            );

            user.setUserCoins(user.getUserCoins() + coinType.getPoints());
            userRepository.save(user);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }


}
