package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.domain.model.StudentClass;
import com.example.project_management_class.domain.repository.StudentClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-classes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentClassController {

    private final StudentClassRepository studentClassRepository;

    @GetMapping
    public ResponseEntity<List<StudentClass>> getAll() {
        return ResponseEntity.ok(studentClassRepository.findAll());
    }

    @GetMapping("/class/{classId}")
    public ResponseEntity<List<StudentClass>> getByClassId(@PathVariable String classId) {
        return ResponseEntity.ok(studentClassRepository.findByClassId(classId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<StudentClass>> getByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(studentClassRepository.findByStudentId(studentId));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody StudentClass studentClass) {
        StudentClass saved = studentClassRepository.save(studentClass);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        studentClassRepository.deleteById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Deleted successfully");
        return ResponseEntity.ok(response);
    }
}
