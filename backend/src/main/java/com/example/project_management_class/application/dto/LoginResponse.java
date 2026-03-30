package com.example.project_management_class.application.dto;

import com.example.project_management_class.domain.enums.Role;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class LoginResponse {
    private String userId;
    private String username;
    private Role role;
    private String fullName;
    
    // For student
    private String studentId;
    private String studentCode;
    private String className;
    
    // For teacher
    private String teacherId;
}
