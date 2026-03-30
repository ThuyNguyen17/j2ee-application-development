package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "assignments")
public class Assignment {
    @Id
    private String id;
    private String title;
    private String description;
    private String grade;
    private LocalDate deadline;
    private Integer maxScore;
    private String teacherId;
    private List<ClassInfo> classes;
    private Integer submittedCount;
    private Integer totalCount;
    
    // Assignment type: ESSAY, QUIZ, UPLOAD
    private String type;
    
    // For QUIZ type - list of questions
    private List<Question> questions;
    
    // For UPLOAD type - file attachments
    private List<Attachment> attachments;
    
    // Status: DRAFT, PUBLISHED
    private String status;
    
    private LocalDateTime createdAt;
    private LocalDateTime publishedAt;
    
    @Data
    public static class ClassInfo {
        @org.springframework.data.mongodb.core.mapping.Field("_id")
        private String id;
        private String name;
    }
    
    @Data
    public static class Question {
        @org.springframework.data.mongodb.core.mapping.Field("_id")
        private String id;
        private String content;        // Câu hỏi
        private String type;           // SINGLE_CHOICE, MULTIPLE_CHOICE
        private List<Option> options;  // Các đáp án
        private List<Integer> correctAnswers; // Index của đáp án đúng (0-based)
        private Integer points;        // Điểm cho câu hỏi này
    }
    
    @Data
    public static class Option {
        private String id;
        private String content;        // Nội dung đáp án
    }
    
    @Data
    public static class Attachment {
        private String id;
        private String fileName;
        private String fileUrl;
        private String fileType;
        private Long fileSize;
    }
}
