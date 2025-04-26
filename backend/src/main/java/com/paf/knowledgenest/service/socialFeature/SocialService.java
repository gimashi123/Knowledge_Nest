package com.paf.knowledgenest.service.socialFeature;


import com.paf.knowledgenest.dto.request.FollowerRequestDTO;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.repository.user.UserRepository;
import com.paf.knowledgenest.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class SocialService {

    @Autowired
    private UserRepository userRepository;

    public ApiResponse<Boolean> followUser(FollowerRequestDTO followerRequestDTO) {
        try {
            if (followerRequestDTO.getFollowerId().equals(followerRequestDTO.getUserId())) {
                throw new RuntimeException("You can't follow yourself");
            }

            User user = userRepository.findById(followerRequestDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("Following User Not Found"));

            User followedUser = userRepository.findById(followerRequestDTO.getFollowerId())
                    .orElseThrow(() -> new RuntimeException("Followed User Not Found"));

            // Initialize lists if null
            if (user.getFollowing() == null) user.setFollowing(new java.util.ArrayList<>());
            if (followedUser.getFollowers() == null) followedUser.setFollowers(new java.util.ArrayList<>());

            // Prevent duplicate follows
            if (user.getFollowing().contains(followedUser.getId())) {
                return ApiResponse.errorResponse("Already following " + followedUser.getName());
            }

            user.getFollowing().add(followedUser.getId());
            followedUser.getFollowers().add(user.getId());

            userRepository.save(user);
            userRepository.save(followedUser);

            return ApiResponse.successResponse(("Followed " + followedUser.getName() + " Successfully"), true);
        } catch (RuntimeException e) {
            return ApiResponse.errorResponse(e.getMessage());
        } catch (Exception e) {
            return ApiResponse.errorResponse("Unexpected Error Occurred while attempting to follow user");
        }
    }

    public ApiResponse<Boolean> unfollowUser(FollowerRequestDTO followerRequestDTO) {
        try {
            if (followerRequestDTO.getFollowerId().equals(followerRequestDTO.getUserId())) {
                throw new RuntimeException("You can't unfollow yourself");
            }

            User user = userRepository.findById(followerRequestDTO.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));

            User followedUser = userRepository.findById(followerRequestDTO.getFollowerId())
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




}
