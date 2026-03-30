package com.example.project_management_class.application.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PendingStudentsResponse {
    private String sessionId;
    private String teachingAssignmentId;
    private String className;
    private List<PendingStudentResponse> students;
}

