package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.dto.SchoolClassDTO;
import com.example.project_management_class.application.service.SchoolClassService;
import com.example.project_management_class.domain.model.SchoolClass;
import com.example.project_management_class.domain.repository.SchoolClassRepository;
import com.example.project_management_class.domain.repository.StudentClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SchoolClassServiceImpl implements SchoolClassService {
    private final SchoolClassRepository schoolClassRepository;
    private final StudentClassRepository studentClassRepository;

    @Override
    public void addClass(SchoolClass schoolClass) {
        schoolClassRepository.save(schoolClass);
    }

    @Override
    public List<SchoolClassDTO> getAllClasses() {
        List<SchoolClass> classes = schoolClassRepository.findAll();
        return classes.stream().map(this::convertToDTO).collect(Collectors.toList());
    }
    
    private SchoolClassDTO convertToDTO(SchoolClass schoolClass) {
        SchoolClassDTO dto = new SchoolClassDTO();
        dto.setId(schoolClass.getId());
        dto.setAcademicYearId(schoolClass.getAcademicYearId());
        dto.setGradeLevel(schoolClass.getGradeLevel());
        dto.setClassName(schoolClass.getClassName());
        dto.setHomeroomTeacherId(schoolClass.getHomeroomTeacherId());
        // Count students in this class
        int studentCount = studentClassRepository.findByClassId(schoolClass.getId()).size();
        dto.setStudentCount(studentCount);
        return dto;
    }

    @Override
    public SchoolClass getClassById(String id) {
        return schoolClassRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("SchoolClass not found with id: " + id));
    }

    @Override
    public void deleteClass(String id) {
        schoolClassRepository.deleteById(id);
    }

    @Override
    public SchoolClass updateClass(String id, SchoolClass schoolClass) {
        schoolClass.setId(id);
        return schoolClassRepository.save(schoolClass);
    }
}
