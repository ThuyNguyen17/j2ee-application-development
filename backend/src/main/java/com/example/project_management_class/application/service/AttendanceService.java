
package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Attendance;
import com.example.project_management_class.domain.model.AttendanceSession;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

public interface AttendanceService {
    AttendanceSession createOrGetSession(String assignmentId, LocalDate date, Integer period, Integer semester, Double latitude, Double longitude);
    AttendanceSession getSession(String sessionId);
    Attendance recordAttendance(String sessionId, String studentId, String studentName, String studentClass, String location, String qrToken, String note);
    Attendance updateAttendanceNote(String attendanceId, String note);
    List<Attendance> getAttendances(String sessionId);
    List<Map<String, Object>> getMissingStudents(String sessionId);
    AttendanceSession updateQrToken(String sessionId, String newToken);
    void closeSession(String sessionId);
    void deleteAttendancesBySession(String sessionId);
}
