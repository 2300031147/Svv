const db = require('../config/database');

// Get all tests
const getAllTests = async (req, res) => {
    try {
        const [rows] = await db.query(
            'SELECT * FROM performance_tests ORDER BY test_date DESC'
        );
        res.json({
            success: true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        console.error('Error fetching tests:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching tests',
            error: error.message
        });
    }
};

// Get single test by ID
const getTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const [rows] = await db.query(
            'SELECT * FROM performance_tests WHERE id = ?',
            [id]
        );
        
        if (rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }
        
        res.json({
            success: true,
            data: rows[0]
        });
    } catch (error) {
        console.error('Error fetching test:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching test',
            error: error.message
        });
    }
};

// Create new test
const createTest = async (req, res) => {
    try {
        const {
            test_name,
            device_used,
            browser_os,
            response_time,
            cpu_usage,
            memory_usage,
            notes,
            status
        } = req.body;

        // Validation
        if (!test_name || !device_used || !browser_os || 
            response_time === undefined || cpu_usage === undefined || 
            memory_usage === undefined || !status) {
            return res.status(400).json({
                success: false,
                message: 'Please provide all required fields'
            });
        }

        const [result] = await db.query(
            `INSERT INTO performance_tests 
            (test_name, device_used, browser_os, response_time, cpu_usage, memory_usage, notes, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [test_name, device_used, browser_os, response_time, cpu_usage, memory_usage, notes || '', status]
        );

        res.status(201).json({
            success: true,
            message: 'Test created successfully',
            data: {
                id: result.insertId,
                test_name,
                device_used,
                browser_os,
                response_time,
                cpu_usage,
                memory_usage,
                notes,
                status
            }
        });
    } catch (error) {
        console.error('Error creating test:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating test',
            error: error.message
        });
    }
};

// Delete test
const deleteTest = async (req, res) => {
    try {
        const { id } = req.params;
        
        const [result] = await db.query(
            'DELETE FROM performance_tests WHERE id = ?',
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Test not found'
            });
        }

        res.json({
            success: true,
            message: 'Test deleted successfully'
        });
    } catch (error) {
        console.error('Error deleting test:', error);
        res.status(500).json({
            success: false,
            message: 'Error deleting test',
            error: error.message
        });
    }
};

// Get statistics
const getStatistics = async (req, res) => {
    try {
        const [stats] = await db.query(`
            SELECT 
                COUNT(*) as total_tests,
                AVG(response_time) as avg_response_time,
                AVG(cpu_usage) as avg_cpu_usage,
                AVG(memory_usage) as avg_memory_usage,
                SUM(CASE WHEN status = 'Stable' THEN 1 ELSE 0 END) as stable_count,
                SUM(CASE WHEN status = 'Lag' THEN 1 ELSE 0 END) as lag_count,
                SUM(CASE WHEN status = 'Crash' THEN 1 ELSE 0 END) as crash_count
            FROM performance_tests
        `);

        res.json({
            success: true,
            data: stats[0]
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching statistics',
            error: error.message
        });
    }
};

module.exports = {
    getAllTests,
    getTestById,
    createTest,
    deleteTest,
    getStatistics
};
