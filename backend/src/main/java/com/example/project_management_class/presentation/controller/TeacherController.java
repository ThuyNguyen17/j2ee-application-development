package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.service.TeacherService;
import com.example.project_management_class.domain.model.Teacher;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/teachers")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TeacherController {
    private final TeacherService teacherService;

    @PostMapping
    public ResponseEntity<Map<String, Object>> createTeacher(@RequestBody Teacher teacher) {
        teacherService.createTeacher(teacher);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Teacher Created!");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/getall")
    public ResponseEntity<Map<String, Object>> getAllTeachers() {
        List<Teacher> teachers = teacherService.getAllTeachers();
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("teachers", teachers);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteTeacher(@PathVariable String id) {
        teacherService.deleteTeacher(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Teacher Deleted!");
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> updateTeacher(@PathVariable String id, @RequestBody Teacher teacher) {
        teacherService.updateTeacher(id, teacher);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Teacher Updated!");
        return ResponseEntity.ok(response);
    }
}
