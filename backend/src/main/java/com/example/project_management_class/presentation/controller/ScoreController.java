package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.domain.model.Score;
import com.example.project_management_class.domain.repository.ScoreRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/scores")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ScoreController {

    private final ScoreRepository scoreRepository;

    @GetMapping
    public ResponseEntity<List<Score>> getAll() {
        return ResponseEntity.ok(scoreRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Score> getById(@PathVariable String id) {
        return ResponseEntity.ok(scoreRepository.findById(id).orElse(null));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Score>> getByStudentId(@PathVariable String studentId) {
        return ResponseEntity.ok(scoreRepository.findByStudentId(studentId));
    }

    @GetMapping("/teaching-assignment/{teachingAssignmentId}")
    public ResponseEntity<List<Score>> getByTeachingAssignmentId(@PathVariable String teachingAssignmentId) {
        return ResponseEntity.ok(scoreRepository.findByTeachingAssignmentId(teachingAssignmentId));
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Score score) {
        Score saved = scoreRepository.save(score);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable String id, @RequestBody Score score) {
        score.setId(id);
        Score saved = scoreRepository.save(score);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", saved);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable String id) {
        scoreRepository.deleteById(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Deleted successfully");
        return ResponseEntity.ok(response);
    }
}
