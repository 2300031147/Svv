const db = require('../config/database');
const cron = require('node-cron');
const cronParser = require('cron-parser');

// Store active cron jobs
const activeCronJobs = new Map();

// Parse cron expression to get next run time
const getNextRunTime = (cronExpression) => {
    try {
        const interval = cronParser.parseExpression(cronExpression);
        return interval.next().toDate();
    } catch (error) {
        console.error('Error parsing cron expression:', error);
        // Default to 1 hour from now if parsing fails
        const now = new Date();
        return new Date(now.getTime() + 60 * 60 * 1000);
    }
};

// Get all scheduled tests for a user
const getAllScheduledTests = async (req, res) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        const [scheduledTests] = await db.execute(
            'SELECT * FROM scheduled_tests WHERE user_id = ? ORDER BY created_at DESC',
            [userId]
        );
        
        res.json({ success: true, data: scheduledTests });
    } catch (error) {
        console.error('Error fetching scheduled tests:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch scheduled tests', error: error.message });
    }
};

// Get a single scheduled test
const getScheduledTestById = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        const [scheduledTests] = await db.execute(
            'SELECT * FROM scheduled_tests WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        
        if (scheduledTests.length === 0) {
            return res.status(404).json({ success: false, message: 'Scheduled test not found' });
        }
        
        res.json({ success: true, data: scheduledTests[0] });
    } catch (error) {
        console.error('Error fetching scheduled test:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch scheduled test', error: error.message });
    }
};

// Create a new scheduled test
const createScheduledTest = async (req, res) => {
    try {
        const { test_name, device_used, browser_os, schedule_cron } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        if (!test_name || !device_used || !browser_os || !schedule_cron) {
            return res.status(400).json({ 
                success: false, 
                message: 'test_name, device_used, browser_os, and schedule_cron are required' 
            });
        }
        
        // Validate cron expression
        if (!cron.validate(schedule_cron)) {
            return res.status(400).json({ success: false, message: 'Invalid cron expression' });
        }
        
        const nextRun = getNextRunTime(schedule_cron);
        
        const [result] = await db.execute(
            'INSERT INTO scheduled_tests (user_id, test_name, device_used, browser_os, schedule_cron, next_run) VALUES (?, ?, ?, ?, ?, ?)',
            [userId, test_name, device_used, browser_os, schedule_cron, nextRun]
        );
        
        res.status(201).json({ 
            success: true, 
            message: 'Scheduled test created successfully',
            data: { id: result.insertId }
        });
    } catch (error) {
        console.error('Error creating scheduled test:', error);
        res.status(500).json({ success: false, message: 'Failed to create scheduled test', error: error.message });
    }
};

// Update a scheduled test
const updateScheduledTest = async (req, res) => {
    try {
        const { id } = req.params;
        const { test_name, device_used, browser_os, schedule_cron, is_active } = req.body;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        let updateFields = [];
        let updateValues = [];
        
        if (test_name !== undefined) {
            updateFields.push('test_name = ?');
            updateValues.push(test_name);
        }
        if (device_used !== undefined) {
            updateFields.push('device_used = ?');
            updateValues.push(device_used);
        }
        if (browser_os !== undefined) {
            updateFields.push('browser_os = ?');
            updateValues.push(browser_os);
        }
        if (schedule_cron !== undefined) {
            if (!cron.validate(schedule_cron)) {
                return res.status(400).json({ success: false, message: 'Invalid cron expression' });
            }
            updateFields.push('schedule_cron = ?');
            updateValues.push(schedule_cron);
            
            const nextRun = getNextRunTime(schedule_cron);
            updateFields.push('next_run = ?');
            updateValues.push(nextRun);
        }
        if (is_active !== undefined) {
            updateFields.push('is_active = ?');
            updateValues.push(is_active);
        }
        
        if (updateFields.length === 0) {
            return res.status(400).json({ success: false, message: 'No fields to update' });
        }
        
        updateValues.push(id, userId);
        
        const [result] = await db.execute(
            `UPDATE scheduled_tests SET ${updateFields.join(', ')} WHERE id = ? AND user_id = ?`,
            updateValues
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Scheduled test not found' });
        }
        
        res.json({ success: true, message: 'Scheduled test updated successfully' });
    } catch (error) {
        console.error('Error updating scheduled test:', error);
        res.status(500).json({ success: false, message: 'Failed to update scheduled test', error: error.message });
    }
};

// Delete a scheduled test
const deleteScheduledTest = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Authentication required' });
        }
        
        const [result] = await db.execute(
            'DELETE FROM scheduled_tests WHERE id = ? AND user_id = ?',
            [id, userId]
        );
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, message: 'Scheduled test not found' });
        }
        
        // Remove from active cron jobs
        if (activeCronJobs.has(id)) {
            activeCronJobs.get(id).stop();
            activeCronJobs.delete(id);
        }
        
        res.json({ success: true, message: 'Scheduled test deleted successfully' });
    } catch (error) {
        console.error('Error deleting scheduled test:', error);
        res.status(500).json({ success: false, message: 'Failed to delete scheduled test', error: error.message });
    }
};

module.exports = {
    getAllScheduledTests,
    getScheduledTestById,
    createScheduledTest,
    updateScheduledTest,
    deleteScheduledTest
};
