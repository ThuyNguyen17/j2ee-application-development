package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.AcademicYear;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface AcademicYearRepository extends MongoRepository<AcademicYear, String> {
    Optional<AcademicYear> findByActiveTrue();
}

