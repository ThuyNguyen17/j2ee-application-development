package com.example.project_management_class.application.dto;

import lombok.Data;
import java.time.LocalDate;

@Data
public class SessionStartRequest {
    private String assignmentId;
    private LocalDate date;
    private Integer period;
    private Integer semester;
    private Double latitude;
    private Double longitude;
}
