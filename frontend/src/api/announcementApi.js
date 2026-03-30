import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/v1/announcements`;

// Get all announcements
export const getAllAnnouncements = async () => {
    const response = await axios.get(`${API_URL}/getall`);
    return response.data.announcements || [];
};

// Get announcement by ID
export const getAnnouncementById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Create new announcement
export const createAnnouncement = async (announcementData) => {
    const response = await axios.post(API_URL, announcementData);
    return response.data;
};

// Update announcement
export const updateAnnouncement = async (id, announcementData) => {
    const response = await axios.put(`${API_URL}/${id}`, announcementData);
    return response.data;
};

// Delete announcement
export const deleteAnnouncement = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

// Get announcements by class ID - backend chưa có, dùng client filter
export const getAnnouncementsByClass = async (classId) => {
    const announcements = await getAllAnnouncements();
    return announcements;
};

// Get announcements by recipient (student)
export const getAnnouncementsForStudent = async (studentId) => {
    // Note: studentId is passed but we filter by 'students' and 'all' on backend
    const response = await axios.get(`${API_URL}/audience/students`);
    return response.data.announcements || [];
};

// Get announcements by recipient (teacher)
export const getAnnouncementsForTeacher = async (teacherId) => {
    const response = await axios.get(`${API_URL}/audience/teachers`);
    return response.data.announcements || [];
};
