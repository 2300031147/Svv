import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token is invalid or expired
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Optionally redirect to login
            // window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Authentication API endpoints
export const authAPI = {
    // Register new user
    register: (userData) => api.post('/auth/register', userData),
    
    // Login user
    login: (credentials) => api.post('/auth/login', credentials),
    
    // Logout (client-side only)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },
    
    // Check if user is authenticated
    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },
    
    // Get current user
    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    }
};

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
    
    // Compare multiple tests
    compareTests: (ids) => api.get(`/tests/compare?ids=${ids.join(',')}`),
    
    // Get historical trends
    getHistoricalTrends: (days = 30, metric = 'response_time') => 
        api.get(`/tests/trends?days=${days}&metric=${metric}`)
};

// Checklist API endpoints
export const checklistAPI = {
    // Get all checklists
    getAllChecklists: () => api.get('/checklists'),
    
    // Get single checklist by ID
    getChecklistById: (id) => api.get(`/checklists/${id}`),
    
    // Create new checklist
    createChecklist: (checklistData) => api.post('/checklists', checklistData),
    
    // Update checklist item
    updateChecklistItem: (itemId, data) => api.put(`/checklists/items/${itemId}`, data),
    
    // Delete checklist
    deleteChecklist: (id) => api.delete(`/checklists/${id}`)
};

// Scheduled tests API endpoints
export const scheduledTestAPI = {
    // Get all scheduled tests
    getAllScheduledTests: () => api.get('/scheduled-tests'),
    
    // Get single scheduled test by ID
    getScheduledTestById: (id) => api.get(`/scheduled-tests/${id}`),
    
    // Create new scheduled test
    createScheduledTest: (data) => api.post('/scheduled-tests', data),
    
    // Update scheduled test
    updateScheduledTest: (id, data) => api.put(`/scheduled-tests/${id}`, data),
    
    // Delete scheduled test
    deleteScheduledTest: (id) => api.delete(`/scheduled-tests/${id}`)
};

// System metrics API endpoint
export const metricsAPI = {
    // Get real-time system metrics
    getMetrics: () => api.get('/metrics')
};

// Reports API endpoint
export const reportsAPI = {
    // Generate PDF report
    getPDFReport: () => api.get('/reports/pdf', { responseType: 'blob' }),
    
    // Generate Excel report
    getExcelReport: () => api.get('/reports/excel', { responseType: 'blob' })
};

export default api;
