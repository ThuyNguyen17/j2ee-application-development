package com.example.project_management_class.domain.model;

import com.example.project_management_class.domain.enums.AttendanceStatus;
import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalTime;

@Document(collection = "attendances")
@Data
public class Attendance {

    @Id
    private String id;

    private String attendanceSessionId;
    private String studentId;

    private AttendanceStatus status; // PRESENT | LATE | ABSENT
    private LocalTime checkInTime;
}