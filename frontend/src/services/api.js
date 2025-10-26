import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Test API endpoints
export const testAPI = {
    // Get all tests
    getAllTests: () => api.get('/tests'),
    
    // Get single test by ID
    getTestById: (id) => api.get(`/tests/${id}`),
    
    // Create new test
    createTest: (testData) => api.post('/tests', testData),
    
    // Delete test
    deleteTest: (id) => api.delete(`/tests/${id}`),
    
    // Get statistics
    getStatistics: () => api.get('/tests/statistics'),
};

export default api;
