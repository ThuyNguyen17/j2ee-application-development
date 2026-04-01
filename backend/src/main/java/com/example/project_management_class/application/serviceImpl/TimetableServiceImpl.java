package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.dto.TimetableResponseDTO;
import com.example.project_management_class.application.service.TimetableService;
import com.example.project_management_class.application.util.ClassNameUtils;
import com.example.project_management_class.domain.model.SchoolClass;
import com.example.project_management_class.domain.model.Subject;
import com.example.project_management_class.domain.model.TeachingAssignment;
import com.example.project_management_class.domain.model.Timetable;
import com.example.project_management_class.domain.repository.SchoolClassRepository;
import com.example.project_management_class.domain.repository.SubjectRepository;
import com.example.project_management_class.domain.repository.TeachingAssignmentRepository;
import com.example.project_management_class.domain.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class TimetableServiceImpl implements TimetableService {

    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final TimetableRepository timetableRepository;
    private final SubjectRepository subjectRepository;
    private final SchoolClassRepository schoolClassRepository;

    @Override
    public List<TimetableResponseDTO> getTeacherTimetableByWeek(String teacherId, LocalDate date) {
        // tính thứ 2 đầu tuần
        LocalDate startOfWeek = date.with(DayOfWeek.MONDAY);
        LocalDate endOfWeek = startOfWeek.plusDays(6);

        return getTeacherTimetableByRange(teacherId, startOfWeek, endOfWeek);
    }

    @Override
    public List<TimetableResponseDTO> getTeacherTimetableByRange(
            String teacherId,
            LocalDate startDate,
            LocalDate endDate
    ) {

        // lấy assignment của giáo viên
        List<TeachingAssignment> assignments =
                teachingAssignmentRepository.findByTeacherId(teacherId);

        log.info("Found {} teaching assignments for teacher {}", assignments.size(), teacherId);
        for (TeachingAssignment ta : assignments) {
            log.info("Assignment: id={}, classId={}, subjectId={}", ta.getId(), ta.getClassId(), ta.getSubjectId());
        }

        List<String> assignmentIds = assignments.stream()
                .map(TeachingAssignment::getId)
                .collect(Collectors.toList());

        if (assignmentIds.isEmpty()) return Collections.emptyList();

        // query timetable theo date
        List<Timetable> timetables =
                timetableRepository.findByTeachingAssignmentIdInAndActualDateBetween(
                        assignmentIds,
                        startDate,
                        endDate
                );

        log.info("Found {} timetable entries for date range {} to {}", timetables.size(), startDate, endDate);

        // map sang DTO
        return timetables.stream().map(t -> {

            TeachingAssignment assignment = assignments.stream()
                    .filter(a -> a.getId().equals(t.getTeachingAssignmentId()))
                    .findFirst()
                    .orElse(null);

            String subjectName = null;
            String className = null;
            if (assignment != null) {
                // Lookup subject name from Subject repository
                Subject subject = subjectRepository.findById(assignment.getSubjectId()).orElse(null);
                subjectName = subject != null ? subject.getSubjectName() : null;
                
                // Lookup class name from SchoolClass repository
                SchoolClass schoolClass = schoolClassRepository.findById(assignment.getClassId()).orElse(null);
                if (schoolClass != null) {
                    className = schoolClass.getGradeLevel() + schoolClass.getClassName();
                    log.info("Found className: {} for classId: {}", className, assignment.getClassId());
                } else {
                    log.warn("SchoolClass not found for classId: {}", assignment.getClassId());
                }
            } else {
                log.warn("Assignment not found for teachingAssignmentId: {}", t.getTeachingAssignmentId());
            }

            return TimetableResponseDTO.builder()
                    .teachingAssignmentId(t.getTeachingAssignmentId())
                    .subject(subjectName)
                    .className(className)
                    .dayOfWeek(t.getDayOfWeek())
                    .period(t.getPeriod())
                    .room(t.getRoom())
                    .note(t.getNote())
                    .build();

        }).collect(Collectors.toList());
    }

    @Override
    public List<TimetableResponseDTO> getClassTimetable(String className, int week, int year, int semester) {
        log.info("Getting class timetable for className: {}, week: {}, year: {}, semester: {}", className, week, year, semester);
        
        // Tìm SchoolClass theo tên
        SchoolClass targetClass = null;
        List<SchoolClass> allClasses = schoolClassRepository.findAll();
        
        for (SchoolClass sc : allClasses) {
            String fullName = sc.getGradeLevel() + sc.getClassName();
            if (fullName.equalsIgnoreCase(className)) {
                targetClass = sc;
                break;
            }
        }
        
        if (targetClass == null) {
            log.warn("SchoolClass not found for className: {}", className);
            return Collections.emptyList();
        }
        
        log.info("Found SchoolClass: id={}, gradeLevel={}, className={}, academicYearId={}", 
                targetClass.getId(), targetClass.getGradeLevel(), targetClass.getClassName(), targetClass.getAcademicYearId());

        // Lấy toàn bộ teaching assignments cho lớp này trong năm học (không lọc theo semester để tránh mất dữ liệu do gán nhầm)
        List<TeachingAssignment> assignments = teachingAssignmentRepository.findByClassIdAndAcademicYearId(
                targetClass.getId(), targetClass.getAcademicYearId());
        
        log.info("Querying teaching assignments with classId={}, academicYearId={}, semester={}", 
                targetClass.getId(), targetClass.getAcademicYearId(), semester);
        
        if (assignments.isEmpty()) {
            log.warn("No teaching assignments found for classId: {}", targetClass.getId());
            return Collections.emptyList();
        }
        
        log.info("Found {} teaching assignments for classId: {}", assignments.size(), targetClass.getId());

        List<String> assignmentIds = assignments.stream()
                .map(TeachingAssignment::getId)
                .collect(Collectors.toList());

        // Tìm timetable entries - dùng method có sẵn
        // Tính ngày bắt đầu và kết thúc tuần
        // Tính ngày bắt đầu và kết thúc tuần dựa trên học kỳ
        LocalDate semesterStartDate;
        if (semester == 2) {
            // Học kỳ 2 bắt đầu từ giữa tháng 1 của năm tiếp theo (year + 1)
            semesterStartDate = LocalDate.of(year + 1, 1, 15);
        } else {
            // Học kỳ 1 bắt đầu từ 01/09 của năm học (year)
            semesterStartDate = LocalDate.of(year, 9, 1);
        }

        // Tìm Thứ 2 của tuần chứa ngày bắt đầu học kỳ
        LocalDate firstMonday = semesterStartDate.with(DayOfWeek.MONDAY);
        // Nếu Monday rơi sau ngày bắt đầu, thì Monday của tuần đó là Monday trước đó
        if (firstMonday.isAfter(semesterStartDate)) {
            firstMonday = firstMonday.minusWeeks(1);
        }

        LocalDate startOfWeek = firstMonday.plusWeeks(week - 1);
        LocalDate endOfWeek = startOfWeek.plusDays(6);
        
        log.info("Searching timetable entries between {} and {}", startOfWeek, endOfWeek);
        
        List<Timetable> timetables = timetableRepository.findByTeachingAssignmentIdInAndActualDateBetween(
                assignmentIds, startOfWeek, endOfWeek);
        
        log.info("Found {} timetable entries for week {}", timetables.size(), week);
        for (Timetable t : timetables) {
            log.info("Timetable: dayOfWeek={}, period={}, actualDate={}, note={}", 
                    t.getDayOfWeek(), t.getPeriod(), t.getActualDate(), t.getNote());
        }

        // Map sang DTO
        final String finalDisplayClassName = targetClass.getGradeLevel() + targetClass.getClassName();
        
        return timetables.stream()
                .map(timetable -> {
                    TeachingAssignment assignment = assignments.stream()
                            .filter(a -> a.getId().equals(timetable.getTeachingAssignmentId()))
                            .findFirst()
                            .orElse(null);
                    
                    String subjectName = null;
                    if (assignment != null) {
                        Subject subject = subjectRepository.findById(assignment.getSubjectId()).orElse(null);
                        subjectName = subject != null ? subject.getSubjectName() : null;
                    }
                    
                    return TimetableResponseDTO.builder()
                            .teachingAssignmentId(timetable.getTeachingAssignmentId())
                            .subject(subjectName)
                            .className(finalDisplayClassName)
                            .dayOfWeek(timetable.getDayOfWeek())
                            .period(timetable.getPeriod())
                            .room(timetable.getRoom())
                            .note(timetable.getNote())
                            .build();
                })
                .collect(Collectors.toList());
    }
}