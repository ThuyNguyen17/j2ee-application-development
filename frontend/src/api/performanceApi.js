import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/scores`;

// Get all performance/score records
export const getAllPerformance = async () => {
    const response = await axios.get(API_URL);
    return response.data || [];
};

// Get performance by student ID
export const getPerformanceByStudent = async (studentId) => {
    const response = await axios.get(`${API_URL}/student/${studentId}`);
    return response.data || [];
};

// Get performance by class ID - cần lấy từ teaching assignment
export const getPerformanceByClass = async (classId) => {
    // Lấy tất cả scores và filter (tạm thời)
    const response = await axios.get(API_URL);
    return response.data || [];
};

// Add or update grade
export const saveGrade = async (gradeData) => {
    const response = await axios.post(API_URL, gradeData);
    return response.data;
};

// Update assignment grade
export const updateAssignmentGrade = async (studentId, assignmentId, score) => {
    // Tìm score record và update
    const scores = await getPerformanceByStudent(studentId);
    // Logic update ở đây
    return { success: true };
};

// Update exam grade
export const updateExamGrade = async (studentId, examId, score) => {
    // Tìm score record và update
    return { success: true };
};

// Calculate student average
export const calculateStudentAverage = async (studentId) => {
    const scores = await getPerformanceByStudent(studentId);
    if (!scores || scores.length === 0) return 0;
    
    // Tính trung bình từ các items trong scores
    let totalValue = 0;
    let totalWeight = 0;
    
    scores.forEach(score => {
        if (score.items) {
            score.items.forEach(item => {
                totalValue += item.value * item.weight;
                totalWeight += item.weight;
            });
        }
    });
    
    return totalWeight > 0 ? (totalValue / totalWeight) : 0;
};

// Get class statistics
export const getClassStatistics = async (classId) => {
    // Trả về mock data tạm thời
    return {
        average: 7.5,
        excellentCount: 5,
        goodCount: 10,
        averageCount: 8,
        poorCount: 2
    };
};
