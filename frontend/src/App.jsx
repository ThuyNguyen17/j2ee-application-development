import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home.jsx";
import StudentLogin from "./pages/StudentLogin.jsx";
import StudentDashboard from "./pages/StudentDashboard.jsx";
import StudentScanner from "./pages/StudentScanner.jsx";
import AttendanceHistory from "./pages/AttendanceHistory.jsx";
import SubjectAttendance from "./pages/SubjectAttendance.jsx";
import StudentTimetable from "./pages/StudentTimetable.jsx";
import TeacherTimetable from "./pages/TeacherTimetable.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";

// Admin pages - imported from Admin folder index
import {
  AdminLibrary,
  AdminAnnouncements,
  AdminEventCalendar,
  AdminTeachingAssignments,
  AdminSeatingChart,
  AdminClassScores
} from "./pages/Admin/index.js";

// Student pages - imported from Students folder index
import {
  StudentAssignments,
  StudentExams,
  StudentPerformance,
  StudentLibrary,
  StudentAnnouncements,
  StudentProfile,
  StudentNotifications,
  StudentEvents,
  StudentScores,
} from "./pages/Students/index.js";

// Teacher pages - imported from Teachers folder index
import {
  TeacherStudents,
  TeacherAssignments,
  TeacherAssignmentSubmissions,
  TeacherExams,
  TeacherPerformance,
  TeacherAnnouncements,
  TeacherEvents,
  TeacherProfile,
  TeacherDashboard,
  TeacherNotifications,
  TeacherSeatingChart
} from "./pages/Teachers/index.js";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/student/login" element={<StudentLogin />} />
      
      <Route element={<AppLayout />}>
        {/* STUDENT ROUTES */}
        <Route path="/student" element={<Navigate to="dashboard" replace />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/timetable" element={<StudentTimetable />} />
        <Route path="/student/scan" element={<StudentScanner />} />
        <Route path="/student/history" element={<AttendanceHistory />} />
        <Route path="/student/subject/:assignmentId" element={<SubjectAttendance />} />
        <Route path="/student/assignments" element={<StudentAssignments />} />
        <Route path="/student/exams" element={<StudentExams />} />
        <Route path="/student/performance" element={<StudentPerformance />} />
        <Route path="/student/scores" element={<StudentScores />} />
        <Route path="/student/library" element={<StudentLibrary />} />
        <Route path="/student/notifications" element={<StudentNotifications />} />
        <Route path="/student/events" element={<StudentEvents />} />
        <Route path="/student/communication" element={<StudentAnnouncements />} />
        <Route path="/student/settings" element={<StudentProfile />} />

        {/* TEACHER ROUTES */}
        <Route path="/teacher" element={<Navigate to="dashboard" replace />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/timetable" element={<TeacherTimetable />} />
        <Route path="/teacher/students" element={<TeacherStudents />} />
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/assignments/:assignmentId/submissions" element={<TeacherAssignmentSubmissions />} />
        <Route path="/teacher/exams" element={<TeacherExams />} />
        <Route path="/teacher/performance" element={<TeacherPerformance />} />
        <Route path="/teacher/events" element={<TeacherEvents />} />
        <Route path="/teacher/communication" element={<TeacherAnnouncements />} />
        <Route path="/teacher/notifications" element={<TeacherNotifications />} />
        <Route path="/teacher/seating-chart" element={<TeacherSeatingChart />} />
        <Route path="/teacher/settings" element={<TeacherProfile />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<Navigate to="dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/library" element={<AdminLibrary />} />
        <Route path="/admin/communication" element={<AdminAnnouncements />} />
        <Route path="/admin/events" element={<AdminEventCalendar />} />
        <Route path="/admin/seating-chart" element={<AdminSeatingChart />} />
        <Route path="/admin/class-scores" element={<AdminClassScores />} />
        <Route path="/admin/teaching-assignments" element={<AdminTeachingAssignments />} />
      </Route>

      <Route path="/attendance" element={<Navigate to="/student/scan" replace />} />
      <Route path="*" element={<div>Path not found: {window.location.pathname}</div>} />
    </Routes>
  );
}

