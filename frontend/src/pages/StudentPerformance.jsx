import React, { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Award,
  BookOpen,
  Target,
  BarChart3
} from "lucide-react";
import { getPerformanceByStudent, calculateStudentAverage } from "./api/performanceApi";
import "./StudentPerformance.css";

const StudentPerformance = () => {
  const [performance, setPerformance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get student ID from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentId = user.id;

  useEffect(() => {
    fetchPerformance();
  }, []);

  const fetchPerformance = async () => {
    try {
      setLoading(true);
      const [performanceData, average] = await Promise.all([
        getPerformanceByStudent(studentId),
        calculateStudentAverage(studentId)
      ]);
      
      // Transform API data to component format
      const subjects = performanceData.map(p => ({
        name: p.subject,
        score: p.averageScore || 0,
        maxScore: 10,
        grade: getGradeFromScore(p.averageScore || 0)
      }));

      const recentScores = performanceData.slice(0, 4).map(p => ({
        subject: p.subject,
        type: p.type || "Kiểm tra",
        score: p.score || 0,
        date: p.date || new Date().toISOString().split('T')[0]
      }));

      setPerformance({
        overallAverage: average,
        totalSubjects: subjects.length,
        completedAssignments: performanceData.filter(p => p.type === 'assignment').length,
        totalAssignments: 28, // Can be fetched from another API
        completedExams: performanceData.filter(p => p.type === 'exam').length,
        totalExams: 8,
        subjects,
        recentScores
      });
    } catch (err) {
      console.error("Error fetching performance:", err);
      setError("Không thể tải kết quả học tập. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const getGradeFromScore = (score) => {
    if (score >= 8.5) return "Giỏi";
    if (score >= 7.0) return "Khá";
    if (score >= 5.0) return "Trung bình";
    return "Yếu";
  };

  const getRankFromScore = (score) => {
    if (score >= 8.5) return { label: "Giỏi", className: "excellent" };
    if (score >= 7.0) return { label: "Khá", className: "good" };
    if (score >= 5.0) return { label: "Trung bình", className: "average" };
    return { label: "Yếu", className: "poor" };
  };

  if (loading) {
    return (
      <div className="student-performance-container">
        <div className="page-header">
          <h1 className="page-title">
            <TrendingUp size={28} />
            Kết quả học tập
          </h1>
        </div>
        <div className="loading-state">Đang tải kết quả...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-performance-container">
        <div className="page-header">
          <h1 className="page-title">
            <TrendingUp size={28} />
            Kết quả học tập
          </h1>
        </div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  if (!performance) {
    return (
      <div className="student-performance-container">
        <div className="page-header">
          <h1 className="page-title">
            <TrendingUp size={28} />
            Kết quả học tập
          </h1>
        </div>
        <div className="empty-state">Chưa có dữ liệu điểm số</div>
      </div>
    );
  }

  return (
    <div className="student-performance-container">
      <div className="page-header">
        <h1 className="page-title">
          <TrendingUp size={28} />
          Kết quả học tập
        </h1>
        <p className="page-subtitle">
          Theo dõi tiến độ và điểm số của bạn
        </p>
      </div>

      {/* Overview Stats */}
      <div className="stats-grid">
        <div className="stat-card main">
          <div className="stat-icon">
            <Target size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{performance.overallAverage}</span>
            <span className="stat-label">Điểm trung bình</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon blue">
            <BookOpen size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{performance.completedAssignments}/{performance.totalAssignments}</span>
            <span className="stat-label">Bài tập hoàn thành</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon purple">
            <Award size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{performance.completedExams}/{performance.totalExams}</span>
            <span className="stat-label">Bài thi đã làm</span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon green">
            <BarChart3 size={20} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{performance.totalSubjects}</span>
            <span className="stat-label">Môn học</span>
          </div>
        </div>
      </div>

      {/* Subjects Performance */}
      <div className="section">
        <h2 className="section-title">Điểm theo môn</h2>
        <div className="subjects-list">
          {performance.subjects.map((subject, index) => {
            const rank = getRankFromScore(subject.score);
            return (
              <div key={index} className="subject-row">
                <div className="subject-info">
                  <span className="subject-name">{subject.name}</span>
                  <span className={`rank-badge ${rank.className}`}>{rank.label}</span>
                </div>
                <div className="subject-score">
                  <div className="progress-bar">
                    <div 
                      className="progress-fill"
                      style={{ width: `${(subject.score / subject.maxScore) * 100}%` }}
                    />
                  </div>
                  <span className="score-value">{subject.score.toFixed(1)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Scores */}
      <div className="section">
        <h2 className="section-title">Điểm gần đây</h2>
        <div className="recent-scores">
          {performance.recentScores.map((item, index) => (
            <div key={index} className="score-card">
              <div className="score-header">
                <span className="score-subject">{item.subject}</span>
                <span className="score-type">{item.type}</span>
              </div>
              <div className="score-value-large">{item.score.toFixed(1)}</div>
              <div className="score-date">{item.date}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentPerformance;
