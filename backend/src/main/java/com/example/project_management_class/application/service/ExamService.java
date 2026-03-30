package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Exam;
import java.util.List;

public interface ExamService {
    void addExam(Exam exam);
    List<Exam> getAllExams();
    void deleteExam(String id);
    Exam updateExam(String id, Exam exam);
}
