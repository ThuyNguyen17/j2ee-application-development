package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.service.SchoolClassService;
import com.example.project_management_class.domain.model.SchoolClass;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/class")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SchoolClassController {
    private final SchoolClassService schoolClassService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> addClass(@RequestBody SchoolClass schoolClass) {
        schoolClassService.addClass(schoolClass);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Class Created!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getall")
    public ResponseEntity<Map<String, Object>> getAllClasses() {
        List<SchoolClass> classes = schoolClassService.getAllClasses();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("classes", classes);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SchoolClass> getClassById(@PathVariable String id) {
        SchoolClass schoolClass = schoolClassService.getClassById(id);
        return ResponseEntity.ok(schoolClass);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteClass(@PathVariable String id) {
        schoolClassService.deleteClass(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Class Deleted!");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateClass(@PathVariable String id, @RequestBody SchoolClass schoolClass) {
        schoolClassService.updateClass(id, schoolClass);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Class Updated!");
        return ResponseEntity.ok(response);
    }
}
