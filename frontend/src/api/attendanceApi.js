import axios from 'axios';
import { BASE_URL } from './config';

// Khi dùng Vite Proxy, ta chỉ cần gọi đường dẫn tương đối.
// Vite sẽ tự động chuyển tiếp các yêu cầu /api sang http://localhost:8080
const api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'ngrok-skip-browser-warning': 'true',
        'Content-Type': 'application/json'
    }
});

export const startSession = async (assignmentId, date, period, semester, latitude, longitude) => {
    // Gọi đường dẫn đầy đủ từ gốc
    const response = await api.post('/api/attendance/session/start', {
        assignmentId,
        date,
        period,
        semester,
        latitude,
        longitude
    });
    return response.data;
};

export const updateQrToken = async (sessionId, token) => {
    const response = await api.post(`/api/attendance/session/${sessionId}/token`, { token });
    return response.data;
};

export const getAttendances = async (sessionId) => {
    const response = await api.get(`/api/attendance/session/${sessionId}/attendances`);
    return response.data;
};

export const getMissingStudents = async (sessionId) => {
    const response = await api.get(`/api/attendance/session/${sessionId}/missing`);
    return response.data;
};

export const closeSession = async (sessionId) => {
    await api.post(`/api/attendance/session/${sessionId}/close`);
};

export const recordAttendance = async (data) => {
    const response = await api.post(`/api/attendance/record`, data);
    return response.data;
};

export const updateAttendanceNote = async (attendanceId, note) => {
    const response = await api.put(`/api/attendance/${attendanceId}/note`, { note });
    return response.data;
};

export const clearAttendances = async (sessionId) => {
    await api.delete(`/api/attendance/session/${sessionId}/clear`);
};