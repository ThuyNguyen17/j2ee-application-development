import React, { useState, useEffect } from "react";
import { 
  MessageSquare, 
  Calendar,
  Search,
  Bell,
  ArrowRight
} from "lucide-react";
import { 
  getAnnouncementsForTeacher
} from "../../api/announcementApi";
import "./TeacherAnnouncements.css";

const TeacherAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const teacherId = user?.teacherId || user?.userId;

  useEffect(() => {
    if (!teacherId) {
      setError("Không tìm thấy thông tin giáo viên. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    fetchData();
  }, [teacherId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getAnnouncementsForTeacher(teacherId);
      setAnnouncements(data || []);
    } catch (err) {
      console.error("Error fetching announcements:", err);
      setError("Không thể tải thông báo.");
    } finally {
      setLoading(false);
    }
  };

  const filteredAnnouncements = (announcements || []).filter(a =>
    (a?.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (a?.content?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="teacher-announcements-container">
        <div className="loading-state">Đang tải thông báo...</div>
      </div>
    );
  }

  return (
    <div className="teacher-announcements-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">
            <Bell size={28} />
            Thông báo từ Ban quản lý
          </h1>
          <p className="page-subtitle">Xem các thông báo và chỉ đạo từ nhà trường</p>
        </div>
      </div>

      <div className="search-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm thông báo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="announcements-list">
        {filteredAnnouncements.map((announcement) => (
          <div key={announcement.id} className="announcement-card">
            <div className="announcement-header">
              <div className="announcement-info">
                <div className="title-row">
                  <h3 className="announcement-title">{announcement.title}</h3>
                  {announcement.priority === 'high' && (
                    <span className="priority-badge danger">Quan trọng</span>
                  )}
                </div>
                <div className="date-row">
                  <Calendar size={14} />
                  <span>{announcement.date}</span>
                </div>
              </div>
            </div>

            <p className="announcement-content">{announcement.content}</p>
            
            <div className="announcement-footer" style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'flex-end' }}>
               <span style={{ fontSize: '12px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                 Xem chi tiết <ArrowRight size={12} />
               </span>
            </div>
          </div>
        ))}

        {filteredAnnouncements.length === 0 && (
          <div className="empty-state">
            <MessageSquare size={48} />
            <p>Chưa có thông báo nào từ Ban quản lý</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherAnnouncements;
