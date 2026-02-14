package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Timetable;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TimetableRepository extends MongoRepository<Timetable, String> {
    List<Timetable> findByTeachingAssignmentIdAndWeek(String teachingAssignmentId, int week);
        
    // Tìm các tiết học thuộc danh sách phân công trong tuần cụ thể
    List<Timetable> findByTeachingAssignmentIdInAndWeek(List<String> assignmentIds, int week);
}
