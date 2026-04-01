import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./components/Home.jsx";

import {
  AdminLibrary,
  AdminAnnouncements,
  AdminEventCalendar,
  AdminTeachingAssignments,
  AdminSeatingChart,
  AdminClassScores,
  AdminDashboard,
  AdminStudents
} from "./pages/Admin/index.js";

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
  StudentDashboard,
  StudentTimetable,
  StudentScanner,
  AttendanceHistory
} from "./pages/Students/index.js";

// Teacher pages - imported from Teachers folder index
import {
  TeacherAssignments,
  TeacherAssignmentSubmissions,
  TeacherExams,
  TeacherPerformance,
  TeacherAnnouncements,
  TeacherEvents,
  TeacherProfile,
  TeacherDashboard,
  TeacherSeatingChart,
  TeacherTimetable
} from "./pages/Teachers/index.js";
import SubjectAttendancel from "./pages/SubjectAttendance.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import Login from "./pages/Login.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      
      <Route element={<AppLayout />}>
        {/* STUDENT ROUTES */}
        <Route path="/student" element={<Navigate to="dashboard" replace />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/timetable" element={<StudentTimetable />} />
        <Route path="/student/scan" element={<StudentScanner />} />
        <Route path="/student/history" element={<AttendanceHistory />} />
        <Route path="/student/subject/:assignmentId" element={<SubjectAttendancel />} />
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
        <Route path="/teacher/assignments" element={<TeacherAssignments />} />
        <Route path="/teacher/assignments/:assignmentId/submissions" element={<TeacherAssignmentSubmissions />} />
        <Route path="/teacher/exams" element={<TeacherExams />} />
        <Route path="/teacher/performance" element={<TeacherPerformance />} />
        <Route path="/teacher/events" element={<TeacherEvents />} />
        <Route path="/teacher/communication" element={<TeacherAnnouncements />} />
        <Route path="/teacher/seating-chart" element={<TeacherSeatingChart />} />
        <Route path="/teacher/settings" element={<TeacherProfile />} />

        {/* ADMIN ROUTES */}
        <Route path="/admin" element={<Navigate to="dashboard" replace />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/library" element={<AdminLibrary />} />
        <Route path="/admin/students" element={<AdminStudents />} />
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

