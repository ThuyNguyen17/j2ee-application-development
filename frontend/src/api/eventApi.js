import axios from 'axios';
import { BASE_URL } from './config';

const API_URL = `${BASE_URL}/api/v1/events`;

// Get all events
export const getAllEvents = async () => {
    const response = await axios.get(`${API_URL}/getall`);
    return response.data.events || [];
};

// Get event by ID
export const getEventById = async (id) => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
};

// Create new event
export const createEvent = async (eventData) => {
    const response = await axios.post(API_URL, eventData);
    return response.data;
};

// Update event
export const updateEvent = async (id, eventData) => {
    const response = await axios.put(`${API_URL}/${id}`, eventData);
    return response.data;
};

// Delete event
export const deleteEvent = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
};

// Get events by date range
export const getEventsByDateRange = async (startDate, endDate) => {
    const response = await axios.get(`${API_URL}/range`, {
        params: { startDate, endDate }
    });
    return response.data.events || [];
};

// Get upcoming events
export const getUpcomingEvents = async () => {
    const response = await axios.get(`${API_URL}/upcoming`);
    return response.data.events || [];
};

// Get events by audience (targetAudience: 'teachers' or 'students')
export const getEventsForAudience = async (targetAudience) => {
    const response = await axios.get(`${API_URL}/audience/${targetAudience}`);
    return response.data.events || [];
};
