import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getClassTimetable } from "../api/timetableApi";
import { PERIODS, DAYS } from "../utils/timetableConstants";
import {
  getCurrentAcademicInfo,
  getCurrentWeek,
  getSemestersForYear,
  generateWeeksForSemester,
} from "../utils/academicUtils";
import { normalizeClassName } from "../utils/classNameUtils";
import TimetableGrid from "../components/timetable/TimetableGrid";
import TimetableControls from "../components/timetable/TimetableControls";
import TimetablePagination from "../components/timetable/TimetablePagination";
import ScheduleCell from "../components/timetable/ScheduleCell";
import axios from "axios";
import { BASE_URL } from "../api/config";

const API_URL = `${BASE_URL}/api`;

export default function StudentTimetable() {
  const navigate = useNavigate();
  const currentAcademicInfo = getCurrentAcademicInfo();
  const currentWeekNum = getCurrentWeek(
    currentAcademicInfo.semester,
    currentAcademicInfo.academicYear
  );

  const [student, setStudent] = useState(null);
  const [className, setClassName] = useState("");
  const [timetable, setTimetable] = useState([]);
  const [selectedAcademicYear, setSelectedAcademicYear] = useState(
    currentAcademicInfo.academicYear
  );
  const [selectedSemester, setSelectedSemester] = useState(
    currentAcademicInfo.semester || 1
  );
  const [selectedWeek, setSelectedWeek] = useState(currentWeekNum);
  const [loading, setLoading] = useState(false);

  // Only show the current academic year's semesters (HK1/HK2).
  const semesterOptions = getSemestersForYear(currentAcademicInfo.academicYear);
  const weekOptions = generateWeeksForSemester(selectedSemester, selectedAcademicYear);

  // 1. Load user from localStorage and fetch full student info
  useEffect(() => {
    const loadStudentInfo = async () => {
      try {
        const storedUser = localStorage.getItem("user");
        if (!storedUser) {
          navigate("/student/login");
          return;
        }
        const user = JSON.parse(storedUser);
        if (!user) {
          navigate("/student/login");
          return;
        }
        if (user.role === "TEACHER") {
          navigate("/teacher/timetable");
          return;
        }
        if (user.role !== "STUDENT") {
          navigate("/student/login");
          return;
        }
        
        // Fetch full student info to get className
        const studentId = user.studentId || user.userId;
        if (studentId) {
          try {
            const resp = await axios.get(`${API_URL}/students/${studentId}`);
            const studentData = resp.data;
            console.log("Raw student data:", JSON.stringify(studentData, null, 2));
            console.log("Available fields:", Object.keys(studentData));
            setStudent(studentData);
            
            // Try to get className from various possible fields
            const rawClassName = studentData.className || studentData.class || studentData.grade || studentData.classId;
            console.log("Raw className found:", rawClassName);
            if (rawClassName) {
              const normalized = normalizeClassName(rawClassName);
              console.log("Normalized className:", normalized);
              setClassName(normalized);
            } else {
              // If no className in student data, try to get from StudentClass collection
              console.log("No className in student data, checking student_classes...");
              try {
                const scResp = await axios.get(`${API_URL}/student-classes`);
                const studentClasses = scResp.data || [];
                const studentClass = studentClasses.find(sc => sc.studentId === studentId || sc.studentId === studentData.id);
                if (studentClass?.classId) {
                  const normalized = normalizeClassName(studentClass.classId);
                  console.log("Found className from student_classes:", normalized);
                  setClassName(normalized);
                }
              } catch (scErr) {
                console.error("Error fetching student_classes:", scErr);
              }
            }
          } catch (err) {
            console.error("Error fetching student info:", err);
            // Fallback to user data
            setStudent(user);
            if (user.className) {
              setClassName(normalizeClassName(user.className));
            }
          }
        } else {
          setStudent(user);
          if (user.className) {
            setClassName(normalizeClassName(user.className));
          }
        }
      } catch {
        navigate("/student/login");
      }
    };
    
    loadStudentInfo();
  }, [navigate]);

  // 2. Fetch timetable when we have className
  useEffect(() => {
    if (!className) {
      console.log("No className available, skipping timetable fetch");
      return;
    }
    const fetchData = async () => {
      try {
        setLoading(true);
        console.log(`Fetching timetable for class: ${className}, week: ${selectedWeek}`);
        const data = await getClassTimetable(
          className,
          selectedWeek,
          selectedAcademicYear,
          selectedSemester
        );
        console.log("Timetable data:", data);
        setTimetable(data);
      } catch (error) {
        console.error("Error fetching class timetable:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [className, selectedWeek, selectedSemester, selectedAcademicYear]);

  const getScheduleForCell = useCallback(
    (dayKey, periodId) =>
      timetable.find((item) => item.dayOfWeek === dayKey && item.period === periodId),
    [timetable]
  );

  const handleFirstWeek = () => setSelectedWeek(1);
  const handlePreviousWeek = () => {
    if (selectedWeek > 1) setSelectedWeek(selectedWeek - 1);
  };
  const handleNextWeek = () => {
    if (selectedWeek < weekOptions.length) setSelectedWeek(selectedWeek + 1);
  };
  const handleLastWeek = () => setSelectedWeek(weekOptions.length);

  const handleYearSemesterChange = (e) => {
    const [year, sem] = e.target.value.split("-");
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

  const getCellClassName = (content) => (content ? "active-cell" : "empty-cell");

  return (
    <div className="timetable-container">
      {loading && (
        <div className="loading-overlay">
          <div className="loading-spinner"></div>
        </div>
      )}

      <TimetableControls
        options={{ semesterOptions, weekOptions }}
        values={{ selectedAcademicYear, selectedSemester, selectedWeek }}
        onChange={{
          onYearSemesterChange: handleYearSemesterChange,
          onWeekChange: handleWeekChange,
        }}
        onPrint={() => window.print()}
      />

      <div className="info-text">
        ( Chế độ học sinh: chỉ xem thời khóa biểu, không mở điểm danh. Lớp {className} )
      </div>

      <TimetableGrid
        periods={PERIODS}
        days={DAYS}
        renderCellContent={renderCellContent}
        getCellClassName={getCellClassName}
      />

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
