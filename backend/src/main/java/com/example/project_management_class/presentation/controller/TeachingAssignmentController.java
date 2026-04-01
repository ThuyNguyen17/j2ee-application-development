package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.domain.model.TeachingAssignment;
import com.example.project_management_class.domain.model.Subject;
import com.example.project_management_class.domain.model.SchoolClass;
import com.example.project_management_class.domain.model.Teacher;
import com.example.project_management_class.domain.repository.TeachingAssignmentRepository;
import com.example.project_management_class.domain.repository.SubjectRepository;
import com.example.project_management_class.domain.repository.SchoolClassRepository;
import com.example.project_management_class.domain.repository.TeacherRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/teaching-assignments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TeachingAssignmentController {

    private final TeachingAssignmentRepository repository;
    private final SubjectRepository subjectRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final TeacherRepository teacherRepository;

    private Map<String, Object> toDto(TeachingAssignment ta) {
        Map<String, Object> dto = new HashMap<>();
        dto.put("id", ta.getId());
        dto.put("teacherId", ta.getTeacherId());
        dto.put("subjectId", ta.getSubjectId());
        dto.put("classId", ta.getClassId());
        dto.put("academicYearId", ta.getAcademicYearId());
        dto.put("semester", ta.getSemester());
        
        // Lấy tên từ các repository
        subjectRepository.findById(ta.getSubjectId()).ifPresent(s -> dto.put("subjectName", s.getSubjectName()));
        schoolClassRepository.findById(ta.getClassId()).ifPresent(c -> dto.put("className", c.getGradeLevel() + c.getClassName()));
        teacherRepository.findById(ta.getTeacherId()).ifPresent(t -> dto.put("teacherName", t.getFullName()));
        
        return dto;
    }

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<Map<String, Object>>> getByTeacher(@PathVariable String teacherId) {
        List<TeachingAssignment> assignments = repository.findByTeacherId(teacherId);
        List<Map<String, Object>> result = assignments.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<TeachingAssignment> create(@RequestBody TeachingAssignment assignment) {
        return ResponseEntity.ok(repository.save(assignment));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Map<String, Object>>> getAll() {
        List<TeachingAssignment> assignments = repository.findAll();
        List<Map<String, Object>> result = assignments.stream().map(this::toDto).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TeachingAssignment> update(@PathVariable String id, @RequestBody TeachingAssignment assignment) {
        assignment.setId(id);
        return ResponseEntity.ok(repository.save(assignment));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        repository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
