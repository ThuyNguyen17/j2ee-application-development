package com.example.project_management_class.application.dto;

import lombok.Data;

@Data
public class SchoolClassDTO {
    private String id;
    private String academicYearId;
    private Integer gradeLevel;
    private String className;
    private String homeroomTeacherId;
    private Integer studentCount; // Computed field
}
