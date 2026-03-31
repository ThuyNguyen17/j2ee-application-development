package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.AttendanceService;
import com.example.project_management_class.application.util.ClassNameUtils;
import com.example.project_management_class.domain.enums.AttendanceStatus;
import com.example.project_management_class.domain.model.Attendance;
import com.example.project_management_class.domain.model.AttendanceSession;
import com.example.project_management_class.domain.model.AcademicYear;
import com.example.project_management_class.domain.model.TeachingAssignment;
import com.example.project_management_class.domain.repository.AcademicYearRepository;
import com.example.project_management_class.domain.repository.AttendanceRepository;
import com.example.project_management_class.domain.repository.AttendanceSessionRepository;
import com.example.project_management_class.domain.repository.TeachingAssignmentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import com.example.project_management_class.domain.model.SchoolClass;
import com.example.project_management_class.domain.model.Student;
import com.example.project_management_class.domain.model.StudentClass;
import com.example.project_management_class.domain.repository.SchoolClassRepository;
import com.example.project_management_class.domain.repository.StudentClassRepository;
import com.example.project_management_class.domain.repository.StudentRepository;

@Service
@RequiredArgsConstructor
public class AttendanceServiceImpl implements AttendanceService {

    private final AttendanceSessionRepository sessionRepository;
    private final AttendanceRepository attendanceRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final AcademicYearRepository academicYearRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final StudentClassRepository studentClassRepository;
    private final StudentRepository studentRepository;

    private SchoolClass resolveSchoolClassByIdOrName(String classIdOrName) {
        if (classIdOrName == null) return null;
        String raw = classIdOrName.trim();
        if (raw.isEmpty()) return null;

        // Preferred: StudentClass.classId stores SchoolClass.id
        SchoolClass byId = schoolClassRepository.findById(raw).orElse(null);
        if (byId != null) return byId;

        // Backward-compat: StudentClass.classId stores a label like "10A1"
        String key = ClassNameUtils.normalizeToKey(raw);
        Integer grade = ClassNameUtils.parseGradeLevel(key);
        String simpleName = ClassNameUtils.parseClassSimpleName(key);
        if (grade == null || simpleName == null || simpleName.isBlank()) return null;
        return schoolClassRepository.findByGradeLevelAndClassNameIgnoreCase(grade, simpleName).orElse(null);
    }

    private String resolveAcademicYearIdFromAssignment(TeachingAssignment assignment) {
        if (assignment == null) return null;

        // Prefer matching by the assignment's academicYear (e.g. 2025 -> "2025-2026" / "2025-2026 (something)").
        int year = assignment.getAcademicYear();
        if (year > 0) {
            for (AcademicYear ay : academicYearRepository.findAll()) {
                if (ay == null || ay.getId() == null || ay.getName() == null) continue;
                String name = ay.getName().trim();
                if (name.startsWith(year + "-")) return ay.getId();
                if (name.startsWith(String.valueOf(year))) return ay.getId();
            }
        }

        // Fallback to active academic year if defined.
        return academicYearRepository.findByActiveTrue().map(AcademicYear::getId).orElse(null);
    }

    @Override
    public AttendanceSession createOrGetSession(String assignmentId, LocalDate date, Integer period, Integer semester, Double latitude, Double longitude) {
        Optional<AttendanceSession> existing = sessionRepository.findFirstByTeachingAssignmentIdAndDateAndPeriod(assignmentId, date, period);
        if (existing.isPresent()) {
            AttendanceSession session = existing.get();
            if (!session.isOpen()) {
                session.setOpen(true);
                if (latitude != null) session.setLatitude(latitude);
                if (longitude != null) session.setLongitude(longitude);
                sessionRepository.save(session);
            }
            return session;
        }

        AttendanceSession newSession = new AttendanceSession();
        newSession.setTeachingAssignmentId(assignmentId);
        newSession.setDate(date);
        newSession.setPeriod(period);
        newSession.setSemester(semester);
        newSession.setOpen(true);
        newSession.setLatitude(latitude);
        newSession.setLongitude(longitude);
        // Generate initial QR token
        newSession.setQrToken(java.util.UUID.randomUUID().toString().substring(0, 8).toUpperCase());

        return sessionRepository.save(newSession);
    }

