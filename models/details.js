const { DataTypes } = require("sequelize");
const sequelize = require("../config/connectionPool");

/**
 * @swagger
 * components:
 *   schemas:
 *     Details:
 *       type: object
 *       required:
 *         - IP
 *         - Brand
 *         - Host
 *         - createdAt
 *         - updatedAt
 *       properties:
 *         ID:
 *           type: integer
 *           description: The auto-generated ID of the details
 *         IP:
 *           type: string
 *           description: The IP address
 *         Brand:
 *           type: string
 *           description: The brand
 *         Host:
 *           type: string
 *           description: The host name
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the details were created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the details were last updated
 *       example:
 *         ID: 1
 *         IP: 127.0.0.1
 *         Brand: ACME Corporation
 *         Host: example.com
 *         createdAt: 2023-02-25T11:23:45.000Z
 *         updatedAt: 2023-02-25T11:23:45.000Z
 */

// define details model
const Details = sequelize.define("details", {
    ID: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
    },
    IP: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Brand: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    Host: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        onUpdate: DataTypes.NOW,
    },
});

// sync model with database
Details.sync()
    .then(() => console.log("Details table created successfully"))
    .catch((err) => console.error(err));

module.exports = Details;
