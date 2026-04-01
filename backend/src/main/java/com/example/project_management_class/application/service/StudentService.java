package com.example.project_management_class.application.service;

import com.example.project_management_class.application.dto.LoginResponse;
import com.example.project_management_class.application.dto.StudentLoginResponse;
import com.example.project_management_class.domain.model.Attendance;
import com.example.project_management_class.domain.model.Student;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.Map;

public interface StudentService {
    LoginResponse login(String username, String password);
    StudentLoginResponse login(String studentCode);
    List<Map<String, Object>> getStudentSubjects(String studentId);
    List<Map<String, Object>> getAttendanceDetails(String studentId, String assignmentId);
    List<Map<String, Object>> getStudentsByClass(String className);
    void importStudentsFromExcel(MultipartFile file);
    void importStudentsFromExcelWithClass(MultipartFile file, String classId);
    ByteArrayInputStream exportStudentsToExcel();
    List<Student> getAllStudents();
    void deleteStudent(String id);
    Student getStudentById(String id);
    Student getStudentByUserId(String userId);
    Student updateStudent(String id, Student student);
    Student createStudent(Student student);
    void updateStudentSeating(String studentId, String className, Integer row, Integer col, String notes);
}
