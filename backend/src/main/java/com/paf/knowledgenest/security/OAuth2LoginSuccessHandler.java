package com.paf.knowledgenest.security;

import com.paf.knowledgenest.model.user.Role;
import com.paf.knowledgenest.model.user.User;
import com.paf.knowledgenest.repository.user.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(OAuth2LoginSuccessHandler.class);
    private static final String FRONTEND_URL = "http://localhost:5173";

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @Autowired
    public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtUtils jwtUtils) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
                                      Authentication authentication) throws IOException {
        try {
            DefaultOAuth2User oauthUser = (DefaultOAuth2User) authentication.getPrincipal();
            Map<String, Object> attributes = oauthUser.getAttributes();

            String email = (String) attributes.get("email");
            String name = (String) attributes.get("name");

            if (email == null || name == null) {
                logger.error("Missing email or name from OAuth2 user attributes");
                response.sendRedirect(FRONTEND_URL + "/login?error=missing_attributes");
                return;
            }

            Optional<User> userOptional = userRepository.findByEmail(email);

            User user;
            if (userOptional.isEmpty()) {
                logger.info("Creating new user for OAuth2 login: {}", email);
                user = new User();
                user.setEmail(email);
                user.setName(name);
                user.setPassword("N/A (Google)");
                user.setRole(String.valueOf(Role.USER));
                userRepository.save(user);
            } else {
                user = userOptional.get();
                logger.info("Existing user logged in via OAuth2: {}", email);
            }

            String token = jwtUtils.generateToken(user.getEmail());
            response.sendRedirect(FRONTEND_URL + "/oauth-success?token=" + token);

        } catch (Exception e) {
            logger.error("Error during OAuth2 login process", e);
            response.sendRedirect(FRONTEND_URL + "/login?error=oauth_failed");
        }
    }
}

