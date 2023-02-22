const { promisify } = require('util');

import { pool } from "../config/connectionPool";

// promisify query method
pool.query = promisify(pool.query);

// define domains schema
const domainsSchema = `CREATE TABLE IF NOT EXISTS Domains (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    Domain VARCHAR(255) NOT NULL,
    URL VARCHAR(255) NOT NULL,
    Owner VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_url (URL)
    INDEX idx_owner (Owner)
)`;

// create domains table if not exists
pool.query(domainsSchema, (err, results) => {
    if (err) throw err;
    console.log('Domains table created successfully');
});

module.exports = pool.promise().query;