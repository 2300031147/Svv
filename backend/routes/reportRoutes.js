const express = require('express');
const router = express.Router();
const { generatePDFReport } = require('../reportGenerator');

// Optional auth middleware
const optionalAuth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (token) {
            const jwt = require('jsonwebtoken');
            if (!process.env.JWT_SECRET) {
                throw new Error('JWT_SECRET is not configured');
            }
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = decoded;
        }
    } catch (error) {
        // If token is invalid, just continue without user info
    }
    next();
};

// Generate PDF report
router.get('/pdf', optionalAuth, async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const doc = await generatePDFReport(userId);

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=performance-report.pdf');

        // Pipe the PDF document to the response
        doc.pipe(res);
    } catch (error) {
        console.error('Error generating PDF report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating PDF report',
            error: error.message
        });
    }
});

module.exports = router;