    @Override
    public AttendanceSession getSession(String sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    @Override
    public Attendance recordAttendance(String sessionId, String studentId, String studentName, String studentClass, String location, String qrToken, String note) {
        AttendanceSession session = getSession(sessionId);
        if (!session.isOpen()) {
            throw new RuntimeException("Attendance session is closed");
        }

        // Check token validity (allow current or previous token for grace period)
        if (qrToken == null || (!qrToken.equals(session.getQrToken()) && !qrToken.equals(session.getPreviousQrToken()))) {
            throw new RuntimeException("Invalid or expired QR token");
        }

        // Check for existing attendance for this student in this session
        Optional<Attendance> existing = attendanceRepository.findFirstByAttendanceSessionIdAndStudentId(sessionId, studentId);
        if (existing.isPresent()) {
            throw new RuntimeException("Bạn đã điểm danh cho buổi học này rồi.");
        }

        // Validate class (server-side): do not trust the client-provided class/name.
        String assignmentId = session.getTeachingAssignmentId();
        Student studentFromDb = studentRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        String resolvedStudentName = studentFromDb.getFullName();
        String resolvedStudentClass = studentClass;

        TeachingAssignment teachingAssignment = teachingAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));

        String academicYearId = resolveAcademicYearIdFromAssignment(teachingAssignment);

        List<StudentClass> studentClasses = studentClassRepository.findByStudentId(studentId);
        if (academicYearId != null && !academicYearId.isBlank()) {
            List<StudentClass> filtered = studentClasses.stream()
                    .filter(sc -> sc != null && academicYearId.equals(sc.getAcademicYearId()))
                    .collect(Collectors.toList());
            // If mapping academicYearId is wrong/missing in DB, don't block attendance incorrectly.
            if (!filtered.isEmpty()) {
                studentClasses = filtered;
            }
        }
        if (studentClasses.isEmpty()) {
            throw new RuntimeException("Ban chua duoc xep lop nen khong the diem danh.");
        }

        String assignmentClassKey = ClassNameUtils.normalizeToKey(teachingAssignment.getClassName());
        if (assignmentClassKey.isBlank()) {
            throw new RuntimeException("Khong xac dinh duoc lop cua buoi hoc nay.");
        }

        // StudentClass has no timestamp/order guarantee. Resolve the student's class that matches the session assignment.
        resolvedStudentClass = null;
        List<String> candidateStudentClasses = new ArrayList<>();
        for (StudentClass sc : studentClasses) {
            if (sc == null || sc.getClassId() == null || sc.getClassId().isBlank()) continue;

            String rawClassId = sc.getClassId().trim();
            SchoolClass schoolClass = resolveSchoolClassByIdOrName(rawClassId);
            if (schoolClass != null && schoolClass.getGradeLevel() != null && schoolClass.getClassName() != null) {
                String display = ClassNameUtils.formatDisplayClassName(schoolClass.getGradeLevel(), schoolClass.getClassName());
                String key = ClassNameUtils.normalizeToKey(display);
                if (!key.isBlank()) candidateStudentClasses.add(display);

                if (key.equals(assignmentClassKey)) {
                    resolvedStudentClass = display;
                    break;
                }
                continue;
            }

            // Fallback: treat classId itself as a class label (e.g. "10A1") even if it doesn't resolve to a SchoolClass.
            String key = ClassNameUtils.normalizeToKey(rawClassId);
            if (!key.isBlank()) candidateStudentClasses.add(rawClassId);
            if (key.equals(assignmentClassKey)) {
                resolvedStudentClass = rawClassId;
                break;
            }
        }

