package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "students")
@Data
public class Student {

    @Id
    private String id;

    private String userId;        // ref users
    private String studentCode;   // HS001
    private String fullName;
    private LocalDate dateOfBirth;
    private String gender;

    private Contact contact;
}