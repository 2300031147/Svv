const express = require('express');
const router = express.Router();
const { generatePDFReport, generateExcelReport } = require('../reportGenerator');

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

// Generate Excel report
router.get('/excel', optionalAuth, async (req, res) => {
    try {
        const userId = req.user ? req.user.id : null;
        const workbook = await generateExcelReport(userId);

        // Set response headers
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=performance-report.xlsx');

        // Write the workbook to the response
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error('Error generating Excel report:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating Excel report',
            error: error.message
        });
    }
});

module.exports = router;