        if (resolvedStudentClass == null) {
            if (candidateStudentClasses.isEmpty()) {
                throw new RuntimeException("Khong xac dinh duoc lop cua ban.");
            }
            throw new RuntimeException("Ban khong thuoc lop nay (" + teachingAssignment.getClassName() + "). Lop cua ban: " + String.join(", ", candidateStudentClasses));
        }

        // Location is optional. If the session has a fixed location, validate distance only when we can parse lat/lon.
        String sanitizedLoc = location != null ? location.trim() : "";

        // Validate distance if session has a configured location.
        if (session.getLatitude() != null && session.getLongitude() != null) {
            double[] coords = extractLatLonFromLocation(sanitizedLoc).orElse(null);
            if (coords != null) {
                double studentLat = coords[0];
                double studentLng = coords[1];

                double distance = calculateDistanceInMeters(session.getLatitude(), session.getLongitude(), studentLat, studentLng);

                // Accept within 50 meters
                if (distance > 50.0) {
                    throw new RuntimeException("Vị trí của bạn quá xa so với lớp học (" + String.format("%.1f", distance) + "m). Vui lòng quét mã tại lớp học.");
                }
            }
        }

        // Create attendance record
        Attendance attendance = new Attendance();
        attendance.setAttendanceSessionId(sessionId);
        attendance.setStudentId(studentId);
        attendance.setStudentName(resolvedStudentName);
        attendance.setStudentClass(resolvedStudentClass);
        attendance.setLocation(sanitizedLoc);
        attendance.setNote(note);
        attendance.setStatus(AttendanceStatus.PRESENT);
        attendance.setAttendanceType("QR");
        attendance.setCheckInTime(LocalTime.now());

