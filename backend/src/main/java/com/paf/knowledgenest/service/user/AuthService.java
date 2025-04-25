package com.paf.knowledgenest.service.user;

import com.paf.knowledgenest.dto.JwtAuthenticationResponse;
import com.paf.knowledgenest.dto.LoginRequest;
import com.paf.knowledgenest.dto.RegisterRequest;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.repository.user.UserRepository;
import com.paf.knowledgenest.security.JwtUtils;
import com.paf.knowledgenest.utils.ApiResponse;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public ApiResponse<JwtAuthenticationResponse> loginUser(LoginRequest request) {
        try {
            //  Authenticate credentials (Spring Security will call CustomUserDetailsService)
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
            // Get the principal (this will be your CustomUserDetails implementation)
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            //  Generate JWT using email (username)
            String token = jwtUtils.generateToken(userDetails.getUsername());
            return ApiResponse.successResponse("User Login Successfully",new JwtAuthenticationResponse(token));
        } catch (Exception e) {
            return ApiResponse.errorResponse("Unexpected Error Occurred while attempting to login");
        }
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}
