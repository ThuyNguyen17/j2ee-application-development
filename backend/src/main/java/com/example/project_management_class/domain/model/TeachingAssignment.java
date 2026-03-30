
package com.example.project_management_class.domain.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "teaching_assignments")
@Data
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TeachingAssignment {

    @Id
    private String id;
    private String teacherId;
    private String subjectName;
    private String className; // e.g. "10A1"
    private Integer academicYear;
    private Integer semester;
}
