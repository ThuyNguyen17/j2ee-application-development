import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/v1/exams`;

// Get all exams
export const getAllExams = async () => {
    const response = await axios.get(`${API_URL}/getall`);
    return response.data.exams || [];
};

// Get exam by ID
export const getExamById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Create new exam
export const createExam = async (examData) => {
    const response = await axios.post(API_URL, examData);
    return response.data;
};

// Update exam
export const updateExam = async (id, examData) => {
    const response = await axios.put(`${API_URL}/${id}`, examData);
    return response.data;
};

// Delete exam
export const deleteExam = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

// Get exams by class name (dựa vào className field trong model)
export const getExamsByClass = async (className) => {
    const response = await axios.get(`${API_URL}/exams/getall`);
    const exams = response.data.exams || [];
    // Lọc theo class name
    return exams.filter(e => e.className === className || !className);
};

// Get exams by student ID
export const getExamsByStudent = async (studentId) => {
    const response = await axios.get(`${API_URL}/student/${studentId}`);
    return response.data.exams || [];
};

// Submit exam result
export const submitExamResult = async (examId, studentId, score) => {
    const response = await axios.post(`${API_URL}/${examId}/result`, {
        studentId,
        score
    });
    return response.data;
};
