package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.List;

@Data
@Document(collection = "exams")
public class Exam {
    @Id
    private String id;
    private String title;
    private String description;
    private LocalDate examDate;
    private Integer duration;
    private Integer maxScore;
    private String teacherId;
    private List<ClassInfo> classes;
    private Integer completedCount;
    private Integer totalCount;
    
    @Data
    public static class ClassInfo {
        private String id;
        private String name;
    }
}
