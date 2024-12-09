import axios from 'axios';

const API_BASE_URL = 'http://cassini.cs.kent.edu/shiftease/api';
export default API_BASE_URL;

export const fetchUsers = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        return response.data;
    } catch (error) {
        console.error("Error fetching users:", error);
        throw error;
    }
};

export const fetchShifts = async (orgId) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/shifts/${orgId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching shifts:", error);
        throw error;
    }
};

export const addShift = async (shiftData) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/shifts`, shiftData);
        return response.data;
    } catch (error) {
        console.error("Error adding shift:", error);
        throw error;
    }
};

export const deleteShift = async (orgId, shiftId) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/shifts/${orgId}/${shiftId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting shift:", error);
        throw error;
    }
};