package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.dto.TimetableResponseDTO;
import com.example.project_management_class.application.service.TimetableService;
import com.example.project_management_class.domain.model.TeachingAssignment;
import com.example.project_management_class.domain.model.Timetable;
import com.example.project_management_class.domain.repository.TeachingAssignmentRepository;
import com.example.project_management_class.domain.repository.TimetableRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TimetableServiceImpl implements TimetableService {

    private final TeachingAssignmentRepository teachingAssignmentRepository;
    private final TimetableRepository timetableRepository;

    @Override
    public List<TimetableResponseDTO> getTeacherTimetable(String teacherId, int week) {
        List<TeachingAssignment> assignments = teachingAssignmentRepository.findByTeacherId(teacherId);
        List<TimetableResponseDTO> result = new ArrayList<>();
        for (TeachingAssignment assignment : assignments) {
            List<Timetable> timetables = timetableRepository.findByTeachingAssignmentIdAndWeek(assignment.getId(), week);
            for (Timetable t : timetables) {
                result.add(TimetableResponseDTO.builder()
                                .subject(assignment.getSubjectName())
                                .className(assignment.getClassName())
                                .dayOfWeek(t.getDayOfWeek())
                                .period(t.getPeriod())
                                .room(t.getRoom())
                                .note(t.getNote())
                                .build()
                );
            }
        }
        return result;
    }
}