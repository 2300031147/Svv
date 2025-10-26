const express = require('express');
const router = express.Router();
const {
    getAllTests,
    getTestById,
    createTest,
    deleteTest,
    getStatistics
} = require('../controllers/testController');

// Routes
router.get('/tests', getAllTests);
router.get('/tests/statistics', getStatistics);
router.get('/tests/:id', getTestById);
router.post('/tests', createTest);
router.delete('/tests/:id', deleteTest);

module.exports = router;
