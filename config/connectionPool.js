const mysql = require('mysql2/promise');

export const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME
});