package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.TeachingAssignment;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TeachingAssignmentRepository extends MongoRepository<TeachingAssignment, String> {
    List<TeachingAssignment> findByTeacherId(String teacherId);

    List<TeachingAssignment> findByTeacherIdAndAcademicYearAndSemester(String teacherId, int academicYear, int semester);

    List<TeachingAssignment> findByClassNameAndAcademicYearAndSemester(String className, int academicYear, int semester);

    List<TeachingAssignment> findByClassNameIgnoreCaseAndAcademicYearAndSemester(String className, int academicYear, int semester);
}
