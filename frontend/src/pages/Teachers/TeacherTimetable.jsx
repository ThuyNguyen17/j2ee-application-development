

import React, { useEffect, useState, useCallback } from "react";
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

  const [timetable, setTimetable] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    currentAcademicInfo.academicYear
  );
  const [selectedSemester, setSelectedSemester] = useState(
    currentAcademicInfo.semester || 1
  );
  const [selectedWeek, setSelectedWeek] = useState(currentWeekNum);
  const [loading, setLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);

  // Attendance states
  const [isAttendanceOpen, setIsAttendanceOpen] = useState(false);
  const [attendanceData, setAttendanceData] = useState(null);


  const [teacher, setTeacher] = useState(null);
  const teacherId = teacher?.teacherId || "";

  // Only show the current academic year's semesters (HK1/HK2).
  const semesterOptions = getSemestersForYear(currentAcademicInfo.academicYear);
  const weekOptions = generateWeeksForSemester(
    selectedSemester,
    selectedAcademicYear
  );

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      console.log("Stored User String:", storedUser);
      if (!storedUser) {
        navigate('/student/login');
        return;
      }
      const user = JSON.parse(storedUser);
      console.log("Parsed User Object:", user);
      if (!user) {
        navigate('/student/login');
        return;
      }

      // Backend roles: STUDENT | TEACHER | ADMIN
      if (user.role === 'STUDENT') {
        navigate('/student/dashboard');
        return;
      }
      if (user.role !== 'TEACHER') {
        navigate('/student/login');
        return;
      }
      setTeacher(user);
    } catch (e) {
      console.error("Error parsing user from localStorage:", e);
      navigate('/student/login');
    }
  }, [navigate]);

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
        console.log("Fetched timetable:", data);
        setTimetable(data);
        setLastUpdate(new Date());
      } catch (error) {
        console.error("Error fetching timetable:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [teacherId, selectedWeek, selectedSemester, selectedAcademicYear]);

  useEffect(() => {
    const checkAcademicYear = () => {
      const latestInfo = getCurrentAcademicInfo();

      if (latestInfo.academicYear !== selectedAcademicYear) {
        setSelectedAcademicYear(latestInfo.academicYear);
        setSelectedSemester(latestInfo.semester || 1);
        const newWeek = getCurrentWeek(latestInfo.semester, latestInfo.academicYear);
        setSelectedWeek(newWeek);
      }
    };

    const dailyCheck = setInterval(checkAcademicYear, 24 * 60 * 60 * 1000);

    return () => clearInterval(dailyCheck);
  }, [selectedAcademicYear]);

  const getScheduleForCell = useCallback((dayKey, periodId) => {
    return timetable.find(
      (item) => item.dayOfWeek === dayKey && item.period === periodId
    );
  }, [timetable]);

  const handleFirstWeek = () => setSelectedWeek(1);
  const handlePreviousWeek = () => {
    if (selectedWeek > 1) setSelectedWeek(selectedWeek - 1);
  };
  const handleNextWeek = () => {
    if (selectedWeek < weekOptions.length) setSelectedWeek(selectedWeek + 1);
  };
  const handleLastWeek = () => setSelectedWeek(weekOptions.length);

  const handleYearSemesterChange = (e) => {
    const [year, sem] = e.target.value.split('-');
    setSelectedAcademicYear(parseInt(year));
    setSelectedSemester(parseInt(sem));
    setSelectedWeek(1);
  };

  const handleWeekChange = (e) => setSelectedWeek(parseInt(e.target.value));

  const handleCellClick = (day, period) => {
    const schedule = getScheduleForCell(day.key, period.id);
    if (!schedule) return;

    const confirmOpen = window.confirm(`Bạn muốn mở điểm danh cho lớp ${schedule.className}, tiết ${period.id}?`);
    if (confirmOpen) {
      // Calculate the specific date for this cell
      const weekData = weekOptions.find(w => w.value === selectedWeek);
      if (weekData) {
        const cellDate = new Date(weekData.startDate);
        // day.key is "MONDAY", "TUESDAY", etc.
        const dayMap = { 'MONDAY': 0, 'TUESDAY': 1, 'WEDNESDAY': 2, 'THURSDAY': 3, 'FRIDAY': 4, 'SATURDAY': 5, 'SUNDAY': 6 };
        const dayOffset = dayMap[day.key] ?? 0;

        // Find the Monday of this week (or the first day of the week)
        // In Vietnamese school, Week X starts on a specific date. 
        // We assume weekData.startDate is the Monday of that week.
        cellDate.setDate(cellDate.getDate() + dayOffset);

        try {
          const dateString = cellDate.toISOString().split('T')[0];
          setAttendanceData({
            assignmentId: schedule.teachingAssignmentId,
            date: dateString,
            period: period.id,
            semester: selectedSemester,
            className: schedule.className // Pass class name for display
          });
          setIsAttendanceOpen(true);
        } catch (e) {
          console.error("Invalid date calculation", e);
        }
      }
    }
  };

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

  return (
    <div className="timetable-container">
      {/* Loading Overlay */}
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      {/* Controls Section */}
      <TimetableControls
        options={{ semesterOptions, weekOptions }}
        values={{ selectedAcademicYear, selectedSemester, selectedWeek }}
        onChange={{
          onYearSemesterChange: handleYearSemesterChange,
          onWeekChange: handleWeekChange
        }}
        onPrint={() => window.print()}
      />

      {/* Info Text */}
      <div className="info-text">
        ( Lưu ý: Tuần {selectedWeek} tương ứng với tuần {selectedWeek} của học kỳ {selectedSemester},
        năm học {selectedAcademicYear}-{selectedAcademicYear + 1} )
      </div>

      {/* Timetable Grid */}
      <TimetableGrid
        periods={PERIODS}
        days={DAYS}
        renderCellContent={renderCellContent}
        getCellClassName={getCellClassName}
        onCellClick={handleCellClick}
      />

      {/* Attendance Modal */}
      {attendanceData && (
        <AttendanceModal
          isOpen={isAttendanceOpen}
          onClose={() => setIsAttendanceOpen(false)}
          {...attendanceData}
        />
      )}

      {/* Footer Buttons */}
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
