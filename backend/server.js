const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Rate limiting middleware (IP-based for unauthenticated users)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
});

// Per-user rate limiting middleware (for authenticated users)
const userRateLimitStore = new Map();

const perUserLimiter = (req, res, next) => {
    // If user is authenticated, use per-user rate limiting
    if (req.user && req.user.id) {
        const userId = req.user.id;
        const now = Date.now();
        const windowMs = 15 * 60 * 1000; // 15 minutes
        const maxRequests = 200; // Higher limit for authenticated users
        
        if (!userRateLimitStore.has(userId)) {
            userRateLimitStore.set(userId, { count: 1, resetTime: now + windowMs });
            return next();
        }
        
        const userLimit = userRateLimitStore.get(userId);
        
        // Reset if window has expired
        if (now > userLimit.resetTime) {
            userRateLimitStore.set(userId, { count: 1, resetTime: now + windowMs });
            return next();
        }
        
        // Increment count
        if (userLimit.count < maxRequests) {
            userLimit.count++;
            return next();
        }
        
        // Rate limit exceeded
        return res.status(429).json({
            success: false,
            message: 'Too many requests, please try again later.',
            retryAfter: Math.ceil((userLimit.resetTime - now) / 1000)
        });
    }
    
    // If not authenticated, continue to IP-based rate limiting
    next();
};

// Clean up expired entries every hour
setInterval(() => {
    const now = Date.now();
    for (const [userId, data] of userRateLimitStore.entries()) {
        if (now > data.resetTime) {
            userRateLimitStore.delete(userId);
        }
    }
}, 60 * 60 * 1000);

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Apply IP-based rate limiting to all API routes
app.use('/api', limiter);

// Import authentication middleware
const authMiddleware = require('./auth/authMiddleware');

// Apply per-user rate limiting after auth check
app.use('/api', authMiddleware.optionalAuth);
app.use('/api', perUserLimiter);

// Routes
const authRoutes = require('./auth/authRoutes');
const testRoutes = require('./routes/testRoutes');
const metricsRoutes = require('./routes/metricsRoutes');
const reportRoutes = require('./routes/reportRoutes');
const checklistRoutes = require('./routes/checklistRoutes');
const scheduledTestRoutes = require('./routes/scheduledTestRoutes');

// Public routes (no authentication required)
app.use('/api/auth', authRoutes);

// Protected routes (authentication optional for backward compatibility)
// Tests can be accessed without auth but will save user_id if authenticated
app.use('/api', testRoutes);

// Checklist routes (optional authentication)
app.use('/api', checklistRoutes);

// Scheduled test routes (requires authentication)
app.use('/api', scheduledTestRoutes);

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
        version: '2.0.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login'
            },
            tests: 'GET /api/tests',
            statistics: 'GET /api/tests/statistics',
            compare: 'GET /api/tests/compare?ids=1,2,3',
            trends: 'GET /api/tests/trends?days=30&metric=response_time',
            singleTest: 'GET /api/tests/:id',
            createTest: 'POST /api/tests',
            deleteTest: 'DELETE /api/tests/:id',
            checklists: {
                getAll: 'GET /api/checklists',
                getOne: 'GET /api/checklists/:id',
                create: 'POST /api/checklists',
                updateItem: 'PUT /api/checklists/items/:id',
                delete: 'DELETE /api/checklists/:id'
            },
            scheduledTests: {
                getAll: 'GET /api/scheduled-tests',
                getOne: 'GET /api/scheduled-tests/:id',
                create: 'POST /api/scheduled-tests',
                update: 'PUT /api/scheduled-tests/:id',
                delete: 'DELETE /api/scheduled-tests/:id'
            },
            metrics: 'GET /api/metrics',
            reports: {
                pdf: 'GET /api/reports/pdf',
                excel: 'GET /api/reports/excel'
            },
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
