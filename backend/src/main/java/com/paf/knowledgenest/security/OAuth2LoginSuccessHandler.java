package com.paf.knowledgenest.security;

import com.paf.knowledgenest.model.user.Role;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.repository.user.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;
import java.util.Optional;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @Autowired
    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                        Authentication authentication) throws IOException, ServletException {

        DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
        Map<String, Object> attributes = oauthUser.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        Optional<User> userOptional = userRepository.findByEmail(email);

        User user;
        if (userOptional.isEmpty()) {
            user = new User();
            user.setEmail(email);
            user.setName(name);
            user.setPassword("N/A (Google)");
            user.setRole(String.valueOf(Role.USER));
            userRepository.save(user);
        } else {
            user = userOptional.get();
        }

        String token = jwtUtils.generateToken(user.getEmail());

        response.sendRedirect("http://localhost:5174/oauth-success?token=" + token);
    }
}
