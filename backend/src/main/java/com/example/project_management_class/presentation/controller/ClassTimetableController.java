package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.dto.TimetableResponseDTO;
import com.example.project_management_class.application.service.TimetableService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Collections;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/classes")
@RequiredArgsConstructor
@CrossOrigin
public class ClassTimetableController {

    private final TimetableService timetableService;

    @GetMapping("/{className}/timetable")
    public ResponseEntity<List<TimetableResponseDTO>> getClassTimetable(
            @PathVariable String className,
            @RequestParam int week,
            @RequestParam int year,
            @RequestParam int semester
    ) {
        log.info("Fetching timetable for class: {}, week: {}, year: {}, semester: {}", className, week, year, semester);
        try {
            List<TimetableResponseDTO> result = timetableService.getClassTimetable(className, week, year, semester);
            log.info("Found {} timetable entries", result.size());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Error fetching timetable for class {}: {}", className, e.getMessage(), e);
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }
}

