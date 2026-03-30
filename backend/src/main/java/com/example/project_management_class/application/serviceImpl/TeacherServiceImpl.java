package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.TeacherService;
import com.example.project_management_class.domain.model.Teacher;
import com.example.project_management_class.domain.model.User;
import com.example.project_management_class.domain.repository.TeacherRepository;
import com.example.project_management_class.domain.repository.UserRepository;
import com.example.project_management_class.domain.enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeacherServiceImpl implements TeacherService {
    private final TeacherRepository teacherRepository;
    private final UserRepository userRepository;

    @Override
    public Teacher createTeacher(Teacher teacher) {
        // Create User account for Teacher
        User user = new User();
        user.setUsername(teacher.getTeacherCode() != null ? teacher.getTeacherCode() : teacher.getFullName().replaceAll("\\s+", "").toLowerCase());
        user.setPassword("123456"); // Default password
        user.setRole(Role.TEACHER);
        user = userRepository.save(user);

        teacher.setUserId(user.getId());
        return teacherRepository.save(teacher);
    }

    @Override
    public List<Teacher> getAllTeachers() {
        return teacherRepository.findAll();
    }

    @Override
    public void deleteTeacher(String id) {
        teacherRepository.deleteById(id);
    }

    @Override
    public Teacher updateTeacher(String id, Teacher teacher) {
        teacher.setId(id);
        return teacherRepository.save(teacher);
    }
}
