package com.paf.knowledgenest.controller.user;

import com.paf.knowledgenest.dto.GoogleLoginRequest;
import com.paf.knowledgenest.dto.RegisterRequest;
import com.paf.knowledgenest.dto.LoginRequest;
import com.paf.knowledgenest.dto.responses.LoginResponse;
import com.paf.knowledgenest.dto.responses.UserResponse;
import com.paf.knowledgenest.model.user.User;

import com.paf.knowledgenest.repository.user.UserRepository;

import com.paf.knowledgenest.service.user.AuthService;
import com.paf.knowledgenest.utils.ApiResponse;
import jakarta.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    @Autowired
    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<String>> register(@Valid @RequestBody RegisterRequest request) {
        log.info("Registering user: {}", request);
        ApiResponse<String> response = authService.registerUser(request);
        if(response.isSuccess()) {
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<LoginResponse>> login(@Valid @RequestBody LoginRequest request) {

        log.info("Login request: {}", request);
        ApiResponse<LoginResponse>  response = authService.loginUser(request);
        if(response.isSuccess()) {
            return ResponseEntity.ok().body(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }

    }

    // added this to fetch user detail into frontend (dashboard)
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Unauthorized: No authentication info found");
        }

        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        
        // Create a response with properly formatted role and user ID
        UserResponse userResponse =
            UserResponse.builder()
                .id(user.getId())  // Include MongoDB ID 
                .name(user.getName())
                .email(user.getEmail())
                .role("ROLE_" + user.getRole())
                    .followers(user.getFollowers())
                    .following(user.getFollowing())
                .build();
                
        return ResponseEntity.ok(userResponse);
    }

    @PostMapping("/google-login")
    public ResponseEntity<ApiResponse<LoginResponse>> googleLogin(@RequestBody GoogleLoginRequest request) {
        String email = request.getEmail();
        ApiResponse<LoginResponse> response = authService.googleLogin(email);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }

}
