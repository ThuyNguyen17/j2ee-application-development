package com.example.project_management_class.application.service;

import com.example.project_management_class.application.dto.TimetableResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface TimetableService {

    // Lấy theo tuần (truyền vào 1 ngày bất kỳ)
    List<TimetableResponseDTO> getTeacherTimetableByWeek(
            String teacherId,
            LocalDate date
    );

    // Lấy theo khoảng ngày
    List<TimetableResponseDTO> getTeacherTimetableByRange(
            String teacherId,
            LocalDate startDate,
            LocalDate endDate
    );

    // Lấy timetable theo tên lớp
    List<TimetableResponseDTO> getClassTimetable(String className, int week, int year, int semester);
}