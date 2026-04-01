import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/v1/announcements`;

// ========== ANNOUNCEMENT APIs ==========

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

// Get announcements by recipient (audience)
export const getAnnouncementsByAudience = async (targetAudience) => {
    const response = await axios.get(`${API_URL}/audience/${targetAudience}`);
    return response.data.announcements || [];
};

// Get announcements for student
export const getAnnouncementsForStudent = async (studentId) => {
    const response = await axios.get(`${API_URL}/audience/students`);
    return response.data.announcements || [];
};

// Get announcements for teacher
export const getAnnouncementsForTeacher = async (teacherId) => {
    const response = await axios.get(`${API_URL}/audience/teachers`);
    return response.data.announcements || [];
};

// ========== MERGED FROM notificationApi.js ==========

// Get announcements by role (STUDENT, TEACHER, ALL)
export const getAnnouncementsByRole = async (targetRole) => {
    const response = await axios.get(`${API_URL}/role/${targetRole}`);
    return response.data.announcements || [];
};

// Get announcements by class ID
export const getAnnouncementsByClass = async (classId) => {
    const response = await axios.get(`${API_URL}/class/${classId}`);
    return response.data.announcements || [];
};

// Get announcements by class and role
export const getAnnouncementsByClassAndRole = async (classId, targetRole) => {
    const response = await axios.get(`${API_URL}/class/${classId}/role/${targetRole}`);
    return response.data.announcements || [];
};

// Create with auto timestamp (like old notification create)
export const createAnnouncementWithTimestamp = async (announcementData) => {
    const response = await axios.post(`${API_URL}/create`, announcementData);
    return response.data;
};

// Legacy aliases for backward compatibility
export const getAllNotifications = getAllAnnouncements;
export const getNotificationsByRole = getAnnouncementsByRole;
export const getNotificationsByClass = getAnnouncementsByClass;
export const getNotificationsByClassAndRole = getAnnouncementsByClassAndRole;
export const createNotification = createAnnouncement;
export const deleteNotification = deleteAnnouncement;
export const updateNotification = updateAnnouncement;
