const { promisify } = require('util');

import { pool } from "../config/connectionPool";

// promisify query method
pool.query = promisify(pool.query);

// define details schema
const detailsSchema = `CREATE TABLE IF NOT EXISTS Details (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    IP VARCHAR(255) NOT NULL,
    Brand VARCHAR(255) NOT NULL,
    Host VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
)`;

// create details table if not exists
pool.query(detailsSchema, (err, results) => {
    if (err) throw err;
    console.log('Details table created successfully');
});

module.exports = pool.promise().query;