const mysql = require('mysql2/promise');

const db = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'vixen_db',
    port: process.env.DB_PORT || 3306,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const connection = await db.getConnection();

        console.log('MySQL connected successfully to vixen_db');

        connection.release();

    } catch (error) {

        console.error(
            'MySQL connection failed:',
            error.message
        );

        process.exit(1);
    }
};

testConnection();

module.exports = db;