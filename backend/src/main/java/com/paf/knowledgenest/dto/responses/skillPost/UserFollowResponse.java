package com.paf.knowledgenest.dto.responses.skillPost;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserFollowResponse {
    private String userId;
    private String name;
    private String profilePic;
    private String email;
    private String username;
}
