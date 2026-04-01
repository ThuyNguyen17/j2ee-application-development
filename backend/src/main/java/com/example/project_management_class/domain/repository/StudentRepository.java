package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StudentRepository extends MongoRepository<Student, String> {
    Optional<Student> findByStudentCode(String studentCode);
    Optional<Student> findByStudentCodeIgnoreCase(String studentCode);
    Optional<Student> findByUserId(String userId);
}
