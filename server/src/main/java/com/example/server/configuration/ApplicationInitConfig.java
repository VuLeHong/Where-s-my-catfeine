package com.example.server.configuration;

import java.util.HashSet;

import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.example.server.enums.Role;
import com.example.server.model.entity.User;
import com.example.server.repository.UserRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Configuration
@RequiredArgsConstructor
@Slf4j
public class ApplicationInitConfig {
    
    private final PasswordEncoder passwordEncoder;

    @Bean
    ApplicationRunner applicationRunner(UserRepository userRepository){
        return args -> {
            if(userRepository.findByUserEmail("admin@gmail.com").isEmpty()){
                var roles = new HashSet<String>();
                roles.add(Role.ADMIN.name());
                User user = User.builder()
                            .userName("admin")
                            .userEmail("admin@gmail.com")
                            .userPassword(passwordEncoder.encode("admin123"))
                            .roles(roles)
                            .build();

                userRepository.save(user);
                log.warn("admin user has been created with passwod: admin123");
            }
        };
    }
}
