package com.paf.knowledgenest.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ProfileRequestDTO {
    private String id;
    private Long userId;
    private String username;
    private String email;
    private String bio;
    private List<String> skills;

    public ProfileRequestDTO(String id, Long userId, String username, String email, String bio, List<String> skills) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.skills = skills;
    }

}
