package com.example.server.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final String[] PUBLIC_ENDPOINTs = {"/user/register", "/auth/create-token", "/auth/verify","/auth/logout"};


    @Autowired
    private CustomJwtDecoder customJwtDecoder;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(request ->
            request.requestMatchers(HttpMethod.POST, PUBLIC_ENDPOINTs).permitAll()
            .anyRequest().authenticated()
            );
        http.oauth2ResourceServer(oauth2 ->
            oauth2.jwt(JwtConfigurer -> JwtConfigurer.decoder(customJwtDecoder))
                    .authenticationEntryPoint(new JwtAuthenticationEntryPoint())
        );
        http
        .csrf(AbstractHttpConfigurer::disable)
        .cors(Customizer.withDefaults())
        ;
        return http.build();
    }


    @Bean
    PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder(10);
    }

@Bean
public CorsFilter corsFilter() {
    CorsConfiguration corsConfig = new CorsConfiguration();
    corsConfig.addAllowedOrigin("http://localhost:3000"); // Allow frontend origin (local development)
    corsConfig.addAllowedOrigin("https://where-s-my-catfeine.vercel.app"); // Vercel frontend URL
    corsConfig.addAllowedHeader("*"); // Allow any headers
    corsConfig.addAllowedMethod("*"); // Allow any HTTP methods
    corsConfig.setAllowCredentials(true);
    corsConfig.addAllowedOriginPattern("*"); 
    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", corsConfig); // Apply to all endpoints
    return new CorsFilter(source);
}

}
