package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "scores")
@Data
public class Score {

    @Id
    private String id;

    private String studentId;
    private String teachingAssignmentId;

    private Integer semester;   // 1 | 2
    private List<ScoreItem> items;
    private String academicYearId;
}
