package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Document(collection = "submissions")
public class Submission {
    @Id
    private String id;
    private String assignmentId;      // ID bài tập
    private String studentId;         // ID sinh viên
    private String studentName;       // Tên sinh viên
    private String content;           // Nội dung bài nộp (cho ESSAY)
    private LocalDateTime submittedAt; // Thời gian nộp
    private Integer score;            // Điểm (null nếu chưa chấm)
    private String feedback;          // Nhận xét của giáo viên
    private String status;            // submitted, graded
    private String classId;           // Lớp của sinh viên khi nộp
    
    // For QUIZ type - student's answers (questionIndex -> selectedOptionIndices)
    private List<QuizAnswer> quizAnswers;
    
    // For UPLOAD type - submitted files
    private List<SubmittedFile> submittedFiles;
    
    @Data
    public static class QuizAnswer {
        private Integer questionIndex;     // Index của câu hỏi
        private List<Integer> selectedOptions; // Index các đáp án được chọn
    }
    
    @Data
    public static class SubmittedFile {
        private String id;
        private String fileName;
        private String fileUrl;
        private String fileType;
        private Long fileSize;
    }
}
