package com.example.project_management_class.domain.repository;

import com.example.project_management_class.domain.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;
import java.util.Optional;

public interface AttendanceRepository extends MongoRepository<Attendance, String> {
    List<Attendance> findByAttendanceSessionId(String sessionId);
    Optional<Attendance> findFirstByAttendanceSessionIdAndStudentId(String sessionId, String studentId);
    void deleteAllByAttendanceSessionId(String sessionId);
}
