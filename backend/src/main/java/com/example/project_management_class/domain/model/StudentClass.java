package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "student_classes")
@Data
public class StudentClass {

    @Id
    private String id;
    private String studentId;
    private String classId;
    private String academicYearId;
    private Integer seatRow;
    private Integer seatColumn;
    private String notes;
}

