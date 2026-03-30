import React, { useState, useEffect } from "react";
import { 
  Award, 
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { getExamsByStudent } from "../../api/examApi";
import "./StudentExams.css";

const StudentExams = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get student ID from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentId = user.id;

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const data = await getExamsByStudent(studentId);
      setExams(data);
    } catch (err) {
      console.error("Error fetching exams:", err);
      setError("Không thể tải bài thi. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case "upcoming": return { text: "Sắp thi", className: "status-upcoming", icon: Clock };
      case "completed": return { text: "Đã hoàn thành", className: "status-completed", icon: CheckCircle };
      default: return { text: "Sắp thi", className: "status-upcoming", icon: Clock };
    }
  };

  if (loading) {
    return (
      <div className="student-exams-container">
        <div className="page-header">
          <h1 className="page-title">
            <Award size={28} />
            Bài thi của tôi
          </h1>
        </div>
        <div className="loading-state">Đang tải bài thi...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-exams-container">
        <div className="page-header">
          <h1 className="page-title">
            <Award size={28} />
            Bài thi của tôi
          </h1>
        </div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="student-exams-container">
      <div className="page-header">
        <h1 className="page-title">
          <Award size={28} />
          Bài thi của tôi
        </h1>
      </div>

      <div className="exams-list">
        {exams.length === 0 ? (
          <div className="empty-state">
            <Award size={48} />
            <p>Chưa có bài thi nào</p>
          </div>
        ) : (
          exams.map((exam) => {
            const status = getStatusBadge(exam.status);
            const StatusIcon = status.icon;
            return (
              <div key={exam.id} className="exam-card">
                <div className="exam-header">
                  <div className="subject-badge">{exam.subject}</div>
                  <div className={`status-badge ${status.className}`}>
                    <StatusIcon size={14} />
                    {status.text}
                  </div>
                </div>
                <h3 className="exam-title">{exam.title}</h3>
                <div className="exam-meta">
                  <div className="meta-item">
                    <Calendar size={16} />
                    <span>{exam.examDate}</span>
                  </div>
                  <div className="meta-item">
                    <Clock size={16} />
                    <span>{exam.duration} phút</span>
                  </div>
                </div>
                {exam.status === "completed" && (
                  <div className="score-display">
                    Điểm: {exam.score}/{exam.maxScore}
                  </div>
                )}
                {exam.status === "upcoming" && (
                  <div className="upcoming-notice">
                    <AlertCircle size={16} />
                    <span>Chuẩn bị cho bài thi sắp tới</span>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentExams;