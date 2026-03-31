import React, { useState, useEffect } from "react";
import { Users, GraduationCap, BookOpen, Calendar, TrendingUp } from "lucide-react";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [counts, setCounts] = useState({ students: 120, teachers: 45, classes: 32 });
  const [events, setEvents] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  // Mock data
  useEffect(() => {
    setEvents([
      { id: 1, title: "Khai giảng năm học mới", date: "2026-09-05" },
      { id: 2, title: "Hội thao trường", date: "2026-10-15" },
      { id: 3, title: "Ngày Nhà giáo Việt Nam", date: "2026-11-20" },
    ]);
    
    setAnnouncements([
      { id: 1, title: "Thông báo nghỉ Tết", content: "Lịch nghỉ Tết Nguyên Đán 2026", date: "2026-01-25" },
      { id: 2, title: "Kế hoạch năm học mới", content: "Kế hoạch tuyển sinh năm 2026-2027", date: "2026-02-01" },
    ]);
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="page-header">
        <h1 className="page-title">
          <TrendingUp size={28} />
          Admin Dashboard
        </h1>
        <p className="page-subtitle">
          Tổng quan hệ thống quản lý trường học
        </p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card students">
          <div className="stat-icon">
            <GraduationCap size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{counts.students}</span>
            <span className="stat-label">Tổng số học sinh</span>
          </div>
        </div>
        
        <div className="stat-card teachers">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{counts.teachers}</span>
            <span className="stat-label">Tổng số giáo viên</span>
          </div>
        </div>
        
        <div className="stat-card classes">
          <div className="stat-icon">
            <BookOpen size={24} />
          </div>
          <div className="stat-info">
            <span className="stat-value">{counts.classes}</span>
            <span className="stat-label">Tổng số lớp học</span>
          </div>
        </div>
      </div>

      {/* Recent Events */}
      <div className="section">
        <h2 className="section-title">
          <Calendar size={20} />
          Sự kiện sắp tới
        </h2>
        <div className="events-list">
          {events.map(event => (
            <div key={event.id} className="event-card">
              <div className="event-date">{event.date}</div>
              <div className="event-title">{event.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="section">
        <h2 className="section-title">Thông báo gần đây</h2>
        <div className="announcements-list">
          {announcements.map(announcement => (
            <div key={announcement.id} className="announcement-card">
              <h3 className="announcement-title">{announcement.title}</h3>
              <p className="announcement-content">{announcement.content}</p>
              <span className="announcement-date">{announcement.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
