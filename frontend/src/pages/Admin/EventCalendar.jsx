import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit2,
  Trash2,
  Plus,
  X,
  Search,
  Filter,
  AlertCircle,
} from "lucide-react";
import "./AdminEvents.css";

const BASE_URL = "http://localhost:8080";

const EVENT_TYPES = [
  { value: "academic", label: "Học thuật" },
  { value: "cultural", label: "Văn hóa" },
  { value: "sports", label: "Thể thao" },
  { value: "meeting", label: "Họp" },
  { value: "other", label: "Khác" },
];

const TARGET_AUDIENCES = [
  { value: "all", label: "Tất cả" },
  { value: "students", label: "Học sinh" },
  { value: "teachers", label: "Giảng viên" },
];

const EventCalendar = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    startTime: "",
    endTime: "",
    location: "",
    organizer: "",
    eventType: "academic",
    targetAudience: "all",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${BASE_URL}/api/v1/events/getall`);
      const allEvents = response.data.events || [];
      
      // Sort by date (put events with dates first, then null dates)
      const sortedEvents = allEvents.sort((a, b) => {
        if (!a.date && !b.date) return 0;
        if (!a.date) return 1;
        if (!b.date) return -1;
        return new Date(a.date) - new Date(b.date);
      });
      
      setEvents(sortedEvents);
    } catch (error) {
      console.error("Error fetching events: ", error);
      alert("Không thể tải sự kiện. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = {
        ...formData,
        events: formData.title // Backend expects 'events' field
      };
      
      if (editingEvent) {
        await axios.put(`${BASE_URL}/api/v1/events/${editingEvent.id}`, submitData);
        alert("Cập nhật sự kiện thành công!");
      } else {
        await axios.post(`${BASE_URL}/api/v1/events`, submitData);
        alert("Thêm sự kiện thành công!");
      }
      fetchEvents();
      closeModal();
    } catch (error) {
      console.error("Error saving event: ", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa sự kiện này?")) {
      try {
        await axios.delete(`${BASE_URL}/api/v1/events/${id}`);
        alert("Xóa sự kiện thành công!");
        fetchEvents();
      } catch (error) {
        console.error("Error deleting event: ", error);
        alert("Không thể xóa sự kiện. Vui lòng thử lại!");
      }
    }
  };

  const openAddModal = () => {
    setEditingEvent(null);
    setFormData({
      title: "",
      description: "",
      date: "",
      startTime: "",
      endTime: "",
      location: "",
      organizer: "",
      eventType: "academic",
      targetAudience: "all",
    });
    setShowModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title || event.events || "",
      description: event.description || "",
      date: event.date || "",
      startTime: event.startTime || "",
      endTime: event.endTime || "",
      location: event.location || "",
      organizer: event.organizer || "",
      eventType: event.eventType || "academic",
      targetAudience: event.targetAudience || "all",
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingEvent(null);
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      (event.title?.toLowerCase() || event.events?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (event.description?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesType = filterType === "all" || event.eventType === filterType;
    return matchesSearch && matchesType;
  });

  const getEventTypeLabel = (type) => {
    const found = EVENT_TYPES.find((t) => t.value === type);
    return found ? found.label : type;
  };

  const getTargetAudienceLabel = (target) => {
    const found = TARGET_AUDIENCES.find((t) => t.value === target);
    return found ? found.label : target;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "Chưa xác định";
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return "Chưa xác định";
      return date.toLocaleDateString("vi-VN", {
        weekday: "long",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
    } catch {
      return dateStr || "Chưa xác định";
    }
  };

  return (
    <div className="admin-events-page">
      <div className="page-header">
        <div className="header-title">
          <Calendar size={28} />
          <h1>Quản lý sự kiện</h1>
        </div>
        <button className="add-event-btn" onClick={openAddModal}>
          <Plus size={20} />
          Thêm sự kiện
        </button>
      </div>

      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Tìm kiếm sự kiện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <Filter size={16} />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">Tất cả loại</option>
            {EVENT_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải...</p>
        </div>
      ) : filteredEvents.length === 0 ? (
        <div className="empty-state">
          <Calendar size={48} />
          <p>Chưa có sự kiện nào</p>
        </div>
      ) : (
        <div className="events-grid">
          {filteredEvents.map((event) => (
            <div key={event.id} className="event-card">
              <div className="event-header">
                <div className="event-type">{getEventTypeLabel(event.eventType)}</div>
                <div className="event-actions">
                  <button onClick={() => openEditModal(event)} className="edit-btn">
                    <Edit2 size={16} />
                  </button>
                  <button onClick={() => handleDelete(event.id)} className="delete-btn">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              
              <h3 className="event-title">{event.title || event.events}</h3>
              {event.description && (
                <p className="event-description">{event.description}</p>
              )}
              
              <div className="event-details">
                {event.date && (
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{formatDate(event.date)}</span>
                  </div>
                )}
                {event.startTime && (
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>
                      {event.startTime}
                      {event.endTime && ` - ${event.endTime}`}
                    </span>
                  </div>
                )}
                {event.location && (
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{event.location}</span>
                  </div>
                )}
                {event.organizer && (
                  <div className="detail-item">
                    <Users size={16} />
                    <span>{event.organizer}</span>
                  </div>
                )}
              </div>
              
              {event.targetAudience && (
                <div className="event-footer">
                  <span className="target-audience">
                    Dành cho: {getTargetAudienceLabel(event.targetAudience)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="event-form-overlay">
          <div className="event-form">
            <div className="modal-header">
              <h2>{editingEvent ? "Chỉnh sửa sự kiện" : "Thêm sự kiện mới"}</h2>
              <button className="close-btn" onClick={closeModal}>
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Tiêu đề sự kiện *"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
                <select
                  value={formData.eventType}
                  onChange={(e) => setFormData({...formData, eventType: e.target.value})}
                >
                  {EVENT_TYPES.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <select
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({...formData, targetAudience: e.target.value})}
                >
                  {TARGET_AUDIENCES.map((audience) => (
                    <option key={audience.value} value={audience.value}>
                      {audience.label}
                    </option>
                  ))}
                </select>
              </div>
              
              <textarea
                placeholder="Mô tả sự kiện"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows="3"
              />
              
              <div className="form-row">
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({...formData, date: e.target.value})}
                  required
                />
                <input
                  type="time"
                  placeholder="Thời gian bắt đầu"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                />
                <input
                  type="time"
                  placeholder="Thời gian kết thúc"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                />
              </div>
              
              <div className="form-row">
                <input
                  type="text"
                  placeholder="Địa điểm"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Người tổ chức"
                  value={formData.organizer}
                  onChange={(e) => setFormData({...formData, organizer: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" className="cancel-btn" onClick={closeModal}>
                  Hủy
                </button>
                <button type="submit" className="submit-btn">
                  {editingEvent ? "Cập nhật" : "Thêm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventCalendar;
