package com.example.project_management_class.infrastructure.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordEncoderConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Compatible with bcrypt hashes produced by bcryptjs ($2a$, $2b$, $2y$).
        return new BCryptPasswordEncoder();
    }
}

