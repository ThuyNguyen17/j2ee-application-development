import React, { useState, useEffect } from "react";
import axios from "axios";
import { Calendar, MessageSquare, AlertCircle, Bell, ChevronRight, User, Terminal } from "lucide-react";
import { BASE_URL } from "../../api/config";
import "./StudentAnnouncements.css";

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentClassName = user?.className || user?.classId || "";

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all announcements from backend
      const response = await axios.get(`${BASE_URL}/api/v1/announcements/getall`);
      const allAnnouncements = response.data.announcements || [];

      // Filter logic:
      // Show if targetAudience is 'all' OR 'students'
      // OR if the student's class matches one of the classes in ann.classes
      const studentAnnouncements = allAnnouncements.filter((ann) => {
        // Check target audience first
        const audience = (ann.targetAudience || 'all').toLowerCase();
        if (audience === 'all' || audience === 'students') return true;

        // Then check specific classes if audience didn't match
        if (ann.classes && ann.classes.length > 0) {
          return ann.classes.some(
            (c) =>
              c.id === studentClassName ||
              c.name === studentClassName ||
              studentClassName.includes(c.name || '')
          );
        }
        
        return false;
      });

      // Sort by date (newest first)
      const sortedAnnouncements = studentAnnouncements.sort(
        (a, b) => new Date(b.date || b.id || 0) - new Date(a.date || a.id || 0)
      );

      setAnnouncements(sortedAnnouncements);
    } catch (error) {
      console.error("Error fetching announcements: ", error);
      setError("Không thể tải thông báo. Vui lòng kiểm tra lại kết nối Server.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (priority) => {
    switch (priority) {
      case "high":
        return { bg: "#fef2f2", color: "#dc2626", border: "#fecaca" };
      case "low":
        return { bg: "#f0fdf4", color: "#16a34a", border: "#bbf7d0" };
      default:
        return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case "high":
        return "Ưu tiên cao";
      case "low":
        return "Ưu tiên thấp";
      default:
        return "Bình thường";
    }
  };

  const formatDate = (dateValue) => {
    if (!dateValue) return "Gần đây";
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "Gần đây";
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return "Gần đây";
    }
  };

  return (
    <div className="announcements-page">
      <div className="page-header">
        <div className="header-title">
          <Bell size={32} color="#0ea5e9" />
          <h1>Thông báo từ Nhà trường</h1>
        </div>
        <span className="announcement-count">
          {announcements.length} thông báo mới
        </span>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải thông báo...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <AlertCircle size={48} color="#ef4444" />
          <p>{error}</p>
          <button className="view-btn" onClick={fetchAnnouncements} style={{ marginTop: '1rem' }}>Thử lại</button>
        </div>
      )}

      {!loading && !error && announcements.length === 0 && (
        <div className="empty-state">
          <MessageSquare size={64} color="#cbd5e1" />
          <h3>Chưa có thông báo</h3>
          <p>Hiện tại chưa có thông báo mới nào dành cho {studentClassName || "bạn"}.</p>
        </div>
      )}

      <div className="announcements-list">
        {announcements.map((item) => {
          const priorityStyle = getPriorityStyles(item.priority);
          return (
            <div
              key={item.id}
              className="announcement-card"
              style={{
                borderLeft: `5px solid ${priorityStyle.color}`
              }}
            >
              <div className="card-header">
                <h3 className="card-title">
                  {item.title || item.announcement}
                </h3>
                <span
                  className="priority-badge"
                  style={{
                    backgroundColor: priorityStyle.bg,
                    color: priorityStyle.color,
                    border: `1px solid ${priorityStyle.border}`
                  }}
                >
                  {getPriorityLabel(item.priority)}
                </span>
              </div>

              <div className="card-date" style={{ marginBottom: '1rem' }}>
                <Calendar size={14} />
                <span>{formatDate(item.date || item.createdAt)}</span>
                <span style={{ margin: '0 8px', color: '#cbd5e1' }}>|</span>
                <User size={14} />
                <span>BQT Nhà trường</span>
              </div>

              <p className="card-content">
                {item.content || item.announcement}
              </p>

              <div className="card-footer">
                <span className="target-classes">
                  Dành cho: {item.targetAudience === 'all' ? 'Toàn trường' : 'Toàn bộ Học sinh'}
                </span>
                <ChevronRight size={18} className="arrow-icon" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StudentAnnouncements;