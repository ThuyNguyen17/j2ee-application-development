package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "classes")
@Data
public class SchoolClass {

    @Id
    private String id;

    private String academicYearId;
    private Integer gradeLevel;      // 6-9 (THCS) | 10-12 (THPT)
    private String className;        // A | B | C

    private String homeroomTeacherId;
}