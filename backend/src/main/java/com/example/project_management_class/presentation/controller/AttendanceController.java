package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.dto.AttendanceRecordRequest;
import com.example.project_management_class.application.dto.NoteRequest;
import com.example.project_management_class.application.dto.SessionStartRequest;
import com.example.project_management_class.application.dto.TokenRequest;
import com.example.project_management_class.application.service.AttendanceService;
import com.example.project_management_class.domain.model.Attendance;
import com.example.project_management_class.domain.model.AttendanceSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AttendanceController {

    private final AttendanceService attendanceService;
    @PostMapping("/session/start")
    public ResponseEntity<AttendanceSession> startSession(@RequestBody SessionStartRequest request) {
        AttendanceSession session = attendanceService.openSession(
                request.getAssignmentId(),
                request.getDate(),
                request.getPeriod(),
                request.getSemester(),
                request.getLatitude(),
                request.getLongitude()
        );
        return ResponseEntity.ok(session);
    }

    @GetMapping("/session/{sessionId}")
    public ResponseEntity<AttendanceSession> getSession(@PathVariable String sessionId) {
        return ResponseEntity.ok(attendanceService.getSessionById(sessionId));
    }

    @PostMapping("/session/{sessionId}/token")
    public ResponseEntity<AttendanceSession> updateToken(
            @PathVariable String sessionId,
            @RequestBody TokenRequest request) {
        return ResponseEntity.ok(attendanceService.updateQrToken(sessionId, request.getToken()));
    }

    @PostMapping("/session/{sessionId}/close")
    public ResponseEntity<Void> closeSession(@PathVariable String sessionId) {
        attendanceService.closeSession(sessionId);
        return ResponseEntity.ok().build();
    }

    // ==============================
    // ATTENDANCE
    // ==============================

    @PostMapping("/check-in")
    public ResponseEntity<Attendance> checkIn(@RequestBody AttendanceRecordRequest request) {
        Attendance attendance = attendanceService.checkIn(
                request.getSessionId(),
                request.getStudentId(),
                request.getStudentName(),
                request.getQrToken(),
                request.getLocation(),
                request.getNote()
        );
        return ResponseEntity.ok(attendance);
    }

    // Alias cho /check-in - tương thích với frontend
    @PostMapping("/record")
    public ResponseEntity<Attendance> record(@RequestBody AttendanceRecordRequest request) {
        return checkIn(request);
    }

    @PutMapping("/{attendanceId}/note")
    public ResponseEntity<Attendance> updateNote(
            @PathVariable String attendanceId,
            @RequestBody NoteRequest request
    ) {
        return ResponseEntity.ok(
                attendanceService.updateNote(attendanceId, request.getNote())
        );
    }

    @GetMapping("/session/{sessionId}/attendances")
    public ResponseEntity<List<Attendance>> getAttendances(@PathVariable String sessionId) {
        return ResponseEntity.ok(
                attendanceService.getAttendancesBySession(sessionId)
        );
    }

    @DeleteMapping("/session/{sessionId}/clear")
    public ResponseEntity<Void> clearAttendances(@PathVariable String sessionId) {
        attendanceService.deleteAllBySession(sessionId);
        return ResponseEntity.ok().build();
    }

    // ==============================
    // REPORT
    // ==============================

    @GetMapping("/session/{sessionId}/absent")
    public ResponseEntity<List<String>> getAbsentStudents(@PathVariable String sessionId) {
        return ResponseEntity.ok(
                attendanceService.getAbsentStudentIds(sessionId)
        );
    }
}