const { promisify } = require('util');

import { pool } from "../config/connectionPool";

// promisify query method
pool.query = promisify(pool.query);

// define user schema
const userSchema = `CREATE TABLE IF NOT EXISTS users (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
)`;

// create users table if not exists
pool.query(userSchema, (err, results) => {
    if (err) throw err;
    console.log('Users table created successfully');
});

module.exports = pool.promise().query;