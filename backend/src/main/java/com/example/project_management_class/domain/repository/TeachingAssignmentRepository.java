package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.TeachingAssignment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TeachingAssignmentRepository extends MongoRepository<TeachingAssignment, String> {
    List<TeachingAssignment> findByTeacherId(String teacherId);
}