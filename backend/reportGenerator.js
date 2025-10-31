const PDFDocument = require('pdfkit');
const db = require('./config/database');

async function generatePDFReport(userId = null) {
    // Create a new PDF document
    const doc = new PDFDocument({ margin: 50 });

    // Fetch test data
    let query = 'SELECT * FROM performance_tests';
    let params = [];
    
    if (userId) {
        query += ' WHERE user_id = ?';
        params.push(userId);
    }
    
    query += ' ORDER BY test_date DESC';
    
    const [tests] = await db.query(query, params);

    // Fetch statistics
    let statsQuery = `
        SELECT 
            COUNT(*) as total_tests,
            AVG(response_time) as avg_response_time,
            AVG(cpu_usage) as avg_cpu_usage,
            AVG(memory_usage) as avg_memory_usage,
            SUM(CASE WHEN status = 'Stable' THEN 1 ELSE 0 END) as stable_count,
            SUM(CASE WHEN status = 'Lag' THEN 1 ELSE 0 END) as lag_count,
            SUM(CASE WHEN status = 'Crash' THEN 1 ELSE 0 END) as crash_count
        FROM performance_tests
    `;
    
    if (userId) {
        statsQuery += ' WHERE user_id = ?';
    }
    
    const [stats] = await db.query(statsQuery, userId ? [userId] : []);
    const statistics = stats[0];

    // Add content to PDF
    // Header
    doc.fontSize(24)
        .font('Helvetica-Bold')
        .text('System Performance Observer', { align: 'center' })
        .moveDown();

    doc.fontSize(14)
        .font('Helvetica')
        .text('Performance Test Report', { align: 'center' })
        .moveDown();

    doc.fontSize(10)
        .text(`Generated on: ${new Date().toLocaleString()}`, { align: 'center' })
        .moveDown(2);

    // Summary Statistics
    doc.fontSize(16)
        .font('Helvetica-Bold')
        .text('Summary Statistics')
        .moveDown(0.5);

    doc.fontSize(12)
        .font('Helvetica');

    const summaryData = [
        ['Total Tests:', statistics.total_tests || 0],
        ['Average Response Time:', `${parseFloat(statistics.avg_response_time || 0).toFixed(2)} ms`],
        ['Average CPU Usage:', `${parseFloat(statistics.avg_cpu_usage || 0).toFixed(2)}%`],
        ['Average Memory Usage:', `${parseFloat(statistics.avg_memory_usage || 0).toFixed(2)} MB`],
        ['Stable Tests:', statistics.stable_count || 0],
        ['Lag Tests:', statistics.lag_count || 0],
        ['Crash Tests:', statistics.crash_count || 0]
    ];

    summaryData.forEach(([label, value]) => {
        doc.text(`${label} ${value}`, { indent: 20 });
    });

    doc.moveDown(2);

    // Test Records Table
    doc.fontSize(16)
        .font('Helvetica-Bold')
        .text('Test Records')
        .moveDown(0.5);

    if (tests.length === 0) {
        doc.fontSize(12)
            .font('Helvetica')
            .text('No test records available.', { indent: 20 });
    } else {
        doc.fontSize(10)
            .font('Helvetica');

        // Table header
        const tableTop = doc.y;
        const rowHeight = 30;
        let currentY = tableTop;

        // Column widths
        const cols = {
            testName: 150,
            device: 80,
            responseTime: 80,
            cpuUsage: 60,
            memUsage: 60,
            status: 50
        };

        // Draw header
        doc.font('Helvetica-Bold')
            .text('Test Name', 50, currentY, { width: cols.testName })
            .text('Device', 200, currentY, { width: cols.device })
            .text('Response (ms)', 280, currentY, { width: cols.responseTime })
            .text('CPU %', 360, currentY, { width: cols.cpuUsage })
            .text('Mem (MB)', 420, currentY, { width: cols.memUsage })
            .text('Status', 480, currentY, { width: cols.status });

        currentY += 20;
        doc.moveTo(50, currentY).lineTo(530, currentY).stroke();
        currentY += 10;

        // Draw rows
        doc.font('Helvetica');
        tests.slice(0, 20).forEach((test, index) => {
            // Check if we need a new page
            if (currentY > 700) {
                doc.addPage();
                currentY = 50;
            }

            doc.text(test.test_name.substring(0, 20), 50, currentY, { width: cols.testName })
                .text(test.device_used.substring(0, 10), 200, currentY, { width: cols.device })
                .text(test.response_time.toString(), 280, currentY, { width: cols.responseTime })
                .text(test.cpu_usage.toString(), 360, currentY, { width: cols.cpuUsage })
                .text(test.memory_usage.toString(), 420, currentY, { width: cols.memUsage })
                .text(test.status, 480, currentY, { width: cols.status });

            currentY += rowHeight;
        });

        if (tests.length > 20) {
            doc.moveDown()
                .text(`... and ${tests.length - 20} more tests`, { indent: 20 });
        }
    }

    // Footer
    doc.fontSize(8)
        .text(
            'System Performance Observer - Performance Testing Report',
            50,
            doc.page.height - 50,
            { align: 'center' }
        );

    doc.end();
    return doc;
}

module.exports = { generatePDFReport };
