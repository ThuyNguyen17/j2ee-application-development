package com.example.project_management_class.application.service;

import com.example.project_management_class.domain.model.Submission;
import java.util.List;

public interface SubmissionService {
    Submission submitAssignment(Submission submission);
    List<Submission> getSubmissionsByAssignment(String assignmentId);
    List<Submission> getSubmissionsByStudent(String studentId);
    Submission gradeSubmission(String submissionId, Integer score, String feedback);
    Submission getSubmissionByAssignmentAndStudent(String assignmentId, String studentId);
}
