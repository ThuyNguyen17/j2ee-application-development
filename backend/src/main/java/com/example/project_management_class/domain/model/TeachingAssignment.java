package com.example.project_management_class.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "teaching_assignments")
public class TeachingAssignment {

    @Id
    private String id;
    private String teacherId;
    private String subjectName;
    private String className;

    private int academicYear;
    private int semester;
}