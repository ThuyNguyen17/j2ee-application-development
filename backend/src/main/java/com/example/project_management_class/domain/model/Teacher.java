package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "teachers")
@Data
public class Teacher {

    @Id
    private String id;

    private String userId;
    private String teacherCode;
    private String fullName;
    private String phone;
    private String email;
}