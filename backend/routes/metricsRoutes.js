const express = require('express');
const router = express.Router();
const si = require('systeminformation');

// Get real-time system metrics
router.get('/metrics', async (req, res) => {
    try {
        // Get CPU, memory, and system uptime
        const [cpuLoad, memory, time] = await Promise.all([
            si.currentLoad(),
            si.mem(),
            si.time()
        ]);

        res.json({
            success: true,
            data: {
                cpu_usage: parseFloat(cpuLoad.currentLoad.toFixed(2)),
                memory_usage: parseFloat((memory.used / 1024 / 1024).toFixed(2)), // Convert to MB
                memory_total: parseFloat((memory.total / 1024 / 1024).toFixed(2)), // Convert to MB
                memory_percentage: parseFloat(((memory.used / memory.total) * 100).toFixed(2)),
                uptime: time.uptime
            }
        });
    } catch (error) {
        console.error('Error fetching system metrics:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching system metrics',
            error: error.message
        });
    }
});

module.exports = router;
