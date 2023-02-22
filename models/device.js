const { promisify } = require('util');

import { pool } from "../config/connectionPool";

// promisify query method
pool.query = promisify(pool.query);

// define device schema
const deviceSchema = `CREATE TABLE IF NOT EXISTS IP_Database (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    IP VARCHAR(255) NOT NULL,
    Name VARCHAR(255) NOT NULL,
    User_Agent VARCHAR(255) NOT NULL,
    Details VARCHAR(255) NOT NULL,
    Details_ipInfo VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_agent (User_Agent)
)`;

// create device table if not exists
pool.query(deviceSchema, (err, results) => {
    if (err) throw err;
    console.log('device table created successfully');
});

module.exports = pool.promise().query;