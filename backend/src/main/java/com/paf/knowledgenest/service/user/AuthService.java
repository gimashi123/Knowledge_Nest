package com.paf.knowledgenest.service.user;

import com.paf.knowledgenest.dto.JwtAuthenticationResponse;
import com.paf.knowledgenest.dto.LoginRequest;
import com.paf.knowledgenest.dto.RegisterRequest;
import com.paf.knowledgenest.dto.request.FollowerRequestDTO;
import com.paf.knowledgenest.dto.response.LoginResponse;
import com.paf.knowledgenest.dto.response.UserResponse;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.repository.user.UserRepository;
import com.paf.knowledgenest.security.JwtUtils;
import com.paf.knowledgenest.utils.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Optional;

@Slf4j
@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @Autowired
    public AuthService(UserRepository userRepository, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
    }

    public ApiResponse<String> registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.errorResponse("Email address already in use.");
        }

        String hashedPassword = passwordEncoder.encode(request.getPassword());

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(hashedPassword);
        user.setName(request.getName());

        if(request.getRole() != null) {
            user.setRole(request.getRole());
        } else {
            user.setRole("USER");
        }

        userRepository.save(user);

        userRepository.save(user);
         return ApiResponse.successResponse("User Registered Successfully", jwtUtils.generateToken(user.getEmail()));
    }

    public ApiResponse<LoginResponse> loginUser(LoginRequest request) {
        try {
            // Authenticate user credentials
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(), request.getPassword()
                    )
            );

            // Check if authentication is successful
            if (authentication == null || !authentication.isAuthenticated()) {
                return ApiResponse.errorResponse("Invalid email or password");
            }

            // Get UserDetails
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            
            // Get the full user from repository to get accurate user data including name
            Optional<User> userOpt = userRepository.findByEmail(userDetails.getUsername());
            if (userOpt.isEmpty()) {
                return ApiResponse.errorResponse("User not found");
            }
            
            User user = userOpt.get();
            
            // Generate JWT token
            String token = jwtUtils.generateToken(userDetails.getUsername());

            LoginResponse loginResponse = LoginResponse.builder()
                    .accessToken(token)
                    .user(UserResponse.builder()
                          .role("ROLE_" + user.getRole())  // Ensure ROLE_ prefix is added
                          .email(user.getEmail())
                          .name(user.getName())
                          .build())
                    .build();
            return ApiResponse.successResponse("User Login Successfully", loginResponse);

        } catch (BadCredentialsException e) {
            log.error("Bad credentials: {}", e.getMessage());
            return ApiResponse.errorResponse("Invalid email or password");
        } catch (Exception e) {
            log.error("Unexpected error during login: {}", e.getMessage(), e);
            return ApiResponse.errorResponse("Unexpected error occurred during login");
        }
    }


    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
