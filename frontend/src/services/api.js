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
};

// System metrics API endpoint
export const metricsAPI = {
    // Get real-time system metrics
    getMetrics: () => api.get('/metrics')
};

// Reports API endpoint
export const reportsAPI = {
    // Generate PDF report
    getPDFReport: () => {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        
        return axios.get(`${API_BASE_URL}/reports/pdf`, {
            responseType: 'blob',
            headers
        });
    }
};

export default api;
