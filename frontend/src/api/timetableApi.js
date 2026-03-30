import axios from "axios";

export const getTeacherTimetable = async (teacherId, week, academicYear, semester) => {
  const response = await axios.get(
    `/api/teacher/${teacherId}/timetable?week=${week}&year=${academicYear}&semester=${semester}`
  );
  return response.data;
};

export const getClassTimetable = async (className, week, academicYear, semester) => {
  const response = await axios.get(
    `/api/classes/${encodeURIComponent(className)}/timetable?week=${week}&year=${academicYear}&semester=${semester}`
  );
  return response.data;
};