        return attendanceRepository.save(attendance);
    }

    @Override
    public Attendance updateAttendanceNote(String attendanceId, String note) {
        Attendance attendance = attendanceRepository.findById(attendanceId)
                .orElseThrow(() -> new RuntimeException("Attendance record not found"));
        attendance.setNote(note);
        return attendanceRepository.save(attendance);
    }

    @Override
    public List<Attendance> getAttendances(String sessionId) {
        return attendanceRepository.findByAttendanceSessionId(sessionId);
    }

    @Override
    public List<Map<String, Object>> getMissingStudents(String sessionId) {
        AttendanceSession session = getSession(sessionId);
        String assignmentId = session.getTeachingAssignmentId();

        List<Map<String, Object>> missingStudents = new ArrayList<>();

        TeachingAssignment assignment = teachingAssignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found"));
        if (assignment.getClassName() == null || assignment.getClassName().isBlank()) {
            throw new RuntimeException("Khong xac dinh duoc lop cua buoi hoc nay.");
        }

        String className = assignment.getClassName().trim();
        String assignmentClassKey = ClassNameUtils.normalizeToKey(className);
        if (assignmentClassKey.isBlank()) {
            throw new RuntimeException("Khong xac dinh duoc lop cua buoi hoc nay.");
        }

        String academicYearId = resolveAcademicYearIdFromAssignment(assignment);

        // Build roster from StudentClass.classId using multiple variants because datasets can store either:
        // - SchoolClass.id
        // - a display label like "10A1"
        // - a normalized key like "10a1"
        List<StudentClass> studentClasses = new ArrayList<>();
        String displayFromAssignment = ClassNameUtils.formatDisplayClassName(className);
        boolean triedWithAcademicYear = academicYearId != null && !academicYearId.isBlank();
        if (triedWithAcademicYear) {
            if (!displayFromAssignment.isBlank()) {
                studentClasses.addAll(studentClassRepository.findByAcademicYearIdAndClassIdIgnoreCase(academicYearId, displayFromAssignment));
            }
            studentClasses.addAll(studentClassRepository.findByAcademicYearIdAndClassIdIgnoreCase(academicYearId, className));
            studentClasses.addAll(studentClassRepository.findByAcademicYearIdAndClassIdIgnoreCase(academicYearId, assignmentClassKey));
        }
        if (studentClasses.isEmpty()) {
            if (!displayFromAssignment.isBlank()) {
                studentClasses.addAll(studentClassRepository.findByClassIdIgnoreCase(displayFromAssignment));
            }
            studentClasses.addAll(studentClassRepository.findByClassIdIgnoreCase(className));
            studentClasses.addAll(studentClassRepository.findByClassIdIgnoreCase(assignmentClassKey));
        }

        // Try resolve SchoolClass by academicYearId + parsed grade/class (most reliable when StudentClass.classId stores SchoolClass.id).
        Integer grade = ClassNameUtils.parseGradeLevel(assignmentClassKey);
        String simple = ClassNameUtils.parseClassSimpleName(assignmentClassKey);
        SchoolClass targetClass = null;
        if (academicYearId != null && grade != null && simple != null && !simple.isBlank()) {
            targetClass = schoolClassRepository
                    .findByAcademicYearIdAndGradeLevelAndClassNameIgnoreCase(academicYearId, grade, simple.toUpperCase())
                    .orElse(null);
            if (targetClass == null) {
                targetClass = schoolClassRepository
                        .findByAcademicYearIdAndGradeLevelAndClassNameIgnoreCase(academicYearId, grade, simple)
                        .orElse(null);
            }
        }
        if (targetClass == null) {
            targetClass = resolveSchoolClassByIdOrName(className);
        }
        if (targetClass != null && targetClass.getId() != null && !targetClass.getId().isBlank()) {
            if (academicYearId != null && !academicYearId.isBlank()) {
                studentClasses.addAll(studentClassRepository.findByAcademicYearIdAndClassId(academicYearId, targetClass.getId()));
            } else {
                studentClasses.addAll(studentClassRepository.findByClassId(targetClass.getId()));
            }

            String display = ClassNameUtils.formatDisplayClassName(targetClass.getGradeLevel(), targetClass.getClassName());
            if (!display.isBlank()) {
                if (academicYearId != null && !academicYearId.isBlank()) {
                    studentClasses.addAll(studentClassRepository.findByAcademicYearIdAndClassIdIgnoreCase(academicYearId, display));
                    studentClasses.addAll(studentClassRepository.findByAcademicYearIdAndClassIdIgnoreCase(academicYearId, ClassNameUtils.normalizeToKey(display)));
                } else {
                    studentClasses.addAll(studentClassRepository.findByClassIdIgnoreCase(display));
                    studentClasses.addAll(studentClassRepository.findByClassIdIgnoreCase(ClassNameUtils.normalizeToKey(display)));
                }
            }
        }

        if (studentClasses.isEmpty() && triedWithAcademicYear) {
            // academicYearId mapping could be wrong; retry SchoolClass-id based lookup without academic year filter.
            if (targetClass != null && targetClass.getId() != null && !targetClass.getId().isBlank()) {
                studentClasses.addAll(studentClassRepository.findByClassId(targetClass.getId()));
            }
        }

        if (studentClasses.isEmpty()) {
            // Last resort: scan and match by normalized class key / resolvable SchoolClass.
            final String targetKey = assignmentClassKey;
            final String targetClassId = targetClass != null ? targetClass.getId() : null;
            studentClasses = studentClassRepository.findAll().stream()
                    .filter(sc -> sc != null && sc.getClassId() != null && !sc.getClassId().isBlank())
                    .filter(sc -> academicYearId == null || academicYearId.isBlank() || academicYearId.equals(sc.getAcademicYearId()))
                    .filter(sc -> {
                        String raw = sc.getClassId().trim();
                        if (targetClassId != null && raw.equals(targetClassId)) return true;
                        if (ClassNameUtils.normalizeToKey(raw).equals(targetKey)) return true;
                        SchoolClass resolved = resolveSchoolClassByIdOrName(raw);
                        return targetClassId != null && resolved != null && targetClassId.equals(resolved.getId());
                    })
                    .collect(Collectors.toList());

            if (studentClasses.isEmpty() && triedWithAcademicYear) {
                // Retry last-resort scan without academic year filter if mapping seems wrong.
                studentClasses = studentClassRepository.findAll().stream()
                        .filter(sc -> sc != null && sc.getClassId() != null && !sc.getClassId().isBlank())
                        .filter(sc -> {
                            String raw = sc.getClassId().trim();
                            if (targetClassId != null && raw.equals(targetClassId)) return true;
                            if (ClassNameUtils.normalizeToKey(raw).equals(targetKey)) return true;
                            SchoolClass resolved = resolveSchoolClassByIdOrName(raw);
                            return targetClassId != null && resolved != null && targetClassId.equals(resolved.getId());
                        })
                        .collect(Collectors.toList());
            }
        }

        // De-dup (same student can appear multiple times due to multiple lookup variants).
        Map<String, StudentClass> uniqueByStudent = new HashMap<>();
        for (StudentClass sc : studentClasses) {
            if (sc == null) continue;
            if (sc.getStudentId() == null || sc.getStudentId().isBlank()) continue;
            uniqueByStudent.putIfAbsent(sc.getStudentId().trim(), sc);
        }
        studentClasses = new ArrayList<>(uniqueByStudent.values());

        List<String> studentIds = studentClasses.stream()
                .map(StudentClass::getStudentId)
                .filter(id -> id != null && !id.isBlank())
                .collect(Collectors.toList());

        List<Student> allStudents = new ArrayList<>();
        if (!studentIds.isEmpty()) {
            studentRepository.findAllById(studentIds).forEach(allStudents::add);
        }

        List<Attendance> attendances = attendanceRepository.findByAttendanceSessionId(sessionId);
        List<String> attendedStudentIds = attendances.stream().map(Attendance::getStudentId).collect(Collectors.toList());

        for (Student s : allStudents) {
            if (!attendedStudentIds.contains(s.getId())) {
                Map<String, Object> map = new HashMap<>();
                map.put("studentId", s.getId());
                map.put("studentCode", s.getStudentCode());
                map.put("studentName", s.getFullName());
                map.put("studentClass", className);
                missingStudents.add(map);
            }
        }

        return missingStudents;
    }

    @Override
    public AttendanceSession updateQrToken(String sessionId, String newToken) {
        AttendanceSession session = getSession(sessionId);
        session.setPreviousQrToken(session.getQrToken()); // Store previous token
        session.setQrToken(newToken);
        return sessionRepository.save(session);
    }

    @Override
    public void closeSession(String sessionId) {
        AttendanceSession session = getSession(sessionId);
        session.setOpen(false);
        sessionRepository.save(session);
    }

    @Override
    public void deleteAttendancesBySession(String sessionId) {
        attendanceRepository.deleteAllByAttendanceSessionId(sessionId);
    }

    private static final Pattern LAT_LON_DECIMAL_PAIR =
            Pattern.compile("(-?\\d{1,3}\\.\\d+)\\s*,\\s*(-?\\d{1,3}\\.\\d+)");

    /**
     * Extract the last "(lat, lon)"-like decimal pair from the location string.
     * Accepts values like:
     * - "21.028511, 105.804817"
     * - "Some address (21.028511, 105.804817)"
     */
    private Optional<double[]> extractLatLonFromLocation(String location) {
        if (location == null) return Optional.empty();
        String s = location.trim();
        if (s.isEmpty()) return Optional.empty();

        Matcher m = LAT_LON_DECIMAL_PAIR.matcher(s);
        double[] last = null;
        while (m.find()) {
            try {
                double lat = Double.parseDouble(m.group(1));
                double lon = Double.parseDouble(m.group(2));
                last = new double[]{lat, lon};
            } catch (NumberFormatException ignored) {
                // continue
            }
        }
        return Optional.ofNullable(last);
    }

    private double calculateDistanceInMeters(double lat1, double lon1, double lat2, double lon2) {
        final int R = 6371; // Radius of the earth in km
        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000; // convert to meters
    }
}