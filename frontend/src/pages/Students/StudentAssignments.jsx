import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Calendar,
  CheckCircle,
  Clock,
  BookOpen,
  Send,
  Star,
  MessageSquare,
  AlertCircle,
  User,
  HelpCircle,
  Upload,
  FileUp,
  AlignLeft,
  Check
} from "lucide-react";
import { getAssignmentsByStudent, submitAssignment, getMySubmission } from "../../api/assignmentApi";
import { BASE_URL } from "../../api/config";
import axios from "axios";
import "./StudentAssignments.css";

const StudentAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState({});
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submitContent, setSubmitContent] = useState("");
  const [quizAnswers, setQuizAnswers] = useState({}); // { questionIndex: selectedOptionIndices }
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [filter, setFilter] = useState("all"); // all, pending, done, overdue

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentId = user.id || user.userId || user.studentId || user._id;
  const studentName = user.fullName || user.name || user.username;

  useEffect(() => {
    if (studentId) {
      fetchAssignmentsWithSubmissions();
    } else {
      setLoading(false);
      setError("Không tìm thấy thông tin sinh viên. Vui lòng đăng nhập lại.");
    }
  }, [studentId]);

  const fetchAssignmentsWithSubmissions = async () => {
    try {
      setLoading(true);
      setError(null);
      const studentId = user.userId || user.id;
      let className = user.className;
      
      // If no className in user data, try to get from StudentClass API
      if (!className && studentId) {
        try {
          const API_URL = `${BASE_URL}/api`;
          
          const scResp = await axios.get(`${API_URL}/student-classes/student/${studentId}/class`);
          const classInfo = scResp.data;
          
          if (classInfo.success && classInfo.className) {
            className = classInfo.className;
            console.log("[DEBUG] Found className from API:", className);
          }
        } catch (err) {
          console.log("[DEBUG] Could not get className from API:", err.message);
        }
      }
      
      console.log("[DEBUG] Fetching assignments for Student ID: " + studentId + ", Class: " + className);
      
      const assignmentsData = await getAssignmentsByStudent(studentId, className);
      console.log("[DEBUG] API Response:", assignmentsData);
      
      if (!assignmentsData || assignmentsData.length === 0) {
        console.log("[DEBUG] No assignments returned from API");
      }
      
      const submissionsMap = {};
      for (const assignment of assignmentsData || []) {
        try {
          const submission = await getMySubmission(assignment.id, studentId);
          if (submission) {
            submissionsMap[assignment.id] = submission;
          }
        } catch (err) {
          console.log("No submission for assignment", assignment.id);
        }
      }
      
      setAssignments(assignmentsData || []);
      setSubmissions(submissionsMap);
    } catch (err) {
      console.error("[DEBUG] Error:", err);
      setError("Không thể tải bài tập: " + (err.message || "Lỗi không xác định"));
    } finally {
      setLoading(false);
    }
  };

  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setSubmitContent("");
    setQuizAnswers({});
    setUploadedFiles([]);
    setShowSubmitModal(true);
  };

  const handleQuizAnswer = (questionIndex, optionIndex, isMultiple) => {
    setQuizAnswers(prev => {
      const current = prev[questionIndex] || [];
      if (isMultiple) {
        // Toggle for multiple choice
        const exists = current.includes(optionIndex);
        return {
          ...prev,
          [questionIndex]: exists 
            ? current.filter(i => i !== optionIndex)
            : [...current, optionIndex]
        };
      } else {
        // Single choice - replace
        return { ...prev, [questionIndex]: [optionIndex] };
      }
    });
  };

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    
    for (const file of files) {
      try {
        const formData = new FormData();
        formData.append('file', file);
        
        const response = await fetch(`${BASE_URL}/api/v1/files/upload`, {
          method: 'POST',
          body: formData
        });
        
        const result = await response.json();
        
        if (result.success) {
          setUploadedFiles(prev => [...prev, {
            name: result.originalFileName,
            size: file.size,
            type: result.fileType,
            url: result.fileUrl,
            fileName: result.fileName
          }]);
        } else {
          alert('Failed to upload file: ' + result.message);
        }
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Failed to upload file');
      }
    }
  };

  const removeUploadedFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // Validate based on assignment type
    if (selectedAssignment.type === 'QUIZ') {
      const answeredCount = Object.keys(quizAnswers).length;
      if (answeredCount === 0) {
        alert("Vui lòng chọn ít nhất một câu trả lời!");
        return;
      }
    } else if (selectedAssignment.type === 'UPLOAD') {
      if (uploadedFiles.length === 0) {
        alert("Vui lòng upload ít nhất một file!");
        return;
      }
    } else {
      if (!submitContent.trim()) {
        alert("Vui lòng nhập nội dung bài làm!");
        return;
      }
    }

    try {
      setSubmitting({ ...submitting, [selectedAssignment.id]: true });
      
      const submissionData = {
        assignmentId: selectedAssignment.id,
        studentId: studentId,
        studentName: studentName,
        content: selectedAssignment.type === 'ESSAY' ? submitContent : "",
        classId: user.classId || "",
        quizAnswers: selectedAssignment.type === 'QUIZ' 
          ? Object.entries(quizAnswers).map(([questionIndex, selectedOptions]) => ({
              questionIndex: parseInt(questionIndex),
              selectedOptions
            }))
          : null,
        submittedFiles: selectedAssignment.type === 'UPLOAD' 
          ? uploadedFiles.map(f => ({ 
              fileName: f.fileName || f.name, 
              fileType: f.type, 
              fileSize: f.size,
              fileUrl: f.url
            }))
          : null
      };
      
      await submitAssignment(submissionData);
      
      alert("Nộp bài thành công!");
      setShowSubmitModal(false);
      fetchAssignmentsWithSubmissions();
    } catch (err) {
      console.error("Error submitting assignment:", err);
      alert("Không thể nộp bài. Vui lòng thử lại.");
    } finally {
      setSubmitting({ ...submitting, [selectedAssignment.id]: false });
    }
  };

  const getAssignmentStatus = (assignment) => {
    const submission = submissions[assignment.id];
    if (!submission) return { status: "pending", text: "Chưa nộp", className: "status-pending" };
    if (submission.status === "graded") return { status: "graded", text: "Đã chấm", className: "status-graded" };
    return { status: "submitted", text: "Đã nộp", className: "status-submitted" };
  };

  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  if (loading) {
    return (
      <div className="student-assignments-container">
        <div className="page-header">
          <h1 className="page-title"><FileText size={28} /> Bài tập của tôi</h1>
        </div>
        <div className="loading-state">Đang tải bài tập...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-assignments-container">
        <div className="page-header">
          <h1 className="page-title"><FileText size={28} /> Bài tập của tôi</h1>
        </div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  const filteredAssignments = assignments.filter((assignment) => {
    const statusInfo = getAssignmentStatus(assignment);
    const overdue = isOverdue(assignment.deadline) && statusInfo.status === "pending";

    if (filter === "pending") return statusInfo.status === "pending" && !overdue;
    if (filter === "done") return statusInfo.status !== "pending";
    if (filter === "overdue") return overdue;
    return true;
  });

  return (
    <div className="student-assignments-container">
      <div className="page-header">
        <h1 className="page-title"><FileText size={28} /> Bài tập của tôi</h1>
        <p className="page-subtitle">Danh sách bài tập được giao</p>
      </div>

      <div className="filter-tabs" style={{ 
        display: 'flex', 
        gap: '12px', 
        marginBottom: '24px',
        background: 'white',
        padding: '8px',
        borderRadius: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        <button 
          className={filter === "all" ? "active" : ""} 
          onClick={() => setFilter("all")}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: filter === "all" ? '#0ea5e9' : 'transparent',
            color: filter === "all" ? 'white' : '#64748b',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >Tất cả</button>
        <button 
          className={filter === "pending" ? "active" : ""} 
          onClick={() => setFilter("pending")}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: filter === "pending" ? '#f59e0b' : 'transparent',
            color: filter === "pending" ? 'white' : '#64748b',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >Chưa làm</button>
        <button 
          className={filter === "done" ? "active" : ""} 
          onClick={() => setFilter("done")}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: filter === "done" ? '#22c55e' : 'transparent',
            color: filter === "done" ? 'white' : '#64748b',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >Đã nộp</button>
        <button 
          className={filter === "overdue" ? "active" : ""} 
          onClick={() => setFilter("overdue")}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: filter === "overdue" ? '#ef4444' : 'transparent',
            color: filter === "overdue" ? 'white' : '#64748b',
            cursor: 'pointer',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
        >Quá hạn</button>
      </div>

      <div className="assignments-list">
        {filteredAssignments.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <p>Chưa có bài tập nào</p>
          </div>
        ) : (
          filteredAssignments.map((assignment) => {
            const statusInfo = getAssignmentStatus(assignment);
            const submission = submissions[assignment.id];
            const overdue = isOverdue(assignment.deadline) && statusInfo.status === "pending";

            return (
              <div key={assignment.id} className={`assignment-card ${statusInfo.status}`}>
                <div className="assignment-header">
                  <div className="assignment-title-section">
                    <h3 className="assignment-title">{assignment.title}</h3>
                    <span className={`status-badge ${statusInfo.className}`}>
                      {statusInfo.text}
                    </span>
                  </div>
                  {overdue && <span className="overdue-badge"><AlertCircle size={14} /> Quá hạn</span>}
                </div>

                <p className="assignment-description">{assignment.description}</p>

                <div className="assignment-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>Hạn nộp: {assignment.deadline}</span>
                  </div>
                  <div className="meta-item">
                    <BookOpen size={16} />
                    <span>Điểm tối đa: {assignment.maxScore}</span>
                  </div>
                </div>

                {submission && (
                  <div className="submission-details">
                    <div className="submission-header">
                      <Send size={16} />
                      <span>Bài đã nộp ({new Date(submission.submittedAt).toLocaleString()})</span>
                    </div>
                    <div className="submission-content">{submission.content}</div>
                    
                    {submission.status === "graded" && (
                      <div className="grade-section">
                        <div className="score-display">
                          <Star size={20} className="score-icon" />
                          <div className="score-info">
                            <span className="score-value">{submission.score}</span>
                            <span className="score-max">/{assignment.maxScore}</span>
                          </div>
                        </div>
                        {submission.feedback && (
                          <div className="feedback-box">
                            <MessageSquare size={16} />
                            <p>{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {statusInfo.status === "pending" && !overdue && (
                  <button 
                    className="submit-btn"
                    onClick={() => openSubmitModal(assignment)}
                    disabled={submitting[assignment.id]}
                  >
                    <Send size={16} />
                    {submitting[assignment.id] ? "Đang nộp..." : "Nộp bài"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>

      {showSubmitModal && selectedAssignment && (
        <div className="modal-overlay">
          <div className="modal submit-modal">
            <div className="modal-header">
              <h2>Nộp bài: {selectedAssignment.title}</h2>
              <button className="close-btn" onClick={() => setShowSubmitModal(false)}>×</button>
            </div>
            <div className="modal-body">
              {/* QUIZ Type */}
              {selectedAssignment.type === 'QUIZ' && selectedAssignment.questions && (
                <div className="quiz-section">
                  <p className="quiz-instruction">Trả lời các câu hỏi bên dưới:</p>
                  {selectedAssignment.questions.map((question, qIndex) => (
                    <div key={qIndex} className="quiz-question">
                      <p className="question-text">
                        <span className="q-number">Câu {qIndex + 1} ({question.points || 1}đ):</span> {question.content}
                      </p>
                      <div className="options-list">
                        {question.options.map((option, oIndex) => {
                          const optionId = `asgn-${selectedAssignment.id}-q-${qIndex}-o-${oIndex}`;
                          const isSelected = (quizAnswers[qIndex] || []).includes(oIndex);
                          
                          return (
                            <label key={oIndex} htmlFor={optionId} className={`option-label ${isSelected ? 'selected' : ''}`}>
                              <input
                                id={optionId}
                                type={question.type === 'MULTIPLE_CHOICE' ? 'checkbox' : 'radio'}
                                name={`question_${qIndex}`}
                                checked={isSelected}
                                onChange={() => handleQuizAnswer(qIndex, oIndex, question.type === 'MULTIPLE_CHOICE')}
                              />
                              <span className="option-text">{option.content}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* UPLOAD Type */}
              {selectedAssignment.type === 'UPLOAD' && (
                <div className="upload-section">
                  <div className="upload-area" onClick={() => document.getElementById(`file-upload-${selectedAssignment.id}`).click()} style={{ cursor: 'pointer' }}>
                    <input
                      id={`file-upload-${selectedAssignment.id}`}
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      style={{ display: 'none' }}
                    />
                    <div className="upload-placeholder">
                      <Upload size={32} />
                      <p>Click để chọn file hoặc kéo thả file vào đây</p>
                    </div>
                  </div>
                  {uploadedFiles.length > 0 && (
                    <div className="uploaded-files">
                      <p>Files đã chọn:</p>
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="file-item">
                          <FileUp size={16} />
                          <span>{file.name} ({(file.size / 1024).toFixed(1)} KB)</span>
                          <button onClick={() => removeUploadedFile(index)}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ESSAY Type (default) */}
              {(!selectedAssignment.type || selectedAssignment.type === 'ESSAY') && (
                <div className="form-group">
                  <label>Nội dung bài làm</label>
                  <textarea
                    value={submitContent}
                    onChange={(e) => setSubmitContent(e.target.value)}
                    placeholder="Nhập câu trả lời hoặc nội dung bài làm của bạn..."
                    rows={10}
                  />
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowSubmitModal(false)}>Hủy</button>
              <button 
                className="submit-confirm-btn" 
                onClick={handleSubmit}
                disabled={
                  (selectedAssignment.type === 'QUIZ' && Object.keys(quizAnswers).length === 0) ||
                  (selectedAssignment.type === 'UPLOAD' && uploadedFiles.length === 0) ||
                  ((!selectedAssignment.type || selectedAssignment.type === 'ESSAY') && !submitContent.trim())
                }
              >
                <Send size={16} /> Nộp bài
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentAssignments;