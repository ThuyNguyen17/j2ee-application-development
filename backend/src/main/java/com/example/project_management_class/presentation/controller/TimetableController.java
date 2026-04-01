package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.dto.TimetableResponseDTO;
import com.example.project_management_class.application.service.TimetableService;
import com.example.project_management_class.domain.model.Timetable;
import com.example.project_management_class.domain.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin
public class TimetableController {

    private final TimetableService timetableService;
    private final TimetableRepository timetableRepository;

    // Lấy timetable theo week/year/semester (để tương thích với frontend cũ)
    @GetMapping("/teacher/{teacherId}/timetable")
    public List<TimetableResponseDTO> getTimetable(
            @PathVariable String teacherId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Integer week,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer semester
    ) {
        // Nếu có week/year/semester, tính date range
        if (week != null && year != null) {
            LocalDate startOfSemester;
            if (semester != null && semester == 2) {
                // Học kỳ 2 bắt đầu từ giữa tháng 1 của năm tiếp theo (year + 1) - Đồng bộ với Service và Frontend
                startOfSemester = LocalDate.of(year + 1, 1, 15);
            } else {
                // Học kỳ 1 bắt đầu từ 01/09 của năm học (year)
                startOfSemester = LocalDate.of(year, 9, 1);
            }
            
            // Tìm Thứ 2 đầu tiên của học kỳ
            LocalDate firstMonday = startOfSemester.with(DayOfWeek.MONDAY);
            if (firstMonday.isAfter(startOfSemester)) {
                firstMonday = firstMonday.minusWeeks(1);
            }
            
            LocalDate startOfWeek = firstMonday.plusWeeks(week - 1);
            LocalDate endOfWeek = startOfWeek.plusDays(6);
            return timetableService.getTeacherTimetableByRange(teacherId, startOfWeek, endOfWeek);
        }
        
        // Nếu có startDate và endDate, dùng trực tiếp
        if (startDate != null && endDate != null) {
            return timetableService.getTeacherTimetableByRange(
                    teacherId,
                    LocalDate.parse(startDate),
                    LocalDate.parse(endDate)
            );
        }
        
        // Mặc định lấy tuần hiện tại
        return timetableService.getTeacherTimetableByWeek(teacherId, LocalDate.now());
    }

    // ==============================
    // GET TIMETABLE BY WEEK (with date parameter)
    // ==============================

    @GetMapping("/teacher/{teacherId}/timetable/week")
    public List<TimetableResponseDTO> getTimetableByWeek(
            @PathVariable String teacherId,
            @RequestParam String date // ví dụ: 2026-02-10
    ) {
        return timetableService.getTeacherTimetableByWeek(
                teacherId,
                LocalDate.parse(date)
        );
    }

    @PostMapping("/timetable")
    public Timetable createTimetableEntry(@RequestBody Timetable timetable) {
        return timetableRepository.save(timetable);
    }
}