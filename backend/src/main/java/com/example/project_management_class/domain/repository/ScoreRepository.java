package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Score;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ScoreRepository extends MongoRepository<Score, String> {
    List<Score> findByStudentId(String studentId);
    List<Score> findByTeachingAssignmentId(String teachingAssignmentId);
}
