package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.domain.model.ViolationLog;
import com.example.project_management_class.domain.repository.ViolationLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/violations")
@RequiredArgsConstructor
public class ViolationLogController {
    private final ViolationLogRepository repository;

    @PostMapping("/log")
    public ResponseEntity<Map<String, Object>> logViolation(@RequestBody ViolationLog log) {
        log.setTimestamp(LocalDateTime.now());
        System.out.println("[ANTI-CHEAT VIOLATION] UserID: " + log.getUserId() + 
            ", AssignmentID: " + log.getAssignmentId() + 
            ", Type: " + log.getViolationType() + 
            ", Details: " + log.getDetails());
        repository.save(log);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/assignment/{id}")
    public ResponseEntity<java.util.List<ViolationLog>> getByAssignment(@PathVariable String id) {
        return ResponseEntity.ok(repository.findByAssignmentId(id));
    }
}
