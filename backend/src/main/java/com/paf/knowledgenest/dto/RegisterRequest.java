package com.paf.knowledgenest.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class RegisterRequest {

    private String role;
    private String name;
    private String email;
    private String password;

}