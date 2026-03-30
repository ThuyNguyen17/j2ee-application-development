package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Teacher;
import java.util.List;

public interface TeacherService {
    Teacher createTeacher(Teacher teacher);
    List<Teacher> getAllTeachers();
    void deleteTeacher(String id);
    Teacher updateTeacher(String id, Teacher teacher);
}
