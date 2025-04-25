package com.paf.knowledgenest.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class JwtAuthenticationResponse {
    private String token;

    public JwtAuthenticationResponse(String token) {
        this.token = token;
    }

}