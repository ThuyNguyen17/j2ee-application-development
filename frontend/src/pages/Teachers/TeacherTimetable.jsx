import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getTeacherTimetable } from "../../api/timetableApi";
import { PERIODS, DAYS } from "../../utils/timetableConstants";
import {
  getCurrentAcademicInfo,
  getCurrentWeek,
  getSemestersForYear,
  generateWeeksForSemester,
} from "../../utils/academicUtils";

import TimetableGrid from "../../components/timetable/TimetableGrid";
import TimetableControls from "../../components/timetable/TimetableControls";
import TimetablePagination from "../../components/timetable/TimetablePagination";
import ScheduleCell from "../../components/timetable/ScheduleCell";
import AttendanceModal from "../../components/attendance/AttendanceModal";

function TeacherTimetable() {
  const navigate = useNavigate();
  const currentAcademicInfo = getCurrentAcademicInfo();
  const currentWeekNum = getCurrentWeek(
    currentAcademicInfo.semester,
    currentAcademicInfo.academicYear
  );

  // ================= STATE =================

  const [timetable, setTimetable] = useState([]);
  const [teacher, setTeacher] = useState(null);

  // 📌 Bộ lọc
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    currentAcademicInfo.academicYear
  );
  const [selectedSemester, setSelectedSemester] = useState(
    currentAcademicInfo.semester || 1
  );
  const [selectedWeek, setSelectedWeek] = useState(currentWeekNum);

  // 📌 UI state
  const [loading, setLoading] = useState(false);

  // 📌 Attendance Modal
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);

  // ================= DERIVED =================

  const teacherId = teacher?.teacherId;

  // 📌 Danh sách học kỳ theo năm
  const semesterOptions = useMemo(() => {
    return getSemestersForYear(selectedAcademicYear);
  }, [selectedAcademicYear]);

  // 📌 Danh sách tuần theo học kỳ
  const weekOptions = useMemo(() => {
    return generateWeeksForSemester(selectedSemester, selectedAcademicYear);
  }, [selectedSemester, selectedAcademicYear]);

  // ================= AUTH =================

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      // ❗ Không có user → về login
      if (!storedUser) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(storedUser);

      // ❗ Role không đúng
      if (user.role !== "TEACHER") {
        navigate("/login");
        return;
      }

      setTeacher(user);
    } catch (e) {
      console.error("Parse user error:", e);
      navigate("/login");
    }
  }, [navigate]);

  // ================= FETCH TIMETABLE =================

  useEffect(() => {
    if (!teacherId) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const data = await getTeacherTimetable(
          teacherId,
          selectedWeek,
          selectedAcademicYear,
          selectedSemester
        );

        setTimetable(data || []);
      } catch (error) {
        console.error("Fetch timetable error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId, selectedWeek, selectedSemester, selectedAcademicYear]);

  // ================= HELPER =================

  /**
   * 📌 Tối ưu: chuyển timetable thành map để lookup nhanh O(1)
   * key dạng: "MONDAY-1"
   */
  const timetableMap = useMemo(() => {
    const map = {};

    timetable.forEach((item) => {
      const key = `${item.dayOfWeek}-${item.period}`;
      map[key] = item;
    });

    return map;
  }, [timetable]);

  /**
   * 📌 Lấy dữ liệu của 1 ô trong timetable
   */
  const getScheduleForCell = useCallback(
    (dayKey, periodId) => {
      return timetableMap[`${dayKey}-${periodId}`];
    },
    [timetableMap]
  );

  // ================= DATE LOGIC =================

  /**
   * 📌 Tính ngày thực tế của 1 ô (rất quan trọng)
   * week.startDate = thứ 2
   */
  const getDateFromCell = (dayKey) => {
    const weekData = weekOptions.find((w) => w.value === selectedWeek);
    if (!weekData) return null;

    const baseDate = new Date(weekData.startDate);

    // Map thứ → offset
    const dayMap = {
      MONDAY: 0,
      TUESDAY: 1,
      WEDNESDAY: 2,
      THURSDAY: 3,
      FRIDAY: 4,
      SATURDAY: 5,
      SUNDAY: 6,
    };

    const offset = dayMap[dayKey] ?? 0;

    baseDate.setDate(baseDate.getDate() + offset);

    return baseDate.toISOString().split("T")[0]; // YYYY-MM-DD
  };

  /**
   * 📌 Danh sách các thứ với ngày chính xác
   */
  const displayedDays = useMemo(() => {
    const weekData = weekOptions.find((w) => w.value === selectedWeek);
    if (!weekData || !weekData.startDate) return DAYS;

    const baseDate = new Date(weekData.startDate);
    baseDate.setHours(12, 0, 0, 0); // Tránh lệch múi giờ khi tính toán
    
    return DAYS.map((day, index) => {
      const d = new Date(baseDate);
      d.setDate(baseDate.getDate() + index);
      const dayStr = d.getDate().toString().padStart(2, '0');
      const monthStr = (d.getMonth() + 1).toString().padStart(2, '0');
      return {
        ...day,
        label: `${day.label} (${dayStr}/${monthStr})`
      };
    });
  }, [selectedWeek, weekOptions]);

  // ================= CLICK CELL =================

  const handleCellClick = (day, period) => {
    const schedule = getScheduleForCell(day.key, period.id);

    // ❗ Không có tiết học → bỏ qua
    if (!schedule) return;

    // ❗ UX: hỏi trước
    const confirmOpen = window.confirm(
      `Điểm danh lớp ${schedule.className} - Tiết ${period.id}?`
    );

    if (!confirmOpen) return;

    const dateString = getDateFromCell(day.key);

    if (!dateString) {
      console.error("Không tính được ngày");
      return;
    }

    // 📌 Set data cho modal
    setAttendanceData({
      assignmentId: schedule.teachingAssignmentId,
      date: dateString,
      period: period.id,
      semester: selectedSemester,
      className: schedule.className,
    });

    // 📌 Mở modal
    setIsAttendanceOpen(true);
  };

  // ================= RENDER CELL =================

  const renderCellContent = (day, period) => {
    const schedule = getScheduleForCell(day.key, period.id);

    if (!schedule) return null;

    return (
      <ScheduleCell
        subject={schedule.subject}
        studentClass={schedule.className}
        room={schedule.room}
        note={schedule.note}
      />
    );
  };

  const getCellClassName = (content) => {
    return content ? "active-cell" : "empty-cell";
  };

  // ================= PAGINATION =================

  const handleFirstWeek = () => setSelectedWeek(1);

  const handlePreviousWeek = () => {
    setSelectedWeek((prev) => Math.max(prev - 1, 1));
  };

  const handleNextWeek = () => {
    setSelectedWeek((prev) =>
      Math.min(prev + 1, weekOptions.length)
    );
  };

  const handleLastWeek = () => {
    setSelectedWeek(weekOptions.length);
  };

  // ================= FILTER =================

  const handleYearSemesterChange = (e) => {
    const [year, sem] = e.target.value.split("-");

    setSelectedAcademicYear(parseInt(year));
    setSelectedSemester(parseInt(sem));

    // ❗ reset tuần về 1 khi đổi học kỳ
    setSelectedWeek(1);
  };

  const handleWeekChange = (e) => {
    setSelectedWeek(parseInt(e.target.value));
  };

  // ================= RENDER =================

  return (
    <div className="timetable-container">
      {/* 🔄 Loading */}
      {loading && <div className="loading-overlay">Loading...</div>}

      {/* 🎛 Controls */}
      <TimetableControls
        options={{ semesterOptions, weekOptions }}
        values={{ selectedAcademicYear, selectedSemester, selectedWeek }}
        onChange={{
          onYearSemesterChange: handleYearSemesterChange,
          onWeekChange: handleWeekChange,
        }}
        onPrint={() => window.print()}
      />

      {/* 📌 Info */}
      <div className="info-text">
        Tuần {selectedWeek} - HK {selectedSemester} - Năm học{" "}
        {selectedAcademicYear}
      </div>

      {/* 📅 Grid */}
      <TimetableGrid
        periods={PERIODS}
        days={displayedDays}
        renderCellContent={renderCellContent}
        getCellClassName={getCellClassName}
        onCellClick={handleCellClick}
      />

      {/* 📊 Attendance Modal */}
      {isAttendanceOpen && attendanceData && (
        <AttendanceModal
          isOpen={isAttendanceOpen}
          onClose={() => setIsAttendanceOpen(false)}
          {...attendanceData}
        />
      )}

      {/* ⏮ Pagination */}
      <TimetablePagination
        selectedWeek={selectedWeek}
        totalWeeks={weekOptions.length}
        onFirstWeek={handleFirstWeek}
        onPreviousWeek={handlePreviousWeek}
        onNextWeek={handleNextWeek}
        onLastWeek={handleLastWeek}
      />
    </div>
  );
}

export default TeacherTimetable;