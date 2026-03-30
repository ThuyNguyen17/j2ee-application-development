
package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.StudentClass;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Repository;



@Repository
public interface StudentClassRepository extends MongoRepository<StudentClass, String> {
    List<StudentClass> findByStudentId(String studentId);
    List<StudentClass> findByClassId(String classId);
    // Backward-compat: some datasets store classId as a human-readable class label (e.g. "10A1") instead of SchoolClass.id.
    List<StudentClass> findByClassIdIgnoreCase(String classId);
    List<StudentClass> findByAcademicYearIdAndClassId(String academicYearId, String classId);
    List<StudentClass> findByAcademicYearIdAndClassIdIgnoreCase(String academicYearId, String classId);
    Optional<StudentClass> findByStudentIdAndAcademicYearId(String studentId, String academicYearId);
}