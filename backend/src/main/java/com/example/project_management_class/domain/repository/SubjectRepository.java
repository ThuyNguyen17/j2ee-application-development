package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Subject;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SubjectRepository extends MongoRepository<Subject, String> {
    Optional<Subject> findBySubjectCode(String subjectCode);
}
