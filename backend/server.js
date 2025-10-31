const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply rate limiting to API routes
app.use('/api', limiter);

// Import authentication middleware
const authMiddleware = require('./auth/authMiddleware');

// Routes
const authRoutes = require('./auth/authRoutes');
const testRoutes = require('./routes/testRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const reportRoutes = require('./routes/reportRoutes');

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication optional for backward compatibility)
// Tests can be accessed without auth but will save user_id if authenticated
app.use('/api', testRoutes);

// System metrics route
app.use('/api', metricsRoutes);

// Reports route (can be protected with authMiddleware if needed)
app.use('/api/reports', reportRoutes);

// Health check route
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: 'Server is running' });
});

// Root route
app.get('/', (req, res) => {
    res.json({ 
        message: 'System Performance Observer API',
        version: '1.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            tests: 'GET /api/tests',
            statistics: 'GET /api/tests/statistics',
            singleTest: 'GET /api/tests/:id',
            createTest: 'POST /api/tests',
            deleteTest: 'DELETE /api/tests/:id',
            metrics: 'GET /api/metrics',
            reports: 'GET /api/reports/pdf',
            health: 'GET /health'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    console.log(`API Base URL: http://localhost:${PORT}/api`);
});

module.exports = app;
