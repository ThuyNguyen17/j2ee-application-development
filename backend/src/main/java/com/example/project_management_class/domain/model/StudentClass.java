package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "student_classes")
@Data
public class StudentClass {

    @Id
    private String id;

    private String academicYearId;   // ⭐ thêm cái này
    private String studentId;
    private String classId;
}
