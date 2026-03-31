import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Calendar,
  Bell,
  Info
} from "lucide-react";
import { getAnnouncementsForStudent } from "./api/announcementApi";
import "./StudentCommunication.css";

const StudentCommunication = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get student ID from localStorage
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const studentId = user.id;

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const data = await getAnnouncementsForStudent(studentId);
      setAnnouncements(data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Không thể tải thông báo. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const getPriorityBadge = (priority) => {
    switch(priority) {
      case "high": return { text: "Ưu tiên cao", className: "priority-high", icon: Bell };
      case "normal": return { text: "Thông thường", className: "priority-normal", icon: Info };
      case "low": return { text: "Thông báo", className: "priority-low", icon: Info };
      default: return { text: "Thông báo", className: "priority-normal", icon: Info };
    }
  };

  if (loading) {
    return (
      <div className="student-communication-container">
        <div className="page-header">
          <h1 className="page-title">
            <MessageSquare size={28} />
            Tin tức & Thông báo
          </h1>
        </div>
        <div className="loading-state">Đang tải thông báo...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="student-communication-container">
        <div className="page-header">
          <h1 className="page-title">
            <MessageSquare size={28} />
            Tin tức & Thông báo
          </h1>
        </div>
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="student-communication-container">
      <div className="page-header">
        <h1 className="page-title">
          <MessageSquare size={28} />
          Tin tức & Thông báo
        </h1>
        <p className="page-subtitle">
          Cập nhật thông tin từ nhà trường và giáo viên
        </p>
      </div>

      <div className="announcements-list">
        {announcements.length === 0 ? (
          <div className="empty-state">
            <MessageSquare size={48} />
            <p>Chưa có thông báo nào</p>
          </div>
        ) : (
          announcements.map((announcement) => {
            const priority = getPriorityBadge(announcement.priority);
            const PriorityIcon = priority.icon;
            
            return (
              <div key={announcement.id} className={`announcement-card ${priority.className}`}>
                <div className="announcement-header">
                  <div className={`priority-indicator ${priority.className}`}>
                    <PriorityIcon size={16} />
                  </div>
                  <div className="announcement-meta">
                    <span className="sender">{announcement.sender}</span>
                    <span className="date">
                      <Calendar size={14} />
                      {announcement.date}
                    </span>
                  </div>
                </div>
                <h3 className="announcement-title">{announcement.title}</h3>
                <p className="announcement-content">{announcement.content}</p>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default StudentCommunication;
