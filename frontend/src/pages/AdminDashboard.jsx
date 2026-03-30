import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Users, GraduationCap, CalendarDays, Award, Library, MessageSquare, BookOpen, Settings } from "lucide-react";
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      const u = raw ? JSON.parse(raw) : null;
      setAdmin(u);
    } catch {
      setAdmin(null);
    }
  }, []);

  if (!admin) return null;

  return (
    <div className="dashboard-content">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Admin Dashboard</h1>
        <p className="dashboard-subtitle">Chào mừng trở lại, {admin.fullName}!</p>
      </div>

      <div className="profile-section">
        <div className="profile-card">
          <div className="profile-avatar">
            <Users size={40} />
          </div>
          <div className="profile-info">
            <h2>{admin.fullName}</h2>
            <p className="admin-role">Quản trị viên hệ thống</p>
            <div className="class-badge">
              <Settings size={16} />
              <span>Quản trị toàn hệ thống</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="actions-section">
        <button className="action-card" onClick={() => navigate('/admin/classes')}>
          <div className="icon-wrapper">
            <Users size={32} />
          </div>
          <div className="action-text">
            <h3>Quản lý lớp học</h3>
            <p>Tạo và quản lý lớp học</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/admin/teachers')}>
          <div className="icon-wrapper">
            <Users size={32} />
          </div>
          <div className="action-text">
            <h3>Quản lý giáo viên</h3>
            <p>Quản lý tài khoản giáo viên</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/admin/students')}>
          <div className="icon-wrapper">
            <GraduationCap size={32} />
          </div>
          <div className="action-text">
            <h3>Quản lý sinh viên</h3>
            <p>Quản lý tài khoản sinh viên</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/admin/exams')}>
          <div className="icon-wrapper">
            <Award size={32} />
          </div>
          <div className="action-text">
            <h3>Quản lý kỳ thi</h3>
            <p>Tổ chức kỳ thi toàn hệ thống</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/admin/library')}>
          <div className="icon-wrapper">
            <Library size={32} />
          </div>
          <div className="action-text">
            <h3>Quản lý thư viện</h3>
            <p>Quản lý tài liệu học tập</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/admin/communication')}>
          <div className="icon-wrapper">
            <MessageSquare size={32} />
          </div>
          <div className="action-text">
            <h3>Quản lý thông báo</h3>
            <p>Gửi thông báo toàn hệ thống</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/admin/events')}>
          <div className="icon-wrapper">
            <CalendarDays size={32} />
          </div>
          <div className="action-text">
            <h3>Quản lý sự kiện</h3>
            <p>Tổ chức sự kiện trường học</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/admin/seating-chart')}>
          <div className="icon-wrapper">
            <GraduationCap size={32} />
          </div>
          <div className="action-text">
            <h3>Quản lý sơ đồ lớp</h3>
            <p>Sắp xếp vị trí chỗ ngồi</p>
          </div>
        </button>

        <button className="action-card" onClick={() => navigate('/admin/teaching-assignments')}>
          <div className="icon-wrapper">
            <BookOpen size={32} />
          </div>
          <div className="action-text">
            <h3>Phân công giảng dạy</h3>
            <p>Phân công giáo viên vào lớp</p>
          </div>
        </button>
      </div>
    </div>
  );
}

