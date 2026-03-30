import React, { useState, useEffect } from "react";
import { Calendar, Clock, MapPin, Users, AlertCircle, CalendarDays } from "lucide-react";
import { getEventsForAudience } from "../../api/eventApi";
import "./TeacherEvents.css";

const TeacherEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("upcoming"); // all, upcoming, past

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch events specifically for teachers
      // The API handles including 'all' targetAudience as well
      const allEvents = await getEventsForAudience('teachers');

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
      setError("Không thể tải sự kiện. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const getEventTypeLabel = (type) => {
    const types = {
      academic: "Học thuật",
      cultural: "Văn hóa",
      sports: "Thể thao",
      meeting: "Họp",
      other: "Khác",
    };
    return types[type] || type || "Khác";
  };

  const getEventTypeColor = (type) => {
    const colors = {
      academic: { bg: "#dbeafe", color: "#1e40af" },
      cultural: { bg: "#fce7f3", color: "#be185d" },
      sports: { bg: "#dcfce7", color: "#16a34a" },
      meeting: { bg: "#fef3c7", color: "#d97706" },
      other: { bg: "#f3f4f6", color: "#6b7280" },
    };
    return colors[type] || colors.other;
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

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    return timeStr;
  };

  const isUpcoming = (dateStr) => {
    if (!dateStr) return false;
    try {
      const eventDate = new Date(dateStr);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return eventDate >= today;
    } catch {
      return false;
    }
  };

  const filteredEvents = events.filter((event) => {
    if (filter === "upcoming") return isUpcoming(event.date);
    if (filter === "past") return !isUpcoming(event.date);
    return true;
  });

  return (
    <div className="teacher-events-page">
      <div className="page-header">
        <div className="header-title">
          <CalendarDays size={28} />
          <h1>Sự kiện & Lịch trình</h1>
        </div>
        <div className="filter-tabs">
          <button
            className={filter === "upcoming" ? "active" : ""}
            onClick={() => setFilter("upcoming")}
          >
            Sắp diễn ra
          </button>
          <button
            className={filter === "all" ? "active" : ""}
            onClick={() => setFilter("all")}
          >
            Tất cả
          </button>
          <button
            className={filter === "past" ? "active" : ""}
            onClick={() => setFilter("past")}
          >
            Đã diễn ra
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Đang tải sự kiện...</p>
        </div>
      )}

      {error && (
        <div className="error-state">
          <AlertCircle size={48} />
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && filteredEvents.length === 0 && (
        <div className="empty-state">
          <Calendar size={64} />
          <h3>Chưa có sự kiện</h3>
          <p>Hiện tại chưa có sự kiện nào {filter === "upcoming" ? "sắp diễn ra" : ""}</p>
        </div>
      )}

      <div className="events-grid">
        {filteredEvents.map((event) => {
          const typeStyle = getEventTypeColor(event.eventType);
          const upcoming = isUpcoming(event.date);
          return (
            <div
              key={event.id}
              className={`event-card ${upcoming ? "upcoming" : "past"}`}
            >
              <div className="event-header">
                <span
                  className="event-type-badge"
                  style={{
                    backgroundColor: typeStyle.bg,
                    color: typeStyle.color,
                  }}
                >
                  {getEventTypeLabel(event.eventType)}
                </span>
                {!upcoming && <span className="past-badge">Đã kết thúc</span>}
              </div>

              <h3 className="event-title">{event.title}</h3>
              <p className="event-description">{event.description}</p>

              <div className="event-details">
                <div className="detail-item">
                  <Calendar size={16} />
                  <span>{formatDate(event.date)}</span>
                </div>
                {event.startTime && (
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>
                      {formatTime(event.startTime)}
                      {event.endTime && ` - ${formatTime(event.endTime)}`}
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
                    <span>Tổ chức: {event.organizer}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeacherEvents;
