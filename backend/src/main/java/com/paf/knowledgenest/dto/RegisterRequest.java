package com.paf.knowledgenest.dto;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RegisterRequest {
    // Getters and setters
    private String name;
    private String email;
    private String password;

}