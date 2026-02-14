import axios from "axios";

export const getTeacherTimetable = async (teacherId, week, academicYear, semester) => {
  const response = await axios.get(
    `http://localhost:8080/teacher/${teacherId}/timetable?week=${week}&year=${academicYear}&semester=${semester}`
  );
  return response.data;
};