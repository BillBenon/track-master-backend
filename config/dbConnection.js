const mysql = require("mysql");
require("dotenv").config();

const { debuglog } = require("util");

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

connection.connect((err) => {
    if (err) {
        debuglog(`❌ server did not start properly`);
        debuglog(err);
        console.log(`❌ server did not start properly`);
        return;
    }

    console.log(`✔ server started on http://localhost:${process.env.PORT}`);
    debuglog(`✔ server started on http://localhost:${process.env.PORT}`);
});
