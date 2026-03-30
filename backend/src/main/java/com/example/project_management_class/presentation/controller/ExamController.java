package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.service.ExamService;
import com.example.project_management_class.domain.model.Exam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/exams")
@RequiredArgsConstructor
public class ExamController {
    private final ExamService examService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addExam(@RequestBody Exam exam) {
        examService.addExam(exam);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Exam Created!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getall")
    public ResponseEntity<Map<String, Object>> getAllExams() {
        List<Exam> exams = examService.getAllExams();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("exams", exams);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteExam(@PathVariable String id) {
        examService.deleteExam(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Exam Deleted!");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateExam(@PathVariable String id, @RequestBody Exam exam) {
        examService.updateExam(id, exam);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Exam Updated!");
        return ResponseEntity.ok(response);
    }
}
