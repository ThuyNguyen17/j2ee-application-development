package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.AssignmentService;
import com.example.project_management_class.application.service.AnnouncementService;
import com.example.project_management_class.domain.model.Assignment;
import com.example.project_management_class.domain.model.Student;
import com.example.project_management_class.domain.model.Announcement;
import com.example.project_management_class.domain.model.StudentClass;
import com.example.project_management_class.domain.repository.AssignmentRepository;
import com.example.project_management_class.domain.repository.StudentClassRepository;
import com.example.project_management_class.domain.repository.StudentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AssignmentServiceImpl implements AssignmentService {
    private final AssignmentRepository assignmentRepository;
    private final StudentClassRepository studentClassRepository;
    private final StudentRepository studentRepository;
    private final AnnouncementService announcementService;

    @Override
    public void addAssignment(Assignment assignment) {
        assignment.setCreatedAt(LocalDateTime.now());
        assignment.setStatus("PUBLISHED");
        Assignment savedAssignment = assignmentRepository.save(assignment);
        
        // Create notifications for students and teachers
        createAssignmentNotifications(savedAssignment);
    }

    private void createAssignmentNotifications(Assignment assignment) {
        if (assignment.getClasses() != null && !assignment.getClasses().isEmpty()) {
            for (Assignment.ClassInfo classInfo : assignment.getClasses()) {
                // Create notification for students of this class
                Announcement studentAnnouncement = new Announcement();
                studentAnnouncement.setTitle("Bài tập mới: " + assignment.getTitle());
                studentAnnouncement.setContent("Giáo viên đã giao bài tập mới: " + assignment.getDescription() +
                    ". Hạn nộp: " + assignment.getDeadline());
                studentAnnouncement.setClassId(classInfo.getId());
                studentAnnouncement.setTargetRole("STUDENT");
                announcementService.createAnnouncement(studentAnnouncement);
                
                // Create notification for teachers of this class
                Announcement teacherAnnouncement = new Announcement();
                teacherAnnouncement.setTitle("Đã giao bài tập: " + assignment.getTitle());
                teacherAnnouncement.setContent("Bạn đã giao bài tập '" + assignment.getTitle() +
                    "' cho lớp " + classInfo.getName());
                teacherAnnouncement.setClassId(classInfo.getId());
                teacherAnnouncement.setTargetRole("TEACHER");
                announcementService.createAnnouncement(teacherAnnouncement);
            }
        }
    }

    @Override
    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    @Override
    public List<Assignment> getAssignmentsByTeacher(String teacherId) {
        return assignmentRepository.findByTeacherId(teacherId);
    }

    @Override
    public List<Assignment> getAssignmentsByStudent(String studentIdInput, String className) {
        System.out.println("[DEBUG] Searching assignments for Student Identifier: " + studentIdInput + ", Class: " + className);
        
        // Find student profile by input ID (v1: input might be _id, userId, or studentCode)
        Optional<Student> studentOpt = studentRepository.findById(studentIdInput);
        
        // If not found by ID, try finding by userId
        if (studentOpt.isEmpty()) {
            studentOpt = studentRepository.findByUserId(studentIdInput);
        }
        
        // If still not found, try finding by studentCode
        if (studentOpt.isEmpty()) {
            studentOpt = studentRepository.findByStudentCode(studentIdInput);
        }

        Set<String> classIdentifiers = new HashSet<>();
        if (className != null && !className.isBlank()) {
            classIdentifiers.add(className);
            classIdentifiers.add(normalize(className));
        }
        
        // Strategy: Aggregate all identifiers from all potential student records
        List<String> studentPotentialIds = new ArrayList<>();
        studentPotentialIds.add(studentIdInput);
        
        if (studentOpt.isPresent()) {
            Student s = studentOpt.get();
            System.out.println("[DEBUG] Found student profile: " + s.getFullName() + " (SID: " + s.getId() + ", Code: " + s.getStudentCode() + ", UserID: " + s.getUserId() + ")");
            if (!studentPotentialIds.contains(s.getId())) studentPotentialIds.add(s.getId());
            if (s.getUserId() != null && !studentPotentialIds.contains(s.getUserId())) studentPotentialIds.add(s.getUserId());
            if (s.getStudentCode() != null && !studentPotentialIds.contains(s.getStudentCode())) studentPotentialIds.add(s.getStudentCode());
        }

        // Search for class enrollments using all possible student identifiers
        for (String sId : studentPotentialIds) {
            List<StudentClass> mappings = studentClassRepository.findByStudentId(sId);
            System.out.println("[DEBUG] Found " + mappings.size() + " mappings for id " + sId);
            for (StudentClass sc : mappings) {
                if (sc.getClassId() != null) {
                    classIdentifiers.add(sc.getClassId());
                    classIdentifiers.add(normalize(sc.getClassId()));
                }
            }
        }
        
        System.out.println("[DEBUG] Final class identifiers for matching: " + classIdentifiers);
        
        List<Assignment> allAssignments = assignmentRepository.findAll();
        List<Assignment> result = allAssignments.stream()
            .filter(a -> {
                if (a.getClasses() == null || a.getClasses().isEmpty()) return false;
                return a.getClasses().stream().anyMatch(info -> {
                    String id = info.getId();
                    String name = info.getName();
                    
                    // Match by ID
                    if (id != null) {
                        if (classIdentifiers.contains(id) || classIdentifiers.contains(normalize(id))) return true;
                    }
                    
                    // Match by Name
                    if (name != null) {
                        if (classIdentifiers.contains(name) || classIdentifiers.contains(normalize(name))) return true;
                    }
                    
                    return false;
                });
            })
            .collect(Collectors.toList());
            
        System.out.println("[DEBUG] Returning " + result.size() + " assignments for student " + studentIdInput);
        return result;
    }

    private String normalize(String s) {
        if (s == null) return "";
        return s.trim().toLowerCase().replaceAll("[^a-zA-Z0-9]", "");
    }

    @Override
    public void deleteAssignment(String id) {
        assignmentRepository.deleteById(id);
    }

    @Override
    public Assignment updateAssignment(String id, Assignment assignment) {
        assignment.setId(id);
        return assignmentRepository.save(assignment);
    }

    @Override
    public Assignment getAssignmentById(String id) {
        return assignmentRepository.findById(id).orElse(null);
    }
}
