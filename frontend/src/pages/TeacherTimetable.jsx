import React, { useEffect, useState, useCallback } from "react";
import { getTeacherTimetable } from "../api/timetableApi";
import { PERIODS, DAYS } from "../utils/timetableConstants";
import {
  getCurrentAcademicInfo,
  getCurrentWeek,
  getSemestersForYear,
  generateWeeksForSemester,
} from "../utils/academicUtils";
import TimetableGrid from "../components/timetable/TimetableGrid";
import TimetableControls from "../components/timetable/TimetableControls";
import TimetablePagination from "../components/timetable/TimetablePagination";
import ScheduleCell from "../components/timetable/ScheduleCell";

function TeacherTimetable() {
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



  const teacherId = "T001";

  const semesterOptions = getSemestersForYear(currentAcademicInfo.academicYear);
  const weekOptions = generateWeeksForSemester(
    selectedSemester,
    selectedAcademicYear
  );

  useEffect(() => {
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
      />

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
