import axios from "axios";
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/v1`;

export const getTeacherTimetable = async (teacherId, week, academicYear, semester) => {
  const response = await axios.get(
    `${API_URL}/teacher/${teacherId}/timetable?week=${week}&year=${academicYear}&semester=${semester}`
  );
  return response.data;
};

export const getClassTimetable = async (className, week, academicYear, semester) => {
  const response = await axios.get(
    `${BASE_URL}/api/classes/${encodeURIComponent(className)}/timetable?week=${week}&year=${academicYear}&semester=${semester}`
  );
  return response.data;
};