const express = require('express');
const router = express.Router();
const scheduledTestController = require('../controllers/scheduledTestController');
const authMiddleware = require('../auth/authMiddleware');

// All scheduled test routes require authentication
router.use(authMiddleware.verifyToken);

// Get all scheduled tests
router.get('/scheduled-tests', scheduledTestController.getAllScheduledTests);

// Get single scheduled test
router.get('/scheduled-tests/:id', scheduledTestController.getScheduledTestById);

// Create new scheduled test
router.post('/scheduled-tests', scheduledTestController.createScheduledTest);

// Update scheduled test
router.put('/scheduled-tests/:id', scheduledTestController.updateScheduledTest);

// Delete scheduled test
router.delete('/scheduled-tests/:id', scheduledTestController.deleteScheduledTest);

module.exports = router;
