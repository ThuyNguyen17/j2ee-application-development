package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.ExamService;
import com.example.project_management_class.domain.model.Exam;
import com.example.project_management_class.domain.repository.ExamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExamServiceImpl implements ExamService {
    private final ExamRepository examRepository;

    @Override
    public void addExam(Exam exam) {
        examRepository.save(exam);
    }

    @Override
    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @Override
    public void deleteExam(String id) {
        examRepository.deleteById(id);
    }

    @Override
    public Exam updateExam(String id, Exam exam) {
        exam.setId(id);
        return examRepository.save(exam);
    }
}
