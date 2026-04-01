
package com.example.project_management_class.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "teaching_assignments")
@Data
@Builder
public class TeachingAssignment {

    @Id
    private String id;
    private String teacherId;
    private String subjectId;
    private String classId;
    private String academicYearId;
    private Integer semester;
}
