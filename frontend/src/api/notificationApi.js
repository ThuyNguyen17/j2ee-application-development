import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/v1/notifications`;

// Get all notifications
export const getAllNotifications = async () => {
    const response = await axios.get(`${API_URL}/getall`);
    return response.data.notifications || [];
};

// Get notifications by role (STUDENT, TEACHER, ALL)
export const getNotificationsByRole = async (targetRole) => {
    const response = await axios.get(`${API_URL}/role/${targetRole}`);
    return response.data.notifications || [];
};

// Get notifications by class
export const getNotificationsByClass = async (classId) => {
    const response = await axios.get(`${API_URL}/class/${classId}`);
    return response.data.notifications || [];
};

// Get notifications by class and role
export const getNotificationsByClassAndRole = async (classId, targetRole) => {
    const response = await axios.get(`${API_URL}/class/${classId}/role/${targetRole}`);
    return response.data.notifications || [];
};

// Create notification
export const createNotification = async (notificationData) => {
    const response = await axios.post(API_URL, notificationData);
    return response.data;
};

// Delete notification
export const deleteNotification = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

// Update notification
export const updateNotification = async (id, notificationData) => {
    const response = await axios.put(`${API_URL}/${id}`, notificationData);
    return response.data;
};
