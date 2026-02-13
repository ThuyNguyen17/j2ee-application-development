package com.example.project_management_class.domain.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDate;

@Document(collection = "attendance_sessions")
@Data
public class AttendanceSession {

    @Id
    private String id;

    private String teachingAssignmentId;
    private LocalDate date;
    private Integer semester;
    private boolean open;
    private String qrToken;
}