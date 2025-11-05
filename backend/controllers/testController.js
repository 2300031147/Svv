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
        
        // Fetch browser metrics if available
        const [metricsRows] = await db.query(
            'SELECT * FROM browser_performance_metrics WHERE test_id = ?',
            [id]
        );
        
        const testData = rows[0];
        if (metricsRows.length > 0) {
            testData.browser_metrics = metricsRows[0];
        }
        
        res.json({
            success: true,
            data: testData
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
            status,
            browser_metrics
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

        // Get user_id from authenticated user (if available)
        const user_id = req.user ? req.user.id : null;

        const [result] = await db.query(
            `INSERT INTO performance_tests 
            (user_id, test_name, device_used, browser_os, response_time, cpu_usage, memory_usage, notes, status) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [user_id, test_name, device_used, browser_os, response_time, cpu_usage, memory_usage, notes || '', status]
        );

        const testId = result.insertId;

        // Insert browser performance metrics if provided
        if (browser_metrics) {
            await db.query(
                `INSERT INTO browser_performance_metrics 
                (test_id, page_load_time, dom_content_loaded, time_to_first_byte, 
                 first_contentful_paint, largest_contentful_paint, cumulative_layout_shift, first_input_delay) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    testId,
                    browser_metrics.page_load_time || null,
                    browser_metrics.dom_content_loaded || null,
                    browser_metrics.time_to_first_byte || null,
                    browser_metrics.first_contentful_paint || null,
                    browser_metrics.largest_contentful_paint || null,
                    browser_metrics.cumulative_layout_shift || null,
                    browser_metrics.first_input_delay || null
                ]
            );
        }

        res.status(201).json({
            success: true,
            message: 'Test created successfully',
            data: {
                id: testId,
                user_id,
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

// Compare multiple tests
const compareTests = async (req, res) => {
    try {
        const { ids } = req.query;
        
        if (!ids) {
            return res.status(400).json({
                success: false,
                message: 'Please provide test IDs to compare'
            });
        }
        
        const testIds = ids.split(',').map(id => parseInt(id.trim()));
        
        if (testIds.length < 2) {
            return res.status(400).json({
                success: false,
                message: 'Please provide at least 2 test IDs to compare'
            });
        }
        
        const placeholders = testIds.map(() => '?').join(',');
        const [tests] = await db.query(
            `SELECT pt.*, bpm.* 
             FROM performance_tests pt 
             LEFT JOIN browser_performance_metrics bpm ON pt.id = bpm.test_id 
             WHERE pt.id IN (${placeholders})`,
            testIds
        );
        
        if (tests.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No tests found with provided IDs'
            });
        }
        
        res.json({
            success: true,
            data: tests
        });
    } catch (error) {
        console.error('Error comparing tests:', error);
        res.status(500).json({
            success: false,
            message: 'Error comparing tests',
            error: error.message
        });
    }
};

// Get historical trends
const getHistoricalTrends = async (req, res) => {
    try {
        const { days = 30, metric = 'response_time' } = req.query;
        
        const validMetrics = ['response_time', 'cpu_usage', 'memory_usage'];
        if (!validMetrics.includes(metric)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid metric. Use: response_time, cpu_usage, or memory_usage'
            });
        }
        
        const [trends] = await db.query(
            `SELECT 
                DATE(test_date) as date,
                AVG(${metric}) as avg_value,
                MIN(${metric}) as min_value,
                MAX(${metric}) as max_value,
                COUNT(*) as test_count
             FROM performance_tests
             WHERE test_date >= DATE_SUB(NOW(), INTERVAL ? DAY)
             GROUP BY DATE(test_date)
             ORDER BY date ASC`,
            [parseInt(days)]
        );
        
        res.json({
            success: true,
            data: {
                metric,
                days: parseInt(days),
                trends
            }
        });
    } catch (error) {
        console.error('Error fetching historical trends:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching historical trends',
            error: error.message
        });
    }
};

module.exports = {
    getAllTests,
    getTestById,
    createTest,
    deleteTest,
    getStatistics,
    compareTests,
    getHistoricalTrends
};
