package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.domain.model.StudentClass;
import com.example.project_management_class.domain.model.SchoolClass;
import com.example.project_management_class.domain.repository.StudentClassRepository;
import com.example.project_management_class.domain.repository.SchoolClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/student-classes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class StudentClassController {

    private final StudentClassRepository studentClassRepository;
    private final SchoolClassRepository schoolClassRepository;

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

    @GetMapping("/student/{studentId}/class")
    public ResponseEntity<Map<String, Object>> getStudentClassInfo(@PathVariable String studentId) {
        List<StudentClass> studentClasses = studentClassRepository.findByStudentId(studentId);
        
        if (studentClasses.isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Student not enrolled in any class");
            return ResponseEntity.ok(response);
        }

        // Get the first class (assuming student is in one class)
        StudentClass studentClass = studentClasses.get(0);
        Optional<SchoolClass> schoolClassOpt = schoolClassRepository.findById(studentClass.getClassId());
        
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("studentClass", studentClass);
        
        if (schoolClassOpt.isPresent()) {
            SchoolClass schoolClass = schoolClassOpt.get();
            response.put("className", schoolClass.getGradeLevel() + schoolClass.getClassName());
            response.put("schoolClass", schoolClass);
        } else {
            response.put("className", studentClass.getClassId());
        }
        
        return ResponseEntity.ok(response);
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
