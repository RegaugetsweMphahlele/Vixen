const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'vixen_db',
    port: 3306
});

db.connect((err) => {
    if (err) {
        console.error('MySQL connection failed:', err.message);
        return;
    }

    console.log('MySQL connected successfully to vixen_db');
});

module.exports = db;