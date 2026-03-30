package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;
import java.util.List;

@Data
@Document(collection = "announcements")
public class Announcement {
    @Id
    private String id;
    private String title;
    private String content;
    private String announcement; // backward compatibility
    private String teacherId;
    private LocalDate date;
    private String priority;
    private String targetAudience; // all, students, teachers
    private List<ClassInfo> classes;
    
    @Data
    public static class ClassInfo {
        private String id;
        private String name;
    }
}
