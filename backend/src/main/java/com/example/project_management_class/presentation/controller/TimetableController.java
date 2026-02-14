package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.dto.TimetableResponseDTO;
import com.example.project_management_class.application.service.TimetableService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/teacher")
@RequiredArgsConstructor
@CrossOrigin
public class TimetableController {

    private final TimetableService timetableService;

    @GetMapping("/{teacherId}/timetable")
    public List<TimetableResponseDTO> getTeacherTimetable(
            @PathVariable String teacherId, 
            @RequestParam int week,
            @RequestParam int year,
            @RequestParam int semester) {
        return timetableService.getTeacherTimetable(teacherId, week, year, semester);
    }
}
