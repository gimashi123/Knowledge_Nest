package com.paf.knowledgenest.security;

import com.paf.knowledgenest.service.user.CustomUserDetailsService;
import jakarta.servlet.*;
import jakarta.servlet.http.*;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.*;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import java.io.IOException;

public class JwtAuthFilter extends GenericFilter {

    private final JwtUtils jwtUtils;
    private final CustomUserDetailsService customUserDetailsService;

    public JwtAuthFilter(JwtUtils jwtUtils, CustomUserDetailsService service) {
        this.jwtUtils = jwtUtils;
        this.customUserDetailsService = service;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        HttpServletRequest httpReq = (HttpServletRequest) request;
        String path = httpReq.getRequestURI();

        if (httpReq.getMethod().equals("OPTIONS")) {
            chain.doFilter(request, response);
            return;
        }

        // Skip filtering for login and register
        if (path.startsWith("/api/auth/login") || path.startsWith("/api/auth/register")) {
            chain.doFilter(request, response);
            return;
        }

        String authHeader = httpReq.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtils.validateToken(token)) {
                String email = jwtUtils.getEmailFromToken(token);
                UserDetails userDetails = customUserDetailsService.loadUserByUsername(email);

                UsernamePasswordAuthenticationToken authToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails, null, userDetails.getAuthorities());

                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(httpReq));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        chain.doFilter(request, response);
    }
}
