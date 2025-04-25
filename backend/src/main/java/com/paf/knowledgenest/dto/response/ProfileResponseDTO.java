package com.paf.knowledgenest.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Builder
@Data
public class ProfileResponseDTO {
    private String id;
    private Long userId;
    private String username;
    private String email;
    private String bio;
    private List<String> skills;
}
