const mysql = require('mysql2');
require('dotenv').config();

// Create a connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'performance_observer',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Get a promise-based wrapper
const promisePool = pool.promise();

// Test the connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
        console.log('Please make sure MySQL is running and database is created.');
        console.log('You can create the database using the database_schema.sql file');
    } else {
        console.log('Database connected successfully!');
        connection.release();
    }
});

module.exports = promisePool;
