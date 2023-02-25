const { DataTypes } = require("sequelize");
const sequelize = require("../config/connectionPool");

/**
 * @swagger
 * components:
 *   schemas:
 *     Device:
 *       type: object
 *       required:
 *         - IP
 *         - Name
 *         - User_Agent
 *         - Details
 *         - Details_ipInfo
 *       properties:
 *         ID:
 *           type: integer
 *           description: The auto-generated id of the device
 *         IP:
 *           type: string
 *           description: The IP address of the device
 *         Name:
 *           type: string
 *           description: The name of the device
 *         User_Agent:
 *           type: string
 *           description: The user agent of the device
 *         Details:
 *           type: string
 *           description: Additional details of the device
 *         Details_ipInfo:
 *           type: string
 *           description: IP info details of the device
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: The date the device was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: The date the device was last updated
 *       example:
 *         ID: 1
 *         IP: 192.168.0.1
 *         Name: My Laptop
 *         User_Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299
 *         Details: Additional details of the device
 *         Details_ipInfo: IP info details of the device
 *         created_at: 2022-02-25T08:00:00.000Z
 *         updated_at: 2022-02-25T08:00:00.000Z
 */

// define device model
const Device = sequelize.define(
    "IP_Database",
    {
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
        Name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        User_Agent: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        Details: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        Details_ipInfo: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            onUpdate: DataTypes.NOW,
        },
    },
    {
        indexes: [
            {
                unique: false,
                fields: ["User_Agent"],
            },
        ],
        timestamps: true,
        createdAt: "created_at",
        updatedAt: "updated_at",
    }
);

// create table if not exists
Device.sync()
    .then(() => {
        console.log("Device table created successfully");
    })
    .catch((err) => {
        console.error("Error creating device table:", err);
    });

module.exports = Device;
