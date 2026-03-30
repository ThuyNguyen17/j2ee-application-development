package com.example.project_management_class.infrastructure.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class TestConfig {

    public TestConfig(@Value("${spring.data.mongodb.uri}") String uri) {
        System.out.println("Mongo URI loaded: " + uri);
    }
}
