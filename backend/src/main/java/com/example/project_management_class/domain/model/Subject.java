package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "subjects")
@Data
public class Subject {

    @Id
    private String id;

    private String subjectCode;   // Toan102
    private String subjectName;   // Toán
}