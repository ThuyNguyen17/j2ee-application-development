package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.AttendanceService;
import com.example.project_management_class.domain.enums.AttendanceStatus;
import com.example.project_management_class.domain.model.*;
import com.example.project_management_class.domain.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRepository attendanceRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final StudentClassRepository studentClassRepository;
    private final StudentRepository studentRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final UserRepository userRepository;

    // ==============================
    // SESSION
    // ==============================

    @Override
    public AttendanceSession openSession(
            String teachingAssignmentId,
            LocalDate date,
            Integer period,
            Integer semester,
            Double latitude,
            Double longitude
    ) {
        return sessionRepository
                .findFirstByTeachingAssignmentIdAndDateAndPeriod(teachingAssignmentId, date, period)
                .map(session -> {
                    if (!session.isOpen()) {
                        session.setOpen(true);
                        session.setLatitude(latitude);
                        session.setLongitude(longitude);
                        sessionRepository.save(session);
                    }
                    return session;
                })
                .orElseGet(() -> {
                    AttendanceSession s = new AttendanceSession();
                    s.setTeachingAssignmentId(teachingAssignmentId);
                    s.setDate(date);
                    s.setPeriod(period);
                    s.setSemester(semester);
                    s.setOpen(true);
                    s.setLatitude(latitude);
                    s.setLongitude(longitude);
                    s.setQrToken(generateToken());
                    return sessionRepository.save(s);
                });
    }

    @Override
    public AttendanceSession getSessionById(String sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    @Override
    public AttendanceSession updateQrToken(String sessionId, String token) {
        AttendanceSession session = getSessionById(sessionId);
        session.setPreviousQrToken(session.getQrToken());
        session.setQrToken(token);
        return sessionRepository.save(session);
    }

    @Override
    public void closeSession(String sessionId) {
        AttendanceSession session = getSessionById(sessionId);
        session.setOpen(false);
        sessionRepository.save(session);
    }

    private String generateToken() {
        return java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // ==============================
    // ATTENDANCE
    // ==============================

    @Override
    public Attendance checkIn(
            String sessionId,
            String studentId,
            String studentName,
            String qrToken,
            String location,
            String note
    ) {
        AttendanceSession session = getSessionById(sessionId);

        validateSession(session, qrToken);

        // Move checking duplicate AFTER resolving the actual student ID
        // so that we can check consistently using the document ID.

        String sid = studentId != null ? studentId.trim() : "";
        Student student = studentRepository.findById(sid).orElse(null);
        
        if (student == null) {
            log.info("Student not found by ID: {}, searching by field userId...", sid);
            student = studentRepository.findByUserId(sid).orElse(null);
        }
        
        if (student == null) {
            log.info("Student not found by userId field: {}, searching by studentCode...", sid);
            student = studentRepository.findByStudentCodeIgnoreCase(sid).orElse(null);
        }
        
        if (student == null) {
            log.info("Student not found by studentCode: {}, trying to resolve via User collection...", sid);
            Optional<User> userOpt = userRepository.findById(sid);
            if (userOpt.isPresent()) {
                User user = userOpt.get();
                log.info("Found User: {}, resolving student via userId={} or username={}", user.getId(), user.getId(), user.getUsername());
                student = studentRepository.findByUserId(user.getId())
                        .orElseGet(() -> studentRepository.findByStudentCodeIgnoreCase(user.getUsername()).orElse(null));
            }
        }
        
        // Final fallback: linear search for safety (only if still not found)
        if (student == null) {
            log.warn("Still not found student {}. Performing linear fallback search...", sid);
            List<Student> all = studentRepository.findAll();
            for (Student s : all) {
                if (sid.equals(s.getUserId()) || sid.equalsIgnoreCase(s.getStudentCode())) {
                    log.info("MATCHED student in linear search: {} (ID={})", s.getFullName(), s.getId());
                    student = s;
                    break;
                }
            }
        }

        if (student == null) {
            log.error("Student not found with ID, userId or studentCode: {}", studentId);
            throw new RuntimeException("Student not found: " + studentId);
        }

        // Always use the official Student ID (document ID) for consistency
        String actualStudentId = student.getId();
        log.info("Resolved student: input={}, actualId={}, fullName={}", studentId, actualStudentId, student.getFullName());

        // Check duplicate with the actual ID
        checkDuplicate(sessionId, actualStudentId);

        TeachingAssignment assignment = teachingAssignmentRepository
                .findById(session.getTeachingAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        String actualClass = resolveStudentClass(actualStudentId, assignment);

        validateLocation(session, location);

        Attendance attendance = new Attendance();
        attendance.setAttendanceSessionId(sessionId);
        // Important: Store the actual Student ID for consistency in reporting
        attendance.setStudentId(actualStudentId);
        attendance.setStudentName(studentName != null ? studentName : student.getFullName());
        attendance.setLocation(location);
        attendance.setNote(note);
        attendance.setStatus(AttendanceStatus.PRESENT);
        attendance.setAttendanceType("QR");
        attendance.setCheckInTime(LocalTime.now());

        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance updateNote(String attendanceId, String note) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));

        attendance.setNote(note);
        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAttendancesBySession(String sessionId) {
        return attendanceRepository.findByAttendanceSessionId(sessionId);
    }

    @Override
    public void deleteAllBySession(String sessionId) {
        attendanceRepository.deleteAllByAttendanceSessionId(sessionId);
    }

    // ==============================
    // REPORT
    // ==============================

    @Override
    public List<String> getAbsentStudentIds(String sessionId) {

        AttendanceSession session = getSessionById(sessionId);

        TeachingAssignment assignment = teachingAssignmentRepository
                .findById(session.getTeachingAssignmentId())
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        List<StudentClass> studentClasses =
                studentClassRepository.findByClassId(assignment.getClassId());

        List<String> allStudentIds = studentClasses.stream()
                .map(StudentClass::getStudentId)
                .toList();

        List<String> attendedIds = attendanceRepository
                .findByAttendanceSessionId(sessionId)
                .stream()
                .map(Attendance::getStudentId)
                .toList();

        return allStudentIds.stream()
                .filter(id -> !attendedIds.contains(id))
                .toList();
    }

    // ==============================
    // VALIDATION
    // ==============================

    private void validateSession(AttendanceSession session, String qrToken) {
        if (!session.isOpen()) throw new RuntimeException("Session closed");

        String currentToken = session.getQrToken();
        String previousToken = session.getPreviousQrToken();
        
        log.info("Validating QR - received: {}, current: {}, previous: {}", 
                 qrToken, currentToken, previousToken);

        boolean match = Objects.equals(qrToken, currentToken) || Objects.equals(qrToken, previousToken);
        
        if (!match) {
            log.warn("QR mismatch - possible race condition. Retrying once after 50ms...");
            try { Thread.sleep(50); } catch (InterruptedException e) { Thread.currentThread().interrupt(); }
            AttendanceSession reloaded = getSessionById(session.getId());
            currentToken = reloaded.getQrToken();
            previousToken = reloaded.getPreviousQrToken();
            log.info("Retried - QR received: {}, current: {}, previous: {}",
                    qrToken, currentToken, previousToken);
            match = Objects.equals(qrToken, currentToken) || Objects.equals(qrToken, previousToken);
        }

        if (!match) {
            log.error("QR validation failed - received: {}, current: {}, previous: {}",
                     qrToken, currentToken, previousToken);
            throw new RuntimeException("Invalid QR");
        }
    }

    private void checkDuplicate(String sessionId, String studentId) {
        if (attendanceRepository
                .findFirstByAttendanceSessionIdAndStudentId(sessionId, studentId)
                .isPresent()) {
            throw new RuntimeException("Already checked in");
        }
    }

    private String resolveStudentClass(String studentId, TeachingAssignment assignment) {

        List<StudentClass> list = studentClassRepository.findByStudentId(studentId);

        if (list.isEmpty()) {
            throw new RuntimeException("Student chưa được xếp lớp");
        }

        String targetClassId = assignment.getClassId();

        return list.stream()
                .map(StudentClass::getClassId)
                .filter(Objects::nonNull)
                .filter(c -> c.equals(targetClassId))
                .findFirst()
                .orElseThrow(() -> {
                    SchoolClass schoolClass = schoolClassRepository.findById(targetClassId).orElse(null);
                    String className = schoolClass != null ? 
                        schoolClass.getGradeLevel() + schoolClass.getClassName() : targetClassId;
                    return new RuntimeException("Bạn không thuộc lớp " + className);
                });
    }

    private String normalize(String s) {
        return s.replaceAll("\\s+", "").toLowerCase();
    }

    private void validateLocation(AttendanceSession session, String location) {
        if (session.getLatitude() == null || session.getLongitude() == null) return;

        double[] coords = extractLatLon(location);
        if (coords == null) return;

        double distance = calculateDistance(
                session.getLatitude(),
                session.getLongitude(),
                coords[0],
                coords[1]
        );

        if (distance > 50) {
            throw new RuntimeException("Bạn ở quá xa lớp (" + distance + "m)");
        }
    }

    private double[] extractLatLon(String loc) {
        try {
            String[] parts = loc.split(",");
            return new double[]{
                    Double.parseDouble(parts[0].trim()),
                    Double.parseDouble(parts[1].trim())
            };
        } catch (Exception e) {
            return null;
        }
    }

    private double calculateDistance(double lat1, double lon1, double lat2, double lon2) {
        double R = 6371;
        double dLat = Math.toRadians(lat2 - lat1);
        double dLon = Math.toRadians(lon2 - lon1);

        double a = Math.sin(dLat / 2) * Math.sin(dLat / 2)
                + Math.cos(Math.toRadians(lat1))
                * Math.cos(Math.toRadians(lat2))
                * Math.sin(dLon / 2) * Math.sin(dLon / 2);

        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)) * 1000;
    }
}