const express = require('express');
const router = express.Router();
const authMiddleware = require('../auth/authMiddleware');
const {
    getAllTests,
    getTestById,
    createTest,
    deleteTest,
    getStatistics
} = require('../controllers/testController');

// Optional authentication middleware - adds user info if token is present but doesn't block
const optionalAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            const jwt = require('jsonwebtoken');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
            req.user = decoded;
        }
    } catch (error) {
        // If token is invalid, just continue without user info
    }
    next();
};

// Routes with optional authentication
router.get('/tests', optionalAuth, getAllTests);
router.get('/tests/statistics', optionalAuth, getStatistics);
router.get('/tests/:id', optionalAuth, getTestById);
router.post('/tests', optionalAuth, createTest);
router.delete('/tests/:id', optionalAuth, deleteTest);

module.exports = router;
