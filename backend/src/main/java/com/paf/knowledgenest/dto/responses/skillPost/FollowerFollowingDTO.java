package com.paf.knowledgenest.dto.responses.skillPost;

import lombok.Data;

import java.util.List;

@Data
public class FollowerFollowingDTO {
    private List<UserFollowResponse> followers;
    private List<UserFollowResponse> followings;
}
