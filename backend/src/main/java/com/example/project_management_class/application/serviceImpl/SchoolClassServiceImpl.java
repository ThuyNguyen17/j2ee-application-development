package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.SchoolClassService;
import com.example.project_management_class.domain.model.SchoolClass;
import com.example.project_management_class.domain.repository.SchoolClassRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SchoolClassServiceImpl implements SchoolClassService {
    private final SchoolClassRepository schoolClassRepository;

    @Override
    public void addClass(SchoolClass schoolClass) {
        schoolClassRepository.save(schoolClass);
    }

    @Override
    public List<SchoolClass> getAllClasses() {
        return schoolClassRepository.findAll();
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
