package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Attendance;
import com.example.project_management_class.domain.model.AttendanceSession;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceService {
    AttendanceSession openSession(
            String teachingAssignmentId,
            LocalDate date,
            Integer period,
            Integer semester,
            Double latitude,
            Double longitude
    );

    AttendanceSession getSessionById(String sessionId);
    AttendanceSession updateQrToken(String sessionId, String token);

    void closeSession(String sessionId);
    Attendance checkIn(
            String sessionId,
            String studentId,
            String studentName,
            String qrToken,
            String location,
            String note
    );

    Attendance updateNote(String attendanceId, String note);

    List<Attendance> getAttendancesBySession(String sessionId);

    void deleteAllBySession(String sessionId);

    List<String> getAbsentStudentIds(String sessionId);
}