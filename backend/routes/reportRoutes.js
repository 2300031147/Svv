const express = require('express');
const router = express.Router();
const { generatePDFReport } = require('../reportGenerator');

// Generate PDF report
router.get('/pdf', async (req, res) => {
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
