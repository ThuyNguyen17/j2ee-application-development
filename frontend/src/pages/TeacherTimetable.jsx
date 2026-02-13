import React, { useEffect, useState } from "react";
import { getTeacherTimetable } from "../api/timetableApi";
import { PERIODS, DAYS } from "../utils/timetableConstants";
import "./TimetableGrid.css";

function TeacherTimetable() {
  const [timetable, setTimetable] = useState([]);
  const [week, setWeek] = useState(3); // Default week
  const teacherId = "T001"; // Hardcoded for now

  useEffect(() => {
    fetchData();
  }, [week]);

  const fetchData = async () => {
    try {
      const data = await getTeacherTimetable(teacherId, week);
      console.log("Fetched timetable:", data);
      setTimetable(data);
    } catch (error) {
      console.error("Error fetching timetable:", error);
    }
  };

  const getScheduleForCell = (day, period) => {
    return timetable.find(
      (item) => item.dayOfWeek === day && item.period === period
    );
  };

  return (
    <div className="timetable-container">
      <div className="timetable-header">
        <h2>Lịch dạy Giảng viên</h2>
      </div>

      <div className="timetable-controls">
        <label>
          Chọn tuần:{" "}
          <input
            type="number"
            value={week}
            onChange={(e) => setWeek(parseInt(e.target.value))}
            min="1"
            max="52"
          />
        </label>
        <button onClick={fetchData}>Xem Lịch</button>
      </div>

      <table className="timetable-grid">
        <thead>
          <tr>
            <th className="period-header">Tiết / Thứ</th>
            {DAYS.map((day) => (
              <th key={day.key}>{day.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERIODS.map((period) => (
            <tr key={period.id}>
              <td className="period-cell">
                <div>Tiết {period.id}</div>
                <div style={{ fontSize: "0.8em", color: "#666" }}>
                  ({period.start})
                </div>
              </td>
              {DAYS.map((day) => {
                const schedule = getScheduleForCell(day.key, period.id);
                return (
                  <td key={`${day.key}-${period.id}`} className={schedule ? "active-cell" : "empty-cell"}>
                    {schedule ? (
                      <div className="schedule-content">
                        <span className="subject-info">{schedule.subject}</span>
                        <span className="class-info">Lớp: {schedule.className}</span>
                        <span className="room-info">Phòng: {schedule.room}</span>
                        {schedule.note && <span className="note-info">{schedule.note}</span>}
                      </div>
                    ) : (
                      ""
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TeacherTimetable;
