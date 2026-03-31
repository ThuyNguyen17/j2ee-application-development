package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.StudentService;
import com.example.project_management_class.application.util.ClassNameUtils;
import com.example.project_management_class.application.dto.LoginResponse;
import com.example.project_management_class.application.dto.StudentLoginResponse;
import com.example.project_management_class.domain.enums.Role;
import com.example.project_management_class.domain.model.*;
import com.example.project_management_class.domain.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.ZoneId;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentServiceImpl implements StudentService {

    private final StudentRepository studentRepository;
    private final StudentClassRepository studentClassRepository;
    private final SchoolClassRepository schoolClassRepository;
    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final AttendanceRepository attendanceRepository;
    private final AttendanceSessionRepository attendanceSessionRepository;
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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

        SchoolClass byGradeAndName = schoolClassRepository.findByGradeLevelAndClassNameIgnoreCase(grade, simpleName).orElse(null);
        if (byGradeAndName != null) return byGradeAndName;

        // Tolerant fallbacks for inconsistent datasets:
        // - some store className as "A1" but gradeLevel is stored with an unexpected type (string/number mismatch)
        // - some store className as the full label like "10A1"
        String display = ClassNameUtils.formatDisplayClassName(raw);
        List<SchoolClass> bySimple = schoolClassRepository.findByClassNameIgnoreCase(simpleName);
        if (bySimple != null && !bySimple.isEmpty()) {
            SchoolClass best = pickBestByGrade(bySimple, grade);
            if (best != null) return best;
        }

        if (display != null && !display.isBlank()) {
            List<SchoolClass> byDisplay = schoolClassRepository.findByClassNameIgnoreCase(display);
            if (byDisplay != null && !byDisplay.isEmpty()) {
                SchoolClass best = pickBestByGrade(byDisplay, grade);
                if (best != null) return best;
            }
        }

        return null;
    }

    private static SchoolClass pickBestByGrade(List<SchoolClass> candidates, Integer grade) {
        if (candidates == null || candidates.isEmpty()) return null;
        if (grade != null) {
            for (SchoolClass c : candidates) {
                if (c != null && grade.equals(c.getGradeLevel())) return c;
            }
        }
        for (SchoolClass c : candidates) {
            if (c != null) return c;
        }
        return null;
    }

    @Override
    public LoginResponse login(String username, String password) {
        String normalizedUsername = username == null ? "" : username.trim();
        User user = userRepository.findByUsername(normalizedUsername)
                .orElseThrow(() -> new RuntimeException("Sai tai khoan hoac mat khau"));

        if (Boolean.FALSE.equals(user.isActive())) {
            throw new RuntimeException("Tai khoan da bi khoa");
        }

        String stored = user.getPassword() == null ? "" : user.getPassword();
        boolean ok;
        // Backward-compat: support both plaintext (old demo data) and bcrypt hashes (NodeJS seeder).
        if (stored.startsWith("$2a$") || stored.startsWith("$2b$") || stored.startsWith("$2y$")) {
            ok = passwordEncoder.matches(password, stored);
        } else {
            ok = stored.equals(password);
        }
        if (!ok) {
            throw new RuntimeException("Sai tai khoan hoac mat khau");
        }

        LoginResponse.LoginResponseBuilder builder = LoginResponse.builder()
                .userId(user.getId())
                .username(user.getUsername())
                .role(user.getRole());

        if (user.getRole() == Role.STUDENT) {
            // Mongoose commonly stores userId as ObjectId, while this Java model uses String.
            // To stay compatible with seeded demo data (username like "HS001"), fall back to lookups by id/code.
            Student student = studentRepository.findByUserId(user.getId())
                    .or(() -> studentRepository.findById(user.getUsername()))
                    .or(() -> studentRepository.findByStudentCode(user.getUsername()))
                    .orElseThrow(() -> new RuntimeException("Thông tin học sinh không tồn tại"));

            builder.studentId(student.getId())
                    .studentCode(student.getStudentCode())
                    .fullName(student.getFullName());

            // Get class name
            List<StudentClass> studentClasses = studentClassRepository.findByStudentId(student.getId());
            if (!studentClasses.isEmpty()) {
                StudentClass sc = studentClasses.get(studentClasses.size() - 1);
                SchoolClass schoolClass = resolveSchoolClassByIdOrName(sc.getClassId());
                if (schoolClass != null && schoolClass.getGradeLevel() != null && schoolClass.getClassName() != null) {
                    builder.className(ClassNameUtils.formatDisplayClassName(
                            schoolClass.getGradeLevel(),
                            schoolClass.getClassName()
                    ));
                } else if (sc.getClassId() != null && !sc.getClassId().isBlank()) {
                    builder.className(ClassNameUtils.formatDisplayClassName(sc.getClassId().trim()));
                }
            }
        } else if (user.getRole() == Role.TEACHER) {
            // Same compatibility concern as Student.userId: seeded data uses teacher id like "GV001".
            Teacher teacher = teacherRepository.findByUserId(user.getId())
                    .or(() -> teacherRepository.findById(user.getUsername()))
                    .orElseThrow(() -> new RuntimeException("Thông tin giáo viên không tồn tại"));

            builder.teacherId(teacher.getId())
                    .fullName(teacher.getFullName());
        }

        return builder.build();
    }

    @Override
    public StudentLoginResponse login(String studentCode) {
        Student student = studentRepository.findByStudentCode(studentCode)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy học sinh với mã: " + studentCode));

        List<StudentClass> studentClasses = studentClassRepository.findByStudentId(student.getId());
        String className = "N/A";
        if (!studentClasses.isEmpty()) {
            StudentClass sc = studentClasses.get(studentClasses.size() - 1);
            SchoolClass schoolClass = resolveSchoolClassByIdOrName(sc.getClassId());
            if (schoolClass != null && schoolClass.getGradeLevel() != null && schoolClass.getClassName() != null) {
                className = ClassNameUtils.formatDisplayClassName(
                        schoolClass.getGradeLevel(),
                        schoolClass.getClassName()
                );
            } else if (sc.getClassId() != null && !sc.getClassId().isBlank()) {
                className = ClassNameUtils.formatDisplayClassName(sc.getClassId().trim());
            }
        }

        return StudentLoginResponse.builder()
                .studentId(student.getId())
                .studentCode(student.getStudentCode())
                .fullName(student.getFullName())
                .className(className)
                .build();
    }

    @Override
    public List<Map<String, Object>> getStudentSubjects(String studentId) {
        log.info("getStudentSubjects called with studentId={}", studentId);
        try {
            List<StudentClass> studentClasses = studentClassRepository.findByStudentId(studentId);
            log.info("Found {} studentClasses for studentId={}", studentClasses.size(), studentId);
            if (studentClasses.isEmpty()) return Collections.emptyList();

            StudentClass sc = studentClasses.get(studentClasses.size() - 1);
            log.info("Using StudentClass: id={}, classId={}", sc.getId(), sc.getClassId());
            
            SchoolClass schoolClass = resolveSchoolClassByIdOrName(sc.getClassId());
            String className = null;
            if (schoolClass != null && schoolClass.getGradeLevel() != null && schoolClass.getClassName() != null) {
                className = ClassNameUtils.formatDisplayClassName(
                        schoolClass.getGradeLevel(),
                        schoolClass.getClassName()
                );
            } else if (sc.getClassId() != null && !sc.getClassId().isBlank()) {
                className = ClassNameUtils.formatDisplayClassName(sc.getClassId().trim());
            }
            log.info("Resolved className={}", className);
            if (className == null || className.isBlank()) return Collections.emptyList();

            final String studentClassKey = ClassNameUtils.normalizeToKey(className);
            log.info("studentClassKey={}", studentClassKey);
            
            // Check if repository is available
            if (teachingAssignmentRepository == null) {
                log.error("teachingAssignmentRepository is NULL!");
                return Collections.emptyList();
            }
            
            List<TeachingAssignment> allAssignments = teachingAssignmentRepository.findAll();
            if (allAssignments == null) {
                log.error("teachingAssignmentRepository.findAll() returned NULL!");
                return Collections.emptyList();
            }
            
            log.info("Total assignments in DB: {}", allAssignments.size());
            
            List<TeachingAssignment> assignments = allAssignments.stream()
                    .filter(a -> {
                        if (a == null) return false;
                        if (a.getClassName() == null) return false;
                        String normalized = ClassNameUtils.normalizeToKey(a.getClassName());
                        return normalized.equals(studentClassKey);
                    })
                    .collect(Collectors.toList());
            log.info("Found {} assignments for classKey={}", assignments.size(), studentClassKey);

            List<Map<String, Object>> result = new ArrayList<>();
            for (TeachingAssignment assignment : assignments) {
                Map<String, Object> map = new HashMap<>();
                map.put("assignmentId", assignment.getId());
                map.put("subjectName", assignment.getSubjectName());

                Teacher teacher = teacherRepository.findById(assignment.getTeacherId()).orElse(null);
                map.put("teacherName", teacher != null ? teacher.getFullName() : "N/A");

                List<AttendanceSession> sessions = attendanceSessionRepository.findByTeachingAssignmentId(assignment.getId());
                long totalSessions = sessions.size();
                long attendedSessions = sessions.stream()
                        .filter(s -> attendanceRepository.findFirstByAttendanceSessionIdAndStudentId(s.getId(), studentId).isPresent())
                        .count();

                map.put("totalSessions", totalSessions);
                map.put("attendedSessions", attendedSessions);
                result.add(map);
            }

            return result;
        } catch (Exception e) {
            log.error("Error in getStudentSubjects for studentId={}: {}", studentId, e.getMessage(), e);
            throw e;
        }
    }

    @Override
    public List<Map<String, Object>> getAttendanceDetails(String studentId, String assignmentId) {
        List<AttendanceSession> sessions = attendanceSessionRepository.findByTeachingAssignmentId(assignmentId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (AttendanceSession session : sessions) {
            Map<String, Object> map = new HashMap<>();
            map.put("sessionId", session.getId());
            map.put("date", session.getDate());
            map.put("period", session.getPeriod());

            Optional<Attendance> attendanceOpt = attendanceRepository.findFirstByAttendanceSessionIdAndStudentId(session.getId(), studentId);
            if (attendanceOpt.isPresent()) {
                Attendance attendance = attendanceOpt.get();
                map.put("status", attendance.getStatus());
                map.put("checkInTime", attendance.getCheckInTime());
                map.put("location", attendance.getLocation());
                map.put("note", attendance.getNote());
                map.put("attendanceType", attendance.getAttendanceType());
                map.put("isPresent", true);
            } else {
                map.put("isPresent", false);
                map.put("status", "ABSENT");
            }
            result.add(map);
        }
        return result;
    }

    private static List<String> buildClassIdCandidates(String raw, String classKey, Integer gradeLevel, String classSimpleName) {
        LinkedHashSet<String> out = new LinkedHashSet<>();
        if (raw != null && !raw.isBlank()) {
            out.add(raw.trim());
            out.add(raw.trim().replaceAll("\\s+", ""));
            out.add(ClassNameUtils.formatDisplayClassName(raw));
        }
        if (classKey != null && !classKey.isBlank()) {
            out.add(classKey);
        }
        if (gradeLevel != null && classSimpleName != null && !classSimpleName.isBlank()) {
            out.add(String.valueOf(gradeLevel) + classSimpleName);
            out.add(String.valueOf(gradeLevel) + classSimpleName.toUpperCase(Locale.ROOT));
        }
        return new ArrayList<>(out);
    }
    public void importStudentsFromExcel(MultipartFile file) {
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Iterator<Row> rows = sheet.iterator();

            int rowNumber = 0;
            while (rows.hasNext()) {
                Row currentRow = rows.next();
                if (rowNumber == 0) {
                    rowNumber++;
                    continue; // Skip header row
                }

                String studentCode = getCellValueSafely(currentRow.getCell(0));
                String fullName = getCellValueSafely(currentRow.getCell(1));
                String gender = getCellValueSafely(currentRow.getCell(3));
                String phone = getCellValueSafely(currentRow.getCell(4));
                String email = getCellValueSafely(currentRow.getCell(5));
                String address = getCellValueSafely(currentRow.getCell(6));

                if (studentCode.isEmpty() || fullName.isEmpty()) {
                    continue; // Skip invalid rows
                }

                Student student = studentRepository.findByStudentCode(studentCode).orElse(new Student());
                student.setStudentCode(studentCode);
                student.setFullName(fullName);
                student.setGender(gender);

                if (currentRow.getCell(2) != null && currentRow.getCell(2).getCellType() == CellType.NUMERIC) {
                    student.setDateOfBirth(currentRow.getCell(2).getDateCellValue().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
                }

                Contact contact = student.getContact() != null ? student.getContact() : new Contact();
                contact.setPhone(phone);
                contact.setEmail(email);
                contact.setAddress(address);
                student.setContact(contact);

                studentRepository.save(student);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to read Excel data: " + e.getMessage());
        }
    }
    private String getCellValueSafely(Cell cell) {
        if (cell == null) return "";
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue().trim();
            case NUMERIC:
                return String.valueOf(cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            default:
                return "";
        }
    }

    @Override
    public ByteArrayInputStream exportStudentsToExcel() {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Students");

            // Header
            Row headerRow = sheet.createRow(0);
            String[] columns = {"Mã SV", "Họ Tên", "Ngày Sinh", "Giới Tính", "Số Điện Thoại", "Email", "Địa Chỉ"};
            for (int i = 0; i < columns.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(columns[i]);
            }

            // Data
            List<Student> students = studentRepository.findAll();
            int rowIdx = 1;
            for (Student student : students) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(student.getStudentCode() != null ? student.getStudentCode() : "");
                row.createCell(1).setCellValue(student.getFullName() != null ? student.getFullName() : "");

                if (student.getDateOfBirth() != null) {
                    row.createCell(2).setCellValue(student.getDateOfBirth().toString());
                } else {
                    row.createCell(2).setCellValue("");
                }

                row.createCell(3).setCellValue(student.getGender() != null ? student.getGender() : "");

                if (student.getContact() != null) {
                    row.createCell(4).setCellValue(student.getContact().getPhone() != null ? student.getContact().getPhone() : "");
                    row.createCell(5).setCellValue(student.getContact().getEmail() != null ? student.getContact().getEmail() : "");
                    row.createCell(6).setCellValue(student.getContact().getAddress() != null ? student.getContact().getAddress() : "");
                } else {
                    row.createCell(4).setCellValue("");
                    row.createCell(5).setCellValue("");
                    row.createCell(6).setCellValue("");
                }
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (IOException e) {
            throw new RuntimeException("Failed to export data to Excel: " + e.getMessage());
        }
    }
    @Override
    public Student getStudentById(String id) {
        return studentRepository.findById(id)
                .orElseGet(() -> studentRepository.findByStudentCode(id).orElse(null));
    }

    @Override
    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    @Override
    public void deleteStudent(String id) {
        studentRepository.deleteById(id);
    }

    @Override
    public Student updateStudent(String id, Student student) {
        Student existingStudent = studentRepository.findById(id)
                .orElseGet(() -> studentRepository.findByStudentCode(id)
                        .orElseThrow(() -> new RuntimeException("Student not found with id or code: " + id)));

        if (student.getFullName() != null) existingStudent.setFullName(student.getFullName());
        if (student.getStudentCode() != null) existingStudent.setStudentCode(student.getStudentCode());
        if (student.getDateOfBirth() != null) existingStudent.setDateOfBirth(student.getDateOfBirth());
        if (student.getGender() != null) existingStudent.setGender(student.getGender());

        if (student.getContact() != null) {
            Contact existingContact = existingStudent.getContact() != null ? existingStudent.getContact() : new Contact();
            Contact newContact = student.getContact();

            if (newContact.getPhone() != null) existingContact.setPhone(newContact.getPhone());
            if (newContact.getEmail() != null) existingContact.setEmail(newContact.getEmail());
            if (newContact.getAddress() != null) existingContact.setAddress(newContact.getAddress());

            existingStudent.setContact(existingContact);
        }

        return studentRepository.save(existingStudent);
    }

    @Override
    public Student createStudent(Student student) {
        // Create User account for Student
        User user = new User();
        user.setUsername(student.getStudentCode() != null ? student.getStudentCode() : student.getFullName().replaceAll("\\s+", "").toLowerCase());
        user.setPassword("123456"); // Default password
        user.setRole(Role.STUDENT);
        user = userRepository.save(user);

        student.setUserId(user.getId());
        return studentRepository.save(student);
    }
    public List<Map<String, Object>> getStudentsByClass(String className) {
        String raw = className == null ? "" : className.trim();
        String classKey = ClassNameUtils.normalizeToKey(raw);
        Integer gradeLevel = ClassNameUtils.parseGradeLevel(classKey);
        String classSimpleName = ClassNameUtils.parseClassSimpleName(classKey);

        log.info("getStudentsByClass called with className='{}', classKey='{}', gradeLevel={}, classSimpleName='{}'", 
                 raw, classKey, gradeLevel, classSimpleName);

        // Prefer querying student_classes by label first. This is more tolerant of datasets where:
        // - "classes" rows are missing/inconsistent
        // - StudentClass.classId stores a human label (e.g. "10A1") instead of SchoolClass.id
        LinkedHashMap<String, StudentClass> unique = new LinkedHashMap<>();
        List<String> candidates = buildClassIdCandidates(raw, classKey, gradeLevel, classSimpleName);
        log.info("Built classId candidates: {}", candidates);
        
        for (String candidate : candidates) {
            if (candidate == null || candidate.isBlank()) continue;
            List<StudentClass> found = studentClassRepository.findByClassIdIgnoreCase(candidate);
            log.info("Query findByClassIdIgnoreCase('{}') returned {} records", candidate, found.size());
            for (StudentClass sc : found) {
                if (sc != null && sc.getId() != null) {
                    unique.putIfAbsent(sc.getId(), sc);
                    log.info("Found StudentClass: id={}, studentId={}, classId={}", sc.getId(), sc.getStudentId(), sc.getClassId());
                }
            }
        }

        // If label lookups did not find anything, resolve SchoolClass and retry with its id.
        SchoolClass schoolClass = null;
        if (unique.isEmpty()) {
            schoolClass = resolveSchoolClassByIdOrName(raw);
            if (schoolClass != null && schoolClass.getId() != null) {
                for (StudentClass sc : studentClassRepository.findByClassId(schoolClass.getId())) {
                    if (sc != null && sc.getId() != null) {
                        unique.putIfAbsent(sc.getId(), sc);
                    }
                }
            }
        } else {
            // Best-effort resolve for display name.
            schoolClass = resolveSchoolClassByIdOrName(raw);
        }

        if (unique.isEmpty()) {
            log.debug("No students found for className='{}' (classKey='{}')", raw, classKey);
            return Collections.emptyList();
        }

        String displayClassName;
        if (schoolClass != null && schoolClass.getGradeLevel() != null && schoolClass.getClassName() != null) {
            displayClassName = ClassNameUtils.formatDisplayClassName(schoolClass.getGradeLevel(), schoolClass.getClassName());
        } else {
            displayClassName = ClassNameUtils.formatDisplayClassName(raw);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (StudentClass sc : unique.values()) {
            Student student = sc == null ? null : studentRepository.findById(sc.getStudentId()).orElse(null);
            if (student == null) continue;

            Map<String, Object> studentMap = new HashMap<>();
            studentMap.put("studentId", student.getId());
            studentMap.put("studentCode", student.getStudentCode());
            studentMap.put("fullName", student.getFullName());
            studentMap.put("className", displayClassName);
            studentMap.put("seatRow", sc.getSeatRow());
            studentMap.put("seatColumn", sc.getSeatColumn());
            studentMap.put("notes", sc.getNotes());
            result.add(studentMap);
        }

        // Deterministic ordering for UI.
        result.sort(Comparator.comparing(m -> String.valueOf(m.getOrDefault("studentCode", ""))));
        log.info("Returning {} students for className='{}'", result.size(), raw);
        return result;
    }
    @Override
    public void updateStudentSeating(String studentId, String className, Integer row, Integer col, String notes) {
        String classKey = ClassNameUtils.normalizeToKey(className);
        List<StudentClass> studentClasses = studentClassRepository.findByStudentId(studentId);
        
        for (StudentClass sc : studentClasses) {
            String scClassKey = ClassNameUtils.normalizeToKey(sc.getClassId());
            if (scClassKey.equals(classKey)) {
                if (row != null) sc.setSeatRow(row);
                if (col != null) sc.setSeatColumn(col);
                if (notes != null) sc.setNotes(notes);
                studentClassRepository.save(sc);
                return;
            }
        }
    }
}
