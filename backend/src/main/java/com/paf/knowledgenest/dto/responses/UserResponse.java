package com.paf.knowledgenest.dto.responses;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class UserResponse {
    private String id;
    private String email;
    private String name;
    private String role;
    private List<String> followers;
    private List<String> following;
    private Integer userCoins;
}
