package com.paf.knowledgenest.dto.requests;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class FollowerRequestDTO {
    private String userId;
    private String targetUserId;
}
