package com.paf.knowledgenest.controller.user;

import com.paf.knowledgenest.dto.RegisterRequest;
import com.paf.knowledgenest.dto.LoginRequest;
import com.paf.knowledgenest.dto.JwtAuthenticationResponse;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.model.user.Role;
import com.paf.knowledgenest.repository.user.UserRepository;
import com.paf.knowledgenest.security.JwtUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.*;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth") // made a change here (/api)
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    @PostMapping("/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Email already registered.");
        }

        User newUser = new User();
        newUser.setName(request.getName());
        newUser.setEmail(request.getEmail());
        newUser.setPassword(passwordEncoder.encode(request.getPassword()));
        newUser.setRole(String.valueOf(Role.USER)); // default role

        userRepository.save(newUser);
        return ResponseEntity.ok("User registered successfully.");
    }

    @PostMapping("/login")
    public ResponseEntity<JwtAuthenticationResponse> login(@Valid @RequestBody LoginRequest request) {
        //  Authenticate credentials (Spring Security will call CustomUserDetailsService)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // Get the principal (this will be your CustomUserDetails implementation)
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        //  Generate JWT using email (username)
        String token = jwtUtils.generateToken(userDetails.getUsername());

        return ResponseEntity.ok(new JwtAuthenticationResponse(token));
    }

    // added this to fetch user detail into frontend (dashboard)
    @GetMapping("/me")
    public ResponseEntity<User> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        return ResponseEntity.ok(user);
    }

}
