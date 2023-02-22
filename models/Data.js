const { promisify } = require('util');

import { pool } from "../config/connectionPool";

// promisify query method
pool.query = promisify(pool.query);

// define data schema
const dataSchema = `CREATE TABLE IF NOT EXISTS Data (
    ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    IP VARCHAR(255) NOT NULL,
    IPDetails VARCHAR(255) NOT NULL,
    Host VARCHAR(255) NOT NULL,
    Source VARCHAR(255) NOT NULL,
    Domain VARCHAR(255) NOT NULL,
    Brand VARCHAR(255) NOT NULL,
    Country VARCHAR(255) NOT NULL,
    ISP VARCHAR(255) NOT NULL,
    VPN VARCHAR(255) NOT NULL,
    New INT NOT NULL,
    Archive INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_ip (IP)
    INDEX idx_ipdetails (IPDetails)
    INDEX idx_host (Host)
    INDEX idx_brand (Brand)
    INDEX idx_country (Country)
    INDEX idx_isp (ISP)
    INDEX idx_email (Domain)
)`;

// create data table if not exists
pool.query(dataSchema, (err, results) => {
    if (err) throw err;
    console.log('Data table created successfully');
});

module.exports = pool.promise().query;