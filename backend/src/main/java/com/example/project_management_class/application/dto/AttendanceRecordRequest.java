package com.example.project_management_class.application.dto;

import lombok.Data;

@Data
public class AttendanceRecordRequest {
    private String sessionId;
    private String studentId;
    private String studentName;
    private String studentClass;
    private String location;
    private String qrToken;
    private String note;
}
