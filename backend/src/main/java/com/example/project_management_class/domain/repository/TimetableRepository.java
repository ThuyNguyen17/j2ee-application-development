package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Timetable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDate;
import java.util.List;

public interface TimetableRepository extends MongoRepository<Timetable, String> {

    List<Timetable> findByTeachingAssignmentIdInAndActualDateBetween(
            List<String> assignmentIds,
            LocalDate startDate,
            LocalDate endDate
    );

    List<Timetable> findByTeachingAssignmentIdInAndActualDate(
            List<String> assignmentIds,
            LocalDate date
    );

    List<Timetable> findByTeachingAssignmentId(String teachingAssignmentId);
}