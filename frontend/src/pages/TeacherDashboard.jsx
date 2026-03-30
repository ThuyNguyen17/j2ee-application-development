import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, CalendarDays, History, FileText, Award, BookOpen, MessageSquare, Settings } from "lucide-react";
import './TeacherDashboard.css';

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      setTeacher(u);
    } catch {
      setTeacher(null);
    }
  }, []);

  if (!teacher) return null;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Teacher Dashboard</h1>
        <p className="dashboard-subtitle">Chào mừng trở lại, {teacher.fullName}!</p>
      </div>

      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-avatar">
            <Users size={40} />
          </div>
          <div className="profile-info">
            <h2>{teacher.fullName}</h2>
            <p className="teacher-code">Giáo viên</p>
            <div className="class-badge">
              <BookOpen size={16} />
              <span>Phòng: {teacher.department || 'Computer Science'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="actions-section">
        <button className="action-card" onClick={() => navigate('/teacher/timetable')}>
          <div className="icon-wrapper">
            <CalendarDays size={32} />
          </div>
          <div className="action-text">
            <h3>Thời khóa biểu</h3>
            <p>Xem lịch dạy tuần này</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/teacher/students')}>
          <div className="icon-wrapper">
            <BookOpen size={32} />
          </div>
          <div className="action-text">
            <h3>Danh sách sinh viên</h3>
            <p>Xem và quản lý sinh viên</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/teacher/assignments')}>
          <div className="icon-wrapper">
            <FileText size={32} />
          </div>
          <div className="action-text">
            <h3>Quản lý bài tập</h3>
            <p>Tạo và chấm bài tập</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/teacher/performance')}>
          <div className="icon-wrapper">
            <BookOpen size={32} />
          </div>
          <div className="action-text">
            <h3>Kết quả sinh viên</h3>
            <p>Xem điểm và thống kê</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/teacher/communication')}>
          <div className="icon-wrapper">
            <MessageSquare size={32} />
          </div>
          <div className="action-text">
            <h3>Gửi thông báo</h3>
            <p>Thông báo cho sinh viên</p>
          </div>
        </button>
      </div>
    </div>
  );
}

