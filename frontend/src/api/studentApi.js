
import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/students`;

export const loginStudent = async (studentCode) => {
    const response = await axios.post(`${API_URL}/login`, { studentCode });
    return response.data;
};

export const login = async (username, password) => {
    const response = await axios.post(`${API_URL}/login-new`, { username, password });
    return response.data;
};

export const getStudentSubjects = async (studentId) => {
    const response = await axios.get(`${API_URL}/${studentId}/subjects`);
    return response.data;
};

export const getAttendanceDetails = async (studentId, assignmentId) => {
    const response = await axios.get(`${API_URL}/${studentId}/subjects/${assignmentId}/attendance`);
    return response.data;
};





export const getStudentsByClass = async (className) => {
    const response = await axios.get(`${API_URL}/class/${encodeURIComponent(className)}`);
    return response.data;
};