package com.example.project_management_class.application.dto;

import com.example.project_management_class.domain.enums.DayOfWeek;
import lombok.Builder;
import lombok.Data;


@Data
@Builder
public class TimetableResponseDTO {
    private String subject;
    private String className;
    private DayOfWeek dayOfWeek;
    private int period;
    private String room;
    private String note;
}