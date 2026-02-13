package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
@Data
public class Notification {

    @Id
    private String id;

    private String title;
    private String content;
    private String academicYearId;
    private String classId;   // nullable
    private String targetRole;   // STUDENT | TEACHER | ALL
    private LocalDateTime createdAt;

}
