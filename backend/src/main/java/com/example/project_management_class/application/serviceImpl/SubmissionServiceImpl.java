package com.example.project_management_class.application.serviceImpl;

import com.example.project_management_class.application.service.SubmissionService;
import com.example.project_management_class.domain.model.Assignment;
import com.example.project_management_class.domain.model.Submission;
import com.example.project_management_class.domain.repository.AssignmentRepository;
import com.example.project_management_class.domain.repository.SubmissionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubmissionServiceImpl implements SubmissionService {
    private final SubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;

    @Override
    public Submission submitAssignment(Submission submission) {
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus("submitted");
        
        // Auto-grade for QUIZ type
        Assignment assignment = assignmentRepository.findById(submission.getAssignmentId()).orElse(null);
        if (assignment != null && "QUIZ".equals(assignment.getType())) {
            Integer autoScore = calculateQuizScore(submission, assignment);
            submission.setScore(autoScore);
            submission.setStatus("graded");
            submission.setFeedback("Đã chấm điểm tự động");
        } else {
            submission.setScore(null);
            submission.setFeedback(null);
        }
        
        Submission saved = submissionRepository.save(submission);
        
        // Update submitted count in assignment
        if (assignment != null) {
            assignment.setSubmittedCount((assignment.getSubmittedCount() != null ? assignment.getSubmittedCount() : 0) + 1);
            assignmentRepository.save(assignment);
        }
        
        return saved;
    }

    private Integer calculateQuizScore(Submission submission, Assignment assignment) {
        if (submission.getQuizAnswers() == null || assignment.getQuestions() == null) {
            return 0;
        }
        
        int totalScore = 0;
        List<Assignment.Question> questions = assignment.getQuestions();
        List<Submission.QuizAnswer> studentAnswers = submission.getQuizAnswers();
        
        for (int i = 0; i < questions.size(); i++) {
            Assignment.Question question = questions.get(i);
            
            // Find student's answer for this question
            Submission.QuizAnswer studentAnswer = null;
            for (Submission.QuizAnswer qa : studentAnswers) {
                if (qa.getQuestionIndex() != null && qa.getQuestionIndex() == i) {
                    studentAnswer = qa;
                    break;
                }
            }
            
            if (studentAnswer == null) continue;
            
            // Check if answer is correct
            List<Integer> correctAnswers = question.getCorrectAnswers();
            List<Integer> selectedOptions = studentAnswer.getSelectedOptions();
            
            if (correctAnswers != null && selectedOptions != null) {
                // Check if sets are equal (correct answers selected, no incorrect answers)
                boolean allCorrectSelected = correctAnswers.stream().allMatch(ca -> selectedOptions.contains(ca));
                boolean noExtraSelected = selectedOptions.stream().allMatch(so -> correctAnswers.contains(so));
                
                if (allCorrectSelected && noExtraSelected) {
                    totalScore += (question.getPoints() != null ? question.getPoints() : 1);
                }
            }
        }
        
        return totalScore;
    }

    @Override
    public List<Submission> getSubmissionsByAssignment(String assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    @Override
    public List<Submission> getSubmissionsByStudent(String studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    @Override
    public Submission gradeSubmission(String submissionId, Integer score, String feedback) {
        Submission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found"));
        submission.setScore(score);
        submission.setFeedback(feedback);
        submission.setStatus("graded");
        return submissionRepository.save(submission);
    }

    @Override
    public Submission getSubmissionByAssignmentAndStudent(String assignmentId, String studentId) {
        return submissionRepository.findByAssignmentIdAndStudentId(assignmentId, studentId)
            .orElse(null);
    }
}
