import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Bell, 
  Send, 
  Trash2, 
  Edit3, 
  Plus, 
  Search, 
  Users, 
  AlertCircle, 
  ChevronRight, 
  X,
  Target,
  Flag
} from "lucide-react";
import { BASE_URL } from "../../api/config";
import "./Announcement.css";

const Announcement = () => {
    const [newAnnouncement, setNewAnnouncement] = useState({ 
        title: '', 
        content: '',
        targetAudience: 'all', 
        priority: 'normal'
    });
    const [announcements, setAnnouncements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingAnnouncement, setEditingAnnouncement] = useState(null);
    const [editForm, setEditForm] = useState({ 
        title: '', 
        content: '',
        targetAudience: 'all',
        priority: 'normal'
    });

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const fetchAnnouncements = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${BASE_URL}/api/v1/announcements/getall`);
            setAnnouncements(response.data.announcements || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching announcements: ', error);
            setError("Không thể tải danh sách thông báo.");
            setLoading(false);
        }
    };

    const handleAddAnnouncement = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${BASE_URL}/api/v1/announcements`, newAnnouncement);
            fetchAnnouncements();
            setNewAnnouncement({ 
                title: '', 
                content: '',
                targetAudience: 'all',
                priority: 'normal'
            });
            alert('Thông báo đã được gửi thành công!');
        } catch (error) {
            console.error("Error adding announcement: ", error);
            alert("Có lỗi xảy ra khi gửi thông báo.");
        }
    };

    const handleDeleteAnnouncement = async (id) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa thông báo này?')) {
            try {
                await axios.delete(`${BASE_URL}/api/v1/announcements/${id}`);
                fetchAnnouncements();
            } catch (error) {
                console.error("Error deleting announcement: ", error);
            }
        }
    };

    const startEdit = (announcement) => {
        setEditingAnnouncement(announcement.id);
        setEditForm({
            title: announcement.title,
            content: announcement.content,
            targetAudience: announcement.targetAudience || 'all',
            priority: announcement.priority || 'normal'
        });
    };

    const cancelEdit = () => {
        setEditingAnnouncement(null);
    };

    const handleUpdateAnnouncement = async (e, id) => {
        e.preventDefault();
        try {
            await axios.put(`${BASE_URL}/api/v1/announcements/${id}`, editForm);
            fetchAnnouncements();
            setEditingAnnouncement(null);
        } catch (error) {
            console.error("Error updating announcement: ", error);
            alert("Có lỗi xảy ra khi cập nhật thông báo.");
        }
    };

    const getAudienceLabel = (audience) => {
        if (audience === 'students') return 'Học sinh';
        if (audience === 'teachers') return 'Giảng viên';
        return 'Tất cả';
    };

    const getPriorityLabel = (priority) => {
        if (priority === 'high') return 'Ưu tiên cao';
        if (priority === 'low') return 'Ưu tiên thấp';
        return 'Bình thường';
    };

    return (
        <div className="admin-announcement-page">
            <h1 className="page-title">
              <Bell size={32} color="#0ea5e9" />
              Quản lý Thông báo
            </h1>

            {/* Form Card */}
            <div className="announcement-form-card">
              <form onSubmit={handleAddAnnouncement}>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Tiêu đề thông báo</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Nhập tiêu đề ngắn gọn..."
                      value={newAnnouncement.title}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, title: e.target.value })}
                      required
                    />
                  </div>
                  
                  <div className="form-group full-width">
                    <label>Nội dung chi tiết</label>
                    <textarea
                      className="form-control"
                      rows={4}
                      placeholder="Nhập nội dung thông báo tại đây..."
                      value={newAnnouncement.content}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, content: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Đối tượng nhận</label>
                    <select
                      className="form-control"
                      value={newAnnouncement.targetAudience}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, targetAudience: e.target.value })}
                    >
                      <option value="all">Tất cả (Học sinh & Giảng viên)</option>
                      <option value="students">Chỉ Học sinh</option>
                      <option value="teachers">Chỉ Giảng viên</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Mức độ ưu tiên</label>
                    <select
                      className="form-control"
                      value={newAnnouncement.priority}
                      onChange={(e) => setNewAnnouncement({ ...newAnnouncement, priority: e.target.value })}
                    >
                      <option value="normal">Bình thường</option>
                      <option value="high">Ưu tiên cao</option>
                      <option value="low">Ưu tiên thấp</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={loading}>
                  <Send size={18} />
                  Gửi thông báo ngay
                </button>
              </form>
            </div>

            {/* List Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: 0 }}>
                Lịch sử thông báo
              </h2>
              <div style={{ color: '#64748b', fontSize: '0.875rem' }}>
                Tổng cộng: {announcements.length} thông báo
              </div>
            </div>

            {loading && (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>Đang tải danh sách...</p>
              </div>
            )}

            {error && (
              <div className="error-state">
                <AlertCircle size={48} />
                <p>{error}</p>
              </div>
            )}

            <div className="announcement-list">
              {!loading && announcements.length === 0 && (
                <div className="empty-state">
                  <Bell size={64} />
                  <h3>Chưa có thông báo nào</h3>
                  <p>Hãy bắt đầu bằng cách tạo thông báo đầu tiên ở biểu mẫu bên trên.</p>
                </div>
              )}

              {announcements.map((announcement) => (
                <div key={announcement.id} className="announcement-item">
                  {editingAnnouncement === announcement.id ? (
                    <div className="edit-form-card">
                      <form onSubmit={(e) => handleUpdateAnnouncement(e, announcement.id)}>
                        <div className="form-group">
                          <label>Tiêu đề</label>
                          <input
                            className="form-control"
                            value={editForm.title}
                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-group">
                          <label>Nội dung</label>
                          <textarea
                            className="form-control"
                            rows={3}
                            value={editForm.content}
                            onChange={(e) => setEditForm({ ...editForm, content: e.target.value })}
                            required
                          />
                        </div>
                        <div className="form-grid">
                          <div className="form-group">
                            <label>Gửi đến</label>
                            <select
                              className="form-control"
                              value={editForm.targetAudience}
                              onChange={(e) => setEditForm({ ...editForm, targetAudience: e.target.value })}
                            >
                              <option value="all">Tất cả</option>
                              <option value="students">Học sinh</option>
                              <option value="teachers">Giảng viên</option>
                            </select>
                          </div>
                          <div className="form-group">
                            <label>Ưu tiên</label>
                            <select
                              className="form-control"
                              value={editForm.priority}
                              onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                            >
                              <option value="normal">Bình thường</option>
                              <option value="high">Ưu tiên cao</option>
                              <option value="low">Ưu tiên thấp</option>
                            </select>
                          </div>
                        </div>
                        <div className="announcement-actions">
                          <button type="submit" className="action-btn edit-btn">Lưu thay đổi</button>
                          <button type="button" className="action-btn cancel-btn" onClick={cancelEdit}>Hủy</button>
                        </div>
                      </form>
                    </div>
                  ) : (
                    <>
                      <div className="announcement-header">
                        <div className="announcement-title">{announcement.title}</div>
                        <div className="badge-group">
                          <span className={`badge audience-${announcement.targetAudience || 'all'}`}>
                            {getAudienceLabel(announcement.targetAudience)}
                          </span>
                          <span className={`badge priority-${announcement.priority || 'normal'}`}>
                            {getPriorityLabel(announcement.priority)}
                          </span>
                        </div>
                      </div>
                      <div className="announcement-content">{announcement.content}</div>
                      <div className="announcement-actions">
                        <button className="action-btn edit-btn" onClick={() => startEdit(announcement)}>
                          <Edit3 size={16} />
                          Sửa
                        </button>
                        <button className="action-btn delete-btn" onClick={() => handleDeleteAnnouncement(announcement.id)}>
                          <Trash2 size={16} />
                          Xóa
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
        </div>
    );
};

export default Announcement;