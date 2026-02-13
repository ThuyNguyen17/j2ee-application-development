package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "exam_schedules")
@Data
public class ExamSchedule {

    @Id
    private String id;

    private String academicYearId;
    private String classId;
    private String subjectId;

    private Integer semester;
    private LocalDate examDate;
    private String room;
}
