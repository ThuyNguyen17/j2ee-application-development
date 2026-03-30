package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.service.SubmissionService;
import com.example.project_management_class.domain.model.Submission;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/submissions")
@RequiredArgsConstructor
public class SubmissionController {
    private final SubmissionService submissionService;

    @PostMapping("/submit")
    public ResponseEntity<Map<String, Object>> submitAssignment(@RequestBody Submission submission) {
        Submission saved = submissionService.submitAssignment(submission);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Bài tập đã được nộp!");
        response.put("submission", saved);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<Map<String, Object>> getSubmissionsByAssignment(@PathVariable String assignmentId) {
        List<Submission> submissions = submissionService.getSubmissionsByAssignment(assignmentId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("submissions", submissions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getSubmissionsByStudent(@PathVariable String studentId) {
        List<Submission> submissions = submissionService.getSubmissionsByStudent(studentId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("submissions", submissions);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/assignment/{assignmentId}/student/{studentId}")
    public ResponseEntity<Map<String, Object>> getSubmissionByAssignmentAndStudent(
            @PathVariable String assignmentId,
            @PathVariable String studentId) {
        Submission submission = submissionService.getSubmissionByAssignmentAndStudent(assignmentId, studentId);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("submission", submission);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/{submissionId}/grade")
    public ResponseEntity<Map<String, Object>> gradeSubmission(
            @PathVariable String submissionId,
            @RequestBody Map<String, Object> gradeData) {
        Integer score = (Integer) gradeData.get("score");
        String feedback = (String) gradeData.get("feedback");
        Submission graded = submissionService.gradeSubmission(submissionId, score, feedback);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Đã chấm điểm!");
        response.put("submission", graded);
        return ResponseEntity.ok(response);
    }
}
