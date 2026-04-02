import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  FileText, 
  ArrowLeft,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  Star,
  MessageSquare,
  Search,
  Filter,
  Send,
  Clock,
  ShieldAlert,
  AlertTriangle,
  ExternalLink
} from "lucide-react";
import { 
  getSubmissionsByAssignment, 
  gradeSubmission,
  getAssignmentById,
  getViolationsByAssignment
} from "../../api/assignmentApi";
import { BASE_URL } from "../../api/config";
import "./AssignmentSubmissions.css";

const AssignmentSubmissions = () => {
  const getAbsoluteUrl = (url) => {
    if (!url) return "#";
    if (url.startsWith('http')) return url;
    return `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;
  };
  const { assignmentId } = useParams();
  const navigate = useNavigate();
  const [assignment, setAssignment] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all"); // all, submitted, graded
  const [gradingSubmission, setGradingSubmission] = useState(null);
  const [viewingViolations, setViewingViolations] = useState(null); // student object
  const [gradeScore, setGradeScore] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");

  useEffect(() => {
    if (assignmentId) {
      fetchData();
    }
  }, [assignmentId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assignmentData, submissionsData, violationsData] = await Promise.all([
        getAssignmentById(assignmentId),
        getSubmissionsByAssignment(assignmentId),
        getViolationsByAssignment(assignmentId)
      ]);
      setAssignment(assignmentData);
      setSubmissions(submissionsData);
      setViolations(violationsData || []);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Không thể tải dữ liệu. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleGrade = async () => {
    if (!gradingSubmission || gradeScore === "") {
      alert("Vui lòng nhập điểm!");
      return;
    }

    const score = parseInt(gradeScore);
    if (score < 0 || score > (assignment?.maxScore || 10)) {
      alert(`Điểm phải từ 0 đến ${assignment?.maxScore || 10}!`);
      return;
    }

    try {
      await gradeSubmission(gradingSubmission.id, score, gradeFeedback);
      alert("Đã chấm điểm thành công!");
      setGradingSubmission(null);
      setGradeScore("");
      setGradeFeedback("");
      fetchData();
    } catch (err) {
      console.error("Error grading:", err);
      alert("Không thể chấm điểm. Vui lòng thử lại.");
    }
  };

  const openGradeModal = (submission) => {
    setGradingSubmission(submission);
    setGradeScore(submission.score || "");
    setGradeFeedback(submission.feedback || "");
  };

  const filteredSubmissions = submissions.filter(sub => {
    const matchesSearch = sub.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sub.content?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "graded" && sub.status === "graded") ||
                         (filterStatus === "submitted" && sub.status === "submitted");
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: submissions.length,
    submitted: submissions.filter(s => s.status === "submitted").length,
    graded: submissions.filter(s => s.status === "graded").length
  };

  if (loading) {
    return (
      <div className="assignment-submissions-container">
        <div className="loading-state">Đang tải...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="assignment-submissions-container">
        <div className="error-state">{error}</div>
        <button className="back-btn" onClick={() => navigate("/teacher/assignments")}>
          <ArrowLeft size={20} /> Quay lại
        </button>
      </div>
    );
  }

  return (
    <div className="assignment-submissions-container">
      <div className="page-header">
        <button className="back-btn" onClick={() => navigate("/teacher/assignments")}>
          <ArrowLeft size={20} /> Quay lại
        </button>
        <div className="header-content">
          <h1 className="page-title">
            <FileText size={28} />
            Bài nộp: {assignment?.title}
          </h1>
          <p className="page-subtitle">{assignment?.description}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-cards">
        <div className="stat-card total">
          <span className="stat-value">{stats.total}</span>
          <span className="stat-label">Tổng số bài</span>
        </div>
        <div className="stat-card pending">
          <span className="stat-value">{stats.submitted}</span>
          <span className="stat-label">Chờ chấm</span>
        </div>
        <div className="stat-card graded">
          <span className="stat-value">{stats.graded}</span>
          <span className="stat-label">Đã chấm</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm sinh viên..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-tabs">
          <button 
            className={filterStatus === "all" ? "active" : ""}
            onClick={() => setFilterStatus("all")}
          >
            Tất cả
          </button>
          <button 
            className={filterStatus === "submitted" ? "active" : ""}
            onClick={() => setFilterStatus("submitted")}
          >
            Chờ chấm
          </button>
          <button 
            className={filterStatus === "graded" ? "active" : ""}
            onClick={() => setFilterStatus("graded")}
          >
            Đã chấm
          </button>
        </div>
      </div>

      {/* Submissions List */}
      <div className="submissions-list">
        {filteredSubmissions.length === 0 ? (
          <div className="empty-state">
            <FileText size={48} />
            <p>Chưa có bài nộp nào</p>
          </div>
        ) : (
          filteredSubmissions.map((submission) => (
            <div key={submission.id} className={`submission-card ${submission.status}`}>
              <div className="submission-header">
                <div className="student-info">
                  <div className="student-avatar">
                    <User size={20} />
                  </div>
                  <div className="student-details">
                    <h4>{submission.studentName || "Không tên"}</h4>
                    <span className="submission-time">
                      <Clock size={14} />
                      {new Date(submission.submittedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="status-badges" style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  {(assignment?.isStrictMode || assignment?.strictMode || 
                    assignment?.title?.toLowerCase().includes('test') || 
                    assignment?.title?.toLowerCase().includes('thi') || 
                    assignment?.title?.toLowerCase().includes('thy')) && (
                    <div 
                      className={`violation-badge ${violations.filter(v => v.userId === submission.studentId).length > 0 ? "has-violations" : "clean"}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setViewingViolations(submission);
                      }}
                      style={{
                        padding: '4px 10px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer',
                        background: violations.filter(v => v.userId === submission.studentId).length > 0 ? '#fef2f2' : '#f0fdf4',
                        color: violations.filter(v => v.userId === submission.studentId).length > 0 ? '#ef4444' : '#22c55e',
                        border: `1px solid ${violations.filter(v => v.userId === submission.studentId).length > 0 ? '#fee2e2' : '#dcfce7'}`
                      }}
                    >
                      <ShieldAlert size={14} />
                      {violations.filter(v => v.userId === submission.studentId).length} Vi phạm
                    </div>
                  )}
                  <div className={`status-badge ${submission.status}`}>
                    {submission.status === "graded" ? (
                      <><CheckCircle size={14} /> Đã chấm</>
                    ) : (
                      <><Clock size={14} /> Chờ chấm</>
                    )}
                  </div>
                </div>
              </div>

              <div className="submission-content">
                {assignment?.type === 'QUIZ' && submission.quizAnswers ? (
                  <div className="quiz-answers-preview">
                    {assignment.questions.map((q, qIdx) => {
                      const studentAns = submission.quizAnswers.find(a => a.questionIndex === qIdx);
                      const isCorrect = studentAns && 
                                       q.correctAnswers.length === studentAns.selectedOptions.length &&
                                       q.correctAnswers.every(ca => studentAns.selectedOptions.includes(ca));
                      
                      return (
                        <div key={qIdx} className={`preview-q ${isCorrect ? 'correct' : 'incorrect'}`} style={{
                          padding: '8px',
                          borderLeft: `4px solid ${isCorrect ? '#22c55e' : '#ef4444'}`,
                          background: isCorrect ? '#f0fdf4' : '#fef2f2',
                          marginBottom: '8px',
                          borderRadius: '4px'
                        }}>
                          <p style={{ fontWeight: '600', fontSize: '0.9rem' }}>Câu {qIdx + 1}: {q.content}</p>
                          <p style={{ fontSize: '0.85rem' }}>
                            Trả lời: {studentAns ? studentAns.selectedOptions.map(idx => q.options[idx].content).join(', ') : 'Không trả lời'}
                            {!isCorrect && <span style={{ color: '#16a34a', marginLeft: '8px' }}>(Đúng: {q.correctAnswers.map(idx => q.options[idx].content).join(', ')})</span>}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : assignment?.type === 'UPLOAD' && submission.submittedFiles ? (
                  <div className="files-preview">
                    {submission.submittedFiles.map((file, fIdx) => (
                      <a key={fIdx} href={getAbsoluteUrl(file.fileUrl)} target="_blank" rel="noreferrer" className="file-link" style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px',
                        background: '#f8fafc',
                        borderRadius: '6px',
                        marginBottom: '4px',
                        color: '#334155',
                        textDecoration: 'none',
                        border: '1px solid #e2e8f0'
                      }}>
                        <FileText size={16} />
                        <span>{file.fileName} ({(file.fileSize / 1024).toFixed(1)} KB)</span>
                      </a>
                    ))}
                  </div>
                ) : (
                  <p>{submission.content}</p>
                )}
              </div>

              {submission.status === "graded" && (
                <div className="grade-display">
                  <div className="score">
                    <Star size={16} className="score-icon" />
                    <span className="score-value">{submission.score}</span>
                    <span className="score-max">/{assignment?.maxScore || 10}</span>
                  </div>
                  {submission.feedback && (
                    <div className="feedback">
                      <MessageSquare size={14} />
                      <p>{submission.feedback}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="submission-actions">
                <button 
                  className="grade-btn"
                  onClick={() => openGradeModal(submission)}
                >
                  <Star size={16} />
                  {submission.status === "graded" ? "Sửa điểm" : "Chấm điểm"}
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Grade Modal */}
      {gradingSubmission && (
        <div className="modal-overlay">
          <div className="modal grade-modal">
            <div className="modal-header">
              <h2>Chấm điểm: {gradingSubmission.studentName}</h2>
              <button className="close-btn" onClick={() => setGradingSubmission(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="submission-preview">
                <label>Bài làm:</label>
                <div className="content-box" style={{ 
                  background: '#f8fafc', 
                  padding: '16px', 
                  borderRadius: '12px', 
                  border: '1px solid #e2e8f0',
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {assignment?.type === 'QUIZ' && gradingSubmission.quizAnswers ? (
                    <div className="quiz-answers-preview">
                      {assignment.questions.map((q, qIdx) => {
                        const studentAns = gradingSubmission.quizAnswers.find(a => a.questionIndex === qIdx);
                        const isCorrect = studentAns && 
                                         q.correctAnswers.length === studentAns.selectedOptions.length &&
                                         q.correctAnswers.every(ca => studentAns.selectedOptions.includes(ca));
                        
                        return (
                          <div key={qIdx} className={`preview-q ${isCorrect ? 'correct' : 'incorrect'}`} style={{
                            padding: '12px',
                            borderLeft: `5px solid ${isCorrect ? '#22c55e' : '#ef4444'}`,
                            background: isCorrect ? '#f0fdf4' : '#fef2f2',
                            marginBottom: '12px',
                            borderRadius: '8px'
                          }}>
                            <p style={{ fontWeight: '600', fontSize: '0.95rem' }}>Câu {qIdx + 1}: {q.content}</p>
                            <p style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                              <span style={{ color: '#64748b' }}>Học sinh trả lời: </span>
                              <span style={{ color: studentAns ? '#0f172a' : '#ef4444' }}>
                                {studentAns ? studentAns.selectedOptions.map(idx => q.options[idx].content).join(', ') : 'Không trả lời'}
                              </span>
                            </p>
                            {!isCorrect && (
                              <p style={{ fontSize: '0.9rem', color: '#16a34a', marginTop: '4px' }}>
                                <span>Đáp án đúng: </span>
                                <span>{q.correctAnswers.map(idx => q.options[idx].content).join(', ')}</span>
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : assignment?.type === 'UPLOAD' && gradingSubmission.submittedFiles ? (
                    <div className="files-preview">
                      {gradingSubmission.submittedFiles.map((file, fIdx) => (
                        <a key={fIdx} href={getAbsoluteUrl(file.fileUrl)} target="_blank" rel="noreferrer" className="file-link" style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px',
                          background: 'white',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          color: '#0284c7',
                          textDecoration: 'none',
                          border: '1px solid #bae6fd',
                          fontWeight: '500'
                        }}>
                          <FileText size={18} />
                          <span>{file.fileName} ({(file.fileSize / 1024).toFixed(1)} KB)</span>
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p style={{ whiteSpace: 'pre-wrap' }}>{gradingSubmission.content}</p>
                  )}
                </div>
              </div>
              <div className="grade-form">
                <div className="form-group">
                  <label>Điểm (0 - {assignment?.maxScore || 10})</label>
                  <input
                    type="number"
                    min="0"
                    max={assignment?.maxScore || 10}
                    value={gradeScore}
                    onChange={(e) => setGradeScore(e.target.value)}
                    placeholder="Nhập điểm"
                  />
                </div>
                <div className="form-group">
                  <label>Nhận xét</label>
                  <textarea
                    value={gradeFeedback}
                    onChange={(e) => setGradeFeedback(e.target.value)}
                    placeholder="Nhập nhận xét cho sinh viên..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setGradingSubmission(null)}>
                Hủy
              </button>
              <button className="submit-btn" onClick={handleGrade}>
                <Star size={16} /> Lưu điểm
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Violation Modal */}
      {viewingViolations && (
        <div className="modal-overlay">
          <div className="modal" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldAlert size={24} color="#ef4444" />
                Lịch sử vi phạm: {viewingViolations.studentName}
              </h2>
              <button className="close-btn" onClick={() => setViewingViolations(null)}>×</button>
            </div>
            <div className="modal-body">
              <div className="violation-summary" style={{ 
                background: '#fef2f2', 
                border: '1px solid #fee2e2', 
                padding: '12px', 
                borderRadius: '8px',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <AlertTriangle size={32} color="#ef4444" />
                <div>
                  <h4 style={{ margin: 0, color: '#991b1b' }}>Phát hiện {violations.filter(v => v.userId === viewingViolations.studentId).length} hành vi bất thường</h4>
                  <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#b91c1c' }}>
                    Hệ thống ghi lại các thời điểm sinh viên thoát chế độ toàn màn hình hoặc chuyển tab.
                  </p>
                </div>
              </div>

              <div className="violation-timeline" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {violations.filter(v => v.userId === viewingViolations.studentId).length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                    <CheckCircle size={48} style={{ margin: '0 auto 10px', color: '#22c55e' }} />
                    <p>Không ghi nhận vi phạm nào</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {violations
                      .filter(v => v.userId === viewingViolations.studentId)
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .map((log, idx) => (
                        <div key={idx} style={{ 
                          padding: '12px', 
                          background: 'white', 
                          border: '1px solid #e2e8f0', 
                          borderRadius: '8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <span style={{ 
                              fontWeight: '600', 
                              color: '#ef4444', 
                              display: 'block',
                              fontSize: '14px'
                            }}>
                              {log.violationType === 'TAB_SWITCH' ? 'Chuyển Tab / Thoát Trang' : 
                               log.violationType === 'FULLSCREEN_EXIT' ? 'Thoát Toàn Màn Hình' : 
                               log.violationType === 'DEVTOOLS_OPEN' ? 'Mở Developer Tools' : 
                               log.violationType || 'Vi phạm bảo mật'}
                            </span>
                            <span style={{ fontSize: '13px', color: '#64748b' }}>{log.details}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '12px', color: '#94a3b8', display: 'block' }}>
                              {new Date(log.timestamp).toLocaleDateString()}
                            </span>
                            <span style={{ fontSize: '14px', fontWeight: '500', color: '#475569' }}>
                              {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button className="submit-btn" onClick={() => setViewingViolations(null)}>Đã xem</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssignmentSubmissions;
