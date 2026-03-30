package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.domain.model.AcademicYear;
import com.example.project_management_class.domain.repository.AcademicYearRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/academic-years")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AcademicYearController {

    private final AcademicYearRepository academicYearRepository;

    @GetMapping("/getall")
    public ResponseEntity<Map<String, Object>> getAllAcademicYears() {
        List<AcademicYear> academicYears = academicYearRepository.findAll();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("academicYears", academicYears);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/active")
    public ResponseEntity<Map<String, Object>> getActiveAcademicYear() {
        AcademicYear activeYear = academicYearRepository.findByActiveTrue().orElse(null);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("academicYear", activeYear);
        return ResponseEntity.ok(response);
    }
}
