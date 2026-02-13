import axios from "axios";

export const getTeacherTimetable = async (teacherId, week) => {
  const response = await axios.get(
    `http://localhost:8080/teacher/${teacherId}/timetable?week=${week}`
  );
  return response.data;
};