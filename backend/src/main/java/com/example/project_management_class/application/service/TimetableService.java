package com.example.project_management_class.application.service;

import com.example.project_management_class.application.dto.TimetableResponseDTO;
import java.util.List;

public interface TimetableService {
    List<TimetableResponseDTO> getTeacherTimetable(String teacherId, int week);
}