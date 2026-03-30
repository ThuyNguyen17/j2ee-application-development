package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.SchoolClass;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface SchoolClassRepository extends MongoRepository<SchoolClass, String> {
    Optional<SchoolClass> findByGradeLevelAndClassName(Integer gradeLevel, String className);

    Optional<SchoolClass> findByGradeLevelAndClassNameIgnoreCase(Integer gradeLevel, String className);

    Optional<SchoolClass> findByAcademicYearIdAndGradeLevelAndClassNameIgnoreCase(String academicYearId, Integer gradeLevel, String className);
    // Backward-compat / tolerant lookup for datasets that store either "A1" or a full label like "10A1" in className.
    List<SchoolClass> findByClassNameIgnoreCase(String className);
}
