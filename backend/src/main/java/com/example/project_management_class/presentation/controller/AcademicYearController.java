package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.domain.model.AcademicYear;
import com.example.project_management_class.domain.repository.AcademicYearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/academic-years")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AcademicYearController {

    private final AcademicYearRepository academicYearRepository;

    @GetMapping
    public ResponseEntity<?> getAllAcademicYears() {
        return ResponseEntity.ok(academicYearRepository.findAll());
    }

    @GetMapping("/active")
    public ResponseEntity<?> getActiveAcademicYear() {
        return academicYearRepository.findByActiveTrue()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 🔥 Thêm API lấy semester start (quan trọng cho timetable)
    @GetMapping("/semester-start")
    public ResponseEntity<?> getSemesterStart(
            @RequestParam int semester
    ) {
        AcademicYear year = academicYearRepository.findByActiveTrue()
                .orElseThrow(() -> new RuntimeException("No active academic year"));

        Map<String, Object> result = new HashMap<>();

        if (semester == 1) {
            result.put("startDate", year.getStartDate());
        } else if (semester == 2) {
            result.put("startDate", year.getStartDate().plusMonths(5));
        } else {
            throw new RuntimeException("Invalid semester");
        }

        return ResponseEntity.ok(result);
    }
}