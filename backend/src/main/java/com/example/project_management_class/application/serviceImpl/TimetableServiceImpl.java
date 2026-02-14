package com.example.project_management_class.application.service.impl;

import com.example.project_management_class.application.dto.TimetableResponseDTO;
import com.example.project_management_class.application.service.TimetableService;
import com.example.project_management_class.domain.model.TeachingAssignment;
import com.example.project_management_class.domain.model.Timetable;
import com.example.project_management_class.domain.repository.TeachingAssignmentRepository;
import com.example.project_management_class.domain.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimetableServiceImpl implements TimetableService {

    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final TimetableRepository timetableRepository;

    @Override
    public List<TimetableResponseDTO> getTeacherTimetable(String teacherId, int week, int academicYear, int semester) {
        // 1. Lấy danh sách phân công giảng dạy của giáo viên trong năm học và học kỳ cụ thể
        List<TeachingAssignment> assignments = teachingAssignmentRepository
                .findByTeacherIdAndAcademicYearAndSemester(teacherId, academicYear, semester);
        
        if (assignments.isEmpty()) {
            return Collections.emptyList();
        }

        // 2. Lấy danh sách ID của các phân công giảng dạy
        List<String> assignmentIds = assignments.stream()
                .map(TeachingAssignment::getId)
                .collect(Collectors.toList());

        // 3. Tạo Map để tra cứu nhanh thông tin phân công (để lấy subjectName, className)
        Map<String, TeachingAssignment> assignmentMap = assignments.stream()
                .collect(Collectors.toMap(TeachingAssignment::getId, a -> a));

        // 4. Tìm các tiết học (Timetable) thuộc danh sách phân công này trong tuần cụ thể
        List<Timetable> timetables = timetableRepository.findByTeachingAssignmentIdInAndWeek(assignmentIds, week);

        // 5. Chuyển đổi sang TimetableResponseDTO
        return timetables.stream()
                .map(timetable -> {
                    TeachingAssignment assignment = assignmentMap.get(timetable.getTeachingAssignmentId());
                    return TimetableResponseDTO.builder()
                            .dayOfWeek(timetable.getDayOfWeek())
                            .period(timetable.getPeriod())
                            .subject(assignment != null ? assignment.getSubjectName() : "Unknown Subject")
                            .className(assignment != null ? assignment.getClassName() : "Unknown Class")
                            .room(timetable.getRoom())
                            .note(timetable.getNote())
                            .build();
                })
                .collect(Collectors.toList());
    }
}
