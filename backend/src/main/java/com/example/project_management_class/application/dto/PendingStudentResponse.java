package com.example.project_management_class.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingStudentResponse {
    private String studentId;
    private String studentCode;
    private String fullName;
    private String className;
}

