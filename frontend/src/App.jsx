import { Routes, Route } from "react-router-dom";
import TeacherTimetable from "./pages/TeacherTimetable";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<TeacherTimetable />} />
    </Routes>
  );
}
