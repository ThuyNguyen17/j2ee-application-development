package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.ViolationLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ViolationLogRepository extends MongoRepository<ViolationLog, String> {
    List<ViolationLog> findByAssignmentId(String assignmentId);
    List<ViolationLog> findByUserId(String userId);
}
