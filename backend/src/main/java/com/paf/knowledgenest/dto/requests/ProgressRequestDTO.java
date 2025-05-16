package com.paf.knowledgenest.dto.requests;

import lombok.Data;

import java.util.List;

@Data
public class ProgressRequestDTO {
        private String title;
        private List<String> topics;
        private Integer progress;
        private String userId;

    @Data
    public static class FollowerRequestDTO {
        private String userId;
        private String followerId;
    }
}
