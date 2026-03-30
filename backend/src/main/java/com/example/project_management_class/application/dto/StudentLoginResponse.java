package com.example.project_management_class.application.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StudentLoginResponse {
    private String studentId;
    private String fullName;
    private String studentCode;
    private String className;
}
