import React, { useState, useEffect } from "react";
import { Bell, Calendar, AlertCircle, Filter, ChevronDown } from "lucide-react";
import { getNotificationsByRole, getNotificationsByClassAndRole } from "../../api/notificationApi";
import "./TeacherNotifications.css";

const TeacherNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all"); // all, high
  const [expandedId, setExpandedId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const teacherId = user.teacherId || user.userId;
      // Get teacher's classes
      const teacherClasses = user.classes || [];

      let notificationsData = [];

      // Fetch general notifications for teachers
      const generalNotifications = await getNotificationsByRole("TEACHER");
      notificationsData = [...generalNotifications];

      // Fetch class-specific notifications for each class the teacher teaches
      for (const classObj of teacherClasses) {
        const classId = classObj.id || classObj;
        const classNotifications = await getNotificationsByClassAndRole(classId, "TEACHER");
        notificationsData = [...notificationsData, ...classNotifications];
      }

      // Sort by date (newest first)
      const sortedNotifications = notificationsData.sort((a, b) => {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setNotifications(sortedNotifications);
    } catch (error) {
      console.error("Error fetching notifications: ", error);
      setError("Không thể tải thông báo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyles = (priority) => {
    // Default styling for notifications
    return { bg: "#fffbeb", color: "#d97706", border: "#fde68a" };
  };

  const getPriorityLabel = (priority) => {
    return "Thông báo";
  };

  const getTargetLabel = (target) => {
    switch (target) {
      case "STUDENT":
        return "Dành cho học sinh";
      case "TEACHER":
        return "Dành cho giáo viên";
      case "ALL":
        return "Thông báo chung";
      default:
        return "Thông báo chung";
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Không có ngày";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "high") return notification.priority === "high";
    return true;
  });

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="teacher-notifications-page">
      <div className="page-header">
        <div className="header-title">
          <Bell size={28} />
          <h1>Thông báo</h1>
        </div>
        <div className="header-actions">
          <div className="filter-dropdown">
            <Filter size={16} />
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">Tất cả thông báo</option>
              <option value="high">Ưu tiên cao</option>
            </select>
          </div>
          <span className="notification-count">
            {filteredNotifications.length} thông báo
          </span>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải thông báo...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <AlertCircle size={48} />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredNotifications.length === 0 && (
        <div className="empty-state">
          <Bell size={64} />
          <h3>Chưa có thông báo</h3>
          <p>Hiện tại chưa có thông báo nào</p>
        </div>
      )}

      <div className="notifications-list">
        {filteredNotifications.map((notification) => {
          const priorityStyle = getPriorityStyles(notification.priority);
          const isExpanded = expandedId === notification.id;
          return (
            <div
              key={notification.id}
              className={`notification-card ${isExpanded ? "expanded" : ""}`}
              style={{
                borderLeft: `4px solid ${priorityStyle.color}`,
              }}
            >
              <div
                className="card-header"
                onClick={() => toggleExpand(notification.id)}
              >
                <div className="header-left">
                  <h3 className="card-title">{notification.title}</h3>
                  <div className="card-meta">
                    <span
                      className="priority-badge"
                      style={{
                        backgroundColor: priorityStyle.bg,
                        color: priorityStyle.color,
                        border: `1px solid ${priorityStyle.border}`,
                      }}
                    >
                      {getPriorityLabel(notification.priority)}
                    </span>
                    <span className="target-badge">
                      {getTargetLabel(notification.targetRole)}
                    </span>
                  </div>
                </div>
                <div className="header-right">
                  <div className="card-date">
                    <Calendar size={14} />
                    <span>{formatDate(notification.createdAt)}</span>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`expand-icon ${isExpanded ? "rotated" : ""}`}
                  />
                </div>
              </div>

              <div className={`card-content ${isExpanded ? "show" : ""}`}>
                <p>{notification.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherNotifications;
