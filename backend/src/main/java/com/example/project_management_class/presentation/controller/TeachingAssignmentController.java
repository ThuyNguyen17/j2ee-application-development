package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.domain.model.TeachingAssignment;
import com.example.project_management_class.domain.repository.TeachingAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/teaching-assignments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class TeachingAssignmentController {

    private final TeachingAssignmentRepository repository;

    @GetMapping("/teacher/{teacherId}")
    public ResponseEntity<List<TeachingAssignment>> getByTeacher(@PathVariable String teacherId) {
        return ResponseEntity.ok(repository.findByTeacherId(teacherId));
    }

    @PostMapping
    public ResponseEntity<TeachingAssignment> create(@RequestBody TeachingAssignment assignment) {
        return ResponseEntity.ok(repository.save(assignment));
    }

    @GetMapping("/all")
    public ResponseEntity<List<TeachingAssignment>> getAll() {
        return ResponseEntity.ok(repository.findAll());
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
