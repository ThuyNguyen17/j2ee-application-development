package com.example.project_management_class.domain.model;

import com.example.project_management_class.domain.enums.Role;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;


@Document(collection = "users")
@Data
public class User {

    @Id
    private String id;

    private String username;
    private String password;
    private Role role;      // ADMIN | STUDENT | TEACHER
    @Field("isActive")
    private boolean active;
}

