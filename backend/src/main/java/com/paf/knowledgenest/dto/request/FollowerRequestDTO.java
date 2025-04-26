package com.paf.knowledgenest.dto.request;

import lombok.Data;

@Data
public class FollowerRequestDTO {
    private String userId;
    private String followerId;
}
