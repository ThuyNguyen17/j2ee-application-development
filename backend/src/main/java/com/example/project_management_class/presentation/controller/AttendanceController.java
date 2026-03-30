package com.example.project_management_class.presentation.controller;

import com.example.project_management_class.application.dto.AttendanceRecordRequest;
import com.example.project_management_class.application.dto.NoteRequest;
import com.example.project_management_class.application.dto.SessionStartRequest;
import com.example.project_management_class.application.dto.UpdateTokenRequest;
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
@CrossOrigin(origins = "*") // Adjust for security later
public class AttendanceController {

    private final AttendanceService attendanceService;

    @PostMapping("/session/start")
    public ResponseEntity<AttendanceSession> startSession(@RequestBody SessionStartRequest request) {
        AttendanceSession session = attendanceService.createOrGetSession(
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
    public ResponseEntity<AttendanceSession> getSession(@PathVariable("sessionId") String sessionId) {
        return ResponseEntity.ok(attendanceService.getSession(sessionId));
    }

    @PostMapping("/session/{sessionId}/token")
    public ResponseEntity<AttendanceSession> updateToken(@PathVariable("sessionId") String sessionId, @RequestBody UpdateTokenRequest request) {
        AttendanceSession session = attendanceService.updateQrToken(sessionId, request.getToken());
        return ResponseEntity.ok(session);
    }

    @PostMapping("/record")
    public ResponseEntity<Attendance> recordAttendance(@RequestBody AttendanceRecordRequest request) {
        Attendance attendance = attendanceService.recordAttendance(
                request.getSessionId(),
                request.getStudentId(),
                request.getStudentName(),
                request.getStudentClass(),
                request.getLocation(),
                request.getQrToken(),
                request.getNote()
        );
        return ResponseEntity.ok(attendance);
    }

    @PutMapping("/{attendanceId}/note")
    public ResponseEntity<Attendance> updateNote(@PathVariable("attendanceId") String attendanceId, @RequestBody NoteRequest request) {
        return ResponseEntity.ok(attendanceService.updateAttendanceNote(attendanceId, request.getNote()));
    }

    @GetMapping("/session/{sessionId}/attendances")
    public ResponseEntity<List<Attendance>> getAttendances(@PathVariable("sessionId") String sessionId) {
        return ResponseEntity.ok(attendanceService.getAttendances(sessionId));
    }

    @GetMapping("/session/{sessionId}/missing")
    public ResponseEntity<List<java.util.Map<String, Object>>> getMissingStudents(@PathVariable("sessionId") String sessionId) {
        return ResponseEntity.ok(attendanceService.getMissingStudents(sessionId));
    }

    @PostMapping("/session/{sessionId}/close")
    public ResponseEntity<Void> closeSession(@PathVariable("sessionId") String sessionId) {
        attendanceService.closeSession(sessionId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/session/{sessionId}/clear")
    public ResponseEntity<Void> clearAttendances(@PathVariable("sessionId") String sessionId) {
        attendanceService.deleteAttendancesBySession(sessionId);
        return ResponseEntity.ok().build();
    }
}