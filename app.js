const fs = require("fs");
const path = require("path");
require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptions = {
    origin: "*",
    credentials: true, //access-control-allow-credentials:true
    optionSuccessStatus: 200,
};

//importing the routes
const usersRoutes = require("./routes/users-routes");
const domainsRoutes = require("./routes/domains-routes");
const detailsRoutes = require("./routes/details-routes");
const dataRoutes = require("./routes/data-routes");
const HttpError = require("./models/http-error");

require("./config/dbConnection");

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// this is used for server cors policy
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE"
    );
    next();
});

// here is where we shall use the routes
app.use("/api/users", usersRoutes);
app.use("/api/domains", domainsRoutes);
app.use("/api/details", detailsRoutes);
app.use("/api/data", dataRoutes);

// in case there is undefined route hitting the backend
app.use((req, res, next) => {
    const error = new HttpError("Could not find this route.", 404);
    throw error;
});

// this is when an error occurs while there is an action involving uploading an img; an uploaded img will be deleted
app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, (err) => {
            console.log(err);
        });
    }
    if (res.headerSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({ message: error.message || "An unknown error occurred" });
});

app.listen(process.env.PORT || 5000);
