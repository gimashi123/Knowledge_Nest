package com.paf.knowledgenest.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class WebConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        config.setAllowCredentials(false); // or true + specific origin
        config.addAllowedOrigin("*");      // use specific origin if credentials are true
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");      // instead of listing methods one by one

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}